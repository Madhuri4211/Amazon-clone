const express=require('express')
const app=express()
const mysql=require('mysql')
const path=require('path')
const dotenv=require('dotenv')
dotenv.config()
const connection = require('./db')
const body_parser=require('body-parser')
const bcrypt=require('bcrypt')
const cors = require("cors");
app.use(cors());

// app.use(express.static('../client'))
app.use(body_parser.urlencoded({extended:true}))
app.use(body_parser.json())


app.use(express.static(path.join(__dirname, '../client')));
app.get('/',(req,res)=>{
    // console.log(path.join(__dirname, '../client/amazon.html'))
    res.sendFile(path.join(__dirname, '../client/amazon.html'))
})


app.get('/api/getproduct/:titlename',(req,res)=>{
    title_name=req.params.titlename;
    console.log(title_name)
    const getProductdata= new Promise((resolve,reject)=>{
            const sqlcommand=`SELECT * FROM amazon_product WHERE title LIKE "%${title_name}%" ORDER BY RAND() LIMIT 100`
            connection.query(sqlcommand,[title_name],(error,result)=>{
            if(error)
            {
                reject(error)
            }
            else
            {
                resolve(result)
            }
        })
    })
    console.log(getProductdata);
    getProductdata
    .then(data=>res.json(data))
    .catch(error=>console.log(error.message))
})

app.get('/api/getcategory/:category',(req,res)=>{
    category_name=req.params.category;
    console.log(category_name);
    const getProductdata=new Promise((resolve,reject)=>{
        const sqlcommand=`SELECT * FROM amazon_product INNER JOIN amazon_categories ON amazon_product.category_id=amazon_categories.id WHERE category_name LIKE"%${category_name}%" OR title LIKE"%${category_name}%" ORDER BY RAND() LIMIT 100;`
        connection.query(sqlcommand,(error,result)=>{
            if(error)
            {
                reject(error.message)
            }
            else
            {
                console.log(result)
                resolve(result)
            }
        })
    })
    getProductdata
    .then(data=>res.json(data))
    .catch(error=>console.log(error.message))
})

app.get('/api/filters',(req,res)=>{
    const title_name=req.query.title
    const min_price=req.query.min;
    min_price?min_price:0;
    const max_price=req.query.max;
    max_price?max_price:100;
    const reviews=req.query.reviews;
    reviews?reviews:1;
    const sortby=req.query.sortby;
    const color=req.query.color;
    color?color:'black';
    const getFilteredData=new Promise((resolve,reject)=>{
        let sqlcommand;
        sqlcommand=`SELECT * FROM amazon_product WHERE title LIKE '${title_name}%' AND price>=${min_price} AND price<${max_price} AND stars>${reviews} ORDER BY price ${sortby}`
        connection.query(sqlcommand,(error,result)=>{
            if(error)
            {
                reject(error)
            }
            else
            {
                resolve(result)
            }
        })
    })
    getFilteredData
    .then(data=>res.json(data))
    .catch(error=>console.log(error))
})


//insert user details
app.post('/api/createUser',async (req,res)=>{
    let message;
    const name=req.body.username;
    const email=req.body.email;
    const hashedPassword=await bcrypt.hash(req.body.password,10);
    const insertUserData=new Promise((resolve,reject)=>{
        const searchUser=`SELECT * FROM userdata WHERE email=?`
        connection.query(searchUser,[email],(error,result)=>{
            if(error){
                console.log(error.message);
            }
            if(result.length!=0){
                message='User already exists'
                console.log(message)
                resolve(message)
                // res.status(409).send('User already exists')
            }
            else
            {
                const sqlcommand=`INSERT INTO userdata values (0,?,?,?);`
                connection.query(sqlcommand,[name,email,hashedPassword],(error,result)=>{
                if(error)
                {
                    reject(error.message)
                }
                else
                {
                    message='Successfully create new account'
                    resolve(message)
                    
                }
                })
            }
       })
    })
    insertUserData
    .then(data=>res.json({message:data}))
    .catch(error=>console.log(error))
})

//authenticate registered user
app.post('/api/login',(req,res)=>{
    let message;
    const email=req.body.email;
    const password=req.body.password;
    const loginUser=new Promise((resolve,reject)=>{
        const searchUser=`SELECT * FROM userdata WHERE email=?;`
        connection.query(searchUser,[email],async (error,result)=>{
            // console.log(result)
            if(error){
                console.log(error.message)
                reject(error)
            }
            if(result.length==0)
            {
                message='User doesnot exists!!'
                console.log(message)
                // res.status(404).send('User doesnot exist')
                resolve(message)
            }
            else{
                const hashedPassword=result[0].password;
                if(await bcrypt.compare(password,hashedPassword)){
                    message='Login successfully!!'
                    console.log(message)
                    resolve(message)
                }
                else{
                    message='Incorrect password!!'
                    console.log('Incorrect password')
                    resolve(message)
                    // res.send('Password is Incorrect')
                }
            }
        })
    })
    loginUser
    .then(data=>res.json({message:data}))
    .catch(error=>console.log(error.message))
})


PORT=process.env.PORT||8080
app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`)
})