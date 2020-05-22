export let canPawnAttack,
    findMovesForBishop,
    findMovesForKing,
    findMovesForKnight,
    findMovesForPawn,
    findMovesForQueen,
    findMovesForRook,
    findPossibleMoves;

import {getArrayOfMoves} from "./getSomething.js";

import {showPossibleMoves} from "./handleWithDOM.js";

import {battleField, gameOptions} from "./variables.js";
import {addMovesForLongCastling, addMovesForShortCastling} from "./specialMoves.js";


findPossibleMoves = (typeOfCounter, team, x, y, copyOfBattleField) => {
    
    let tabOfMoves = getArrayOfMoves(
        typeOfCounter,
        team,
        x,
        y,
        true,
        copyOfBattleField
    );

    if (copyOfBattleField.fields[x][y].typeOfCounter === "king") {

        const shortCastlingMoves = addMovesForShortCastling(
                x,
                y,
                gameOptions.activeColour,
                copyOfBattleField
            ),

            longCastlingMoves = addMovesForLongCastling(
                x,
                y,
                gameOptions.activeColour,
                copyOfBattleField
            );


        tabOfMoves = [
            ...tabOfMoves,
            ...shortCastlingMoves,
            ...longCastlingMoves
        ];

    }


    showPossibleMoves(tabOfMoves);


};


canPawnAttack = (unfriendlyColour, x, y, copyOfBattleField) => {

    const tabOfMoves = [],


        // This number decide if the pawn go up or down through the battlefield
        moveY = unfriendlyColour === "white"
            ? 1
            : -1,
        // //////////////////////////////////////////////////////////////////////


        rightCoordinates = {
            "x": x + 1,
            "y": y + moveY
        },

        leftCoordinates = {
            "x": x - 1,
            "y": y + moveY
        };

    if (leftCoordinates.x >= 0 && leftCoordinates.y <= 7 && leftCoordinates.y >= 0) {

        if (copyOfBattleField.fields[leftCoordinates.x][leftCoordinates.y].color === unfriendlyColour) {

            tabOfMoves.push({"x": leftCoordinates.x,
                "y": leftCoordinates.y});

        }

    }

    if (rightCoordinates.x <= 7 && rightCoordinates.y <= 7 && rightCoordinates.y >= 0) {

        if (copyOfBattleField.fields[rightCoordinates.x][rightCoordinates.y].color === unfriendlyColour) {

            tabOfMoves.push({"x": rightCoordinates.x,
                "y": rightCoordinates.y});

        }

    }


    return tabOfMoves;

};