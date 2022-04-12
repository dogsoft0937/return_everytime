const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output");
const express=require('express');
const app=express();
const port=process.env.PORT || 6000;
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');

const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
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

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/api/users',require('./routes/users'))
app.use('/api/list',require('./routes/lists'))

app.get('/hello',(req,res)=>{
    res.json("helloworld");
})

app.listen(port,()=>{
    console.log('server start');
})