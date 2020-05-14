import { getFieldFromCoordinates, getCoordinatesFromField, getAllCounters, getArrayOfMoves, getOppositeColour } from "./getSomething.js";

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
           willBeKingInDanger,
           isKingInDanger,
           isMate,
           verifyCheckAndMate;






    filterTabInCaseOfCheck = (x, y, tabOfMoves) => {

        let willBeCheck;

        const filteredTab = [];
        
        for(let i = 0; i<tabOfMoves.length; i++){
            willBeCheck = willBeKingInDanger({x, y},tabOfMoves[i], gameOptions.activeColour);

            if(!willBeCheck){ // IF THERE IS NO CHECK  
                filteredTab.push(tabOfMoves[i]);
            }
        }

        return filteredTab;
    }

    willBeKingInDanger = (origin, destination, colour) =>{

        //PRETENT TO MOVE FROM ORIGIN TO DESTINATION
        
        let originField = battleField.fields[origin.x][origin.y];
        let destinationField = battleField.fields[destination.x][destination.y];

        const originFieldColor = originField.color,
              originFieldTypeOfCounter = originField.typeOfCounter,
              destinationFieldColor = destinationField.color,
              destinationFieldTypeOfCounter = destinationField.typeOfCounter;

        const isDestinationFieldTaken = isFieldTaken(destination.x, destination.y);

        battleField.fields[destination.x][destination.y].color = originFieldColor;
        battleField.fields[destination.x][destination.y].typeOfCounter = originFieldTypeOfCounter;

        battleField.fields[origin.x][origin.y].color = null;
        battleField.fields[origin.x][origin.y].typeOfCounter = null;


        let isCheck = isKingInDanger(colour);


        /********** undo changes ***********/
        battleField.fields[destination.x][destination.y].color = destinationFieldColor;
        battleField.fields[destination.x][destination.y].typeOfCounter = destinationFieldTypeOfCounter;

        battleField.fields[origin.x][origin.y].color = originFieldColor;
        battleField.fields[origin.x][origin.y].typeOfCounter = originFieldTypeOfCounter;

     /*   if(isDestinationFieldTaken){
           destinationField.color = destinationFieldColor;
           destinationField.typeOfCounter = destinationFieldTypeOfCounter;
         
        } else {
           destinationField.color = null;
           destinationField.typeOfCounter = null;
        }*/
        /***********************************/
        

        return isCheck;
    };

    isKingInDanger = (colour) => {
      
        const oppositeColour = getOppositeColour(colour);

        const offensiveCounters = getAllCounters(null, oppositeColour, false) ;
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

        const tabOfCounters = getAllCounters(null, endangeredColour, true);
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

    verifyCheckAndMate = () => {
        const firstKing = document.querySelector(`.white.king`);
        const secondKing = document.querySelector(`.black.king`);

        const checkFirst = isKingInDanger("white");
        const checkSecond = isKingInDanger("black");

        const fieldWithDanger = document.querySelector(".danger");

        console.log(fieldWithDanger)


        if(checkFirst){
            
            firstKing.classList.add("danger")
    
            const mate = isMate("white");
    
            if(mate){
                gameOptions.didGameEnd = true;
                gameOptions.winner = "black";
    
                showWinner();
            }

            return;
        } 
        
        if(checkSecond){
            
            secondKing.classList.add("danger")
    
            const mate = isMate("black");
            if(mate){
                gameOptions.didGameEnd = true;
                gameOptions.winner = "white";
    
                showWinner();
            }

            return;
        }

        if(fieldWithDanger !== null){
            fieldWithDanger.classList.remove("danger")
        }
        
}

