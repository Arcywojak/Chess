import {getActiveCoordinates,
    getActiveField,
    getCoordinatesFromField,
    getFieldFromCoordinates} from "./getSomething.js";

import {
    findPossibleMoves,
    isFieldTaken,
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves} from "./showMoves.js";

import {changePositionOfCounter} from "./moveCounter.js";

const gameOptions = {
    move: "white"
}


const updatePlayerToMove = () => {
    let field = document.querySelector('.game-info-h2');

    field.innerText = `${gameOptions.move} move`;
}

updatePlayerToMove();



const changeMove = () => {
    if(gameOptions.move === "white"){
        gameOptions.move = "black";
    } else {
        gameOptions.move = "white"
    }
}

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

    if ( (field.parentNode.classList.contains("white") && gameOptions.move === "white") || 
         (field.parentNode.classList.contains("black") && gameOptions.move === "black") ) {

        removeActivePosition();
        showActivePosition(field);

    } else if (field.classList.contains("to-move")) {
                
        changeMove();

        updatePlayerToMove();
        
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