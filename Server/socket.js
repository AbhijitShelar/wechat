const {Server}=require('socket.io');

const intilaizeSocket=(server)=>
{
    const io=new Server(server);
     io.on('connection',(socket)=>{
        console.log("A user connected")

        socket.on('disconnect',()=>{
            console.log("user disconnected");
        })
     })



    return io;
}
module.exports=intilaizeSocket;