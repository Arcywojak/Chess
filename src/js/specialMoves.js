import { battleField, gameOptions, imagesOfCounter, TYPE_OF_COUNTER_CLASS } from "./variables.js";
import { isFieldTaken } from "./handleWithDOM.js";
import {filterTabInCaseOfCheck, isKingInDanger} from "./LookForCheck.js"
import {changePositionOfCounter} from './moveCounter.js'
import { getCoordinatesFromField } from "./getSomething.js";

export let setOptionsForCastling,
           canKingDoShortCastling,
           canKingDoLongCastling,
           enPassant,
           addMovesForShortCastling,
           addMovesForLongCastling,
           DoesKingDoCastling,
           doesPawnPromote;



    setOptionsForCastling = () => {

    // set addition option for rooks
        battleField.fields[0][0].isFirstMove = true;
        battleField.fields[7][0].isFirstMove = true;
        battleField.fields[0][7].isFirstMove = true;
        battleField.fields[7][7].isFirstMove = true;

    // set addition option for kings   
        battleField.fields[4][0].isFirstMove = true;
        battleField.fields[4][7].isFirstMove = true;

    }

    addMovesForShortCastling = (x, y, color) => {
        const coordinateY = color === "white" ? 7 : 0;

        if(
            !isFieldTaken(5, coordinateY) &&
            !isFieldTaken(6, coordinateY) &&
            battleField.fields[4][coordinateY].isFirstMove &&
            !isKingInDanger(gameOptions.oppositeColour)
          )     {
               
            let tabWithShortCastling = [
                {
                    x:5,
                    y:y,
                },
                {
                    x:6,
                    y:y,
                },
            ];
             
            tabWithShortCastling = filterTabInCaseOfCheck(x, y, tabWithShortCastling);
            
            if(tabWithShortCastling.length === 2){

                    return [{x:6, y:y}]

            } 

          }

          return [];

    }

    addMovesForLongCastling = (x, y, color) => {
            const coordinateY = color === "white" ? 7 : 0;
    
            if(
                !isFieldTaken(1, coordinateY) &&
                !isFieldTaken(2, coordinateY) &&
                !isFieldTaken(3, coordinateY) &&
                battleField.fields[4][coordinateY].isFirstMove &&
                !isKingInDanger(gameOptions.oppositeColour)
              )     {
                   
                let tabWithLongCastling = [
                    {
                        x:1,
                        y:y,
                    },
                    {
                        x:2,
                        y:y,
                    },
                    {
                        x:3,
                        y:y,
                    }
                ];
                 
                tabWithLongCastling = filterTabInCaseOfCheck(x, y, tabWithLongCastling);
                
                if(tabWithLongCastling.length === 3){
    
                        return [{x:2, y:y}]
    
                } 
    
              }
    
              return [];
    
        }

        DoesKingDoCastling = (origin, destination) => {
            if(battleField.fields[origin.x][origin.y].typeOfCounter === "king" ||
            battleField.fields[origin.x][origin.y].typeOfCounter === "rook"  ){
     
             if(battleField.fields[origin.x][origin.y].typeOfCounter === "king" || //CASTLING
                battleField.fields[origin.x][origin.y].isFirstMove === true) {
                 
                 if(origin.x - destination.x === -2){ //It mean we are doing short castling
     
                     const coordinatesOfRookOrigin = {
                         x:7,
                         y:origin.y 
                     }
     
                     const coordinatesOfRookDestination = {
                         x:destination.x - 1, //to the left of the king
                         y:origin.y //y coordinate doesnt change
                     }
     
                     changePositionOfCounter(coordinatesOfRookOrigin, coordinatesOfRookDestination);
     
                 } else if(origin.x - destination.x === 2){ //It mean we are doing long castling
     
                     const coordinatesOfRookOrigin = {
                         x:0,
                         y:origin.y 
                     }
     
                     const coordinatesOfRookDestination = {
                         x:destination.x + 1, //to the righy of the king
                         y:origin.y //y coordinate doesnt change
                     }
     
                     changePositionOfCounter(coordinatesOfRookOrigin, coordinatesOfRookDestination);
                 }
             }
     
            battleField.fields[origin.x][origin.y].isFirstMove = false;      
         }
        }

    doesPawnPromote = (field, coordinates, team) => {
        
        if(coordinates.y === 0 || coordinates.y === 7){

            field.childNodes[0].src = imagesOfCounter[team].queen;

            field.classList.remove("pawn");

            field.classList.add("queen")

            battleField.fields[coordinates.x][coordinates.y].typeOfCounter = "queen";
        }
        
    }