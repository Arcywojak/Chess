export let findMovesForBishop,
    findMovesForKing,
    findMovesForKnight,
    findMovesForPawn,
    findMovesForQueen,  
    findMovesForRook,
    findPossibleMoves,
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
    getPawnMoves,
    getArrayOfMoves} from "./getSomething.js";

import {
    isFieldTaken,
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves} from "./handleWithDOM.js";

import { doesCounterEndangerKing, filterTabInCaseOfCheck, willBeMyKingInDanger } from "./LookForCheck.js";
import { COLOR_CLASS, battleField, gameOptions } from "./variables.js";
import { addMovesForShortCastling, addMovesForLongCastling } from "./specialMoves.js";




    findPossibleMoves = (typeOfCounter, team, x, y) => {

        const tabOfMoves = getArrayOfMoves(typeOfCounter, team, x, y)


        let filteredTab = filterTabInCaseOfCheck(x, y, tabOfMoves);
        
        if(battleField.fields[x][y].typeOfCounter === "king"){

        const shortCastlingMoves = addMovesForShortCastling(x, y, gameOptions.activeColour);

        const longCastlingMoves = addMovesForLongCastling(x, y, gameOptions.activeColour)


         filteredTab = [...filteredTab, ...shortCastlingMoves, ...longCastlingMoves];
        
        } 
        
        

        showPossibleMoves(filteredTab);

        return;
}




    canPawnAttack = (unfriendlyColour, x, y) => {

        let tabOfMoves = [];

    
    // this number decide if the pawn go up or down through the battlefield
        const moveY = unfriendlyColour === "white" 
            ? 1
            : -1,
    ////////////////////////////////////////////////////////////////////////
    
    
            rightCoordinates = {
                "x": x + 1,
                "y": y + moveY
            },
    
            leftCoordinates = {
                "x": x - 1,
                "y": y + moveY
            };

        if(leftCoordinates.x >= 0 && leftCoordinates.y<=7 && leftCoordinates.y>=0){

            if (battleField.fields[leftCoordinates.x][leftCoordinates.y].color === unfriendlyColour) {
    
                tabOfMoves.push(
                    {"x": leftCoordinates.x,
                        "y": leftCoordinates.y}
                );
    
             }

        }
        
        if(rightCoordinates.x <=7  && rightCoordinates.y<=7 && rightCoordinates.y>=0){

            if (battleField.fields[rightCoordinates.x][rightCoordinates.y].color === unfriendlyColour) {
        
                tabOfMoves.push(
                    {"x": rightCoordinates.x,
                        "y": rightCoordinates.y}
                );

            }
            
        }

    
        return tabOfMoves;
    
    };