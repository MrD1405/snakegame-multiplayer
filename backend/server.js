import {Server} from 'socket.io';
import {createServer} from 'http';
import { createGameState,gameLoop ,getUpdatedVelocity,initGame} from './game.js';
import { FRAME_SIZE } from './constants.js';
const httpServer=createServer()
httpServer.listen(9090);

const state={};
const clientRooms={}
const io=new Server(httpServer,{
    cors:[

    ]
})
io.on('connection',(socket)=>{
    // const state=createGameState();
    // socket.emit('init');

    socket.on('newGame',handleNewGame);
    socket.on('joinGame',handleJoinGame);

    function handleJoinGame(gameCode){
        const room=io.sockets.adapter.rooms.get(gameCode);
        console.log(io.sockets.adapter.rooms,gameCode);
         console.log(room);
        let allUsers;
       
        
        let numClients=0
        if(room){
            numClients=room.size;

        }
        console.log(numClients);
        if(numClients===0){
            socket.emit('unknownGame');
            return;
        }
        else if(numClients>1){
            socket.emit('tooManyPlayers');
            return;
        }
        clientRooms[socket.id]=gameCode;
        socket.join(gameCode);
        socket.number=1;
        socket.emit('init',2);
        startGameInterval(gameCode);
        
    }
    function handleNewGame(){
       
        let roomName=makeid(5);
        clientRooms[socket.id]=roomName;
        
        socket.emit('gameCode',roomName);//you were here
        state[roomName]=initGame();
        socket.join(roomName);
        socket.number=1;
        socket.emit('init',1);
        // console.log(io.sockets.adapter.rooms.get('EYYfy'));
          
    }
    socket.on('keydown',(array)=>{
        const roomName=clientRooms[socket.id];
        if(!roomName)return;

        try{
            let keyCode=parseInt(array[0]);

        }
        catch(e){
            console.error(e);
            return;
        }
        
        const vel=getUpdatedVelocity(array[0]);
        if(vel){
            state[roomName].player[array[1]-1].vel=vel;
            console.log(socket.number);
        }
    });
    
})


function startGameInterval(roomName){
    const intervalId=setInterval(()=>{
        const winner =gameLoop(state[roomName]);

        if(!winner){
            emitGameState(roomName,state[roomName]);
              
        }
        else{
            emitGameOver(roomName,winner);
            clearInterval(intervalId); 
        }
    },1000/FRAME_SIZE);
}

function emitGameState(roomName,state){
    
    io.in(roomName).emit('gameState',JSON.stringify(state));
}
function emitGameOver(roomName,winner){
    io.in(roomName).emit('gameOver',JSON.stringify({winner}));
}
function makeid(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }