const express = require("express")
const router = express.Router()
const multer = require('multer')
const path = require('path')
const {Client} = require("cassandra-driver")

module.exports = router

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

client.connect();

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

    router.post('/post', postUpload.single('image'),async (req,res)=>{
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


    router.get('/getposts', async (req,res) => {
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


    router.post('/getpostbypostid', async (req,res) => {
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

    router.post('/getlikes', async (req,res) => {
        const postId = req.body.id
        const query = "SELECT * FROM tradey_ks.likes_by_time WHERE post_id = ?;"

        const rs = await client.execute(query,[postId])
        res.send(rs.rows)
    })

    router.post('/getcomments', async (req,res) => {

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

    router.post('/getcommentbycommentid', async (req,res) => {
        const commentId = req.body.commentId

        const query = 'SELECT * FROM tradey_ks.comments_by_comment_id WHERE comment_id = ?;'
        const rs = await client.execute(query, [commentId])
        
        const userQuery = `SELECT user_id, type, name, photourl, email FROM tradey_ks.users_by_user_id WHERE user_id = ${rs.rows[0].commenter_id.toString()};`
        const userRs = await client.execute(userQuery)

        res.send([{...rs.rows[0],...userRs.rows[0]}])
    })

    router.post('/getshares', async (req,res) => {
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

    router.post('/like', async (req,res)=> {
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

    router.post('/comment', async(req,res)=> {
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

    router.post('/postadvertisement', advertisementUpload.single('image'), async (req,res) => {
        const name = req.body.name
        const description = req.body.description
        const image = advertisementFilePath + filename
        const link = req.body.link
        const query = 'INSERT INTO tradey_ks.advertisement (ad_id,name,description,image,link) VALUES (uuid(),?,?,?,?);'

        const rs = await client.execute(query, [name,description,image,link])

        res.send(rs.rows)
    })

    router.post('/getadvertisement', async (req,res) => {
        const query = 'SELECT * FROM tradey_ks.advertisement;'

        const rs = await client.execute(query)
        res.send(rs.rows)
    })