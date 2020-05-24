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

    let move = null//getMoveFromOpenings();

    

    if(move === null){

    const depth = 3;

    move = calculateBestMove(depth, true); 

            //promotionBlock = document.querySelector(".select-counter-to-promote");


       // if (!promotionBlock.classList.contains("invisible")) {

        //    promotePawn(
        //        imagesOfCounter[gameOptions.oppositeColour].queen,
        //        "queen"
        //    );

       // }
    }
    
  //  console.log("I KNOW OPENINGS")

  console.log(move)

    changePositionOfCounter(
        move.origin,
        move.destination
    );

};

calculateBestMove = (depth=3, isMaximisingPlayer=true) => {

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

        //const temporaryBattleField = 
      
        for(let i=0; i<countersWithMoves.length; i++){
            for(let j=0; j<countersWithMoves[i].moves.length; j++){

                const pretendedMove = pretendMove(countersWithMoves[i].coordinates,
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
                    gameOptions.activeColour
                    );
              
                undoMove(pretendedMove);

                //console.log(boardValue)
                if(boardValue >= bestValue){
              //      console.log(`Changed from ${bestValue} to ${boardValue}`)
                    bestValue = boardValue;

                    bestMove.origin = countersWithMoves[i].coordinates;
                    bestMove.destination = countersWithMoves[i].moves[j];
                }        
            }
        }
        console.log(bestMove)
        

        return bestMove;
}