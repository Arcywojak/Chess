import { getFieldFromCoordinates, getCoordinatesFromField, getAllCounters, getArrayOfMoves } from "./getSomething.js";

import {
    COLOR_CLASS,
    TYPE_OF_COUNTER_CLASS,
    gameOptions,
    battleField,
    showWinner
} from './variables.js'
import { isFieldTaken } from "./handleWithDOM.js";
import { findPossibleMoves } from "./findMoves.js";

export let doesCounterEndangerKing,
           doesTeamEndangerEnemyKing,
           filterTabInCaseOfCheck,
           willBeMyKingInDanger,
           isKingInDanger,
           isMate,
           verifyCheckAndMate;






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

        const offensiveCounters = getAllCounters(offensiveColour, false) ;
        //we do not need king because he can't check enemy king

        let isInDanger,
        tabOfMoves;

        for(let i=0; i<offensiveCounters.length; i++){

            tabOfMoves = getArrayOfMoves(
                offensiveCounters[i].typeOfCounter,
                offensiveCounters[i].colour,
                offensiveCounters[i].x,
                offensiveCounters[i].y,
                false
                );

            isInDanger = doesCounterEndangerKing(tabOfMoves);

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

    isMate = (endangeredColour) => {

        const tabOfCounters = getAllCounters(endangeredColour, true);
        let tabOfMoves,
            tabOfFilteredMoves

        for(let i = 0; i<tabOfCounters.length; i++){
            tabOfMoves = getArrayOfMoves(
                tabOfCounters[i].typeOfCounter,
                tabOfCounters[i].colour,
                tabOfCounters[i].x,
                tabOfCounters[i].y,
                false
                );

            tabOfFilteredMoves = filterTabInCaseOfCheck(
                tabOfCounters[i].x,
                tabOfCounters[i].y,
                tabOfMoves
            )
           
            if(tabOfFilteredMoves.length > 0){

               

                return false;
            }
        }

        return  true;
    }

    verifyCheckAndMate = (isCheck) => {
        const kingField = document.querySelector(`.${gameOptions.activeColour}.king`);

        const otherKingField = document.querySelector(`.${gameOptions.oppositeColour}.king`);

        if(isCheck){
            
            kingField.classList.add("danger")
    
            const mate = isMate(gameOptions.activeColour);
    
            if(mate){
                gameOptions.didGameEnd = true;
                gameOptions.winner = gameOptions.oppositeColour;
    
                showWinner();
            }
        } else {
            if(otherKingField.classList.contains("danger")){
                otherKingField.classList.remove("danger")
            }
        }
    }

