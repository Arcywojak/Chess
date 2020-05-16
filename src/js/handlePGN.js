export let updatePgn,
convertStringIntoPgnMoves,
convertLetterIntoCounterType,
convertPgnNumberIntoMyNotation,
convertFieldLetterIntoNumber,
getFullOriginBasedOnMove,
convertPgnIntoMoves;

//THE MOST IMPORT FUNCTION IS "convertPgnIntoMoves", because it executes the rest of functions



import {charOfCounter, 
        gameOptions, 
        nameOfFieldsX, 
        nameOfFieldsY} from "./variables.js";

import {willBeKingInDanger} from "./LookForCheck.js";

import {getAllCounters, 
        getArrayOfMoves} from "./getSomething.js";


updatePgn = (from, to, movingCounter, attackedCounter) => {

    const pgnBlock = document.querySelector(".pgn-text"),

        movingCounterSiblings = getAllCounters(
            movingCounter,
            gameOptions.activeColour,
            false
        );

    let textToAdd = pgnBlock.innerText;

    if(gameOptions.numberOfMove > 0){
        textToAdd += "\xa0";
    }

    if (Number.isInteger(gameOptions.numberOfMove)) {

        textToAdd += `${gameOptions.numberOfMove + 1}. `; // Add number of move, dot and space

    }

    textToAdd += `${charOfCounter[movingCounter]}`;

    // Check if sibling has similar move

    for (let i = 0; i < movingCounterSiblings.length; i++) {

        if (movingCounterSiblings[i].x !== from.x) {

            const tabOfSibling = getArrayOfMoves(
                movingCounter,
                gameOptions.activeColour,
                movingCounterSiblings[i].x,
                movingCounterSiblings[i].y
            );

            for (let j = 0; j < tabOfSibling.length; j++) {

                if (tabOfSibling[j].x ===
                        to.x &&
                        tabOfSibling[j].y ===
                        to.y) {

                    textToAdd += nameOfFieldsX[from.x];

                }

            }

        }

    }

    // /////////////////////////////////

    if (attackedCounter !== null) {

        if (movingCounter === "pawn") {

            textToAdd += nameOfFieldsX[from.x];

        }

        textToAdd += "x";

    }

    textToAdd += nameOfFieldsX[to.x];
    textToAdd += nameOfFieldsY[to.y];

    const isCheck = willBeKingInDanger(
        from,
        to,
        gameOptions.oppositeColour
    );

    if (isCheck) {

        const mate = isMate(gameOptions.oppositeColour);

        if (mate) {

            textToAdd += "#";

        } else {

            textToAdd += "+";

        }

    }


    gameOptions.numberOfMove += 0.5;

    pgnBlock.innerText = textToAdd;

};

