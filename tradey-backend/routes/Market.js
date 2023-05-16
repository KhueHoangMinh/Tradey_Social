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

// API to post a product

router.post('/postproduct', marketUpload.single('image'), async (req,res) => {
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

// API to get all products

router.get('/getmarket', async (req,res)=> {
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

// API to get posts by user ID

router.post('/getuserposts', async (req,res) => {
    const userId = req.body.userId
    const query = `SELECT * FROM tradey_ks.posts_by_publisher_id WHERE publisher_id = ?;`

    const rs = await client.execute(query, [userId])

    rs.rows.sort((a, b) => (a.time > b.time) ? -1 : 1)

    res.send(rs.rows)
})

// API to get all products from an user

router.post('/getproductbysellerid', async (req,res) => {
    const userId = req.body.userId
    const query = `SELECT * FROM tradey_ks.products_by_seller_id WHERE seller_id = ?;`

    const rs = await client.execute(query, [userId])

    rs.rows.sort((a, b) => (a.time > b.time) ? -1 : 1)

    res.send(rs.rows)
})

// API to search for products by product name

router.post('/search', async (req,res) => {
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

// API to delete a product

router.post('/deleteproduct', async (req,res) => {
    const productId = req.body.productId
    const selectQuery = `SELECT * FROM tradey_ks.products_by_product_id WHERE product_id = ?;`
    const selectRs = await client.execute(selectQuery,[productId])

    const query = `BEGIN BATCH
    DELETE FROM tradey_ks.products_by_product_id WHERE product_id = ${selectRs.rows[0].product_id.toString()};
    DELETE FROM tradey_ks.products_by_seller_id WHERE seller_id = ${selectRs.rows[0].seller_id.toString()} AND product_id = ${selectRs.rows[0].product_id.toString()};
    APPLY BATCH;`

    if(selectRs.rows.length > 0) {
        await client.execute(query)
        res.send('deleted')
    } else {
        res.send("error")
    }
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

// API to update a products information

router.post('/updateproduct', updateMarketUpload.single('image'), async (req,res) => {
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

    
    if(selectRs.rows.length > 0) {
        await client.execute(query)
        res.send('updated')
    } else {
        res.send("error")
    }
})

// API to get a product's information by product ID

router.post('/getproductbyid', async (req,res) => {
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

// API to get highlighted products

router.post('/gethighlighted', async (req,res) => {
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
        if(selectRs.rows.length > 0) finalRs[i] = {...finalRs[i],...selectRs.rows[0]}
    }

    res.send(finalRs)
})