/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const express = require('express')
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const {Client} = require("cassandra-driver")
const {Server} = require('socket.io')
const { onRequest } = require('firebase-functions/v1/https')

FRONTEND = "http://192.168.1.7"
// const app = express()
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json({limit: '1mb'}))
// app.use(express.json())
// app.use(cors())

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'tradey',
//     multipleStatements: true
// })

async function run() {
    // exports.helloWorld = onRequest((request, response) => {
    //   logger.info("Hello logs!", {structuredData: true});
    //   response.send("Hello from Firebase!");
    // });
    const app = express()
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json({limit: '1mb'}))
    app.use(express.json())
    app.use(cors({
        origin: [FRONTEND + ":3000","http://localhost:3000"],
        credentials: true
    }))

    app.use('/storage',express.static('storage'))

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

    const server = http.createServer(app)

    const io = new Server(server, {
        cors: {
            origin: [FRONTEND + ":3000","http://localhost:3000"],
            methods: ["GET","POST"],
            credentials: true
        }
    })

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

    server.listen(3002)
    // exports.server = onRequest(server)

    app.get('/api/test', (req,res) => {
        res.send(':D')
    })


    app.post('/api/register', async (req,res) => {
        const type = req.body.type
        const name = req.body.name
        const email = req.body.email
        var photoURL = req.body.photoURL
        const password = req.body.password
        photoURL = null

        const selectQuery = `SELECT email FROM tradey_ks.users_by_email WHERE type IN ('user','googleuser','admin') AND email = ?;`
        const rs = await client.execute(selectQuery,[email])

        if(rs.rows.length >= 1) {
            res.send('existed')
        } else {
            const query = `INSERT INTO tradey_ks.users_by_email (user_id,type,name,email,password) VALUES (uuid(),'${type}','${name}','${email}','${password}');` 
            
            client.execute(query, {prepare: true},async (err, result) => {
                if(err) {
                    res.send(err)
                } else {
                    const query2 = `SELECT user_id FROM tradey_ks.users_by_email WHERE type = '${type}' AND email = '${email}';`
                    const rs2 = await client.execute(query2)
                    const query3 =  `INSERT INTO tradey_ks.users_by_user_id (user_id,type,name,email,password) VALUES (${rs2.rows[0].user_id.toString()},'${type}','${name}','${email}','${password}');`
                    client.execute(query3)
                    res.send(result)
                }
            })
        }
    })

    
    app.post('/api/login', async (req,res) => {
        const email = req.body.email
        const password = req.body.password
        const query = "SELECT user_id, type, name, email, photourl FROM tradey_ks.users_by_email where type IN ('user','admin') AND email = ? AND password = ?;"

        client.execute(query,[email,password], (err, result) => {
            if(err) {
                res.send(err)
            } else {
                res.send(result)
            }
        });
    })

    app.post('/api/googlelogin', async (req,res) => {
        const email = req.body.email
        const query = `SELECT user_id, type, name, email, photourl FROM tradey_ks.users_by_email where type = 'googleuser' AND email = ?;`

        client.execute(query,[email], (err, result) => {
            if(err) {
                res.send(err)
            } else {
                res.send(result)
            }
        });
    })


    var filename = ''
    var filepath = 'storage/post/'

    const postStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,'./'+filepath)
        },
        filename: (req,file,cb) => {
            filename = Date.now() + req.body.publisherId + path.extname(file.originalname)
            cb(null, filename)
        }
    })

    const postUpload = multer({storage: postStorage})

    app.post('/api/post', postUpload.single('image'),async (req,res)=>{
        const publisherId = req.body.publisherId
        const description = req.body.description
        const type = req.body.type
        var source = null
        var link = null
        if(type === 'share' || type === 'shareproduct') {
            source = req.body.source
        } else {
            if(req.file) {
                link = filepath + filename
            }
        }

        
        const generateId1 = "UPDATE tradey_ks.id SET id = uuid() WHERE selector = 1;"
        const generateId2 = "SELECT id FROM tradey_ks.id WHERE selector = 1;"

        await client.execute(generateId1)
        var idRs = await client.execute(generateId2)
        const postId = idRs.rows[0].id

        const query = `INSERT INTO tradey_ks.posts_by_post_id (type, post_id, description, publisher_id, time) VALUES (?,?,?,?,toTimeStamp(now()));`
        const rs = await client.execute(query,[type,idRs.rows[0].id,description,publisherId]);

        var query2 = `SELECT time FROM tradey_ks.posts_by_post_id WHERE post_id = ?;`
        var rs2 = await client.execute(query2,[idRs.rows[0].id])

        var query3 = `INSERT INTO tradey_ks.posts_by_publisher_id (type, post_id, description, publisher_id, time) VALUES (?,?,?,?,?);`
        await client.execute(query3, [type,idRs.rows[0].id,description,publisherId,rs2.rows[0].time])

        if(source || link) {
            await client.execute(generateId1)
            idRs = await client.execute(generateId2)
    
            query3 = `INSERT INTO tradey_ks.post_contents_by_content_id (content_id,post_id,source,link,content_description) VALUES (?,?,?,?,?);`
            await client.execute(query3, [idRs.rows[0].id,postId,source,link,description])
            query3 = `INSERT INTO tradey_ks.post_contents_by_post_id (content_id,post_id,source,link,content_description) VALUES (?,?,?,?,?);`
            await client.execute(query3, [idRs.rows[0].id,postId,source,link,description])
        }
        

        res.send('posted')
    })


    app.get('/api/getposts', async (req,res) => {
        const query = "SELECT * FROM tradey_ks.posts_by_post_id;"
        var respondRs = {}
        var finalRs = []
        const rs = await client.execute(query)

        rs.rows.sort((a,b) => (a.time > b.time) ? -1:1)

        for(let i = 0; i < rs.rows.length; i++) {
            var dataQuery = 'SELECT user_id, type AS user_type, name, photourl, email FROM tradey_ks.users_by_user_id WHERE user_id = ?;'
            var dataRs1 = await client.execute(dataQuery,[rs.rows[i].publisher_id])

            finalRs.push({...rs.rows[i],...dataRs1.rows[0]})
        }
        res.send(finalRs)
    })


    app.post('/api/getpostbypostid', async (req,res) => {
        async function getPostByPostId(postId) {
            const query = "SELECT * FROM tradey_ks.posts_by_post_id WHERE post_id = ?;"
            const rs = await client.execute(query,[postId])
            var respondRs = null
    
            if(rs.rows.length == 1) {
                var dataQuery = 'SELECT user_id, type AS user_type, name, photourl, email FROM tradey_ks.users_by_user_id WHERE user_id = ?;'
                var dataRs1 = await client.execute(dataQuery,[rs.rows[0].publisher_id])
        
                dataQuery = 'SELECT * FROM tradey_ks.post_contents_by_post_id WHERE post_id = ?;'
                var dataRs2 = await client.execute(dataQuery,[rs.rows[0].post_id])
        
                respondRs = {...rs.rows[0],...dataRs1.rows[0],content: dataRs2.rows}
        
                if(dataRs2.rows.length === 1 && dataRs2.rows[0].source) {
                    respondRs = {...respondRs, sharedContent: await getPostByPostId(dataRs2.rows[0].source)}
                }
            }
            return respondRs
        }

        const postId = req.body.postId

        const rs = await getPostByPostId(postId)

        res.send(rs)
    })

    app.post('/api/getlikes', async (req,res) => {
        const postId = req.body.id
        const query = "SELECT * FROM tradey_ks.likes_by_time WHERE post_id = ?;"

        const rs = await client.execute(query,[postId])
        res.send(rs.rows)
    })

    app.post('/api/getcomments', async (req,res) => {

        async function getAllComments(postId) {
            var comments = []

            const query = 'SELECT comment_id FROM tradey_ks.comments_by_time WHERE post_id = ? ORDER BY time DESC;'
            const rs = await client.execute(query, [postId])

            for(var i = 0; i < rs.rows.length; i++) {
                comments.push({comment_id: rs.rows[i].comment_id, comments: await getAllComments(rs.rows[i].comment_id)})
            }

            return comments
        }

        const postId = req.body.id

        res.send(await getAllComments(postId))
    })

    app.post('/api/getcommentbycommentid', async (req,res) => {
        const commentId = req.body.commentId

        const query = 'SELECT * FROM tradey_ks.comments_by_comment_id WHERE comment_id = ?;'
        const rs = await client.execute(query, [commentId])
        
        const userQuery = `SELECT user_id, type, name, photourl, email FROM tradey_ks.users_by_user_id WHERE user_id = ${rs.rows[0].commenter_id.toString()};`
        const userRs = await client.execute(userQuery)

        res.send([{...rs.rows[0],...userRs.rows[0]}])
    })

    app.post('/api/getshares', async (req,res) => {
        const postId = req.body.id
        var shares = 0
        const query = "SELECT * FROM tradey_ks.post_contents_by_post_id;"
        const rs = await client.execute(query)

        for(var i = 0; i < rs.rows.length; i++) {
            if(rs.rows[i].source == postId) {
                shares++
            }
        }

        res.send({shares: shares})
    })

    app.post('/api/like', async (req,res)=> {
        const userId = req.body.userId
        const postId = req.body.postId
        const type = req.body.type
        var insertType = ''
        if(type === 'default') {
            insertType = 'like'
        } else {
            insertType = type
        }

        const selectQuery = "SELECT * FROM tradey_ks.likes_by_liker_id WHERE post_id = ? AND liker_id = ?;"
        const rs = await client.execute(selectQuery,[postId,userId])
        
        if(rs.rows.length === 0) {
            var insertQuery = "INSERT INTO tradey_ks.likes_by_liker_id (like_id,post_id,liker_id,time,type) VALUES (uuid(),?,?,toTimeStamp(now()),?);"
            await client.execute(insertQuery,[postId,userId,insertType])
            var likeRs = await client.execute('SELECT * FROM tradey_ks.likes_by_liker_id WHERE post_id = ? AND liker_id = ?;', [postId,userId])
            insertQuery = "INSERT INTO tradey_ks.likes_by_time (like_id,post_id,liker_id,time,type) VALUES (?,?,?,?,?);"
            await client.execute(insertQuery,[likeRs.rows[0].like_id,likeRs.rows[0].post_id,likeRs.rows[0].liker_id,likeRs.rows[0].time,likeRs.rows[0].type])
            res.send('liked')
        } else {
            if(type !== 'default' && type !== rs.rows[0].type) {
                var updateQuery = "UPDATE tradey_ks.likes_by_liker_id SET type = ? WHERE post_id = ? AND liker_id = ? AND time = ?;"
                await client.execute(updateQuery,[type,postId,rs.rows[0].liker_id,rs.rows[0].time])
                updateQuery = "UPDATE tradey_ks.likes_by_time SET type = ? WHERE post_id = ? AND time = ? AND like_id = ?;"
                await client.execute(updateQuery,[type,postId,rs.rows[0].time,rs.rows[0].like_id])
                res.send('updated')
            } else {
                var deleteQuery = "DELETE FROM tradey_ks.likes_by_liker_id WHERE post_id = ? AND liker_id = ? AND time = ?;"
                await client.execute(deleteQuery,[postId,rs.rows[0].liker_id,rs.rows[0].time])
                deleteQuery = "DELETE FROM tradey_ks.likes_by_time WHERE post_id = ? AND time = ? AND like_id = ?;"
                await client.execute(deleteQuery,[postId,rs.rows[0].time,rs.rows[0].like_id])
                res.send('deleted')
            }
        }
    })

    app.post('/api/comment', async(req,res)=> {
        const userId = req.body.userId
        const postId = req.body.postId
        const content = req.body.content

        const generateId1 = "UPDATE tradey_ks.id SET id = uuid() WHERE selector = 1;"
        const generateId2 = "SELECT id FROM tradey_ks.id WHERE selector = 1;"

        await client.execute(generateId1)
        const idRs = await client.execute(generateId2)

        var query = "INSERT INTO tradey_ks.comments_by_comment_id (comment_id,post_id,commenter_id,content,time) VALUES (?,?,?,?,toTimeStamp(now()));"
        await client.execute(query, [idRs.rows[0].id, postId, userId, content])

        const selectQuery = `SELECT * FROM tradey_ks.comments_by_comment_id WHERE comment_id = ?;`
        const selectRs = await client.execute(selectQuery, [idRs.rows[0].id])

        var query = "INSERT INTO tradey_ks.comments_by_time (comment_id,post_id,commenter_id,content,time) VALUES (?,?,?,?,?);"
        await client.execute(query, [idRs.rows[0].id, postId, userId, content, selectRs.rows[0].time])

        res.send('commented')
    })

    var marketFilepath = 'storage/product/'

    const marketStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null, './' + marketFilepath)
        },
        filename: (req,file,cb) => {
            filename = Date.now() + 'market' + path.extname(file.originalname)
            cb(null,filename)
        }
    })

    const marketUpload = multer({storage: marketStorage})

    app.post('/api/postproduct', marketUpload.single('image'), async (req,res) => {
        const sellerId = req.body.userId
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const type = req.body.type
        const image = marketFilepath + filename

        const generateId1 = "UPDATE tradey_ks.id SET id = uuid() WHERE selector = 1;"
        const generateId2 = "SELECT id FROM tradey_ks.id WHERE selector = 1;"

        await client.execute(generateId1)
        const idRs = await client.execute(generateId2)

        const query = `INSERT INTO tradey_ks.products_by_product_id (type, product_id, product_name, description, price, image, time, seller_id) VALUES (?, ${idRs.rows[0].id.toString()},?,?,${price.toString()},?,toTimeStamp(now()),${sellerId.toString()});`
        await client.execute(query, [type,name,description,image])

        const selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?;`
        const selectRs = await client.execute(selectQuery, [idRs.rows[0].id])

        const insertProductsTables = `BEGIN BATCH
        INSERT INTO tradey_ks.products_by_seller_id (type, product_id, product_name, description, price, image, time, seller_id) VALUES ('${type}', ${idRs.rows[0].id.toString()},'${name}','${description}',${price.toString()},'${image}',?,${sellerId.toString()});
        APPLY BATCH;`

        await client.execute(insertProductsTables,[selectRs.rows[0].time]);

        res.send('inserted')
    })




    app.get('/api/getmarket', async (req,res)=> {
        const query = `SELECT * FROM tradey_ks.products_by_seller_id;`
        var finalRs = []
        const rs = await client.execute(query)

        for(let i = 0; i < rs.rows.length; i++) {
            const userQuery = "SELECT user_id, type as userType, name, photourl, email FROM tradey_ks.users_by_user_id WHERE user_id = ?;"
            const userRs = await client.execute(userQuery, [rs.rows[i].seller_id])
            finalRs.push({...rs.rows[i],...userRs.rows[0]})
        }
        
        finalRs.sort((a, b) => (a.time > b.time) ? -1 : 1)

        res.send(finalRs)
    })

    app.post('/api/getuserposts', async (req,res) => {
        const userId = req.body.userId
        const query = `SELECT * FROM tradey_ks.posts_by_publisher_id WHERE publisher_id = ?;`

        const rs = await client.execute(query, [userId])

        rs.rows.sort((a, b) => (a.time > b.time) ? -1 : 1)

        res.send(rs.rows)
    })

    app.post('/api/getproductbysellerid', async (req,res) => {
        const userId = req.body.userId
        const query = `SELECT * FROM tradey_ks.products_by_seller_id WHERE seller_id = ?;`

        const rs = await client.execute(query, [userId])

        rs.rows.sort((a, b) => (a.time > b.time) ? -1 : 1)

        res.send(rs.rows)
    })

    app.post('/api/search', async (req,res) => {
        var input = req.body.input
        if(!input) {
            input = '';
        }
        const filter = req.body.filter
        const query = `SELECT * from tradey_ks.products_by_seller_id;`
        var finalRs = []
        const rs = await client.execute(query)

        for(let i = 0; i < rs.rows.length; i++) {
            if(rs.rows[i].product_name.toLowerCase().includes(input.toLowerCase())) {
                const userQuery = "SELECT user_id, type, name, photourl, email FROM tradey_ks.users_by_user_id WHERE user_id = ?;"
                const userRs = await client.execute(userQuery, [rs.rows[i].seller_id])
                finalRs.push({...rs.rows[i],...userRs.rows[0]})
            }
        }

        switch(filter) {
          case 'price_up':
            finalRs.sort((a, b) => (a.price > b.price) ? 1 : -1)
            break 
      
          case 'price_down':
            finalRs.sort((a, b) => (a.price < b.price) ? 1 : -1)
            break
      
          case 'name_up':
            finalRs.sort((a, b) => (a.product_name > b.product_name) ? 1 : -1)
            break
      
          case 'name_down':
            finalRs.sort((a, b) => (a.product_name < b.product_name) ? 1 : -1)
            break
      
          case 'date_up':
            finalRs.sort((a, b) => (a.time < b.time) ? 1 : -1)
            break
      
          case 'date_down':
            finalRs.sort((a, b) => (a.time > b.time) ? 1 : -1)
            break
          default:
            finalRs.sort((a, b) => (a.time < b.time) ? 1 : -1)
            break
        }

        res.send(finalRs)
    })

    const advertisementFilePath = 'storage/advertisement/'

    const advertisementStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null, './' + advertisementFilePath)
        },
        filename: (req,file,cb) => {
            filename = Date.now() + 'advertisement' + path.extname(file.originalname)
            cb(null,filename)
        }
    })

    const advertisementUpload = multer({storage: advertisementStorage})

    app.post('/api/postadvertisement', advertisementUpload.single('image'), async (req,res) => {
        const name = req.body.name
        const description = req.body.description
        const image = advertisementFilePath + filename
        const link = req.body.link
        const query = 'INSERT INTO tradey_ks.advertisement (ad_id,name,description,image,link) VALUES (uuid(),?,?,?,?);'

        const rs = await client.execute(query, [name,description,image,link])

        res.send(rs.rows)
    })

    app.post('/api/getadvertisement', async (req,res) => {
        const query = 'SELECT * FROM tradey_ks.advertisement;'

        const rs = await client.execute(query)
        res.send(rs.rows)
    })

    app.post('/api/addtocart', async (req,res)=> {
        const productId = req.body.productId
        const userId = req.body.userId
        const action = req.body.action
        const quantity = req.body.quantity

        const selectQuery = `SELECT * FROM tradey_ks.cart WHERE user_id = ? AND product_id = ?;`
        const selectRs = await client.execute(selectQuery,[userId,productId])

        switch(action) {
            case 'add':
                if(selectRs.rows.length === 1) {
                    const query = `UPDATE tradey_ks.cart SET quantity = ${(selectRs.rows[0].quantity + 1).toString()} WHERE user_id = ? ANd product_id = ?;`
                    await client.execute(query, [userId, productId])
        
                    res.send('incremented')
                } else if(selectRs.rows.length === 0) {
                    const query = `INSERT INTO tradey_ks.cart (product_id,user_id,quantity,time) VALUES (${productId.toString()},${userId.toString()},${quantity.toString()},toTimeStamp(now()));`
            
                    await client.execute(query)
                    res.send('added')
                }
                break
            case 'dec':
                if(selectRs.rows.length === 1 && selectRs.rows[0].quantity > 1) {
                    const query = `UPDATE tradey_ks.cart SET quantity = ${(selectRs.rows[0].quantity - 1).toString()} WHERE user_id = ? ANd product_id = ?;`
                    await client.execute(query, [userId, productId])
        
                    res.send('decremented')
                } else if(selectRs.rows.length === 1 && selectRs.rows[0].quantity <= 1) {
                    const query = `DELETE FROM tradey_ks.cart WHERE user_id = ? ANd product_id = ?;`
            
                    await client.execute(query,[userId,productId])
                    res.send('deleted')
                }
                break
            case 'delete':
                const query = `DELETE FROM tradey_ks.cart WHERE user_id = ? ANd product_id = ?;`
        
                await client.execute(query,[userId,productId])
                res.send('deleted')
                break
        }
    })

    app.post('/api/getcart', async (req,res) => {
        const userId = req.body.userId
        
        var finalRs = []
        const query = `SELECT * FROM tradey_ks.cart WHERE user_id = ?;`

        rs = await client.execute(query, [userId])

        for(let i = 0; i < rs.rows.length; i++) {
            var productQuery = "SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?;"
            var productRs = await client.execute(productQuery,[rs.rows[i].product_id])
            finalRs.push({...rs.rows[i],...productRs.rows[0]})
        }

        res.send(finalRs)
    })

    app.post("/api/changecartquant", async  (req,res) => {
        const userId = req.body.userId
        const productId = req.body.productId
        const action = req.body.action
        const query = `SELECT * FROM tradey_ks.cart WHERE user_id = ? AND product_id = ?;`
        const rs = await client.execute(query, [userId, productId])
        var quantity = 1

        if(rs.rows.length == 0) {
            res.send("error")
        } else {
            quantity = rs.rows[0].quantity
            if(action == 'dec') {
                if(rs.rows[0].quantity > 1) {
                    const updateQuery = `UPDATE tradey_ks.cart SET quantity = ${(rs.rows[0].quantity - 1).toString()} WHERE user_id = ? AND product_id = ?;`
                    await client.execute(updateQuery, [userId,productId])
                } else {
                    const deleteQuery = `DELETE FROM tradey_ks.cart WHERE user_id = ? AND product_id = ?;`
                    await client.execute(deleteQuery, [userId,productId])
                }
                quantity--
            } else if (action == "inc") {
                const updateQuery = `UPDATE tradey_ks.cart SET quantity = ${(rs.rows[0].quantity + 1).toString()} WHERE user_id = ? AND product_id = ?;`
                await client.execute(updateQuery, [userId,productId])
                quantity++
            }
            res.send({quantity: quantity})
        }
    })

    app.post('/api/checkout', async (req,res) => {
        const userId = req.body.userId
        const phone = req.body.phone
        const address = req.body.address
        const note = req.body.note
        const voucher = req.body.voucher

        const selectCart = `SELECT * FROM tradey_ks.cart WHERE user_id = ?;`
        const selectRs = await client.execute(selectCart,[userId])

        if(selectRs.rows.length > 0) {
            const generateId1 = "UPDATE tradey_ks.id SET id = uuid() WHERE selector = 1;"
            const generateId2 = "SELECT id FROM tradey_ks.id WHERE selector = 1;"
    
            await client.execute(generateId1)
            const idRs = await client.execute(generateId2)
    
            var billQuery = `INSERT INTO tradey_ks.bills_by_bill_id (bill_id, time, user_id, status, phone, address, note, voucher) VALUES (${idRs.rows[0].id.toString()},toTimeStamp(now()),${userId.toString()},'PENDING',?,?,?,?);`
            await client.execute(billQuery,[phone,address,note,voucher])
    
            const selectQuery = `SELECT * FROM tradey_ks.bills_by_bill_id WHERE bill_id = ?;`
            const selectRs1 = await client.execute(selectQuery, [idRs.rows[0].id])
            
            billQuery = `INSERT INTO tradey_ks.bills_by_user_id (bill_id, time, user_id, status, phone, address, note, voucher) VALUES (${idRs.rows[0].id.toString()},?,${userId.toString()},?,?,?,?,?);`
            await client.execute(billQuery, [selectRs1.rows[0].time,selectRs1.rows[0].status,phone,address,note,voucher])

            var itemQuery = `BEGIN BATCH` 
            var timeArray = []
            for(let i=0;i<selectRs.rows.length;i++) {
                itemQuery += `
                    INSERT INTO tradey_ks.bill_products_by_bill_id (bill_id, product_id, quantity, time) VALUES 
                    (${idRs.rows[0].id.toString()},${selectRs.rows[i].product_id.toString()},
                    ${selectRs.rows[i].quantity.toString()},?);
                `
                timeArray.push(selectRs.rows[i].time)
            }
            itemQuery += `APPLY BATCH;`
            await client.execute(itemQuery, timeArray)

            const deleteQuery = `DELETE FROM tradey_ks.cart WHERE user_id = ?;`
            await client.execute(deleteQuery, [userId])

            res.send(['bill_created',idRs.rows[0].id])
        } else {
            res.send('no_item')
        }
    })

    app.post('/api/getshopbills', async (req,res) => {
        var finalRs = []

        const billsQuery = `SELECT * FROM tradey_ks.bills_by_time;`
        const billsRs = await client.execute(billsQuery)

        for(var i = 0; i < billsRs.rows.length; i++) {
            var itemQuery = `SELECT * FROM tradey_ks.bill_products_by_time WHERE type = 'shop' AND bill_id = ? ORDER BY time DESC;`
            var itemRs = await client.execute(itemQuery,[billsRs.rows[i].bill_id])
            for(var j = 0; j < itemRs.rows.length; j++) {
                var productQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'shop' AND product_id = ?`;
                var productRs = await client.execute(productQuery,[itemRs.rows[j].product_id])
                itemRs.rows[j] = {...itemRs.rows[j],...productRs.rows[0]}
            }

            if(itemRs.rows.length > 0) {
                finalRs.push({...billsRs.rows[i],billItems: itemRs.rows})
            }
        }
        res.send(finalRs)
    })

    app.post('/api/getrequests', async (req,res) => {
        const userId = req.body.userId
        var finalRs = []

        const billsQuery = `SELECT * FROM tradey_ks.bills_by_bill_id;`
        const billsRs = await client.execute(billsQuery)

        for(var i = 0; i < billsRs.rows.length; i++) {
            var itemQuery = `SELECT * FROM tradey_ks.bill_products_by_bill_id WHERE bill_id = ?;`
            var itemRs = await client.execute(itemQuery,[billsRs.rows[i].bill_id])
            var itemsOfSeller = []

            for(var j = 0; j < itemRs.rows.length; j++) {
                var productQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?;`
                var productRs = await client.execute(productQuery,[itemRs.rows[j].product_id])
                if(productRs.rows[0].seller_id == userId) {
                    itemsOfSeller.push({...itemRs.rows[j],...productRs.rows[0]})
                }
            }

            if( itemsOfSeller.length > 0) {
                finalRs.push({...billsRs.rows[i],billItems: itemsOfSeller})
            }
        }
        finalRs.sort((a, b) => (a.time > b.time) ? -1 : 1)
        res.send(finalRs)
    })

    app.post('/api/getbillsbyuser', async (req,res) => {
        const userId = req.body.userId
        var finalRs = []

        const query = `SELECT * FROM tradey_ks.bills_by_user_id WHERE user_id = ?;`
        const rs = await client.execute(query, [userId])

        rs.rows.sort((a, b) => (a.time > b.time) ? -1 : 1)

        for(var i = 0; i < rs.rows.length; i++) {
            var marketItemQuery = `SELECT * FROM tradey_ks.bill_products_by_bill_id WHERE bill_id = ?;`
            var marketItemRs = await client.execute(marketItemQuery, [rs.rows[i].bill_id])
            marketItemRs.rows.sort((a, b) => (a.time > b.time) ? -1 : 1)
            for(var j = 0; j < marketItemRs.rows.length; j++) {
                var productQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?`;
                var productRs = await client.execute(productQuery,[marketItemRs.rows[j].product_id])
                marketItemRs.rows[j] = {...marketItemRs.rows[j],...productRs.rows[0]}
            }
            finalRs.push({...rs.rows[i], billItems: marketItemRs.rows})
        }
        res.send(finalRs)
    })

    app.post('/api/getbillbybillid', async (req,res) => {
        const billId = req.body.billId

        const query = `SELECT * FROM tradey_ks.bills_by_bill_id WHERE bill_id = ?;`
        const rs = await client.execute(query, [billId])

        var marketItemQuery = `SELECT * FROM tradey_ks.bill_products_by_bill_id WHERE bill_id = ?;`
        var marketItemRs = await client.execute(marketItemQuery, [rs.rows[0].bill_id])
        marketItemRs.rows.sort((a, b) => (a.time > b.time) ? -1 : 1)
        for(var j = 0; j < marketItemRs.rows.length; j++) {
            var productQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?`;
            var productRs = await client.execute(productQuery,[marketItemRs.rows[j].product_id])
            marketItemRs.rows[j] = {...marketItemRs.rows[j],...productRs.rows[0]}
        }
        res.send([{...rs.rows[0], billItems: marketItemRs.rows}])
    })

    app.post('/api/getuserbyid', async (req,res)=> {
        const userId = req.body.userId
        const query = 'SELECT type, user_id, name, email, photourl FROM tradey_ks.users_by_user_id WHERE user_id = ?;'

        const rs = await client.execute(query, [userId])
        res.send(rs.rows)
    })

    app.post('/api/deleteproduct', async (req,res) => {
        const productId = req.body.productId
        const selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?;`
        const selectRs = await client.execute(selectQuery,[productId])

        const query = `BEGIN BATCH
        DELETE FROM tradey_ks.products_by_product_id WHERE product_id = ${selectRs.rows[0].product_id.toString()};
        DELETE FROM tradey_ks.products_by_seller_id WHERE seller_id = ${selectRs.rows[0].seller_id.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        APPLY BATCH;`

        await client.execute(query)
        res.send('deleted')
    })

    const updateMarketFilepath = 'storage/product/'

    const updateMarketStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,'./'+updateMarketFilepath)
        },
        filename: (req,file,cb) => {
            filename = req.body.imagePath
            cb(null,filename)
        }
    })

    const updateMarketUpload = multer({storage: updateMarketStorage})

    app.post('/api/updateproduct', updateMarketUpload.single('image'), async (req,res) => {
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        var image = ''
        if(req.file) {
            image = updateMarketFilepath + req.body.imagePath
        }
        const productId = req.body.productId
        
        const selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?;`
        const selectRs = await client.execute(selectQuery,[productId])

        const query = `BEGIN BATCH
        UPDATE tradey_ks.products_by_product_id SET product_name = '${name}', description = '${description}', price = ${price.toString()}, image = '${image}' WHERE type = 'market' AND product_id = ${selectRs.rows[0].product_id.toString()};
        UPDATE tradey_ks.products_by_seller_id SET product_name = '${name}', description = '${description}', price = ${price.toString()}, image = '${image}' WHERE type = 'market' AND seller_id = ${selectRs.rows[0].seller_id.toString()} AND time =  ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        APPLY BATCH;`

        await client.execute(query)
        res.send('updated')
    })

    app.post('/api/getproductbyid', async (req,res) => {
        const productId = req.body.productId
        const query = `SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?;`

        const rs = await client.execute(query,[productId])
        var additional = {}
        if(req.body.addPublisher) {
            const userQuery = `SELECT user_id,name,email,photourl,type FROM tradey_ks.users_by_user_id WHERE user_id = ?;`
            const userRs = await client.execute(userQuery,[rs.rows[0].seller_id])
            additional = userRs.rows[0]
        }

        res.send([{...rs.rows[0],...additional}])
    })

    var userfilename = ''
    var userfilepath = 'storage/user/'

    const userStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,'./'+userfilepath)
        },
        filename: (req,file,cb) => {
            userfilename = 'avatar' + req.body.userId + path.extname(file.originalname)
            cb(null, userfilename)
        }
    })

    const userUpload = multer({storage: userStorage})

    app.post('/api/updateuserinfo', userUpload.single('avatar'),async (req,res)=>{
        const userId = req.body.userId
        var avatar = null
        if(req.file) {
            avatar = userfilepath + userfilename
        }
        const username = req.body.username
        const password = req.body.password

        if(avatar !== null) {
            const query = `UPDATE tradey_ks.users_by_user_id SET photourl = ? WHERE user_id = ?;`
            await client.execute(query, [avatar, userId])
            const selectQuery = `SELECT type, email, password FROM tradey_ks.users_by_user_id WHERE user_id = ?`
            const selectRs = await client.execute(selectQuery, [userId])
            const query2 = `UPDATE tradey_ks.users_by_email SET photourl = ? WHERE type = ? AND email = ? AND password = ?;`
            await client.execute(query2,[avatar,selectRs.rows[0].type,selectRs.rows[0].email,selectRs.rows[0].password])
        } else if(username !== null) {
            const query = `UPDATE tradey_ks.users_by_user_id SET name = ? WHERE user_id = ?;`
            await client.execute(query, [username, userId])
            const selectQuery = `SELECT type, email, password FROM tradey_ks.users_by_user_id WHERE user_id = ?`
            const selectRs = await client.execute(selectQuery, [userId])
            const query2 = `UPDATE tradey_ks.users_by_email SET name = ? WHERE type = ? AND email = ? AND password = ?;`
            await client.execute(query2,[username,selectRs.rows[0].type,selectRs.rows[0].email,selectRs.rows[0].password])
        } else if (password !== null) {
            const query = `UPDATE tradey_ks.users_by_user_id SET password = ? WHERE user_id = ?;`
            await client.execute(query, [password, userId])
            const selectQuery = `SELECT type, email, password FROM tradey_ks.users_by_user_id WHERE user_id = ?`
            const selectRs = await client.execute(selectQuery, [userId])
            const query2 = `UPDATE tradey_ks.users_by_email SET password = ? WHERE type = ? AND email = ? AND password = ?;`
            await client.execute(query2,[password,selectRs.rows[0].type,selectRs.rows[0].email,selectRs.rows[0].password])
        }
        

        res.send('updated')
    })

    app.post('/api/gethighlighted', async (req,res) => {
        const query = `SELECT * FROM tradey_ks.bill_products_by_bill_id;`
        var rs = await client.execute(query)
        var finalRs = []

        for(var i = 0; i< rs.rows.length; i++) {
            var check = true
            for(var j = 0; j < finalRs.length; j++) {
                if(finalRs[j].product_id.toString() === rs.rows[i].product_id.toString()) {
                    finalRs[j].quantity += rs.rows[i].quantity
                    check = false
                    break
                }
            }
            if(check) {
                finalRs.push({...rs.rows[i]})
            }
        }

        finalRs.sort((a, b) => (a.quantity > b.quantity) ? -1 : 1)

        for(var i = 0; i < finalRs.length; i++) {
            var selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?;`
            var selectRs = await client.execute(selectQuery, [finalRs[i].product_id])
            finalRs[i] = {...finalRs[i],...selectRs.rows[0]}
        }

        res.send(finalRs)
    })

    app.post('/api/getusers', async (req,res) => {
        const query = `SELECT user_id,type,name,email,photourl FROM tradey_ks.users_by_user_id;`

        const rs = await client.execute(query)

        res.send(rs.rows)
    })

    app.post('/api/searchuser', async (req,res) => {
        const name = req.body.name
        const query = `SELECT user_id,name,email,photourl,type FROM tradey_ks.users_by_user_id;`
        var rs = await client.execute(query)

        var finalRs = []
        for(var i = 0; i < rs.rows.length; i++) {
            if(rs.rows[i].name.toLowerCase().includes(name.toLowerCase())) {
                finalRs.push(rs.rows[i])
            }
        }

        res.send(finalRs)
    })

    app.post('/api/getmessages', async (req,res) => {
        const senderId = req.body.userId
        const receiverId = req.body.chatting
        var finalRs = []

        const query = `SELECT * FROM tradey_ks.messages WHERE sender_id = ? AND receiver_id = ?;`
        var rs1 = await client.execute(query, [senderId, receiverId])
        var rs2 = await client.execute(query, [receiverId, senderId])

        finalRs = [...rs1.rows, ...rs2.rows]

        finalRs.sort((a,b) => (a.time > b.time) ? 1 : -1)

        res.send(finalRs)
    })

    app.post("/api/addfriend", async (req,res) => {
        const userId = req.body.userId
        const friendId = req.body.friendId

        const query1 = `SELECT * FROM tradey_ks.relations_by_user_id WHERE user_id = ? AND friend_id = ?;`
        const rs1 = await client.execute(query1,[userId,friendId])
        const rs2 = await client.execute(query1, [friendId,userId])

        if(rs1.rows.length == 1 && rs2.rows.length == 1) {
            const deleteQuery = `BEGIN BATCH
            DELETE FROM tradey_ks.relations_by_user_id WHERE user_id = ? AND friend_id = ?;
            DELETE FROM tradey_ks.relations_by_user_id WHERE user_id = ? AND friend_id = ?;
            DELETE FROM tradey_ks.relations_by_friend_id WHERE friend_id = ? AND user_id = ?;
            DELETE FROM tradey_ks.relations_by_friend_id WHERE friend_id = ? AND user_id = ?;
            APPLY BATCH;`
            await client.execute(deleteQuery,[userId,friendId,friendId,userId, friendId,userId,userId,friendId])
            res.send("unfriended")
        } else if(rs1.rows.length == 1 && rs2.rows.length == 0) {
            const deleteQuery = `BEGIN BATCH
            DELETE FROM tradey_ks.relations_by_user_id WHERE user_id = ? AND friend_id = ?;
            DELETE FROM tradey_ks.relations_by_friend_id WHERE friend_id = ? AND user_id = ?;
            APPLY BATCH;`
            await client.execute(deleteQuery,[userId,friendId,friendId,userId])
            res.send("canceled")
        } else if (rs1.rows.length == 0 && rs2.rows.length == 1) {
            const insertQuery = `BEGIN BATCH
            INSERT INTO tradey_ks.relations_by_user_id (user_id,friend_id) VALUES (?,?);
            INSERT INTO tradey_ks.relations_by_friend_id (user_id,friend_id) VALUES (?,?);
            APPLY BATCH;`
            await client.execute(insertQuery,[userId,friendId,userId,friendId])
            res.send("accepted")
        } else if (rs1.rows.length == 0 && rs2.rows.length == 0){
            const insertQuery = `BEGIN BATCH
            INSERT INTO tradey_ks.relations_by_user_id (user_id,friend_id) VALUES (?,?);
            INSERT INTO tradey_ks.relations_by_friend_id (user_id,friend_id) VALUES (?,?);
            APPLY BATCH;`
            await client.execute(insertQuery,[userId,friendId,userId,friendId])
            res.send("requested")
        } else {
            res.send("error")
        }
    })

    app.post('/api/checkrelationship', async (req,res) => {
        const userId = req.body.userId
        const friendId = req.body.friendId

        const query1 = `SELECT * FROM tradey_ks.relations_by_user_id WHERE user_id = ? AND friend_id = ?;`
        const rs1 = await client.execute(query1,[userId,friendId])
        const rs2 = await client.execute(query1, [friendId,userId])

        if(rs1.rows.length == 1 && rs2.rows.length == 1) {
            res.send("friend")
        } else if(rs1.rows.length == 1 && rs2.rows.length == 0) {
            res.send("requested")
        } else if (rs1.rows.length == 0 && rs2.rows.length == 1) {
            res.send("pending")
        } else if (rs1.rows.length == 0 && rs2.rows.length == 0){
            res.send("none")
        } else {
            res.send("error")
        }
    })

    app.post('/api/getfriends', async (req,res) => {
        const userId = req.body.userId
        const query = `SELECT * FROM tradey_ks.relations_by_user_id WHERE user_id = ?;`
        const rs = await client.execute(query, [userId])
        var finalRs = []
        const checkRekQuery = `SELECT * FROM tradey_ks.relations_by_user_id WHERE user_id = ? AND friend_id = ?;`
        const getUserInfo = `SELECT type,user_id,name,email,photourl FROM tradey_ks.users_by_user_id WHERE user_id = ?;`

        for(var i = 0; i < rs.rows.length; i++) {
            var checkRel = await client.execute(checkRekQuery,[rs.rows[i].friend_id,userId])
            if(checkRel.rows.length == 1) {
                var userRs = await client.execute(getUserInfo, [checkRel.rows[0].user_id])
                finalRs.push(userRs.rows[0])
            }
        }
        res.send(finalRs)
    })


// apis for Cyberpunk7702
app.post("/insertgamedata", async function dosth(req,res) { 
    let username = req.body.playername 
    let bestscore = req.body.bestscore 
    const result = await client.execute(`INSERT INTO tradey_ks.best_scores(username, user_id, bestscore) VALUES (?, uuid(), ${bestscore.toString()});`,[username]) 
    res.send(result) })


    app.post ("/getgamedata", async function dosth(req,res) { 
        const query = "SELECT * FROM tradey_ks.best_scores;" 
        var result = await client.execute(query) 
        result.rows.sort((a, b) => (a.bestscore > b.bestscore) ? -1 : 1) 
        res.send(result.rows) })

    app.listen(3001)

    
    // exports.app = onRequest(app)
}

run();




// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
