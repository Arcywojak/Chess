
/** ***********  FUNCTIONS  ************//*

//initCounters:
//@4 params:
   -team (expect to be 'white' or 'black')
   -

*//** ************************************/

import {battleField, gameOptions, imagesOfCounter} from "./variables.js";

const innerBoard = document.querySelector(".board-inner");

export const initPositionOfCounters_DOM = () => {

    let color,
        div,
        imageOfCounter,
        typeOfCounter;

    for (let x = 0; x <= 7; x++) {

        for (let y = 0; y <= 7; y++) {

            div = document.createElement("div");

            div.classList.add(
                "field",
                `x${x}`,
                `y${y}`

            );

            if (battleField.fields[x][y].color !== null) {

                color = battleField.fields[x][y].color,
                typeOfCounter = battleField.fields[x][y].typeOfCounter;

                div.classList.add(
                    color,
                    typeOfCounter
                );

                imageOfCounter = document.createElement("img");


                imageOfCounter.src = imagesOfCounter[color][typeOfCounter];

                div.appendChild(imageOfCounter);

            }


            div.style.webkitTransform = `translate(${x * 78.5}px, ${y * 78.5}px) rotate(${gameOptions.reverseBoard})`;
            div.style.MozTransform = `translate(${x * 78.5}px, ${y * 78.5}px) rotate(${gameOptions.reverseBoard})`;
            div.style.msTransform = `translate(${x * 78.5}px, ${y * 78.5}px) rotate(${gameOptions.reverseBoard})`;
            div.style.OTransform = `translate(${x * 78.5}px, ${y * 78.5}px) rotate(${gameOptions.reverseBoard})`;
            div.style.transform = `translate(${x * 78.5}px, ${y * 78.5}px) rotate(${gameOptions.reverseBoard})`;

            innerBoard.appendChild(div);

        }

    }

};

export const initCounters = (team = "", typeOfCounter = "", numberOfCounters = null, position = []) => {

    let player;

    if (team === "white") {

        player = whitePlayer;

    } else if (team === "black") {

        player = blackPlayer;

    }

    const playerTypeOfCounter = player.counters[typeOfCounter];

    for (let i = 0; i < numberOfCounters; i++) {

        const counter = {
            team,
            "position": {
                "x": position[i].x * 78.5,
                "y": position[i].y * 78.5
            }
        };

        playerTypeOfCounter[i] = counter;

    }

    initPositionOfCounters(
        team,
        typeOfCounter
    );


};

// ////////////

export const setEmptyBattleField = () => {

    for (let x = 0; x <= 7; x++) {

        battleField.fields[x] = [];

        for (let y = 0; y <= 7; y++) {

            battleField.fields[x][y] = {
                "color": null,
                "typeOfCounter": null
            };

        }

    }

};

export const fillFieldsInCounters = (team = "", counterType = "", numberOfCounters = null, position = []) => {

    for (let i = 0; i < numberOfCounters; i++) {

        battleField.fields[
            position[i].x
        ][
            position[i].y
        ].
            color = team;

        battleField.fields[
            position[i].x
        ][
            position[i].y
        ].
            typeOfCounter = counterType;

    }

};


// //////////////