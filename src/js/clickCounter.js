import {getActiveCoordinates,
    getActiveField,
    getCoordinatesFromField,
    getFieldFromCoordinates} from "./getSomething.js";

import {removeActivePosition,
    showActivePosition,
    toggleOverlayAndPromotionBlock} from "./handleWithDOM.js";

import {changePositionOfCounter} from "./moveCounter.js";

import {AIdoMove} from "./artificalInteligence.js";

import {findPossibleMoves} from "./findMoves.js";

import {
    COLOR_CLASS,
    TYPE_OF_COUNTER_CLASS,
    battleField,
    gameOptions,
    switchTeams,
    innerBoard
} from "./variables.js";

import {isKingInDanger, verifyCheckAndMate} from "./LookForCheck.js";

export let handleClick, promotePawn, selectPromotion;

handleClick = (e) => {

    if(!gameOptions.didGameEnd && 
        !(gameOptions.gameMode === "c" && gameOptions.computerColor === gameOptions.activeColour)){

        const field = e.target,

            active = getActiveField();

        if (active === field) {

            removeActivePosition();

            return;

        }

        if (field.parentNode.classList.contains("white") && gameOptions.activeColour === "white" ||
            field.parentNode.classList.contains("black") && gameOptions.activeColour === "black") {

            removeActivePosition();

            const team = field.parentNode.classList[COLOR_CLASS],
                typeOfCounter = field.parentNode.classList[TYPE_OF_COUNTER_CLASS],
                {x, y} = getCoordinatesFromField(
                    field,
                    true
                );

            findPossibleMoves(
                typeOfCounter,
                team,
                x,
                y
            ); // FindMoves.js

            showActivePosition(field);

        } else if (field.classList.contains("to-move") || field.parentNode.classList.contains("to-move")) {

            const instanceContainingToMove = field.classList.contains("to-move") ? field : field.parentNode,

                /**  IF WAS CHECK AND WE ESCAPED, REMOVE "DANGER" CLASS   **/
                isCheck = isKingInDanger(gameOptions.activeColour);

            if (isCheck) {

                const kingField = innerBoard.querySelector(`.${gameOptions.activeColour}.king`);

                kingField.classList.remove("danger");

            }

            /** ******************************************************** */


            const from = getActiveCoordinates(),

                to = getCoordinatesFromField(
                    instanceContainingToMove,
                    false
                );


            changePositionOfCounter(
                from,
                to
            );

        }

    }
};

const promotionBlock = document.querySelectorAll(".counter-to-promote");

promotePawn = (src, id) => {

    const theLatestPosition = {"x": gameOptions.lastMove.to.x,
        "y": gameOptions.lastMove.to.y};

    battleField.fields[theLatestPosition.x][theLatestPosition.y].typeOfCounter = id;
    const theLatestField = getFieldFromCoordinates(
        theLatestPosition.x,
        theLatestPosition.y
    );

    theLatestField.classList.remove("pawn");
    theLatestField.classList.add(id);
    theLatestField.childNodes[0].src = src;

    toggleOverlayAndPromotionBlock();

    verifyCheckAndMate();

};

promotionBlock.forEach((field) => {

    field.childNodes[1].addEventListener(
        "click",
        (e) => { // Add event to images

            promotePawn(
                e.target.src,
                e.target.id
            );

        }
    );

});


document.addEventListener(
    "click",
    handleClick
);

document.addEventListener(
    "click",
    selectPromotion
);

const button = document.querySelector(".switch-button");

button.addEventListener(
    "click",
    () => {

        switchTeams();

        let fieldWithCounter, img;

        for (let x = 0; x <= 7; x++) {

            for (let y = 0; y <= 7; y++) {

                if (battleField.fields[x][y].color !== null) {

                    fieldWithCounter = getFieldFromCoordinates(
                        x,
                        y
                    );

                    img = fieldWithCounter.childNodes[0];

                    img.style.transform = `rotate(${gameOptions.reverseBoard}deg)`;

                }

            }

        }

    }
);

const button2 = document.querySelector(".restart-button");

button2.addEventListener("click", () => {

    location.reload();
    
})

const gameModeButtons = document.querySelectorAll(".input-wrapper.gm");

gameModeButtons.forEach( btn => {
    btn.addEventListener("click", (e) => {
        
        const id = e.target.id;

        gameOptions.gameMode = id;

        let checkColourField = document.querySelector(".check-colour");

        if(id === "c"){
            checkColourField.classList.add("shown");

            if(gameOptions.activeColour === gameOptions.computerColor){
                AIdoMove();
            }
        } else {
            checkColourField.classList.remove("shown");
        }
    })
} )

const checkColourButtons = document.querySelectorAll(".input-wrapper.mini");

checkColourButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {

        //console.log(gameOptions.gameStarted)
        
        if(gameOptions.gameStarted && gameOptions.numberOfMove > 0){

            const alertField = document.querySelector(".change-team-alert");

            if(!alertField.classList.contains("hidden")){
                return;
            }

            alertField.classList.remove("hidden");

            return new Promise( () => { 
                setTimeout( () => {
              
                        alertField.classList.add("hidden")
                
                }, 3000)
            })
        }

        const id = e.target.id;


        gameOptions.computerColor = id;
        console.log( gameOptions.gameStarted, "S")

        if (
            !gameOptions.didGameEnd && 
             gameOptions.activeColour === gameOptions.computerColor && 
             gameOptions.gameMode === "c"
             ) {

                AIdoMove();

             }
    })
})
