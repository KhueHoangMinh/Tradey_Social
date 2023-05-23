// Import dependencies

const logger = require("firebase-functions/logger");
const express = require('express')
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const favicon = require("serve-favicon")
const {Client} = require("cassandra-driver")
const {Server} = require('socket.io')

// frontend url for CORS origin

FRONTEND = "http://192.168.1.7"

// main function

async function run() {
    const app = express()
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json({limit: '1mb'}))
    app.use(express.json())
    app.use(cors({
        origin: [FRONTEND + ":3001","http://localhost:3000"],
        credentials: true
    }))


    // Connect to AstraDB

    const client = new Client({
        cloud: {
            secureConnectBundle: "./secure/secure-connect-tradey-db.zip",
            multipleStatements: true
        },
        credentials: {
            username: "nyyhFDCiuebzUpUJUWLxDWpK",
            password: "8Da-tcuLHgq9YudadWN20Au2lW13Fna7D1bNkePyls.q.N9fanwWfhES,O7.J5nPhn1KOyDU8FoOGdoU.NuRhr6k_ZyYeLwPJNH5S4ZFTCiYLLaIcXA5xyZAQ8mMF0Ms",
        },
    })

    await client.connect();

    // Create and connect to Socket.io server

    const server = http.createServer(app)

    const io = new Server(server, {
        cors: {
            origin: [FRONTEND + ":3001","http://localhost:3000"],
            methods: ["GET","POST"],
            credentials: true
        }
    })

    // Chat functions

    io.on("connection", socket => {
        var prevMess = null

        socket.on("joinchat", async (req) => {
            var idArray = [req.userId, req.chatting]
            idArray.sort((a,b) => (a > b) ? 1 : -1)
    
            const query = `SELECT password FROM tradey_ks.users_by_user_id WHERE user_id = ?;`
            var rs1 = await client.execute(query,[idArray[0]])
            var rs2 = await client.execute(query,[idArray[1]])
    
            var roomId = idArray[0].toString() + idArray[1].toString() + rs1.rows[0].password + rs2.rows[0].password
    
            socket.join(roomId)
        })

        socket.on("online", async (req) => {
            socket.join("notifications")
        })

        socket.on("sendmessage", async (req) => {
            var idArray = [req.userId, req.chatting]
            idArray.sort((a,b) => (a > b) ? 1 : -1)

            const insertQuery = `INSERT INTO tradey_ks.messages (sender_id,receiver_id,time,message) VALUES (?,?,toTimeStamp(now()),?);`
    
            const query = `SELECT password FROM tradey_ks.users_by_user_id WHERE user_id = ?;`
            var rs1 = await client.execute(query,[idArray[0]])
            var rs2 = await client.execute(query,[idArray[1]])
    
            var roomId = idArray[0].toString() + idArray[1].toString() + rs1.rows[0].password + rs2.rows[0].password
            if(prevMess != {senderId: req.userId, receiverId: req.chatting, message: req.message, time: req.time.toString()}) {
                socket.to(roomId).emit("receivemessage", {senderId: req.userId, receiverId: req.chatting, message: req.message, time: req.time.toString()})
                socket.to('notifications').emit('receivenotification', {type: 'message', content: null, receiverIds: [req.chatting]})
                await client.execute(insertQuery, [req.userId,req.chatting,req.message])
            }
            prevMess = {senderId: req.userId, receiverId: req.chatting, message: req.message, time: req.time.toString()}
        })

        socket.on("disconnect", ()=> {
        })
    })

    // app.use(favicon(path.join(__dirname,"images","png","crop-logo-no-background.png")))
    app.use('/storage',express.static('storage'))
    app.use('',express.static('build'))


    // Routes for APIs
    const usersRoute = require("./routes/Users.js")
    const postsRoute = require("./routes/Posts.js")
    const marketRoute = require("./routes/Market.js")

    app.use("/api/users", usersRoute)
    app.use("/api/posts", postsRoute)
    app.use("/api/market", marketRoute)
    app.use('*',express.static('build'))

    // Run server on port 3001
    server.listen(3001)

    
}

run();

