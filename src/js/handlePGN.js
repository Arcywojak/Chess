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

import {willBeKingInDanger, isMate} from "./LookForCheck.js";

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

    if(movingCounter === "king" && Math.abs(from.x - to.x) === 2){

        textToAdd += "O-O";

        if(from.x - to.x === 2){
            textToAdd+= "-O"
        }; 

    } else {
  
        textToAdd += `${charOfCounter[movingCounter]}`;

        // Check if sibling has similar move, 
        // we do not need to check it at pawn because 
        // it doesnt depend on siblings when it comes to add addition letter to PGN

        if(movingCounter !== "pawn"){

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
    }
       
        

    gameOptions.numberOfMove += 0.5;

    pgnBlock.innerText = textToAdd;
}

    convertStringIntoPgnMoves = (pgnString) => {

        const movesArray = pgnString.split(" "),

            filteredMoves = movesArray.filter((word) => {

                if (word.length > 0) {

                    const isMoveValid = new RegExp(
                        "([a-z])([1-8])|([O])",
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
                        if(origin.x === allCountersOfType[i].x){


                       
                            newOrigin.x = allCountersOfType[i].x;
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

    convertPgnIntoMoves = (pgnString, index) => {


        if(typeof(pgnString) !== 'string'){
            throw new Error(`parameter "${pgnString}" is not valid string!`)
        }

        const pgn = convertStringIntoPgnMoves(pgnString);

        if(index === pgn.length){
            index = index - 1;
        } 

        const wantedMove = pgn[index];

        console.log(pgn, index)

        let counterName, 
            colour,
            counterOfLetters = 0,
            origin = {
                "x": null,
                "y": null
            },
            destination = {
                "x": null,
                "y": null
            };

            const smallLetter = /^[a-h]+$/,
            fieldNumber = /^\d+$/;

            counterOfLetters = 0;
         

            counterName = convertLetterIntoCounterType(wantedMove.charAt(0));

            if (index % 2 === 0) {

                colour = "white";

            } else {

                colour = "black";

            }

            if(wantedMove.charAt(0) === "O"){   // only castling begins with "O"

                    counterName = "king";

                    origin.x = 4;

                if(wantedMove.length >= 5) { //LONG castling

                    destination.x = 2;

                } else {    // SHORT castling

                    destination.x = 6;
                    
                }

                if(colour === "white"){
                    origin.y = 7;
                    destination.y = 7;
                } else {
                    origin.y = 0;
                    destination.y = 0;
                }

                const move = {
                    "from": {
                        "x": origin.x,
                        "y": origin.y
                    },
                    "to": {
                        "x": destination.x,
                        "y": destination.y
                    },
                    "typeOfCounter": counterName,
                    color: colour
                };

                return move;

            } 

            if (counterName === "pawn") {

                for (let j = 0; j < wantedMove.length; j++) {

                    if (smallLetter.test(wantedMove.charAt(j))) { // IF CHAR IS SMALL LETTER
                        if (counterOfLetters === 0) { // IF IT IS THE FIRST LETTER

                            destination.x = convertFieldLetterIntoNumber(wantedMove.charAt(j));

                            

                        } else { // IF IT IS NOT FIRST LETTER

                            origin.x = destination.x;

                            destination.x = convertFieldLetterIntoNumber(wantedMove.charAt(j));

                        }

                        counterOfLetters++;

                    } else if (fieldNumber.test(wantedMove.charAt(j))) {
                        destination.y = convertPgnNumberIntoMyNotation(Number(wantedMove.charAt(j)));


                    }

                }

            } else {

                for(let j = 1; j < wantedMove.length; j++){
                        if (smallLetter.test(wantedMove.charAt(j))) { // IF CHAR IS SMALL LETTER
    
                            if (counterOfLetters === 0) { // IF IT IS THE FIRST LETTER      
    
                                destination.x = convertFieldLetterIntoNumber(wantedMove.charAt(j));
    
                             } else {
                                 
                                origin.x = destination.x;
                                destination.x = convertFieldLetterIntoNumber(wantedMove.charAt(j));
                             }
                                
                                counterOfLetters++;
                                
                            } else if(fieldNumber.test(wantedMove.charAt(j))) { // IF IT IS NOT FIRST LETTER
    
                                destination.y = convertPgnNumberIntoMyNotation(Number(wantedMove.charAt(j)));
                                
    
                            }
    
                        }
                }

                const newOrigin = getFullOriginBasedOnMove(
                    counterName,
                    colour,
                    origin,
                    destination
                );

                const move = {
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
                };

        return move;

    };