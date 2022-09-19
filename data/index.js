const express=require("express");
const router=require("./router");
const cors = require('cors') ;

const server=express();

server.use(cors());
//server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use('/api',router);


server.listen(9508,()=>{
    console.log("localhost serve runnning at post:9508");
})