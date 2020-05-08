
export let  removeActivePosition,
            showActivePosition,
            showRecentMove,
            removeRecentMove,
            removePossibleMoves,
            showPossibleMoves,
            isFieldTaken;  
            
import {getActiveField,
        getFieldFromCoordinates,
        getCoordinatesFromField
} from './getSomething.js'

import {
    COLOR_CLASS,
    TYPE_OF_COUNTER_CLASS,
    gameOptions,
    updatePlayerToMove,
    changeColourOfActivePlayer,
    battleField
} from './variables.js'



removeActivePosition = () => {

    const activeField = getActiveField();

    if (activeField !== null) {

        activeField.classList.remove("active");

        removePossibleMoves();

    }

};

showActivePosition = (target) => {

    const activeField = getActiveField(true);

    if (!(activeField === target)) {

        target.classList.add("active");

        const team = target.parentNode.classList[COLOR_CLASS],
            typeOfCounter = target.parentNode.classList[TYPE_OF_COUNTER_CLASS],

            coordinates = getCoordinatesFromField(
                target,
                true
            ),

            {x, y} = coordinates;

    }


};

showRecentMove = (fieldOrigin, fieldDestination) => {
    fieldOrigin.classList.add('last-move');

    fieldDestination.classList.add('last-move');
};

removeRecentMove = () => {
    let fields = document.querySelectorAll(".last-move");

    if(fields !== null){

    fields.forEach(field => {
        field.classList.remove("last-move");
    })

    }
};

removePossibleMoves = () => {

    const previouslyToMove = document.querySelectorAll(".to-move");

    if (previouslyToMove !== null) {

        previouslyToMove.forEach((div) => {

            div.classList.remove("to-move");

        });

    }

};

showPossibleMoves = (arrayOfMoves) => {

    //console.log(arrayOfMoves)
    if (!(typeof arrayOfMoves === "undefined")) {

        const tabOfPossibleMoves = [];

        for (let i = 0; i < arrayOfMoves.length; i++) {

            tabOfPossibleMoves[i] = document.querySelector(`.x${arrayOfMoves[i].x}.y${arrayOfMoves[i].y}`);

            tabOfPossibleMoves[i].classList.add("to-move");

        }

    }

};

isFieldTaken = (x, y) => {

    if (battleField.fields[x][y].color !== null) { // It mean the field is taken by some counter

        return true;

    }

    return false;

};