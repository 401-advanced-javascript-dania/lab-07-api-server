'use strict';
const express=require('express');
const app = express();
const logRequest=require('./logger.js')
app.use(logRequest)
app.use(express.json());
app.get('/categories',(req,res)=>{
    console.log('query',req.query.type)
    let output={
        type: req.query.type
    }
    res.status(200).json(output)
})
app.post('/categories',(req,res)=>{
    console.log('req.body',req.body)
    res.status(201).send('it added!')
})
app.get('/midware',timestamp(),(req,res)=>{
let output={
    requestTime:req.requestTime
}
res.status(200).json(output)
})

function timestamp(){
    return (req,res,next)=>{
req.requestTime=new Date().toLocaleDateString("en-us")+"    "+new Date().toLocaleTimeString("en-us")
        next();
    }
    function errorHandler(err,req,res,next){
        res.status(500);
        res.statusMessage='Generic Server Erorr!';
        res.json({erorr:err})
    }
    function notFoundHandler(req,res,next){
        res.status(404);
        res.statusMessage='Not Found';
        res.json({error:'Not Found'})
    }
}
module.exports={
    server:app,
    start:port=>{
        let PORT=port||process.env.PORT||3000;
 app.listen(PORT,()=>console.log(`listening on ${PORT}`))
    }
}