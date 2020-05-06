import { getFieldFromCoordinates, getCoordinatesFromField, getAllCountersExceptKing } from "./getSomething.js";

import {
    COLOR_CLASS,
    TYPE_OF_COUNTER_CLASS,
    gameOptions,
    battleField
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
        
        let originField = battleField.fields[origin.x][origin.y];
        let destinationField = battleField.fields[destination.x][destination.y];

        const originFieldColor = originField.color,
              originFieldTypeOfCounter = originField.typeOfCounter,
              destinationFieldColor = destinationField.color,
              destinationFieldTypeOfCounter = destinationField.typeOfCounter;

        originField.color = null;
        originField.typeOfCounter = null;

        const isDestinationFieldTaken = isFieldTaken(destination.x, destination.y);

        destinationField.color = originFieldColor;
        destinationField.typeOfCounter = originFieldTypeOfCounter;

        let isCheck = isKingInDanger(gameOptions.oppositeColour);

        /********** undo changes ***********/
        originField.color = originFieldColor;
        originField.typeOfCounter = originFieldTypeOfCounter;

        if(isDestinationFieldTaken){
           destinationField.color = destinationFieldColor;
           destinationField.typeOfCounter = destinationFieldTypeOfCounter;
         
        } else {
           destinationField.color = null;
           destinationField.typeOfCounter = null;
        }
        /***********************************/
        

        return isCheck;
    };

    isKingInDanger = (offensiveColour) => {
      
        //exec

        const offensiveCounters = getAllCountersExceptKing(offensiveColour) ;
        //we do not need king because he can't check enemy king

        let isInDanger;

        for(let i=0; i<offensiveCounters.length; i++){

            isInDanger = findPossibleMoves(
                offensiveCounters[i].typeOfCounter,
                offensiveCounters[i].colour,
                offensiveCounters[i].x,
                offensiveCounters[i].y,
                false
                );

            if(isInDanger){

                return true;
            }
        }

        return false

    }

    doesCounterEndangerKing = (tabOfMoves) => {

            for(let i=0; i<tabOfMoves.length; i++){
            
            if(
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

        
    }

