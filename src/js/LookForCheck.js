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


filterTabInCaseOfCheck = (x, y, tabOfMoves, copyOfBattleField) => {

    
    let willBeCheck;

    const filteredTab = [];

    for (let i = 0; i < tabOfMoves.length; i++) {

        willBeCheck = willBeKingInDanger(
            {x,
                y},
            tabOfMoves[i],
            gameOptions.activeColour,
            copyOfBattleField
        );

        if (!willBeCheck) { // IF THERE IS NO CHECK

            filteredTab.push(tabOfMoves[i]);

        }

    }

    return filteredTab;

};

willBeKingInDanger = (origin, destination, colour, copyOfBattleField) => {

    // PRETENT TO MOVE FROM ORIGIN TO DESTINATION

    const originField = copyOfBattleField.fields[origin.x][origin.y],
        destinationField = copyOfBattleField.fields[destination.x][destination.y],

        originFieldColor = originField.color,
        originFieldTypeOfCounter = originField.typeOfCounter,
        destinationFieldColor = destinationField.color,
        destinationFieldTypeOfCounter = destinationField.typeOfCounter;

    copyOfBattleField.fields[destination.x][destination.y].color = originFieldColor;
    copyOfBattleField.fields[destination.x][destination.y].typeOfCounter = originFieldTypeOfCounter;

    copyOfBattleField.fields[origin.x][origin.y].color = null;
    copyOfBattleField.fields[origin.x][origin.y].typeOfCounter = null;


    const isCheck = isKingInDanger(colour, copyOfBattleField);


    /** ******** Undo changes ***********/
    copyOfBattleField.fields[destination.x][destination.y].color = destinationFieldColor;
    copyOfBattleField.fields[destination.x][destination.y].typeOfCounter = destinationFieldTypeOfCounter;

    copyOfBattleField.fields[origin.x][origin.y].color = originFieldColor;
    copyOfBattleField.fields[origin.x][origin.y].typeOfCounter = originFieldTypeOfCounter;

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

isKingInDanger = (colour, copyOfBattleField) => {

    const oppositeColour = getOppositeColour(colour),

        offensiveCounters = getAllCounters(
            null,
            oppositeColour,
            false,
            copyOfBattleField
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
            false,
            copyOfBattleField
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

isMate = (endangeredColour, copyOfBattleField) => {

    const tabOfCounters = getAllCounters(
        null,
        endangeredColour,
        true,
        copyOfBattleField
    );
    let tabOfFilteredMoves,
        tabOfMoves;

    for (let i = 0; i < tabOfCounters.length; i++) {

        tabOfMoves = getArrayOfMoves(
            tabOfCounters[i].typeOfCounter,
            tabOfCounters[i].colour,
            tabOfCounters[i].x,
            tabOfCounters[i].y,
            false,
            copyOfBattleField
        );

        tabOfFilteredMoves = filterTabInCaseOfCheck(
            tabOfCounters[i].x,
            tabOfCounters[i].y,
            tabOfMoves,
            copyOfBattleField
        );

        if (tabOfFilteredMoves.length > 0) {


            return false;

        }

    }

    return true;

};

verifyCheckAndMate = (copyOfBattleField) => {
    
    const firstKing = document.querySelector(".white.king"),
        secondKing = document.querySelector(".black.king"),

        checkFirst = isKingInDanger("white", copyOfBattleField),
        checkSecond = isKingInDanger("black", copyOfBattleField),

        fieldWithDanger = document.querySelector(".danger");

    if (checkFirst) {

        firstKing.classList.add("danger");

        const mate = isMate("white", copyOfBattleField);

        if (mate) {

            gameOptions.didGameEnd = true;
            gameOptions.winner = "black";

            showWinner();

        }

        return;

    }

    if (checkSecond) {

        secondKing.classList.add("danger");

        const mate = isMate("black", copyOfBattleField);

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