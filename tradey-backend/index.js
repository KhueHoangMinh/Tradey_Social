const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const { stringify } = require('querystring')
const {Client} = require("cassandra-driver")


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
    const app = express()
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json({limit: '1mb'}))
    app.use(express.json())
    app.use(cors())

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

    
    const query = ``

    // app.get('/api/test' ,async (req,res) => {
    //     const query1 = `CREATE TABLE tradey_ks.test_2(id UUID PRIMARY KEY, name TEXT);`
    //     const query2 = `INSERT INTO tradey_ks.test_2 (id, name) VALUES (uuid(),'khue');`
    //     const query3 = `SELECT * FROM tradey_ks.test_2;`
    //     // await client.execute(query1);
    //     const rs = await client.execute(query2);
    //     // await client.execute(query3);
    //     res.send(rs);
    // })

    app.post('/api/register', async (req,res) => {
        const type = req.body.type
        const name = req.body.name
        const email = req.body.email
        var photoURL = req.body.photoURL
        const password = req.body.password

        if(photoURL == null) {
            photoURL = '/images/user.png'
        }

        const selectQuery = `SELECT email FROM tradey_ks.users_by_email WHERE type IN ('user','googleuser','admin') AND email = ?;`
        const rs = await client.execute(selectQuery,[email])

        if(rs.rows.length >= 1) {
            res.send('existed')
        } else {
            const query = `INSERT INTO tradey_ks.users_by_email (user_id,type,name,email,photourl,password) VALUES (uuid(),'${type}','${name}','${email}','${photoURL}','${password}');` 
            
            client.execute(query, {prepare: true},async (err, result) => {
                if(err) {
                    res.send(err)
                } else {
                    const query2 = `SELECT user_id FROM tradey_ks.users_by_email WHERE type = '${type}' AND email = '${email}';`
                    const rs2 = await client.execute(query2)
                    const query3 =  `INSERT INTO tradey_ks.users_by_user_id (user_id,type,name,email,photourl,password) VALUES (${rs2.rows[0].user_id.toString()},'${type}','${name}','${email}','${photoURL}','${password}');`
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
    var filepath = '../tradey-frontend/public/storage/uploadedImages/posts/'

    const postStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,filepath)
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
        var image = ''
        if(filename != '') {
            image = '/storage/uploadedImages/posts/' + filename
        } else {
            image = null
        }
        const video = null

        
        const generateId1 = "UPDATE tradey_ks.id SET id = uuid() WHERE selector = 1;"
        const generateId2 = "SELECT id FROM tradey_ks.id WHERE selector = 1;"

        await client.execute(generateId1)
        const idRs = await client.execute(generateId2)

        const query = `INSERT INTO tradey_ks.posts_by_publisher_id (type, post_id, publisher_id, time, description, image, video) VALUES ('userpost',${idRs.rows[0].id.toString()},?,toTimeStamp(now()),?,?,?);`

        const rs = await client.execute(query,[publisherId, description, image, video]);
        const query2 = `SELECT post_id, time FROM tradey_ks.posts_by_publisher_id WHERE type = 'userpost' AND publisher_id = ? AND post_id = ?;`
        const rs2 = await client.execute(query2,[publisherId, idRs.rows[0].id.toString()])
        var query3 = `INSERT INTO tradey_ks.posts_by_post_id (type, post_id, publisher_id, time, description, image, video) VALUES ('userpost',?,?,?,?,?,?);`
        await client.execute(query3, [rs2.rows[0].post_id, publisherId, rs2.rows[0].time, description, image, video])
        var query3 = `INSERT INTO tradey_ks.posts_by_time (type, post_id, publisher_id, time, description, image, video) VALUES ('userpost',?,?,?,?,?,?);`
        await client.execute(query3, [rs2.rows[0].post_id, publisherId, rs2.rows[0].time, description, image, video])

        res.send(rs.rows)
    })


    app.get('/api/getposts', async (req,res) => {
        const query = "SELECT * FROM tradey_ks.posts_by_time WHERE type = 'userpost' ORDER BY time DESC;"
        var finalRs = []

        const rs = await client.execute(query)
        for(let i = 0; i < rs.rows.length; i++) {
            const userQuery = 'SELECT user_id, type, name, photourl, email FROM tradey_ks.users_by_user_id WHERE user_id = ?;'

            const userRs = await client.execute(userQuery,[rs.rows[i].publisher_id])
            finalRs.push({...rs.rows[i],...userRs.rows[0]})
        }
        res.send(finalRs)
    })

        app.post('/api/getlikes', async (req,res) => {
        const postId = req.body.id
        const query = "SELECT COUNT(*) AS likes FROM tradey_ks.likes_by_time WHERE post_id = ?;"

        const rs = await client.execute(query,[postId])
        res.send(rs.rows)
    })

    app.post('/api/getcomments', async (req,res) => {
        const postId = req.body.id
        const query = "SELECT COUNT(*) AS comments FROM tradey_ks.comments_by_time WHERE post_id = ?;"

        const rs = await client.execute(query,[postId])
        res.send(rs.rows)
    })
    app.post('/api/getshares', async (req,res) => {
        const postId = req.body.id
        const query = "SELECT COUNT(*) AS shares FROM tradey_ks.shares_by_time WHERE post_id = ?;"

        const rs = await client.execute(query,[postId])
        res.send(rs.rows)
    })

    app.post('/api/like', async (req,res)=> {
        const userId = req.body.userId
        const postId = req.body.postId

        const selectQuery = "SELECT * FROM tradey_ks.likes_by_liker_id WHERE post_id = ? AND liker_id = ?;"
        const rs = await client.execute(selectQuery,[postId,userId])
        
        if(rs.rows.length == 0) {
            var insertQuery = "INSERT INTO tradey_ks.likes_by_liker_id (like_id,post_id,liker_id,time) VALUES (uuid(),?,?,toTimeStamp(now()));"
            await client.execute(insertQuery,[postId,userId])
            likeRs = await client.execute('SELECT * FROM tradey_ks.likes_by_liker_id WHERE post_id = ? AND liker_id = ?;', [postId,userId])
            insertQuery = "INSERT INTO tradey_ks.likes_by_time (like_id,post_id,liker_id,time) VALUES (?,?,?,?);"
            await client.execute(insertQuery,[likeRs.rows[0].like_id,likeRs.rows[0].post_id,likeRs.rows[0].liker_id,likeRs.rows[0].time])
            res.send('liked')
        } else {
            var deleteQuery = "DELETE FROM tradey_ks.likes_by_liker_id WHERE post_id = ? AND liker_id = ?;"
            await client.execute(deleteQuery,[postId,rs.rows[0].liker_id])
            deleteQuery = "DELETE FROM tradey_ks.likes_by_time WHERE post_id = ? AND time = ?;"
            await client.execute(deleteQuery,[postId,rs.rows[0].time])
            res.send('deleted')
        }
    })

    app.post('/api/comment', async(req,res)=> {
        const userId = req.body.userId
        const postId = req.body.postId
        const content = req.body.content
        const query = "INSERT INTO tradey_ks.comments_by_time (comment_id,post_id,commenter_id,content,time) VALUES (uuid(),?,?,?,toTimeStamp(now()));"

        const rs = await client.execute(query, [postId, userId, content])
        res.send(rs.rows)
    })
    app.post('/api/share', async (req,res)=> {
        const userId = req.body.userId
        const postId = req.body.postId
        const query = "INSERT INTO tradey_ks.shares_by_time (share_id,post_id,sharer_id,time) VALUES (uuid(),?,?,toTimeStamp(now()));"

        const rs = await client.execute(query, [postId, userId])
        res.send(rs.rows)
    })

    app.post('/api/showcomments', async (req,res) => {
        const postId = req.body.postId
        var finalRs = []
        const query = 'SELECT * FROM tradey_ks.comments_by_time WHERE post_id = ? ORDER BY time DESC;'

        const rs = await client.execute(query, [postId])
        
        for(let i = 0; i < rs.rows.length; i++) {
            const userQuery = `SELECT user_id, type, name, photourl, email FROM tradey_ks.users_by_user_id WHERE user_id = ${rs.rows[i].commenter_id.toString()};`
            const userRs = await client.execute(userQuery)
            finalRs.push({...rs.rows[i],...userRs.rows[0]})
        }
        res.send(finalRs)
    })

    var shopFilepath = '../tradey-frontend/public/storage/uploadedImages/shop/'

    const shopStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null, shopFilepath)
        },
        filename: (req,file,cb) => {
            filename = Date.now() + 'shop' + path.extname(file.originalname)
            cb(null,filename)
        }
    })

    const shopUpload = multer({storage: shopStorage})

    app.post('/api/postshopproduct', shopUpload.single('image'), async (req,res) => {
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        console.log(price)
        const image = '/storage/uploadedImages/shop/' + filename

        const generateId1 = "UPDATE tradey_ks.id SET id = uuid() WHERE selector = 1;"
        const generateId2 = "SELECT id FROM tradey_ks.id WHERE selector = 1;"

        await client.execute(generateId1)
        const idRs = await client.execute(generateId2)

        const query = `INSERT INTO tradey_ks.products_by_product_id (type, product_id, product_name, description, price, image, time) VALUES ('shop', ${idRs.rows[0].id.toString()},?,?,${price.toString()},?,toTimeStamp(now()));`
        await client.execute(query, [name,description,image])

        const selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'shop' AND product_id = ?;`
        const selectRs = await client.execute(selectQuery, [idRs.rows[0].id])

        const insertProductsTables = `BEGIN BATCH
        INSERT INTO tradey_ks.products_by_name (type, product_id, product_name, description, price, image, time) VALUES ('shop', ${idRs.rows[0].id.toString()},'${name}','${description}',${price.toString()},'${image}',?);
        INSERT INTO tradey_ks.products_by_time (type, product_id, product_name, description, price, image, time) VALUES ('shop', ${idRs.rows[0].id.toString()},'${name}','${description}',${price.toString()},'${image}',?);
        APPLY BATCH;`

        // console.log(insertProductsTables)
        await client.execute(insertProductsTables,[selectRs.rows[0].time,selectRs.rows[0].time]);

        res.send('inserted')
    })

    app.get('/api/getshop', async (req,res)=> {
        const query = `SELECT * FROM tradey_ks.products_by_time WHERE type = 'shop' ORDER BY time DESC;`

        const rs = await client.execute(query)

        res.send(rs.rows)
    })


    var marketFilepath = '../tradey-frontend/public/storage/uploadedImages/market/'

    const marketStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null, marketFilepath)
        },
        filename: (req,file,cb) => {
            filename = Date.now() + 'market' + path.extname(file.originalname)
            cb(null,filename)
        }
    })

    const marketUpload = multer({storage: marketStorage})

    app.post('/api/postmarketproduct', marketUpload.single('image'), async (req,res) => {
        const sellerId = req.body.userId
        const name = req.body.name
        const description = req.body.description
        const time = req.body.time
        const price = req.body.price
        const image = '/storage/uploadedImages/market/' + filename

        const generateId1 = "UPDATE tradey_ks.id SET id = uuid() WHERE selector = 1;"
        const generateId2 = "SELECT id FROM tradey_ks.id WHERE selector = 1;"

        await client.execute(generateId1)
        const idRs = await client.execute(generateId2)

        const query = `INSERT INTO tradey_ks.products_by_product_id (type, product_id, product_name, description, price, image, time, seller_id) VALUES ('market', ${idRs.rows[0].id.toString()},?,?,${price.toString()},?,toTimeStamp(now()),${sellerId.toString()});`
        await client.execute(query, [name,description,image])

        const selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'market' AND product_id = ?;`
        const selectRs = await client.execute(selectQuery, [idRs.rows[0].id])

        const insertProductsTables = `BEGIN BATCH
        INSERT INTO tradey_ks.products_by_name (type, product_id, product_name, description, price, image, time, seller_id) VALUES ('market', ${idRs.rows[0].id.toString()},'${name}','${description}',${price.toString()},'${image}',?,${sellerId.toString()});
        INSERT INTO tradey_ks.products_by_time (type, product_id, product_name, description, price, image, time, seller_id) VALUES ('market', ${idRs.rows[0].id.toString()},'${name}','${description}',${price.toString()},'${image}',?,${sellerId.toString()});
        INSERT INTO tradey_ks.products_by_seller_id (type, product_id, product_name, description, price, image, time, seller_id) VALUES ('market', ${idRs.rows[0].id.toString()},'${name}','${description}',${price.toString()},'${image}',?,${sellerId.toString()});
        APPLY BATCH;`

        // console.log(insertProductsTables)
        await client.execute(insertProductsTables,[selectRs.rows[0].time,selectRs.rows[0].time,selectRs.rows[0].time]);

        res.send('inserted')
    })




    app.get('/api/getmarket', async (req,res)=> {
        const query = `SELECT * FROM tradey_ks.products_by_time WHERE type = 'market' ORDER BY time DESC;`
        var finalRs = []
        const rs = await client.execute(query)

        for(let i = 0; i < rs.rows.length; i++) {
            const userQuery = "SELECT user_id, type, name, photourl, email FROM tradey_ks.users_by_user_id WHERE user_id = ?;"
            const userRs = await client.execute(userQuery, [rs.rows[i].seller_id])
            finalRs.push({...rs.rows[i],...userRs.rows[0]})
        }

        res.send(finalRs)
    })

    app.post('/api/getuserposts', async (req,res) => {
        const userId = req.body.userId
        const query = `SELECT * FROM tradey_ks.posts_by_publisher_id WHERE type = 'userpost' AND publisher_id = ?;`

        const rs = await client.execute(query, [userId])

        res.send(rs.rows)
    })

    app.post('/api/getusermarket', async (req,res) => {
        const userId = req.body.userId
        const query = `SELECT * FROM tradey_ks.products_by_seller_id WHERE type = 'market' AND seller_id = ? ORDER BY time DESC;`

        const rs = await client.execute(query, [userId])

        res.send(rs.rows)
    })


    // this should be improve
    app.post('/api/getadminshop', async (req,res) => {
        const userId = req.body.userId
        const query = `SELECT * FROM tradey_ks.products_by_time WHERE type = 'shop' ORDER BY time DESC;`

        const rs = await client.execute(query)
        res.send(rs.rows)
    })

    app.post('/api/shopsearch', async (req,res) => {
        const input = req.body.input
        const query = `SELECT * from tradey_ks.products_by_name WHERE type = 'shop' AND product_name = '${input}' ORDER BY time DESC;`

        const rs = await client.execute(query)

        res.send(rs.rows)
    })

    // this should be improve
    app.post('/api/marketsearch', async (req,res) => {
        const input = req.body.input
        const query = `SELECT * from tradey_ks.products_by_name WHERE type = 'market' AND product_name = ? ORDER BY time DESC;`
        var finalRs = []
        const rs = await client.execute(query,[input])

        for(let i = 0; i < rs.rows.length; i++) {
            const userQuery = "SELECT user_id, type, name, photourl, email FROM tradey_ks.users_by_user_id WHERE user_id = ?;"
            const userRs = await client.execute(userQuery, [rs.rows[i].seller_id])
            finalRs.push({...rs.rows[i],...userRs.rows[0]})
        }

        res.send(finalRs)
    })

    const advertisementFilePath = '../tradey-frontend/public/storage/uploadedImages/advertisement/'

    const advertisementStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null, advertisementFilePath)
        },
        filename: (req,file,cb) => {
            filename = Date.now() + 'advertisement' + path.extname(file.originalname)
            cb(null,filename)
        }
    })

    const advertisementUpload = multer({storage: advertisementStorage})

    app.post('/api/postadvertisement', advertisementUpload.single('image'), async (req,res) => {
        const name = req.body.name
        const image = '/storage/uploadedImages/advertisement/' + filename
        const link = req.body.link
        const query = 'INSERT INTO tradey_ks.advertisement (ad_id,name,image,link) VALUES (uuid(),?,?,?);'

        const rs = await client.execute(query, [name,image,link])

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
        const type = req.body.type
        const quantity = 1

        const selectQuery = `SELECT * FROM tradey_ks.cart WHERE type = ? AND user_id = ? AND product_id = ?;`
        const selectRs = await client.execute(selectQuery,[type,userId,productId])

        switch(action) {
            case 'add':
                if(selectRs.rows.length == 1) {
                    const query = `UPDATE tradey_ks.cart SET quantity = ${(selectRs.rows[0].quantity + 1).toString()} WHERE type = ? AND user_id = ? ANd product_id = ?;`
                    await client.execute(query, [type, userId, productId])
        
                    res.send('incremented')
                } else if(selectRs.rows.length == 0) {
                    const query = `INSERT INTO tradey_ks.cart (type,product_id,user_id,quantity,time) VALUES (?,${productId.toString()},${userId.toString()},${quantity.toString()},toTimeStamp(now()));`
            
                    await client.execute(query,[type])
                    res.send('added')
                }
                break
            case 'dec':
                if(selectRs.rows.length == 1 && selectRs.rows[0].quantity > 1) {
                    const query = `UPDATE tradey_ks.cart SET quantity = ${(selectRs.rows[0].quantity - 1).toString()} WHERE type = ? AND user_id = ? ANd product_id = ?;`
                    await client.execute(query, [type, userId, productId])
        
                    res.send('decremented')
                } else if(selectRs.rows.length == 1 && selectRs.rows[0].quantity <= 1) {
                    const query = `DELETE FROM tradey_ks.cart WHERE type = ? AND user_id = ? ANd product_id = ?;`
            
                    await client.execute(query,[type,userId,productId])
                    res.send('deleted')
                }
                break
            case 'delete':
                const query = `DELETE FROM tradey_ks.cart WHERE type = ? AND user_id = ? ANd product_id = ?;`
        
                await client.execute(query,[type,userId,productId])
                res.send('deleted')
                break
        }
    })

    app.post('/api/getcart', async (req,res) => {
        const userId = req.body.userId
        var finalRsShop = []
        var query = `SELECT * FROM tradey_ks.cart WHERE type = 'shop' AND user_id = ?;`

        var rs = await client.execute(query, [userId])
        for(let i = 0; i < rs.rows.length; i++) {
            var productQuery = "SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'shop' AND product_id = ?;"
            var productRs = await client.execute(productQuery, [rs.rows[i].product_id])
            finalRsShop.push({...rs.rows[i],...productRs.rows[0]})
        }
        
        var finalRsMarket = []
        query = `SELECT * FROM tradey_ks.cart WHERE type = 'market' AND user_id = ?;`

        rs = await client.execute(query, [userId])

        for(let i = 0; i < rs.rows.length; i++) {
            var productQuery = "SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'market' AND product_id = ?;"
            var productRs = await client.execute(productQuery,[rs.rows[i].product_id])
            finalRsMarket.push({...rs.rows[i],...productRs.rows[0]})
        }

        res.send({shopCart: finalRsShop, marketCart: finalRsMarket})
    })

    app.post('/api/checkout', async (req,res) => {
        const userId = req.body.userId

        const checkout = async (type, userId) => {

            const selectCart = `SELECT * FROM tradey_ks.cart WHERE type = ? AND user_id = ?;`
            const selectRs = await client.execute(selectCart,[type, userId])
    
            if(selectRs.rows.length > 0) {
                const generateId1 = "UPDATE tradey_ks.id SET id = uuid() WHERE selector = 1;"
                const generateId2 = "SELECT id FROM tradey_ks.id WHERE selector = 1;"
        
                await client.execute(generateId1)
                const idRs = await client.execute(generateId2)
        
                var billQuery = `INSERT INTO tradey_ks.bills_by_bill_id (bill_id, time, user_id, status) VALUES (${idRs.rows[0].id.toString()},toTimeStamp(now()),${userId.toString()},'PENDING');`
                await client.execute(billQuery)
        
                const selectQuery = `SELECT * FROM tradey_ks.bills_by_bill_id WHERE user_id = ? AND bill_id = ?;`
                const selectRs1 = await client.execute(selectQuery, [userId, idRs.rows[0].id])
                
                billQuery = `INSERT INTO tradey_ks.bills_by_time (bill_id, time, user_id, status) VALUES (${idRs.rows[0].id.toString()},?,${userId.toString()},?);`
                await client.execute(billQuery, [selectRs1.rows[0].time,selectRs1.rows[0].status])
    
                var itemQuery = `BEGIN BATCH` 
                var timeArray = []
                for(let i=0;i<selectRs.rows.length;i++) { 
                    var time = new Date(selectRs.rows[i].time.toString())
                    if(selectRs.rows[i].time.length > 28) {
                        time = new Date(selectRs.rows[i].time.toString().substr(0,23) + selectRs.rows[i].time.toString().substr(27))
                    }
                    itemQuery += `
                        INSERT INTO tradey_ks.bill_products_by_time (type, bill_id, product_id, quantity, time, user_id) VALUES 
                        ('${selectRs.rows[i].type.toString()}',${idRs.rows[0].id.toString()},${selectRs.rows[i].product_id.toString()},
                        ${selectRs.rows[i].quantity.toString()},?,${selectRs.rows[i].user_id.toString()});
                    `
                    timeArray.push(selectRs.rows[i].time)
                }
                itemQuery += `APPLY BATCH;`
                await client.execute(itemQuery, timeArray)
    
                const deleteQuery = `DELETE FROM tradey_ks.cart WHERE type = ? AND user_id = ?;`
                await client.execute(deleteQuery, [type, userId])
    
                return 'bill_created'
            } else {
                return 'no_item'
            }
        }

        res.send({shopCheckout: checkout('shop',userId), marketCheckout: checkout('market',userId)})

    })

    app.post('/api/getshopbills', async (req,res) => {
        var finalRs = []

        const billsQuery = `SELECT * FROM tradey_ks.bills_by_time;`
        const billsRs = await client.execute(billsQuery)

        for(var i = 0; i < billsRs.rows.length; i++) {
            var itemQuery = `SELECT * FROM tradey_ks.bill_products_by_time WHERE type = 'shop' AND bill_id = ? ORDER BY time DESC;`
            var itemRs = await client.execute(itemQuery,[billsRs.rows[i].bill_id])

            if(itemRs.rows.length > 0) {
                finalRs.push({...billsRs.rows[i],billItems: itemRs.rows})
            }
        }
        res.send(finalRs)
    })

    app.post('/api/getmarketbills', async (req,res) => {
        const userId = req.body.userId
        var finalRs = []

        const billsQuery = `SELECT * FROM tradey_ks.bills_by_time;`
        const billsRs = await client.execute(billsQuery)

        for(var i = 0; i < billsRs.rows.length; i++) {
            var itemQuery = `SELECT * FROM tradey_ks.bill_products_by_time WHERE type = 'market' AND bill_id = ? ORDER BY time DESC;`
            var itemRs = await client.execute(itemQuery,[billsRs.rows[i].bill_id])
            var itemsOfSeller = []

            for(var j = 0; j < itemRs.rows.length; j++) {
                var sellerCheckQuery = `SELECT seller_id FROM tradey_ks.products_by_product_id WHERE type = 'market' AND product_id = ?;`
                var checkRs = await client.execute(sellerCheckQuery,[itemRs.rows[j].product_id])
                if(checkRs.rows[0].seller_id == userId) {
                    itemsOfSeller.push(itemRs.rows[j])
                }
            }

            if( itemsOfSeller.length > 0) {
                finalRs.push({...billsRs.rows[i],billItems: itemsOfSeller})
            }
        }
        console.log(finalRs)
        res.send(finalRs)
    })

    app.get('/api/getshoporder', async (req,res) => {
        const query = 'SELECT * FROM tradey_ks.bill_products_by_time;'
        var finalRs = []

        const rs = await client.execute(query)

        for(let i = 0; i < rs.rows.length; i++) {
            const productQuery = "SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'shop' AND product_id = ?;"
            const productRs = await client.execute(productQuery, [rs.rows[i].product_id])
            finalRs.push({...rs.rows[i],...productRs.rows[0]})
        }

        res.send(finalRs)
    })

    app.post('/api/getmarketorder', async (req,res)=> {
        const userId = req.body.userId
        var finalRs = []
        
        const query = `SELECT * FROM tradey_ks.bill_products_by_seller_id WHERE type = 'market' AND seller_id = ?;`

        const rs = await client.execute(query, [userId])

        for(let i = 0; i < rs.rows.length; i++) {
            const productQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'market' AND product_id = ?;`
            const productRs = await client.execute(productQuery, [rs.rows[i].product_id])
            finalRs.push({...rs.rows[i],...productRs.rows[0]})
        }

        res.send(finalRs)
    })

    app.post('/api/getbillsbyuser', async (req,res) => {
        const userId = req.body.userId
        var finalRs = []

        const query = `SELECT * FROM tradey_ks.bills_by_time WHERE user_id = ? ORDER BY time DESC;`
        const rs = await client.execute(query, [userId])

        for(var i = 0; i < rs.rows.length; i++) {
            var shopItemQuery = `SELECT * FROM tradey_ks.bill_products_by_time WHERE type = 'shop' AND bill_id = ? ORDER BY time DESC;`
            var shopItemRs = await client.execute(shopItemQuery, [rs.rows[i].bill_id])
            for(var j = 0; j < shopItemRs.rows.length; j++) {
                var productQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'shop' AND product_id = ?`;
                var productRs = await client.execute(productQuery,[shopItemRs.rows[j].product_id])
                shopItemRs.rows[j] = {...shopItemRs.rows[j],...productRs.rows[0]}
            }
            var marketItemQuery = `SELECT * FROM tradey_ks.bill_products_by_time WHERE type = 'market' AND bill_id = ? ORDER BY time DESC;`
            var marketItemRs = await client.execute(marketItemQuery, [rs.rows[i].bill_id])
            for(var j = 0; j < marketItemRs.rows.length; j++) {
                var productQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'market' AND product_id = ?`;
                var productRs = await client.execute(productQuery,[marketItemRs.rows[j].product_id])
                marketItemRs.rows[j] = {...marketItemRs.rows[j],...productRs.rows[0]}
            }
            finalRs.push({...rs.rows[i], billItems: [...shopItemRs.rows, ...marketItemRs.rows]})
        }
        console.log(finalRs)
        res.send(finalRs)
    })

    app.post('/api/getuserbyid', async (req,res)=> {
        const userId = req.body.userId
        console.log(userId)
        const query = 'SELECT name, email, photourl FROM tradey_ks.users_by_user_id WHERE user_id = ?;'

        const rs = await client.execute(query, [userId])
        res.send(rs.rows)
    })

    app.post('/api/getshopbillitems', async (req,res) => {
        const billId = req.body.billId
        var finalRs = []
        const query = `SELECT * FROM tradey_ks.bill_products_by_time WHERE type = 'shop' AND bill_id = ? ORDER BY time DESC;`

        const rs = await client.execute(query, [billId])

        for(let i = 0; i < rs.rows.length; i++) {
            const productQuery = "SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'shop' AND product_id = ?;"
            const productRs = await client.execute(productQuery, [rs.rows[i].product_id])
            finalRs.push({...rs.rows[i],...productRs.rows[0]})
        }

        res.send(finalRs)
    })

    app.post('/api/getmarketbillitems', async (req,res) => {
        const billId = req.body.billId
        var finalRs = []
        const query = `SELECT * FROM tradey_ks.bill_products_by_time WHERE type = 'market' AND bill_id = ? ORDER BY time DESC;`

        const rs = await client.execute(query, [billId])

        for(let i = 0; i < rs.rows.length; i++) {
            const productQuery = "SELECT * FROM market_products WHERE market_id = ?;"
            const productRs = await client.execute(productQuery, [rs.rows[i].product_id])
            finalRs.push({...rs.rows[i],...productRs.rows[0]})
        }

        res.send(finalRs)
    })

    app.post('/api/deleteshopproduct', async (req,res) => {
        const productId = req.body.productId
        const selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'shop' AND product_id = ?;`
        const selectRs = await client.execute(selectQuery,[productId])

        const query = `BEGIN BATCH
        DELETE FROM tradey_ks.products_by_product_id WHERE type = 'shop' AND product_id = ${selectRs.rows[0].product_id.toString()};
        DELETE FROM tradey_ks.products_by_name WHERE type = 'shop' AND time = ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        DELETE FROM tradey_ks.products_by_time WHERE type = 'shop' AND product_name = '${selectRs.rows[0].product_name.toString()}' AND time =  ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        APPLY BATCH;`

        await client.execute(query)
        res.send('deleted')
    })

    const updateShopFilepath = '../tradey-frontend/public/storage/uploadedImages/shop/'

    const updateShopStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,updateShopFilepath)
        },
        filename: (req,file,cb) => {
            filename = req.body.imagePath
            cb(null,filename)
        }
    })

    const updateShopUpload = multer({storage: updateShopStorage})

    app.post('/api/updateshopproduct', updateShopUpload.single('image'), async (req,res) => {
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const image = '/storage/uploadedImages/shop/' + req.body.imagePath
        const productId = req.body.productId
        
        const selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'shop' AND product_id = ?;`
        const selectRs = await client.execute(selectQuery,[productId])

        const query = `BEGIN BATCH
        UPDATE tradey_ks.products_by_product_id SET product_name = '${name}', description = '${description}', price = ${price.toString()}, image = '${image}' WHERE type = 'shop' AND product_id = ${selectRs.rows[0].product_id.toString()};
        UPDATE tradey_ks.products_by_name SET product_name = '${name}', description = '${description}', price = ${price.toString()}, image = '${image}' WHERE type = 'shop' AND time = ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        UPDATE tradey_ks.products_by_time SET product_name = '${name}', description = '${description}', price = ${price.toString()}, image = '${image}' WHERE type = 'shop' AND product_name = '${selectRs.rows[0].product_name.toString()}' AND time =  ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        APPLY BATCH;`


        await client.execute(query)
        res.send('updated')
    })

    app.post('/api/deletemarketproduct', async (req,res) => {
        const productId = req.body.productId
        const selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'market' AND product_id = ?;`
        const selectRs = await client.execute(selectQuery,[productId])

        const query = `BEGIN BATCH
        DELETE FROM tradey_ks.products_by_product_id WHERE type = 'market' AND product_id = ${selectRs.rows[0].product_id.toString()};
        DELETE FROM tradey_ks.products_by_name WHERE type = 'market' AND time = ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        DELETE FROM tradey_ks.products_by_time WHERE type = 'market' AND product_name = '${selectRs.rows[0].product_name.toString()}' AND time =  ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        DELETE FROM tradey_ks.products_by_seller_id WHERE type = 'market' AND seller_id = ${selectRs.rows[0].seller_id.toString()} AND time =  ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        APPLY BATCH;`

        await client.execute(query)
        res.send('deleted')
    })

    const updateMarketFilepath = '../tradey-frontend/public/storage/uploadedImages/market/'

    const updateMarketStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,updateMarketFilepath)
        },
        filename: (req,file,cb) => {
            filename = req.body.imagePath
            cb(null,filename)
        }
    })

    const updateMarketUpload = multer({storage: updateMarketStorage})

    app.post('/api/updatemarketproduct', updateMarketUpload.single('image'), async (req,res) => {
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const image = '/storage/uploadedImages/market/' + req.body.imagePath
        const productId = req.body.productId
        
        const selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'market' AND product_id = ?;`
        const selectRs = await client.execute(selectQuery,[productId])

        const query = `BEGIN BATCH
        UPDATE tradey_ks.products_by_product_id SET product_name = '${name}', description = '${description}', price = ${price.toString()}, image = '${image}' WHERE type = 'market' AND product_id = ${selectRs.rows[0].product_id.toString()};
        UPDATE tradey_ks.products_by_name SET product_name = '${name}', description = '${description}', price = ${price.toString()}, image = '${image}' WHERE type = 'market' AND time = ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        UPDATE tradey_ks.products_by_time SET product_name = '${name}', description = '${description}', price = ${price.toString()}, image = '${image}' WHERE type = 'market' AND product_name = '${selectRs.rows[0].product_name.toString()}' AND time =  ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        UPDATE tradey_ks.products_by_seller_id SET product_name = '${name}', description = '${description}', price = ${price.toString()}, image = '${image}' WHERE type = 'market' AND seller_id = ${selectRs.rows[0].seller_id.toString()} AND time =  ${selectRs.rows[0].time.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
        APPLY BATCH;`

        await client.execute(query)
        res.send('updated')
    })

    app.post('/api/getproductbyid', async (req,res) => {
        const type = req.body.type
        const productId = req.body.productId
        const query = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = ? AND product_id = ?;`

        const rs = await client.execute(query,[type,productId])

        res.send(rs.rows)
    })


    app.listen(3001)
}

run();


