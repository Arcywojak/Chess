import { battleField, gameOptions, imagesOfCounter, TYPE_OF_COUNTER_CLASS, COLOR_CLASS } from "./variables.js";
import { isFieldTaken, setCounterToPromoteImages, toggleOverlayAndPromotionBlock } from "./handleWithDOM.js";
import {filterTabInCaseOfCheck, isKingInDanger} from "./LookForCheck.js"
import {changePositionOfCounter} from './moveCounter.js'
import { getCoordinatesFromField, getFieldFromCoordinates } from "./getSomething.js";

export let setOptionsForCastling,
           canKingDoShortCastling,
           canKingDoLongCastling,
           addEnPassantIfPossible,
           addMovesForShortCastling,
           addMovesForLongCastling,
           DoesKingDoCastling,
           doesPawnPromote,
           didPawnDoEnPassant;



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

    doesPawnPromote = (coordinates, team) => {
        
        if(coordinates.y === 0 || coordinates.y === 7){


            setCounterToPromoteImages(team);
            toggleOverlayAndPromotionBlock(coordinates)

        }
        
    }

    addEnPassantIfPossible = (hostileColour, x, y) => {

        if(gameOptions.lastMove.whoMoved.typeOfCounter === "pawn" &&
           gameOptions.lastMove.whoMoved.colour === hostileColour){

            if( Math.abs(gameOptions.lastMove.from.y - gameOptions.lastMove.to.y) === 2 ){

                if(y === gameOptions.lastMove.to.y &&
                   Math.abs(gameOptions.lastMove.to.x - x) === 1 ){

                    let yToReturn;

                    if(hostileColour === "white"){
                        yToReturn = y+1
                    } else {
                        yToReturn = y-1
                    }

                    return [{x:gameOptions.lastMove.from.x, y: yToReturn}]
                }
            }
        }

        return [];
    }

    didPawnDoEnPassant = (origin, destination) => {

        if(
           !isFieldTaken(destination.x, destination.y) &&
           origin.x !== destination.x
        ){

            if(battleField.fields[origin.x][origin.y].color === "white"){
                //remove pawn from field destination.x, destination.y + 1

                battleField.fields[destination.x][destination.y + 1].color = null;
                battleField.fields[destination.x][destination.y + 1].typeOfCounter = null;

                const fieldWithPawn = getFieldFromCoordinates(
                    destination.x,
                    destination.y + 1
                )

                console.log(fieldWithPawn)
                console.log("FIELD")

                fieldWithPawn.classList.remove(
                    fieldWithPawn.classList[COLOR_CLASS],
                    fieldWithPawn.classList[TYPE_OF_COUNTER_CLASS]
                )

                const imageOfField = fieldWithPawn.childNodes[0];

                fieldWithPawn.removeChild(imageOfField);

            } else {
                 //remove pawn from field destination.x, destination.y - 1

                 battleField.fields[destination.x][destination.y - 1].color = null;
                battleField.fields[destination.x][destination.y - 1].typeOfCounter = null;

                const fieldWithPawn = getFieldFromCoordinates(
                    destination.x,
                    destination.y - 1
                );

                fieldWithPawn.classList.remove(
                    fieldWithPawn.classList[COLOR_CLASS],
                    fieldWithPawn.classList[TYPE_OF_COUNTER_CLASS]
                );

                const imageOfField = fieldWithPawn.childNodes[0];

                fieldWithPawn.removeChild(imageOfField);
            }
        }
    }

