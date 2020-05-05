
/** ***********  FUNCTIONS  ************//*

//initCounters:
//@4 params:
   -team (expect to be 'white' or 'black')
   -

*//** ************************************/

import {battleField, imagesOfCounter} from './variables.js'

const innerBoard = document.querySelector(".board-inner");

export const initPositionOfCounters_DOM = (team, counterName) => {

   /* const quantityOfCounters = player.counters[counterName].length,

        counterArray = player.counters[counterName];

    for (let i = 0; i < quantityOfCounters; i++) {

        const div = document.createElement("div");

        div.classList.add(
            "field",
            `x${counterArray[i].position.x / 78.5}`,
            `y${counterArray[i].position.y / 78.5}`,
            `${counterName}`,
            `${team}`
            
        );

        const imageOfCounter = document.createElement("img");

        imageOfCounter.src = imagesOfCounter[team][counterName];

        div.appendChild(imageOfCounter);

        div.style.webkitTransform = `translate(${counterArray[i].position.x}px, ${counterArray[i].position.y}px)`;
        div.style.MozTransform = `translate(${counterArray[i].position.x}px, ${counterArray[i].position.y}px)`;
        div.style.msTransform = `translate(${counterArray[i].position.x}px, ${counterArray[i].position.y}px)`;
        div.style.OTransform = `translate(${counterArray[i].position.x}px, ${counterArray[i].position.y}px)`;
        div.style.transform = `translate(${counterArray[i].position.x}px, ${counterArray[i].position.y}px)`;

        innerBoard.appendChild(div);

    }*/

    let div,
        imageOfCounter,
        color,
        typeOfCounter;

    for(let x = 0; x <=7; x++){

        for(let y=0; y<=7; y++){

            div = document.createElement("div");

            div.classList.add(
                "field",
                `x${x}`,
                `y${y}`
                
            );

        if(battleField.fields[x][y].color !== null){

            color = battleField.fields[x][y].color,
            typeOfCounter = battleField.fields[x][y].typeOfCounter

            div.classList.add(
                color,
                typeOfCounter            
            );

            imageOfCounter = document.createElement("img");

          

            imageOfCounter.src = imagesOfCounter[color][typeOfCounter];

            div.appendChild(imageOfCounter);
        }

        

        div.style.webkitTransform = `translate(${x*78.5}px, ${y*78.5}px)`;
        div.style.MozTransform = `translate(${x*78.5}px, ${y*78.5}px)`;
        div.style.msTransform = `translate(${x*78.5}px, ${y*78.5}px)`;
        div.style.OTransform = `translate(${x*78.5}px, ${y*78.5}px)`;
        div.style.transform = `translate(${x*78.5}px, ${y*78.5}px)`;

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

//////////////

export const setEmptyBattleField = () => {
    for(let x = 0; x <= 7; x++){

        battleField.fields[x] = []

        for(let y = 0; y <= 7; y++){

            battleField.fields[x][y] = {
                color: null,
                typeOfCounter: null
            }
        }
    }
}

export const fillFieldsInCounters = (team = "", counterType = "", numberOfCounters = null, position = []) => {
    
    for(let i = 0; i<numberOfCounters; i++){
        battleField.fields[
            position[i].x
        ][
            position[i].y
        ]
        .color = team;

        battleField.fields[
            position[i].x
        ][
            position[i].y
        ]
        .typeOfCounter = counterType;
    }
}




////////////////