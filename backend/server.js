import {Server} from 'socket.io';
import {createServer} from 'http';
import { createGameState,gameLoop ,getUpdatedVelocity} from './game.js';
import { FRAME_SIZE } from './constants.js';
const httpServer=createServer()
httpServer.listen(9090);

const io=new Server(httpServer,{
    cors:[

    ]
})
io.on('connection',(socket)=>{
    const state=createGameState();
    socket.emit('init');
    socket.on('keydown',(keyCode)=>{
        try{
            keyCode=parseInt(keyCode);

        }
        catch(e){
            console.error(e);
            return;
        }
        
        const vel=getUpdatedVelocity(keyCode);
        if(vel){
            state.player.vel=vel;
        }
    });
    startGameInterval(socket,state);
})


function startGameInterval(client,state){
    const intervalId=setInterval(()=>{
        const winner =gameLoop(state);

        if(!winner){
            client.emit('gameState',state);
        }
        else{
            client.emit('gameOver');
            clearInterval(intervalId); 
        }
    },1000/FRAME_SIZE);
}