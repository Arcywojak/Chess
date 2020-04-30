export let beatCounter,
    changePositionOfCounter;

import {
    findPossibleMoves,
    isFieldTaken,
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves,
    showRecentMove,
    removeRecentMove} from "./showMoves.js";
import {getFieldFromCoordinates} from "./getSomething.js";
import { doesCounterEndangerKing, doesTeamEndangerEnemyKing } from "./LookForCheck.js";
import { findMovesForSomebody } from "./findMoves.js";

const moveSound = document.querySelector("#move-sound");
const beatSound = document.querySelector("#beat-sound");

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

    if (takenField) {

        const destinationImg = destinationBlock.childNodes[0];

        destinationBlock.removeChild(destinationImg);

        destinationBlock.classList.remove(
            destinationBlock.classList[3],
            destinationBlock.classList[4]
        );

        moveSound.play();

    } else {
        beatSound.play();
    }

    destinationBlock.classList.add(
        teamClass,
        counterClass
    );


    destinationBlock.appendChild(originBlockImg);

    removeRecentMove();

    removeActivePosition();

    showRecentMove(originBlock, destinationBlock);

    doesTeamEndangerEnemyKing(teamClass);
        
    

};