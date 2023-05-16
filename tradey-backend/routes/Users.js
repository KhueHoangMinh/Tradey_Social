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

router.post('/register', async (req,res) => {
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
        
        await client.execute(query, {prepare: true},async (err, result) => {
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


router.post('/login', async (req,res) => {
    const email = req.body.email
    const password = req.body.password
    const query = "SELECT user_id, type, name, email, photourl FROM tradey_ks.users_by_email where type IN ('user','admin') AND email = ? AND password = ?;"

    await client.execute(query,[email,password], (err, result) => {
        if(err) {
            res.send(err)
        } else {
            res.send(result)
        }
    });
})

router.post('/googlelogin', async (req,res) => {
    const email = req.body.email
    const query = `SELECT user_id, type, name, email, photourl FROM tradey_ks.users_by_email where type = 'googleuser' AND email = ?;`

    await client.execute(query,[email], (err, result) => {
        if(err) {
            res.send(err)
        } else {
            res.send(result)
        }
    });
})

router.post('/addtocart', async (req,res)=> {
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

router.post('/getcart', async (req,res) => {
    const userId = req.body.userId
    
    var finalRs = []
    const query = `SELECT * FROM tradey_ks.cart WHERE user_id = ?;`

    rs = await client.execute(query, [userId])

    for(let i = 0; i < rs.rows.length; i++) {
        var productQuery = "SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?;"
        var productRs = await client.execute(productQuery,[rs.rows[i].product_id])
        if(productRs.rows.length > 0) finalRs.push({...rs.rows[i],...productRs.rows[0]})
    }

    res.send(finalRs)
})

router.post("/changecartquant", async  (req,res) => {
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

router.post('/checkout', async (req,res) => {
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

router.post('/getshopbills', async (req,res) => {
    var finalRs = []

    const billsQuery = `SELECT * FROM tradey_ks.bills_by_time;`
    const billsRs = await client.execute(billsQuery)

    for(var i = 0; i < billsRs.rows.length; i++) {
        var itemQuery = `SELECT * FROM tradey_ks.bill_products_by_time WHERE type = 'shop' AND bill_id = ? ORDER BY time DESC;`
        var itemRs = await client.execute(itemQuery,[billsRs.rows[i].bill_id])
        for(var j = 0; j < itemRs.rows.length; j++) {
            var productQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE type = 'shop' AND product_id = ?`;
            var productRs = await client.execute(productQuery,[itemRs.rows[j].product_id])
            if(productRs.rows.length > 0) itemRs.rows[j] = {...itemRs.rows[j],...productRs.rows[0]}
        }

        if(itemRs.rows.length > 0) {
            finalRs.push({...billsRs.rows[i],billItems: itemRs.rows})
        }
    }
    res.send(finalRs)
})

router.post('/getrequests', async (req,res) => {
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
            if(productRs.rows.length > 0 && productRs.rows[0].seller_id == userId) {
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

router.post('/getbillsbyuser', async (req,res) => {
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
            if(productRs.rows.length > 0) marketItemRs.rows[j] = {...marketItemRs.rows[j],...productRs.rows[0]}
        }
        finalRs.push({...rs.rows[i], billItems: marketItemRs.rows})
    }
    res.send(finalRs)
})

router.post('/getbillbybillid', async (req,res) => {
    const billId = req.body.billId

    const query = `SELECT * FROM tradey_ks.bills_by_bill_id WHERE bill_id = ?;`
    const rs = await client.execute(query, [billId])

    var marketItemQuery = `SELECT * FROM tradey_ks.bill_products_by_bill_id WHERE bill_id = ?;`
    var marketItemRs = await client.execute(marketItemQuery, [rs.rows[0].bill_id])
    marketItemRs.rows.sort((a, b) => (a.time > b.time) ? -1 : 1)
    for(var j = 0; j < marketItemRs.rows.length; j++) {
        var productQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?`;
        var productRs = await client.execute(productQuery,[marketItemRs.rows[j].product_id])
        if(productRs.rows.length > 0) marketItemRs.rows[j] = {...marketItemRs.rows[j],...productRs.rows[0]}
    }
    res.send([{...rs.rows[0], billItems: marketItemRs.rows}])
})

router.post("/changeorderstatus", async (req,res) => {
    const orderId = req.body.orderId
    const newStatus = req.body.status
    const userId = req.body.userId

    const query = `BEGIN BATCH
    UPDATE tradey_ks.bills_by_bill_id SET status = ? WHERE bill_id = ?;
    UPDATE tradey_ks.bills_by_user_id SET status = ? WHERE user_id = ? AND bill_id = ?;
    APPLY BATCH;`
    await client.execute(query, [newStatus,orderId,newStatus,userId,orderId])

    res.send("updated")
})

router.post('/getuserbyid', async (req,res)=> {
    const userId = req.body.userId
    const query = 'SELECT type, user_id, name, email, photourl FROM tradey_ks.users_by_user_id WHERE user_id = ?;'

    const rs = await client.execute(query, [userId])
    res.send(rs.rows)
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

    router.post('/updateuserinfo', userUpload.single('avatar'),async (req,res)=>{
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

    router.post('/getusers', async (req,res) => {
        const query = `SELECT user_id,type,name,email,photourl FROM tradey_ks.users_by_user_id;`

        const rs = await client.execute(query)

        res.send(rs.rows)
    })

    router.post('/searchuser', async (req,res) => {
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

    router.post('/getmessages', async (req,res) => {
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

    router.post("/addfriend", async (req,res) => {
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

    router.post('/checkrelationship', async (req,res) => {
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

    router.post('/getfriends', async (req,res) => {
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

