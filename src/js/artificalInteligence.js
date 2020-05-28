import {getAllCounters,
        getArrayOfMoves,
        getMoveFromOpenings,
        getCountersWithMoves} from "./getSomething.js";

import {changePositionOfCounter} from "./moveCounter.js";

import {gameOptions, battleField} from "./variables.js";

import {pretendMove, undoMove, evaluateBoard, minimax} from "./aiHelpers.js"
import { addMovesForShortCastling, addMovesForLongCastling } from "./specialMoves.js";

export let AIdoMove,
           calculateBestMove;


AIdoMove = () => {

    let move = getMoveFromOpenings();

    if(move === null){

        const depthBlock = document.querySelector(".select-depth select");
        const depth = depthBlock[depthBlock.options.selectedIndex].value;

        move = calculateBestMove(Number(depth), true); 

        changePositionOfCounter(
            move.origin,
            move.destination
        );

        return;
    
    } 

    setTimeout( () => {

        changePositionOfCounter(
            move.origin,
            move.destination
        );

    }, 1000)

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
                // pretendMove returns the move we pretended

                boardValue = minimax
                    (
                    depth - 1, 
                    !isMaximisingPlayer,
                    -10000,
                    10000,
                    gameOptions.activeColour
                    );
              
                undoMove(pretendedMove);

                if(boardValue >= bestValue){
                    bestValue = boardValue;

                    bestMove.origin = countersWithMoves[i].coordinates;
                    bestMove.destination = countersWithMoves[i].moves[j];
                }        
            }
        }   
        
        if(battleField.fields[bestMove.origin.x][bestMove.origin.y].typeOfCounter === "king"){

                const shortCastling = addMovesForShortCastling(bestMove.origin.x, bestMove.origin.y, gameOptions.computerColor);

                if(shortCastling.length > 0){
                    bestMove.destination.x = shortCastling[0].x;
                    bestMove.destination.y = shortCastling[0].y;
                } else {

                    const longCastling = addMovesForLongCastling(bestMove.origin.x, bestMove.origin.y, gameOptions.computerColor);

                    if(longCastling.length > 0){
                        bestMove.destination.x = longCastling[0].x;
                        bestMove.destination.y = longCastling[0].y;
                    }
                }
        }

        return bestMove;
}