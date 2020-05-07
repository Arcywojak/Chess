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
import { COLOR_CLASS, battleField } from "./variables.js";




    findPossibleMoves = (typeOfCounter, team, x, y, filterTabAndShowMoves) => {

        const tabOfMoves = getArrayOfMoves(typeOfCounter, team, x, y)

        if(filterTabAndShowMoves){

          const filteredTab = filterTabInCaseOfCheck(x, y, tabOfMoves);

           showPossibleMoves(filteredTab);

           return;
        }
        

      return doesCounterEndangerKing(tabOfMoves);
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

        if(leftCoordinates.x >= 0){

            if (battleField.fields[leftCoordinates.x][leftCoordinates.y].color === unfriendlyColour) {
    
                tabOfMoves.push(
                    {"x": leftCoordinates.x,
                        "y": leftCoordinates.y}
                );
    
             }

        }
        
        if(rightCoordinates.x <=7 ){

            if (battleField.fields[rightCoordinates.x][rightCoordinates.y].color === unfriendlyColour) {
        
                tabOfMoves.push(
                    {"x": rightCoordinates.x,
                        "y": rightCoordinates.y}
                );

            }
            
        }

    
        return tabOfMoves;
    
    };