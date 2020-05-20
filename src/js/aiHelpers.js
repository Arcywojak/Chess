import { battleField } from "./variables.js";
import { isFieldTaken } from "./handleWithDOM.js";

export let pretendMove,
           undoMove,
           evaluateBoard,
           getCounterValue;



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
            totalEvaluation += getCounterValue(battleField.fields[i][j]);
        }
    }
    return totalEvaluation;
}

getCounterValue = (field) => {

    let value;

    switch(field.typeOfCounter) {
        case null:
            value = 0;break;
        case "pawn":
            value = 10;break;
        case "knight":
            value = 30;break;
        case "bishop":
            value = 30;break;
        case "rook":
            value = 50;break;
        case "queen":
            value = 90;break;
        case "king":
            value = 900;break;

        default :
        throw new Error(`Unknown type of counter: "${field.typeOfCounter}"`)
    }

    if(field.color === "black"){
        value = -value;
    }

    return value;
}