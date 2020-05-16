import {getAllCounters, 
        getArrayOfMoves,
        getOppositeColour} from "./getSomething.js";

import {
    battleField,
    gameOptions,
    showWinner
} from "./variables.js";

import {isFieldTaken} from "./handleWithDOM.js";

export let doesCounterEndangerKing,
    doesTeamEndangerEnemyKing,
    filterTabInCaseOfCheck,
    isKingInDanger,
    isMate,
    verifyCheckAndMate,
    willBeKingInDanger;


filterTabInCaseOfCheck = (x, y, tabOfMoves) => {

    let willBeCheck;

    const filteredTab = [];

    for (let i = 0; i < tabOfMoves.length; i++) {

        willBeCheck = willBeKingInDanger(
            {x,
                y},
            tabOfMoves[i],
            gameOptions.activeColour
        );

        if (!willBeCheck) { // IF THERE IS NO CHECK

            filteredTab.push(tabOfMoves[i]);

        }

    }

    return filteredTab;

};

willBeKingInDanger = (origin, destination, colour) => {

    // PRETENT TO MOVE FROM ORIGIN TO DESTINATION

    const originField = battleField.fields[origin.x][origin.y],
        destinationField = battleField.fields[destination.x][destination.y],

        originFieldColor = originField.color,
        originFieldTypeOfCounter = originField.typeOfCounter,
        destinationFieldColor = destinationField.color,
        destinationFieldTypeOfCounter = destinationField.typeOfCounter,

        isDestinationFieldTaken = isFieldTaken(
            destination.x,
            destination.y
        );

    battleField.fields[destination.x][destination.y].color = originFieldColor;
    battleField.fields[destination.x][destination.y].typeOfCounter = originFieldTypeOfCounter;

    battleField.fields[origin.x][origin.y].color = null;
    battleField.fields[origin.x][origin.y].typeOfCounter = null;


    const isCheck = isKingInDanger(colour);


    /** ******** Undo changes ***********/
    battleField.fields[destination.x][destination.y].color = destinationFieldColor;
    battleField.fields[destination.x][destination.y].typeOfCounter = destinationFieldTypeOfCounter;

    battleField.fields[origin.x][origin.y].color = originFieldColor;
    battleField.fields[origin.x][origin.y].typeOfCounter = originFieldTypeOfCounter;

    /*
     *   If(isDestinationFieldTaken){
     *    destinationField.color = destinationFieldColor;
     *    destinationField.typeOfCounter = destinationFieldTypeOfCounter;
     *
     *   } else {
     *    destinationField.color = null;
     *    destinationField.typeOfCounter = null;
     *   }
     */
    /** *********************************/


    return isCheck;

};

isKingInDanger = (colour) => {

    const oppositeColour = getOppositeColour(colour),

        offensiveCounters = getAllCounters(
            null,
            oppositeColour,
            false
        );
        // We do not need king because he can't check enemy king

    let isInDanger,
        tabOfMoves;


    for (let i = 0; i < offensiveCounters.length; i++) {

        tabOfMoves = getArrayOfMoves(
            offensiveCounters[i].typeOfCounter,
            offensiveCounters[i].colour,
            offensiveCounters[i].x,
            offensiveCounters[i].y,
            false
        );

        isInDanger = doesCounterEndangerKing(tabOfMoves);

        if (isInDanger) {

            return true;

        }

    }

    return false;

};

doesCounterEndangerKing = (tabOfMoves) => {


    for (let i = 0; i < tabOfMoves.length; i++) {

        if (
            battleField.fields[
                tabOfMoves[i].x
            ][
                tabOfMoves[i].y
            ].typeOfCounter === "king"
        ) {

            return true;

        }

    }

    return false;


};

isMate = (endangeredColour) => {

    const tabOfCounters = getAllCounters(
        null,
        endangeredColour,
        true
    );
    let tabOfFilteredMoves,
        tabOfMoves;

    for (let i = 0; i < tabOfCounters.length; i++) {

        tabOfMoves = getArrayOfMoves(
            tabOfCounters[i].typeOfCounter,
            tabOfCounters[i].colour,
            tabOfCounters[i].x,
            tabOfCounters[i].y,
            false
        );

        tabOfFilteredMoves = filterTabInCaseOfCheck(
            tabOfCounters[i].x,
            tabOfCounters[i].y,
            tabOfMoves
        );

        if (tabOfFilteredMoves.length > 0) {


            return false;

        }

    }

    return true;

};

verifyCheckAndMate = () => {

    const firstKing = document.querySelector(".white.king"),
        secondKing = document.querySelector(".black.king"),

        checkFirst = isKingInDanger("white"),
        checkSecond = isKingInDanger("black"),

        fieldWithDanger = document.querySelector(".danger");

    if (checkFirst) {

        firstKing.classList.add("danger");

        const mate = isMate("white");

        if (mate) {

            gameOptions.didGameEnd = true;
            gameOptions.winner = "black";

            showWinner();

        }

        return;

    }

    if (checkSecond) {

        secondKing.classList.add("danger");

        const mate = isMate("black");

        if (mate) {

            gameOptions.didGameEnd = true;
            gameOptions.winner = "white";

            showWinner();

        }

        return;

    }

    if (fieldWithDanger !== null) {

        fieldWithDanger.classList.remove("danger");

    }

};