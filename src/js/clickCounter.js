import {getActiveCoordinates,
    getActiveField,
    getCoordinatesFromField,
    getFieldFromCoordinates} from "./getSomething.js";

import {
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves} from "./handleWithDOM.js";

import {changePositionOfCounter} from "./moveCounter.js";

import {findPossibleMoves} from './findMoves.js'

import {
    COLOR_CLASS,
    TYPE_OF_COUNTER_CLASS,
    gameOptions,
    updatePlayerToMove,
    changeColourOfActivePlayer,
    battleField
} from './variables.js'
import { isKingInDanger } from "./LookForCheck.js";




updatePlayerToMove();

let handleClick;


/* /* 
 *////////////// STRUCTURE OF FUNCTIONS ///////////////
/*  *
 *  Which functions execute indyvidual functions
 *
 *  handleCLick
 *  |
 *  |-1) removeActivePosition
 *  |
 *  |-2) removeActivePosition, showActivePositon, O-canPawnAttack
 *  |
 *  |-3) getActiveCoordinates, getCoordinatesFromField, changePositionOfCounter
 *
 *  removeActivePosition
 *  |
 *  |-getActiveField, removePossibleMoves
 *
 *  showActivePosition
 *  |
 *  |-getActiveField, getCoordinatesFromField, findPossibleMoves
 *
 *  removeActivePosition
 *  |
 *  |-getActiveField, removePossibleMoves
 *
 *  getActiveCoordinates
 *  |
 *  |-getActiveField,
 *
 *  changePositionOfCounter
 *  |
 *  |-removeActivePosition
 *
 *  canPawnAttack
 *  |
 *  |-getActiveField, getCoordinatesFromField,getFieldFromCoordinates(x2), showPossibleMove(x2)
 *
 *  findPossibleMove
 *  |
 *  |-showPossibleMove
 *
 *  -Number) - one of possible paths during executing
 * */
//// ////////////////////////////////////////////////////









handleClick = (e) => {

    const field = e.target,

        active = getActiveField();

    if (active === field) {

        removeActivePosition();

        return;
    }

    if ( (field.parentNode.classList.contains("white") && gameOptions.activeColour === "white") || 
         (field.parentNode.classList.contains("black") && gameOptions.activeColour === "black") ) {

        removeActivePosition();

        const team = field.parentNode.classList[COLOR_CLASS],
              typeOfCounter = field.parentNode.classList[TYPE_OF_COUNTER_CLASS],
              {x, y} = getCoordinatesFromField(field, true);

        findPossibleMoves(typeOfCounter, team, x, y); //findMoves.js
 
        showActivePosition(field);

    } else if (field.classList.contains("to-move")) {

        /**  IF WAS CHECK AND WE ESCAPED, REMOVE "DANGER" CLASS   **/
        const isCheck = isKingInDanger(gameOptions.oppositeColour)
        if(isCheck){
            const kingField = document.querySelector(`.${gameOptions.activeColour}.king`);
            kingField.classList.remove("danger")
        }
        /********************************************************** */
                
        changeColourOfActivePlayer();
        
        const from = getActiveCoordinates(),

            to = getCoordinatesFromField(
                field,
                false
            );

            

        changePositionOfCounter(
            from,
            to
        );

    }

};

document.addEventListener(
    "click",
    handleClick
);
