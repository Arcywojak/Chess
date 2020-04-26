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

findMovesForSomebody = (typeOfCounter, team, x, y) => {

        let tabOfMoves = [];

        switch(typeOfCounter){
            case 'pawn':

            const enemy = team === "white" ? "black" : "white";
            const tabMove = getPawnMoves(team, x, y);
            const tabAttack = canPawnAttack(enemy);

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

            default: throw new Error("You have probably given wrong name of counter");
        }

        showPossibleMoves(tabOfMoves);
}

    findMovesForBishop = (team, x, y) => {
        
        
        
    }

    findMovesForRook = (team, x, y) => {

        const tab = getRookMoves(team, x, y);

        showPossibleMoves(tab);
    }

    findMovesForQueen = (team, x, y) => {

        const tab = getQueenMoves(team, x, y);

        showPossibleMoves(tab);
    }

    canPawnAttack = (unfriendlyColour) => {

        let tabOfMoves = [];
        const activeField = getActiveField(true),
        
    
            activeCoordinates = getCoordinatesFromField(activeField),
    
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
        console.log(tabOfMoves)
    
        return tabOfMoves;
    
    };