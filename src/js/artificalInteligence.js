import {getAllCounters,
        getArrayOfMoves,
        getMoveFromOpenings,
        getCountersWithMoves} from "./getSomething.js";

import {changePositionOfCounter} from "./moveCounter.js";

import {promotePawn} from "./clickCounter.js";

import {gameOptions} from "./variables.js";

export let AIdoMove,
           calculateBestMove;


AIdoMove = () => {

    const move = getMoveFromOpenings();

    if(move === null){

      

        const countersWithMoves = getCountersWithMoves(gameOptions.activeColour);

        let randomCounter = Math.floor(Math.random() * countersWithMoves.length);

        if (randomCounter === countersWithMoves.length) {

            randomCounter--;

        }

        let randomMove = Math.floor(Math.random() * countersWithMoves[randomCounter].moves.length);

        if (randomMove === countersWithMoves[randomCounter].moves.length) {

            randomMove--;

        }


        const origin = countersWithMoves[randomCounter].coordinates,

            destination = {
                "x": countersWithMoves[randomCounter].moves[randomMove].x,
                "y": countersWithMoves[randomCounter].moves[randomMove].y
            },

            promotionBlock = document.querySelector(".select-counter-to-promote");


        if (!promotionBlock.classList.contains("invisible")) {

            promotePawn(
                imagesOfCounter[gameOptions.oppositeColour].queen,
                "queen"
            );

        }

        changePositionOfCounter(
            origin,
            destination
        );

        console.log("RANDOM")

        return;

    }
    
    console.log("I KNOW OPENINGS")

    changePositionOfCounter(
        move.from,
        move.to
    );

};

calculateBestMove = () => {

    const countersWithMoves = getCountersWithMoves(gameOptions.activeColour);
}