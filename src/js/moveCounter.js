export let beatCounter,
    changePositionOfCounter;

import {
    findPossibleMoves,
    isFieldTaken,
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves} from "./showMoves.js";
import {getFieldFromCoordinates} from "./getSomething.js";

changePositionOfCounter = (origin, destination) => {

    const originBlock = getFieldFromCoordinates(
            origin.x,
            origin.y
        ),

        teamClass = originBlock.classList[3],
        counterClass = originBlock.classList[4];

    originBlock.classList.remove(
        teamClass,
        counterClass
    );
    const originBlockImg = originBlock.childNodes[0];

    originBlock.removeChild(originBlockImg);

    const destinationBlock = getFieldFromCoordinates(
            destination.x,
            destination.y
        ),
        takenField = isFieldTaken(
            destination.x,
            destination.y
        );

    console.log(destinationBlock);

    if (takenField) {

        const destinationImg = destinationBlock.childNodes[0];

        destinationBlock.removeChild(destinationImg);

        destinationBlock.classList.remove(
            destinationBlock.classList[3],
            destinationBlock.classList[4]
        );

    }

    destinationBlock.classList.add(
        teamClass,
        counterClass
    );


    destinationBlock.appendChild(originBlockImg);

    removeActivePosition();

};