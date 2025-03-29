import { FRAME_SIZE,GRID_SIZE } from "./constants.js";


export function createGameState(){
    return {
        player:[
        {
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
        },
        {
            pos : {
                x:2,
                y:11
            },
            vel:{
                x:1,
                y:0,
            },
            snake:[
                {x:0,y:11},
                {x:1,y:11},
                {x:2,y:11}
            ],
        },
    ],
        food:{
            x:7,
            y:7,
        },
        gridsize:GRID_SIZE,
        
    }
}

export function initGame(){
    const state=createGameState();
    randomFood(state);
    console.log(state+"in init() method");
    return state;
}
export function gameLoop(state){

    if(!state)return;

    const playerOne=state.player[0];
    const playerTwo=state.player[1];
    playerOne.pos.x+=playerOne.vel.x;
    playerOne.pos.y+=playerOne.vel.y;
    playerTwo.pos.x+=playerTwo.vel.x;
    playerTwo.pos.y+=playerTwo.vel.y;

    if(playerOne.pos.x<0 || playerOne.pos.x>GRID_SIZE || playerOne.pos.y<0|| playerOne.pos.y >GRID_SIZE){
        return 2;
    }
    if(playerTwo.pos.x<0 || playerTwo.pos.x>GRID_SIZE || playerTwo.pos.y<0|| playerTwo.pos.y >GRID_SIZE){
        return 1;
    }
    if(state.food.x ==playerOne.pos.x && state.food.y==playerOne.pos.y){
        playerOne.snake.push({...playerOne.pos});
        playerOne.pos.x+=playerOne.vel.x;
        playerOne.pos.y+=playerOne.vel.y;
        state.food=randomFood(state);
    }
    if(state.food.x ===playerTwo.pos.x && state.food.y==playerTwo.pos.y){
        playerTwo.snake.push({...playerTwo.pos});
        playerTwo.pos.x+=playerTwo.vel.x;
        playerTwo.pos.y+=playerTwo.vel.y;
        state.food=randomFood(state);
    }
    if(playerOne.vel.x || playerOne.vel.y){
        playerOne.snake.forEach(element => {
            if(element.x===playerOne.pos.x && element.y===playerOne.pos.y){
                return 2;
            }
        });
    }

    if(playerTwo.vel.x || playerTwo.vel.y){
        playerTwo.snake.forEach(element => {
            if(element.x===playerTwo.pos.x && element.y===playerTwo.pos.y){
                return 1;
            }
        });
    }
    playerOne.snake.push({...playerOne.pos});
    playerOne.snake.shift();

    playerTwo.snake.push({...playerTwo.pos});
    playerTwo.snake.shift();
    


}
function randomFood(state){
    const food={
        x:Math.floor(Math.random()*GRID_SIZE),
        y:Math.floor(Math.random()*GRID_SIZE),
    }
    state.player[0].snake.forEach(cell=>{
        if(cell.x===food.x && cell.y===food.y){
            return randomFood(state);
        }
    })
    state.player[1].snake.forEach(cell=>{
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