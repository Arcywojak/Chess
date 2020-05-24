import { battleField } from "./variables.js";
import { isFieldTaken } from "./handleWithDOM.js";

import {getCountersWithMoves} from "./getSomething.js"

import {pawnEvalWhite,
    pawnEvalBlack,
    knightEval,
    bishopEvalWhite,
    bishopEvalBlack,
    evalQueen,
    rookEvalWhite,
    rookEvalBlack,
    kingEvalWhite,
    kingEvalBlack} from "./variables.js"

export let pretendMove,
           undoMove,
           evaluateBoard,
           getCounterValue,
           minimax;



pretendMove = (origin, destination) => {

    let destColor = null;
    let destType = null;
    const originColor = battleField.fields[origin.x][origin.y].color;
    const originType = battleField.fields[origin.x][origin.y].typeOfCounter;
    
    battleField.fields[origin.x][origin.y].typeOfCounter = null;
    battleField.fields[origin.x][origin.y].color = null;

    const isTaken = isFieldTaken(destination.x, destination.y);

    if(isTaken){
        destType = battleField.fields[destination.x][destination.y].typeOfCounter;
        destColor = battleField.fields[destination.x][destination.y].color
    }

    battleField.fields[destination.x][destination.y].typeOfCounter = originType;
    battleField.fields[destination.x][destination.y].color = originColor;


    return {origin, destination, destType, destColor, originColor, originType};
}

undoMove = (pretendedMove) => {
    //pretendedMove.origin, //earlier origin of counter
    //pretendedMove.destination, // the latest move coordinates
    //pretendedMove.destType,
    //pretendedMove.destColor
    //pretendedMove.originType,
    //pretendedMove.originColor

    battleField.fields[pretendedMove.origin.x][pretendedMove.origin.y].typeOfCounter = pretendedMove.originType;
    battleField.fields[pretendedMove.origin.x][pretendedMove.origin.y].color = pretendedMove.originColor;

    battleField.fields[pretendedMove.destination.x][pretendedMove.destination.y].typeOfCounter = pretendedMove.destType;
    battleField.fields[pretendedMove.destination.x][pretendedMove.destination.y].color = pretendedMove.destColor;
}

evaluateBoard = () => {
    let totalEvaluation = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            totalEvaluation += getCounterValue(battleField.fields[i][j], i, j);
        }
    }
    return totalEvaluation;
}

getCounterValue = (field, x, y) => {

    let value;

    const color = field.color;

    switch(field.typeOfCounter) {
        case null:
            value = 0;
            break;
        case "pawn":
            value = 10 + ( color === "white" ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
            break;
        case "knight":
            value = 30 +  knightEval[y][x];
            break;
        case "bishop":
            value = 30 + ( color === "white" ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );;
            break;
        case "rook":
            value = 50 + ( color === "white" ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
            break;
        case "queen":
            value = 90 + evalQueen[y][x];
            break;
        case "king":
            value = 900 + ( color === "white" ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );;
            break;

        default :
        throw new Error(`Unknown type of counter: "${field.typeOfCounter}"`)
    }

    if(field.color === "black"){
        value = -value;
    }

    return value;
}

minimax = (depth, isMaximisingPlayer, alpha, beta, colorOfTeam) => {

    if(depth === 0){
        return -evaluateBoard();
    }

    //let val = evaluateBoard()
    
    colorOfTeam = colorOfTeam === "white" ? "black" : "white";

    const countersWithMoves = getCountersWithMoves(colorOfTeam);

    if(isMaximisingPlayer){

        let value = -5555;

        for(let i=0; i<countersWithMoves.length; i++){
            for(let j=0; j<countersWithMoves[i].moves.length; j++){
                
                const pretendedMove = pretendMove( countersWithMoves[i].coordinates,
                                                   countersWithMoves[i].moves[j]); 

                // pretendMove returns the move we pretended

                //AI is black so we take negative value
                value = Math.max(
                    value,  
                    minimax(
                        depth - 1,
                        !isMaximisingPlayer,
                        alpha,
                        beta,
                        colorOfTeam
                           ) 
                    );

                undoMove(pretendedMove);

                alpha = Math.max(alpha, value);

                if(beta <= alpha){
                    return value;
                }
            }
        }
            return value;

       } else {

        let value = 5555;

        for(let i=0; i<countersWithMoves.length; i++){
            for(let j=0; j<countersWithMoves[i].moves.length; j++){
                
                const pretendedMove = pretendMove(
                                                    countersWithMoves[i].coordinates,
                                                    countersWithMoves[i].moves[j]); 
                // pretendMove returns the move we pretended

                //AI is black so we take negative value
                value = Math.min(
                    value,
                    minimax(
                        depth - 1,
                        !isMaximisingPlayer,
                        alpha,
                        beta,
                        colorOfTeam
                        ) 
                    );

                undoMove(pretendedMove);

                beta = Math.min(beta, value);

                if (beta <= alpha) {
                    return value;
                }   
            }
        }
            return value;
       }
}