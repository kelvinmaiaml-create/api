const express = require('express')
const api = express()
const ejs = require('ejs')
const {MongoClient}= require('mongodb')
const dotenv = require('dotenv')
dotenv.config()
const nodemon = require('nodemon')
const url = process.env.DATABASE_URL
//mongodb+srv://admin:admin@cluster0.vml0npv.mongodb.net/?appName=Cluster0
const ObjectId = require('mongodb').ObjectId

const client = new MongoClient(url)
let collection 

api.set('view engine', 'ejs')
api.get('/index',(req,res)=>{
    res.render('index.ejs')
})
// read
api.get('/show', async(req,res)=>{
    const crud = await collection.find().toArray()
    res.render('show.ejs', {crud})
})
// cria o novo usuário
api.post('/show', async(req,res)=>{
    await collection.insertOne({
        name: req.body.name,
        surname: req.body.surname
    })
    res.redirect('/show')
})
api.post('/edit/:id', async(req,res)=>{
    await collection.updateOne({_id: new ObjectId(req.params.id)},
{$set:{
    name: req.body.name,
    surname: req.body.surname
}})
res.redirect('/show')
})
api.get('/edit/:id', async (req,res)=>{
    const crud= await collection.find({_id: new ObjectId(req.params.id)}).toArray()
    res.render('edit.ejs', {crud})

})
api.get('/delete/:id', async(req,res)=>{
    await collection.deleteOne({_id: new ObjectId(req.params.id)})
    res.redirect('/show')
})

async function iniciar(){
    await client.connect()
    const db = client.db('pessoa')
    collection = db.collection('crud')
    console.log("conectado com mongodb")
    api.listen(3000, function(){
    console.log("O nosso servidor esta na porta 3000!")
})
}

api.get('/',(req,res) =>{
    res.send("Ola mundo!")
})

iniciar().catch(function(erro){
    console.error("erro ao iniciar a alicação"+erro)
})
