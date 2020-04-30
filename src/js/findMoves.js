export let findMovesForBishop,
    findMovesForKing,
    findMovesForKnight,
    findMovesForPawn,
    findMovesForQueen,
    findMovesForRook,
    findMovesForSomebody,
    canPawnAttack;

import {getActiveCoordinates,
    getActiveField,
    getCoordinatesFromField,
    getFieldFromCoordinates,
    getBishopMoves,
    getRookMoves,
    getQueenMoves,
    getKingMoves,
    getKnightMoves,
    getPawnMoves} from "./getSomething.js";

import {
    findPossibleMoves,
    isFieldTaken,
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves} from "./showMoves.js";

import { doesCounterEndangerKing } from "./LookForCheck.js";

    findMovesForSomebody = (typeOfCounter, team, x, y, show) => {

        const enemyColour = team === "white" ? "black" : "white";

        let tabOfMoves = [];

        switch(typeOfCounter){
            case 'pawn':

            
            const tabMove = getPawnMoves(team, x, y);
            const tabAttack = canPawnAttack(enemyColour, x, y);

                tabOfMoves = tabMove.concat(tabAttack);
                
                break;

            case 'knight':

                tabOfMoves = getKnightMoves(team, x, y);

                break;

            case 'bishop':

                tabOfMoves = getBishopMoves(team, x, y);

                break;

            case 'rook':

                tabOfMoves = getRookMoves(team, x, y);

                break;

            case 'queen':
                
                tabOfMoves = getQueenMoves(team, x, y);

                break;

            case 'king':
                
                tabOfMoves = getKingMoves(team, x, y);

                break;

            default: throw new Error("You have probably given wrong name of counter");
        }

        if(show){
            showPossibleMoves(tabOfMoves);

            return;
        }
            
        

        doesCounterEndangerKing(tabOfMoves, enemyColour);
}




    canPawnAttack = (unfriendlyColour, x, y) => {

        let tabOfMoves = [];
        const activeField = getFieldFromCoordinates(x, y),
        
    
            activeCoordinates = getCoordinatesFromField(activeField, false),
    
            otherNumber = unfriendlyColour === "white"
                ? 1
                : -1,
    
    
            rightCoordinates = {
                "x": activeCoordinates.x - 1,
                "y": activeCoordinates.y + otherNumber
            },
    
            leftCoordinates = {
                "x": activeCoordinates.x + 1,
                "y": activeCoordinates.y + otherNumber
            },
    
            leftField = getFieldFromCoordinates(
                leftCoordinates.x,
                leftCoordinates.y
            ),
            rightField = getFieldFromCoordinates(
                rightCoordinates.x,
                rightCoordinates.y
            );
    
    
        if (leftField !== null) {
    
            const team = leftField.classList[3];
    
            if (team === unfriendlyColour) {
    
                tabOfMoves.push(
                    {"x": leftCoordinates.x,
                        "y": leftCoordinates.y}
                );
    
            }
    
        }
        if (rightField !== null) {
    
            const team = rightField.classList[3];
    
            if (team === unfriendlyColour) {
    
                tabOfMoves.push(
                    {"x": rightCoordinates.x,
                        "y": rightCoordinates.y}
                );
    
            }
    
        }
    
        return tabOfMoves;
    
    };