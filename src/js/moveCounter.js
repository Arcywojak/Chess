export let beatCounter,
    changePositionOfCounter;

import {
    isFieldTaken,
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves,
    showRecentMove,
    removeRecentMove} from "./handleWithDOM.js";
import {getFieldFromCoordinates} from "./getSomething.js";
import { doesCounterEndangerKing, doesTeamEndangerEnemyKing, isKingInDanger, isMate, verifyCheckAndMate } from "./LookForCheck.js";
import { COLOR_CLASS, TYPE_OF_COUNTER_CLASS, battleField, gameOptions, showWinner } from "./variables.js";
import { DoesKingDoCastling, doesPawnPromote, didPawnDoEnPassant } from "./specialMoves.js";

const moveSound = document.querySelector("#move-sound");
const beatSound = document.querySelector("#beat-sound");

changePositionOfCounter = (origin, destination) => {

    gameOptions.lastMove.from.x = origin.x;
    gameOptions.lastMove.from.y = origin.y;
    gameOptions.lastMove.to.x = destination.x;
    gameOptions.lastMove.to.y = destination.y;
    gameOptions.lastMove.whoMoved.typeOfCounter = battleField.fields[origin.x][origin.y].typeOfCounter;
    gameOptions.lastMove.whoMoved.colour = battleField.fields[origin.x][origin.y].color;

    const originBlock = getFieldFromCoordinates(
        origin.x,
        origin.y
    ),
    destinationBlock = getFieldFromCoordinates(
        destination.x,
        destination.y
    ),

      colourOfMovingCounter = battleField.fields[origin.x][origin.y].color,
      typeOfMovingCounter = battleField.fields[origin.x][origin.y].typeOfCounter,
      colourOfTakenField = battleField.fields[destination.x][destination.y].color,
      counterOfTakenField = battleField.fields[destination.x][destination.y].typeOfCounter,
      originBlockImg = originBlock.childNodes[0],

    takenField = isFieldTaken(
        destination.x,
        destination.y
    );


/******************* CHECKING IF WE WANT TO DO CASTLING **************************/
 if(typeOfMovingCounter === 'king'){
    DoesKingDoCastling(origin, destination);
 }
/***************************************************************************************/

 /******************* CHECKING IF A PAWN DID EN PASSANT **************************/
 if(typeOfMovingCounter === 'pawn'){
    didPawnDoEnPassant(origin, destination);
 } 
/***************************************************************************************/
    
    removeRecentMove();
    removeActivePosition();     

    originBlock.classList.remove(
        typeOfMovingCounter,
        colourOfMovingCounter
    );

    battleField.fields[origin.x][origin.y].color = null;
    battleField.fields[origin.x][origin.y].typeOfCounter = null;

    
    originBlock.removeChild(originBlockImg);

    

    battleField.fields[destination.x][destination.y].color = colourOfMovingCounter;
    battleField.fields[destination.x][destination.y].typeOfCounter = typeOfMovingCounter;  

    if (takenField) {

        const destinationImg = destinationBlock.childNodes[0];

        destinationBlock.removeChild(destinationImg);

        destinationBlock.classList.remove(
            counterOfTakenField,
            colourOfTakenField
        );

        moveSound.play();

    } else {
        beatSound.play();
    }

    destinationBlock.classList.add(
        colourOfMovingCounter,
        typeOfMovingCounter
    );

    destinationBlock.appendChild(originBlockImg);

    /******************* CHECKING IF A PAWN'S DREAM COMES TRUE **************************/
    if(typeOfMovingCounter === 'pawn'){
        doesPawnPromote(destination, colourOfMovingCounter);
    }
    /***************************************************************************************/

    

    showRecentMove(originBlock, destinationBlock);

    //IS CHECK AFTER THIS MOVE?
    const isCheck = isKingInDanger(gameOptions.oppositeColour, gameOptions.activeColour)


    verifyCheckAndMate(isCheck);

   

};