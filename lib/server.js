'use strict';
const express=require('express');
const app = express();
const logRequest=require('./logger.js')
app.use(logRequest)
app.use(express.json());
//basic route
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
//error function call 
app.get('/real-error',(req,res)=>{
    throw new  Error('my first real erorr')
})
//generate api
let db=[];
app.get('/api/v1/categories',(req,res,next)=>{
    let count=db.length;
    let result=db;
    res.json({count,result});
})
app.get('/api/v1/categories/:id',(req,res,next)=>{
    let id=req.params.id;
    let record=db.filter(record=>record.id === parseInt(id));
    res.json(record)
})
app.post('/api/v1/categories',(req,res,next)=>{
let {name}=req.body;
let record={name};
record.id=db.length+1;
db.push(record)
res.json(record)
})
app.put('/api/v1/categories/:id',(req,res,next)=>{
    let idToUpdate=req.params.id;
    let {name,id}=req.body;
    let updatedRecord={name,id};
    db=db.map(record=>(record.id === parseInt(idToUpdate))?updatedRecord:record);
    res.json(updatedRecord);
})
app.delete('/api/v1/categories/:id',(req,res,next)=>{
    let id =req.params.id;
    db=db.filter(record=>record.id !== parseInt(id));
    res.json({msg:'item deleted'})
})
// middleware function 
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
//error and notfound handler

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