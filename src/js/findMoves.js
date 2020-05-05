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
    getPawnMoves} from "./getSomething.js";

import {
    isFieldTaken,
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves} from "./handleWithDOM.js";

import { doesCounterEndangerKing, filterTabInCaseOfCheck, willBeMyKingInDanger } from "./LookForCheck.js";
import { COLOR_CLASS, battleField } from "./variables.js";




    findPossibleMoves = (typeOfCounter, team, x, y, filterTabAndShowMoves) => {

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

        

        if(filterTabAndShowMoves){

          // const filteredTab = filterTabInCaseOfCheck(x, y, tabOfMoves);

           showPossibleMoves(tabOfMoves);

           return;
        }
        

    //  return doesCounterEndangerKing(tabOfMoves);
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
            console.log("AAA")

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