const dotenv=require('dotenv').config()
const express=require('express')
const bodyparser=require('body-parser')
const cookieParser=require('cookie-parser')
const userRoute=require('./routes/userRoute')
const bookRoute=require('./routes/booksRoute')


const app=express()


app.use(express.json()) // help in using express data
app.use(express.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(cookieParser());


// router middleware

app.use('/api/customer',userRoute);
app.use('/api/book',bookRoute)


const PORT=process.env.PORT || 3000 ;
app.listen(PORT)