const PGN = "1. e4 Nc6 2. f4 b5 3. d4 Nh6 4. d5 d6 5. dxc6 Rb8 ";

    convertStringIntoPgnMoves = (pgnString) => {

        const movesArray = pgnString.split(" "),

            filteredMoves = movesArray.filter((word) => {

                if (word.length > 0) {

                    const isMoveValid = new RegExp(
                        "([a-z])([1-8])",
                        "g"
                    );

                    if (isMoveValid.test(word)) {

                        return word;

                    }

                }

            });

        return filteredMoves;

    };

    convertLetterIntoCounterType = (letter) => {

        let name;

        switch (letter) {

        case "N":
            name = "knight"; break;
        case "B":
            name = "bishop"; break;
        case "R":
            name = "rook"; break;
        case "Q":
            name = "queen"; break;
        case "K":
            name = "king"; break;
        default:
            name = "pawn"; break;

        }

        return name;

    };

    convertPgnNumberIntoMyNotation = (number) => {

        let newNumber;

        switch (number) {

        case 1:
            newNumber = 7; break;
        case 2:
            newNumber = 6; break;
        case 3:
            newNumber = 5; break;
        case 4:
            newNumber = 4; break;
        case 5:
            newNumber = 3; break;
        case 6:
            newNumber = 2; break;
        case 7:
            newNumber = 1; break;
        case 8:
            newNumber = 0; break;
        default:
            throw new Error(`parameter ${number} is not valid number!`);

        }

        return newNumber;

    };

    convertFieldLetterIntoNumber = (letter) => {

        let number;

        switch (letter) {

        case "a":
            number = 0; break;
        case "b":
            number = 1; break;
        case "c":
            number = 2; break;
        case "d":
            number = 3; break;
        case "e":
            number = 4; break;
        case "f":
            number = 5; break;
        case "g":
            number = 6; break;
        case "h":
            number = 7; break;
        default:
            throw new Error(`wrong parameter, ${letter}`);

        }

        return number;

    };

    getFullOriginBasedOnMove = (counterName, colour, origin, destination) => {


        const newOrigin = {
                "x": null,
                "y": null
            },

            allCountersOfType = getAllCounters(
                counterName,
                colour
            );

        for (let i = 0; i < allCountersOfType.length; i++) {

            const movesArray = getArrayOfMoves(
                allCountersOfType[i].typeOfCounter,
                allCountersOfType[i].colour,
                allCountersOfType[i].x,
                allCountersOfType[i].y
            );

            for (let j = 0; j < movesArray.length; j++) {

                if (movesArray[j].x === destination.x && movesArray[j].y === destination.y) {

                    if (origin.x !== null) {

                        if (allCountersOfType[i].x === origin.x) {

                            newOrigin.y = allCountersOfType[i].y;

                        }

                    } else {

                        newOrigin.x = allCountersOfType[i].x;
                        newOrigin.y = allCountersOfType[i].y;

                    }

                }

            }

        }

        return newOrigin;

    };

    convertPgnIntoMoves = (pgnString) => {

        if(typeof(pgnString) !== 'string'){
            throw new Error(`parameter "${pgnString}" is not valid string!`)
        }

        const pgn = convertStringIntoPgnMoves(pgnString);

        let convertedMoves = [],
            counterName, colour, counter,
            origin = {
                "x": null,
                "y": null
            },
            destination = {
                "x": null,
                "y": null
            };

        for (let i = 0; i < pgn.length; i++) { // SEARCH THROUGH MOVES


            counterName = convertLetterIntoCounterType(pgn[i].charAt(0));

            if (counterName === "pawn") {

                let counterOfLetters = 0;
                const smallLetter = new RegExp(
                        "[a-f]",
                        "g"
                    ),
                    fieldNumber = new RegExp(
                        "[1-9]",
                        "g"
                    );

                for (let j = 0; j < pgn[i].length; j++) {

                    if (smallLetter.test(pgn[i].charAt(j))) { // IF CHAR IS SMALL LETTER

                        if (counterOfLetters === 0) { // IF IT IS THE FIRST LETTER


                            if (pgn[i].length <= 3) {

                                destination.x = convertFieldLetterIntoNumber(pgn[i].charAt(j));

                            } else {

                                origin.x = convertFieldLetterIntoNumber(pgn[i].charAt(j));

                            }

                            counterOfLetters++;

                        } else { // IF IT IS NOT FIRST LETTER

                            destination.x = convertFieldLetterIntoNumber(pgn[i].charAt(j));

                        }

                    } else if (fieldNumber.test(pgn[i].charAt(j))) {

                        destination.y = convertPgnNumberIntoMyNotation(Number(pgn[i].charAt(j)));

                    }

                }


                if (i % 2 === 0) {

                    colour = "white";

                } else {

                    colour = "black";

                }

                const newOrigin = getFullOriginBasedOnMove(
                    counterName,
                    colour,
                    origin,
                    destination
                );

                convertedMoves.push({
                    "from": {
                        "x": newOrigin.x,
                        "y": newOrigin.y
                    },
                    "to": {
                        "x": destination.x,
                        "y": destination.y
                    },
                    "typeOfCounter": counterName,
                    color: colour
                });

            }

        }

        return convertedMoves;

    };


    const testBtn = document.querySelector(".testPgn");

testBtn.addEventListener(
    "click",
    convertPgnIntoMoves
);
