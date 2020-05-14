import {getAllCounters, getArrayOfMoves} from "./getSomething.js"
import {changePositionOfCounter} from "./moveCounter.js"
import {promotePawn} from './clickCounter.js'
import {gameOptions} from "./variables.js"
import {openings} from "./openings/openings.js"

export let AIdoMove;


AIdoMove = () => {
    const allCounters = getAllCounters(null, gameOptions.activeColour, true) ;
    console.log(openings)

    const tabForCounters = [];

    let moves, coordinates;

    for(let i=0; i<allCounters.length; i++){
        
        coordinates = {x: allCounters[i].x, y:allCounters[i].y};

        moves = getArrayOfMoves(
            allCounters[i].typeOfCounter,
            allCounters[i].colour,
            allCounters[i].x,
            allCounters[i].y
            );

        tabForCounters.push({
            coordinates,
            moves
        })
    }
   
    const countersWithMoves = tabForCounters.filter( tab => {
        return tab.moves.length > 0;
    })

    let randomCounter = Math.floor(Math.random()*countersWithMoves.length);

    if(randomCounter === countersWithMoves.length){
        randomCounter--;
    }

    let randomMove = Math.floor(Math.random()*countersWithMoves[randomCounter].moves.length);

    if(randomMove === countersWithMoves[randomCounter].moves.length){
        randomMove--;
    }

   

    const origin = countersWithMoves[randomCounter].coordinates
    
    const destination = {
       x: countersWithMoves[randomCounter].moves[randomMove].x,
       y: countersWithMoves[randomCounter].moves[randomMove].y
    }
    
    const promotionBlock = document.querySelector(".select-counter-to-promote");


    if(!promotionBlock.classList.contains('invisible')){
        promotePawn(imagesOfCounter[gameOptions.oppositeColour].queen,"queen")
    }


   changePositionOfCounter(origin, destination);
}