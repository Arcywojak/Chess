import {COLOR_CLASS, TYPE_OF_COUNTER_CLASS, battleField, gameOptions, imagesOfCounter} from "./variables.js";
import {isFieldTaken, setCounterToPromoteImages, toggleOverlayAndPromotionBlock} from "./handleWithDOM.js";
import {filterTabInCaseOfCheck, isKingInDanger} from "./LookForCheck.js";
import {changePositionOfCounter} from "./moveCounter.js";
import {getCoordinatesFromField, getFieldFromCoordinates, getAllCounters, getCountersWithMoves} from "./getSomething.js";
import { convertStringIntoPgnMoves } from "./handlePGN.js";

export let DoesKingDoCastling,
    addEnPassantIfPossible,
    addMovesForLongCastling,
    addMovesForShortCastling,
    canKingDoLongCastling,
    canKingDoShortCastling,
    didPawnDoEnPassant,
    doesPawnPromote,
    setOptionsForCastling,
    isDraw;


setOptionsForCastling = () => {

    // Set addition option for rooks
    battleField.fields[0][0].isFirstMove = true;
    battleField.fields[7][0].isFirstMove = true;
    battleField.fields[0][7].isFirstMove = true;
    battleField.fields[7][7].isFirstMove = true;

    // Set addition option for kings
    battleField.fields[4][0].isFirstMove = true;
    battleField.fields[4][7].isFirstMove = true;

};

addMovesForShortCastling = (x, y, color) => {

    const coordinateY = color === "white" ? 7 : 0;

    if (
        !isFieldTaken(
            5,
            coordinateY
        ) &&
            !isFieldTaken(
                6,
                coordinateY
            ) &&
            battleField.fields[4][coordinateY].isFirstMove &&
            !isKingInDanger(gameOptions.activeColour)
    ) {

        let tabWithShortCastling = [
            {
                "x": 5,
                y
            },
            {
                "x": 6,
                y
            }
        ];

        tabWithShortCastling = filterTabInCaseOfCheck(
            x,
            y,
            tabWithShortCastling
        );

        if (tabWithShortCastling.length === 2) {

            return [
                {"x": 6,
                    y}
            ];

        }

    }

    return [];

};

addMovesForLongCastling = (x, y, color) => {

    const coordinateY = color === "white" ? 7 : 0;

    if (
        !isFieldTaken(
            1,
            coordinateY
        ) &&
                !isFieldTaken(
                    2,
                    coordinateY
                ) &&
                !isFieldTaken(
                    3,
                    coordinateY
                ) &&
                battleField.fields[4][coordinateY].isFirstMove &&
                !isKingInDanger(gameOptions.activeColour)
    ) {

        let tabWithLongCastling = [
            {
                "x": 1,
                y
            },
            {
                "x": 2,
                y
            },
            {
                "x": 3,
                y
            }
        ];

        tabWithLongCastling = filterTabInCaseOfCheck(
            x,
            y,
            tabWithLongCastling
        );

        if (tabWithLongCastling.length === 3) {

            return [
                {"x": 2,
                    y}
            ];

        }

    }

    return [];

};

DoesKingDoCastling = (origin, destination) => {

    if (battleField.fields[origin.x][origin.y].typeOfCounter === "king") {

        if (battleField.fields[origin.x][origin.y].typeOfCounter === "king" || // CASTLING
                battleField.fields[origin.x][origin.y].isFirstMove === true) {

            if (origin.x - destination.x === -2) { // It mean we are doing short castling

                const coordinatesOfRookOrigin = {
                        "x": 7,
                        "y": origin.y
                    },

                    coordinatesOfRookDestination = {
                        "x": destination.x - 1, // To the left of the king
                        "y": origin.y // Y coordinate doesnt change
                    };

                changePositionOfCounter(
                    coordinatesOfRookOrigin,
                    coordinatesOfRookDestination,
                    false
                );

            } else if (origin.x - destination.x === 2) { // It mean we are doing long castling

                const coordinatesOfRookOrigin = {
                        "x": 0,
                        "y": origin.y
                    },

                    coordinatesOfRookDestination = {
                        "x": destination.x + 1, // To the righy of the king
                        "y": origin.y // Y coordinate doesnt change
                    };

                changePositionOfCounter(
                    coordinatesOfRookOrigin,
                    coordinatesOfRookDestination,
                    false
                );

                

            }

        }

        battleField.fields[origin.x][origin.y].isFirstMove = false;
    }

};

