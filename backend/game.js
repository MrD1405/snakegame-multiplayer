import { FRAME_SIZE,GRID_SIZE } from "./constants.js";


export function createGameState(){
    return {
        player:{
            pos : {
                x:3,
                y:10
            },
            vel:{
                x:1,
                y:0,
            },
            snake:[
                {x:1,y:10},
                {x:2,y:10},
                {x:3,y:10}
            ],
            food:{
                x:7,
                y:7,
            },
            gridsize:GRID_SIZE,
        }
    }
}

export function gameLoop(state){

    if(!state)return;

    const playerOne=state.player;
    playerOne.pos.x+=playerOne.vel.x;
    playerOne.pos.y+=playerOne.vel.y;

    if(playerOne.pos.x<0 || playerOne.pos.x>GRID_SIZE || playerOne.pos.y<0|| playerOne.pos.y >GRID_SIZE){
        return 2;
    }
    if(playerOne.food.x ==playerOne.pos.x && playerOne.food.y==playerOne.pos.y){
        playerOne.snake.push({...playerOne.pos});
        playerOne.pos.x+=playerOne.vel.x;
        playerOne.pos.y+=playerOne.vel.y;
        playerOne.food=randomFood(playerOne);
    }
    if(playerOne.vel.x || playerOne.vel.y){
        playerOne.snake.forEach(element => {
            if(element.x===playerOne.pos.x && element.y===playerOne.pos.y){
                return 2;
            }
        });
    }
    playerOne.snake.push({...playerOne.pos});
    playerOne.snake.shift();
    


}
function randomFood(state){
    const food={
        x:Math.floor(Math.random()*GRID_SIZE),
        y:Math.floor(Math.random()*GRID_SIZE),
    }
    state.snake.forEach(cell=>{
        if(cell.x===food.x && cell.y===food.y){
            return randomFood(state);
        }
    })
    return food;
}

export function getUpdatedVelocity(keyCode){
    switch(keyCode){
        case 37:{
            return {x:-1,y:0};
        }
        case 38:{
            return {x:0,y:-1};
        }
        case 39:{
            return {x:1,y:0};
        }
        case 40:{
            return {x:0,y:1};
        }
    }
}