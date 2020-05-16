import {getAllCounters,
        getArrayOfMoves,
        getMoveFromOpenings} from "./getSomething.js";

import {changePositionOfCounter} from "./moveCounter.js";

import {promotePawn} from "./clickCounter.js";

import {gameOptions} from "./variables.js";

export let AIdoMove;


AIdoMove = () => {

    const move = getMoveFromOpenings();

    if(move === null){

        const allCounters = getAllCounters(
                null,
                gameOptions.activeColour,
                true
            ),

            tabForCounters = [];

        let coordinates, moves;

        for (let i = 0; i < allCounters.length; i++) {

            coordinates = {"x": allCounters[i].x,
                "y": allCounters[i].y};

            moves = getArrayOfMoves(
                allCounters[i].typeOfCounter,
                allCounters[i].colour,
                allCounters[i].x,
                allCounters[i].y
            );

            tabForCounters.push({
                coordinates,
                moves
            });

        }

        const countersWithMoves = tabForCounters.filter((tab) => tab.moves.length > 0);

        let randomCounter = Math.floor(Math.random() * countersWithMoves.length);

        if (randomCounter === countersWithMoves.length) {

            randomCounter--;

        }

        let randomMove = Math.floor(Math.random() * countersWithMoves[randomCounter].moves.length);

        if (randomMove === countersWithMoves[randomCounter].moves.length) {

            randomMove--;

        }


        const origin = countersWithMoves[randomCounter].coordinates,

            destination = {
                "x": countersWithMoves[randomCounter].moves[randomMove].x,
                "y": countersWithMoves[randomCounter].moves[randomMove].y
            },

            promotionBlock = document.querySelector(".select-counter-to-promote");


        if (!promotionBlock.classList.contains("invisible")) {

            promotePawn(
                imagesOfCounter[gameOptions.oppositeColour].queen,
                "queen"
            );

        }

        changePositionOfCounter(
            origin,
            destination
        );

        console.log("RANDOM")

        return;

    }

    console.log("I KNOW OPENINGS")
    changePositionOfCounter(
        move.from,
        move.to
    );

};