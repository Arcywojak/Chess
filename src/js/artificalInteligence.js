import {getAllCounters,
        getArrayOfMoves,
        getMoveFromOpenings,
        getCountersWithMoves} from "./getSomething.js";

import {changePositionOfCounter} from "./moveCounter.js";

import {promotePawn} from "./clickCounter.js";

import {gameOptions, battleField} from "./variables.js";

import {pretendMove, undoMove, evaluateBoard} from "./aiHelpers.js"

export let AIdoMove,
           calculateBestMove;


AIdoMove = () => {

    const move = getMoveFromOpenings();

    calculateBestMove();

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

    let bestValue = -9999,
        boardValue,
        bestMove = {
            origin:{
                x:null,
                y:null
            },
            destination:{
                x:null,
                y:null
            }
        };

        const temporaryBattleField = JSON.parse(JSON.stringify(battleField));
      
        for(let i=0; i<countersWithMoves.length; i++){
            for(let j=0; j<countersWithMoves[i].moves.length; j++){
                
                const pretendedMove = pretendMove(countersWithMoves[i].coordinates,
                                                  countersWithMoves[i].moves[j]); 
                // pretendMove returns the move we pretended

                boardValue = evaluateBoard();
                    console.log(boardValue)
                if(boardValue > bestValue){
                    bestValue = boardValue;

                    bestMove.origin = countersWithMoves[i].coordinates;
                    bestMove.destination = countersWithMoves[i].moves[j];
                }

                undoMove(pretendedMove);
            }
        }
}