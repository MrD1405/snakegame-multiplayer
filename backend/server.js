import {Server} from 'socket.io';
import {createServer} from 'http';
const httpServer=createServer()
httpServer.listen(9090);

const io=new Server(httpServer,{
    cors:[

    ]
})
io.on('connection',(socket)=>{
    console.log("hello"+socket.id);
    socket.emit('welcome',()=>{
        return "hello";
    })
})