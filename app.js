
const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port=2000;
const fs = require('fs')
const writeStream = fs.createWriteStream('score.txt','UTF-8')


server.listen(port,()=>{
    console.log(`server running at port ${port}`)
})

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/Ex2.html');
})

app.use('/',express.static(__dirname+'/'));

const SOCKET_LIST ={};


io.on('connection',(socket)=>{
    console.log('user connected')
    socket.on('message',(data)=>{
        console.log(data.data)
        writeStream.write('Score:')
        writeStream.write(data.data+'\n')
    })

   
})


