import {getAllCounters,
        getArrayOfMoves,
        getMoveFromOpenings,
        getCountersWithMoves} from "./getSomething.js";

import {changePositionOfCounter} from "./moveCounter.js";

import {promotePawn} from "./clickCounter.js";

import {gameOptions, battleField} from "./variables.js";

import {pretendMove, undoMove, evaluateBoard, minimax} from "./aiHelpers.js"

export let AIdoMove,
           calculateBestMove;


AIdoMove = () => {
    
    const move = null//getMoveFromOpenings();

    

    if(  move !== null){


            const promotionBlock = document.querySelector(".select-counter-to-promote");


        if (!promotionBlock.classList.contains("invisible")) {

            promotePawn(
                imagesOfCounter[gameOptions.oppositeColour].queen,
                "queen"
            );

        }
        
        changePositionOfCounter(
            move.from,
            move.to
        );

        console.log("OPENING")

        return;

    } else {

       
        
        const depth = 3 ;

        const d = new Date().getTime();
      //  console.log("START")

        const bestMove = calculateBestMove(depth, true);

        const d2 = new Date().getTime();

       // console.log(`Depth ${depth} took ${(d2 - d)/1000} seconds`)
        
        changePositionOfCounter(
            bestMove.origin,
            bestMove.destination
        );
    }
    
    //console.log("RADOM")

    

};

calculateBestMove = (depth, isMaximisingPlayer) => {

    const countersWithMoves = getCountersWithMoves(gameOptions.activeColour, battleField);
    

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

        //const temporaryBattleField = 
      
        for(let i=0; i<countersWithMoves.length; i++){
            for(let j=0; j<countersWithMoves[i].moves.length; j++){

                let copyOfBattleField = JSON.parse(JSON.stringify(battleField));

                const pretendedMove = pretendMove(copyOfBattleField,
                                                  countersWithMoves[i].coordinates,
                                                  countersWithMoves[i].moves[j]);
                 
                                                //  console.log(JSON.parse(JSON.stringify(copyOfBattleField.fields)))
                // pretendMove returns the move we pretended
               // console.log(battleField)

                boardValue = minimax
                    (
                    depth - 1, 
                    !isMaximisingPlayer,
                    -10000,
                    10000,
                    gameOptions.activeColour,
                    copyOfBattleField
                    );
              
                undoMove(pretendedMove, copyOfBattleField);

                //console.log(boardValue)
                if(boardValue >= bestValue){
                    console.log(`Changed from ${bestValue} to ${boardValue}`)
                    bestValue = boardValue;

                    bestMove.origin = countersWithMoves[i].coordinates;
                    bestMove.destination = countersWithMoves[i].moves[j];
                }        
            }
        }
        console.log("AFTER CALCULATE: ",bestValue)
        

        return bestMove;
}