import { getFieldFromCoordinates, getCoordinatesFromField } from "./getSomething.js";

import {
    COLOR_CLASS,
    TYPE_OF_COUNTER_CLASS,
    gameOptions
} from './variables.js'
import { isFieldTaken } from "./handleWithDOM.js";
import { findPossibleMoves } from "./findMoves.js";

export let doesCounterEndangerKing,
           doesTeamEndangerEnemyKing,
           filterTabInCaseOfCheck,
           willBeMyKingInDanger,
           isKingInDanger




    doesTeamEndangerEnemyKing = (friendlyColour) => {
        const hostileColour = friendlyColour === "white" ? "black" : "white";

        let typeOfCounter, coordinates;

        const allCountersOfFriendlyColour = document.querySelectorAll(`.${friendlyColour}`);
        //typeOfCounter, team, x, y, show

        allCountersOfFriendlyColour.forEach( field => {
            typeOfCounter = field.classList[TYPE_OF_COUNTER_CLASS];
            coordinates = getCoordinatesFromField(field, false);
            const {x, y} = coordinates;

            findPossibleMoves(typeOfCounter, friendlyColour, x, y, false);
        })
    }

    filterTabInCaseOfCheck = (x, y, tabOfMoves) => {

        

        let willBeCheck;

        const filteredTab = [];
        
        for(let i = 0; i<tabOfMoves.length; i++){
            willBeCheck = willBeMyKingInDanger({x, y},tabOfMoves[i]);

            if(!willBeCheck){ // IF THERE IS NO CHECK  
                filteredTab.push(tabOfMoves[i]);
            }
        }

        return filteredTab;
    }

    willBeMyKingInDanger = (origin, destination) =>{
        //PRETENT TO MOVE FROM ORIGIN TO DESTINATION

        

        let originField = getFieldFromCoordinates(origin.x, origin.y);

        console.log(originField)

        originField.classList.remove(gameOptions.activeColour);

        let destinationField = getFieldFromCoordinates(destination.x, destination.y)

        let isDestinationFieldTaken = isFieldTaken(destination.x, destination.y);

        if(isDestinationFieldTaken){
            destinationField.classList.remove(gameOptions.oppositeColour);
        }

        destinationField.classList.add(gameOptions.activeColour);

        let isCheck = isKingInDanger(gameOptions.activeColour, gameOptions.oppositeColour, false);

        destinationField.classList.remove(gameOptions.activeColour);

        //przywrocenie klas
        if(isDestinationFieldTaken){
            destinationField.classList.add(gameOptions.oppositeColour);
        }

        originField.classList.add(gameOptions.activeColour)

        ///////

        return isCheck;
    };

    isKingInDanger = (colourOfKing, offensiveColour, showDanger) => {
      
        //exec

        const offensiveCounters = document.querySelectorAll(`.${offensiveColour}`);
        let typeOfCounter,
            coordinates,
            isInDanger;


        for(let i=0; i<offensiveCounters.length; i++){
            coordinates = getCoordinatesFromField(offensiveCounters[i], false);
            typeOfCounter = offensiveCounters[i].classList[TYPE_OF_COUNTER_CLASS];

            isInDanger = findPossibleMoves(typeOfCounter, offensiveColour, coordinates.x, coordinates.y, false);

            if(isInDanger){
                return true;
            }
        }

        return false

    }

    doesCounterEndangerKing = (tabOfMoves) => {

        let fieldOfEnemyKing = document.querySelector(`.king.${gameOptions.activeColour}`)


        let kingPosition = getCoordinatesFromField(fieldOfEnemyKing);

            for(let i=0; i<tabOfMoves.length; i++){
            
            if(kingPosition.x === tabOfMoves[i].x &&
                kingPosition.y === tabOfMoves[i].y){
                //fieldOfEnemyKing.classList.add('danger');

                

                return true;
                }
            }

            //fieldOfEnemyKing.classList.remove("danger");

            return false;

        
    }

