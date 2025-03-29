const BG_COLOR='#231f20';
const SNAKE_COLOR='#c2c2c2';
const SNAKE_COLOR2='#b18ab8'
const FOOD_COLOR='#e66916';

const gameScreen=document.getElementById("gameScreen");
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
let playerNumber;
let canvas,ctx;
let gameActive=false;
const socket=io('http://localhost:9090');
socket.on('welcome',array=>{
    console.log(array);
})

socket.on('init',handleInit);
socket.on('gameState',handleGameState);
socket.on('gameOver',handleGameOver);
socket.on('gameCode',handleGameCode);
socket.on('unknownGame',handleUnknownGame);
socket.on('tooManyPlayers',handleTooManyPlayers);

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

function newGame(){
    socket.emit('newGame');
    init();
}


function joinGame(){
    const code=gameCodeInput.value;
    socket.emit('joinGame',code);
    init();

}
function init(){
    initialScreen.style.display="none";
    gameScreen.style.display="block"; 
    canvas=document.getElementById('canvas');
    ctx=canvas.getContext('2d');
    canvas.height=canvas.width=600;
    ctx.fillStyle=BG_COLOR;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    document.addEventListener('keydown',keydown);
    //paintGame(gameState);
    gameActive=true;
}

function keydown(e){
    socket.emit('keydown',[e.keyCode,playerNumber]);
}

function paintGame(state){
    let food=state.food;
    const gridsize=state.gridsize;
    const size=Math.floor(canvas.width/gridsize);
    ctx.fillStyle=BG_COLOR;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=FOOD_COLOR;

    ctx.fillRect(food.x*size,food.y*size,size,size);
    paintPlayer(state.player[0],SNAKE_COLOR,size);
    paintPlayer(state.player[1],SNAKE_COLOR2,size);
}

function paintPlayer(player,SNAKE_COLOR,size){
    ctx.fillStyle=SNAKE_COLOR;
    const snake=player.snake;

    snake.forEach(element => {
        ctx.fillRect(element.x*size,element.y*size,size,size);
    });
    
}

function handleGameState(gameState){
    if(!gameActive)return;
    gameState=JSON.parse(gameState);
    requestAnimationFrame(()=> paintGame(gameState));
}
function handleInit(number){
    playerNumber=number;
}
function handleGameOver(data){
    data=JSON.parse(data);
    if(!gameActive)return;
   if(data.winner===playerNumber) alert("YOU WIN!");
   else alert("YOU LOSE!!");
}

function handleGameCode(gameCode){
    gameCodeDisplay.innerText=gameCode;
    console.log(gameCode);
}

function handleUnknownGame(){
    reset();
    alert("Not a Valid Room");
}
function handleTooManyPlayers(){
    reset();
    alert("The room is already full");
}
function reset(){
    playerNumber=null;
    gameCodeInput.value="";
    gameCodeDisplay.innerText="";
    initialScreen.style.display="block";
    gameScreen.style.display="none";
}