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
import { doesCounterEndangerKing, doesTeamEndangerEnemyKing, isKingInDanger, isMate } from "./LookForCheck.js";
import { COLOR_CLASS, TYPE_OF_COUNTER_CLASS, battleField, gameOptions, showWinner } from "./variables.js";

const moveSound = document.querySelector("#move-sound");
const beatSound = document.querySelector("#beat-sound");

changePositionOfCounter = (origin, destination) => {
    
    removeRecentMove();
    removeActivePosition();

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

    

    showRecentMove(originBlock, destinationBlock);

    //IS CHECK AFTER THIS MOVE
    const isCheck = isKingInDanger(gameOptions.oppositeColour, gameOptions.activeColour)

    if(isCheck){
        const kingField = document.querySelector(`.${gameOptions.activeColour}.king`);
        kingField.classList.add("danger")

        const mate = isMate(gameOptions.activeColour);

        if(isMate){
            gameOptions.didGameEnd = true;
            gameOptions.winner = gameOptions.oppositeColour;

            showWinner();
        }
    }

};