doesPawnPromote = (coordinates, team) => {

    if (coordinates.y === 0 || coordinates.y === 7) {


        if(team === "black"){
            battleField.fields[coordinates.x][coordinates.y].typeOfCounter = "queen";

            const field = getFieldFromCoordinates(coordinates.x, coordinates.y);

            console.log(JSON.parse(JSON.stringify(field)));
            console.log(JSON.parse(JSON.stringify(battleField)));

            field.classList.remove("pawn");
            field.classList.add("queen");

            field.childNodes[0].src = imagesOfCounter.black.queen;

            return;
        } else {
            setCounterToPromoteImages(team);
            toggleOverlayAndPromotionBlock(coordinates);
        }
        

    }

};

addEnPassantIfPossible = (hostileColour, x, y) => {

    if (gameOptions.lastMove.whoMoved.typeOfCounter === "pawn" &&
           gameOptions.lastMove.whoMoved.colour === hostileColour) {

        if (Math.abs(gameOptions.lastMove.from.y - gameOptions.lastMove.to.y) === 2) {

            if (y === gameOptions.lastMove.to.y &&
                   Math.abs(gameOptions.lastMove.to.x - x) === 1) {

                let yToReturn;

                if (hostileColour === "white") {

                    yToReturn = y + 1;

                } else {

                    yToReturn = y - 1;

                }

                return [
                    {"x": gameOptions.lastMove.from.x,
                        "y": yToReturn}
                ];

            }

        }

    }

    return [];

};

didPawnDoEnPassant = (origin, destination) => {

    if (
        !isFieldTaken(
            destination.x,
            destination.y
        ) &&
           origin.x !== destination.x
    ) {

        if (battleField.fields[origin.x][origin.y].color === "white") {

            // Remove pawn from field destination.x, destination.y + 1

            battleField.fields[destination.x][destination.y + 1].color = null;
            battleField.fields[destination.x][destination.y + 1].typeOfCounter = null;

            const fieldWithPawn = getFieldFromCoordinates(
                destination.x,
                destination.y + 1
            );

            fieldWithPawn.classList.remove(
                fieldWithPawn.classList[COLOR_CLASS],
                fieldWithPawn.classList[TYPE_OF_COUNTER_CLASS]
            );

            const imageOfField = fieldWithPawn.childNodes[0];

            fieldWithPawn.removeChild(imageOfField);

        } else {

            // Remove pawn from field destination.x, destination.y - 1

            battleField.fields[destination.x][destination.y - 1].color = null;
            battleField.fields[destination.x][destination.y - 1].typeOfCounter = null;

            const fieldWithPawn = getFieldFromCoordinates(
                destination.x,
                destination.y - 1
            );

            fieldWithPawn.classList.remove(
                fieldWithPawn.classList[COLOR_CLASS],
                fieldWithPawn.classList[TYPE_OF_COUNTER_CLASS]
            );

            const imageOfField = fieldWithPawn.childNodes[0];

            fieldWithPawn.removeChild(imageOfField);

        }

    }

};

isDraw = () => {

    const tabOfCounters = getCountersWithMoves(
        gameOptions.activeColour
    );

    const kingInDanger = isKingInDanger(gameOptions.activeColour);

    if(!kingInDanger && tabOfCounters.length === 0){
        gameOptions.didGameEnd = true;
        gameOptions.endMessage = `Draw, ${gameOptions.activeColour} is in stalemate.`;

        return true;
    }
}