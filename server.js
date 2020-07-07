const users = require('./users');
const express = require('express')
const http = require('http')
const socket = require('socket.io')
const cors = require('cors')
const app = express()
const db = require('./db')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", require("./routes/user"));

const server = http.createServer(app)
const io = socket(server)
const mongoose = require('mongoose')
const Message = require('./model/Message');
const { user } = require('./routes/user');
const User = mongoose.model('user')
io.on("connection",(socket)=>{

      let friendIdUser
      // socket.emit("your id",socket.id)
      socket.on("your id",id=>{
         let sender = users.create(socket,id);
      })
       
      socket.on("send message",async({body,to,from})=>{
        console.log("b",body,"uid", from,"fid", to);
       const yourIdUser = await User.findOne({ _id: from });
      friendIdUser = await User.findOne({ _id: to });
      //  console.log(yourIdUser)
       var obj ={
             to: friendIdUser._id,
             from:  yourIdUser._id,
             body:body
       }
      const mesg = new Message(obj)
      mesg.save();
            const receiver = users.get(friendIdUser._id);
            receiver.emit("message",{body,from,to})
      })
      
})


server.listen(8080,()=>console.log("server is connected on port 8080"))







// function initSocket(socket) {
//       let id;
//       socket
//             .on('init', async () => {
//                   id = await users.create(socket);
//                   socket.emit('init', { id });
//             })
//             .on('request', (data) => {
//                   const receiver = users.get(data.to);
//                   if (receiver) {
//                         receiver.emit('request', { from: id });
//                   }
//             })
//             .on('call', (data) => {
//                   const receiver = users.get(data.to);
//                   if (receiver) {
//                         receiver.emit('call', { ...data, from: id });
//                   } else {
//                         socket.emit('failed');
//                   }
//             })
//             .on('end', (data) => {
//                   const receiver = users.get(data.to);
//                   if (receiver) {
//                         receiver.emit('end');
//                   }
//             })
//             .on('disconnect', () => {
//                   users.remove(id);
//                   console.log(id, 'disconnected');
//             });
// }

// module.exports = (server) => {
//       io({ path: '/bridge', serveClient: false })
//             .listen(server, { log: true })
//             .on('connection', initSocket);
// };