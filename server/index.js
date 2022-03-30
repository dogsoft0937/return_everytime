const express=require('express');
const app=express();
const port=process.env.PORT || 5000;
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');

const config=require('./config/key');

const mongoose=require('mongoose');
const connect = mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected ..."))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/hello',(req,res)=>{
    res.json("helloworld");
})

app.listen(port,()=>{
    console.log('server start');
})