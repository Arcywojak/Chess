import {getActiveCoordinates,
    getActiveField,
    getCoordinatesFromField,
    getFieldFromCoordinates} from "./getSomething.js";

import {findMovesForBishop,
    findMovesForKing,
    findMovesForKnight,
    findMovesForPawn,
    findMovesForQueen,
    findMovesForRook,
    findMovesForSomebody} from "./findMoves.js";


export let  findPossibleMoves,
            isFieldTaken,
            removeActivePosition,
            removePossibleMoves,
            showActivePosition,
            showPossibleMoves;






removeActivePosition = () => {

    const activeField = getActiveField();

    if (activeField !== null) {

        activeField.classList.remove("active");

        removePossibleMoves();

    }

},

showActivePosition = (target) => {

    const activeField = getActiveField(true);

    if (!(activeField === target)) {

        target.classList.add("active");

        const team = target.parentNode.classList[3],
            typeOfCounter = target.parentNode.classList[4],

            coordinates = getCoordinatesFromField(
                target,
                true
            ),

            {x, y} = coordinates;

        findPossibleMoves(
            team,
            x,
            y,
            typeOfCounter
        );

    }


};
showPossibleMoves = (arrayOfMoves) => {

    if (!(typeof arrayOfMoves === "undefined")) {

        const tabOfPossibleMoves = [];

        for (let i = 0; i < arrayOfMoves.length; i++) {

            tabOfPossibleMoves[i] = document.querySelector(`.x${arrayOfMoves[i].x}.y${arrayOfMoves[i].y}`);

            tabOfPossibleMoves[i].classList.add("to-move");

        }

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
findPossibleMoves = (team, x, y, typeOfCounter) => {

    findMovesForSomebody(typeOfCounter, team, x, y);

};

isFieldTaken = (x, y) => {

    const field = getFieldFromCoordinates(
            x,
            y
        ),
        lengthOfClassList = field.classList.length;


    if (lengthOfClassList > 4) { // It mean the field is taken by some counter

        return true;

    }

    return false;

};