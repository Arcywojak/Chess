export let beatCounter,
    changePositionOfCounter,
    AIdoMove;

import {
    isFieldTaken,
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves,
    showRecentMove,
    removeRecentMove} from "./handleWithDOM.js";
import {getFieldFromCoordinates, getAllCounters, getArrayOfMoves} from "./getSomething.js";
import { doesCounterEndangerKing, doesTeamEndangerEnemyKing, isKingInDanger, isMate, verifyCheckAndMate } from "./LookForCheck.js";
import { COLOR_CLASS, TYPE_OF_COUNTER_CLASS, battleField, gameOptions, showWinner, changeColourOfActivePlayer, imagesOfCounter } from "./variables.js";
import { DoesKingDoCastling, doesPawnPromote, didPawnDoEnPassant } from "./specialMoves.js";
import {promotePawn} from './clickCounter.js'

const moveSound = document.querySelector("#move-sound");
const beatSound = document.querySelector("#beat-sound");

changePositionOfCounter = (origin, destination) => {

    gameOptions.lastMove.from.x = origin.x;
    gameOptions.lastMove.from.y = origin.y;
    gameOptions.lastMove.to.x = destination.x;
    gameOptions.lastMove.to.y = destination.y;
    gameOptions.lastMove.whoMoved.typeOfCounter = battleField.fields[origin.x][origin.y].typeOfCounter;
    gameOptions.lastMove.whoMoved.colour = battleField.fields[origin.x][origin.y].color;


/*******************GET ORIGIN AND DESTINATION FIELD ******************** */
    const originBlock = getFieldFromCoordinates(
        origin.x,
        origin.y
    ),
    destinationBlock = getFieldFromCoordinates(
        destination.x,
        destination.y
    ),
/******************************************************* ******************** */


/*************GET TYPE AND COLOUR OF ATTACKING AND ATTACKED COUNTERS ***********/
      colourOfMovingCounter = battleField.fields[origin.x][origin.y].color,
      typeOfMovingCounter = battleField.fields[origin.x][origin.y].typeOfCounter,
      colourOfTakenField = battleField.fields[destination.x][destination.y].color,
      counterOfTakenField = battleField.fields[destination.x][destination.y].typeOfCounter,
      originBlockImg = originBlock.childNodes[0],
/*********************************************************************************/

    takenField = isFieldTaken(
        destination.x,
        destination.y
    );


/******************* CHECKING IF WE WANT TO DO CASTLING **************************/
 if(typeOfMovingCounter === 'king'){
    DoesKingDoCastling(origin, destination);
 }
/***************************************************************************************/

 /******************* CHECKING IF A PAWN DID EN PASSANT **************************/
 if(typeOfMovingCounter === 'pawn'){
    didPawnDoEnPassant(origin, destination);
 } 
/***************************************************************************************/
    
    removeRecentMove();
    removeActivePosition();   
    changeColourOfActivePlayer();
    showRecentMove(originBlock, destinationBlock);
      

    originBlock.classList.remove(
        typeOfMovingCounter,
        colourOfMovingCounter
    );

    battleField.fields[origin.x][origin.y].color = null;
    battleField.fields[origin.x][origin.y].typeOfCounter = null;

    originBlockImg.style.transform =
     `translate(${(destination.x - origin.x)*78.5}px, ${(destination.y - origin.y)*78.5}px)`;

     setTimeout( () => { // delay code by 100ms to let animation works

        originBlockImg.style.transform = //reset animation
        `translate(${(destination.x - origin.x)*0}px, ${(destination.y - origin.y)*0}px)`;

        originBlock.removeChild(originBlockImg);

        battleField.fields[destination.x][destination.y].color = colourOfMovingCounter;
        battleField.fields[destination.x][destination.y].typeOfCounter = typeOfMovingCounter;  


    //**************CHECK IF WE BEAT OR MOVE INTO AN EMPTY FIELD ***************/
        if (takenField) {
    
            const destinationImg = destinationBlock.childNodes[0];
    
            destinationBlock.removeChild(destinationImg);
    
            destinationBlock.classList.remove(
                counterOfTakenField,
                colourOfTakenField
            );
    
            moveSound.play();
    
        } else {
            beatSound.play();
        }
    
        destinationBlock.classList.add(
            colourOfMovingCounter,
            typeOfMovingCounter
        ); 
        destinationBlock.appendChild(originBlockImg);
        //**************************************************************************************/
    
        /******************* CHECKING IF A PAWN'S DREAM COMES TRUE *****************************/
        if(typeOfMovingCounter === 'pawn'){
            doesPawnPromote(destination, colourOfMovingCounter);
        }
        /***************************************************************************************/
    
        //*******************IS CHECK AFTER THIS MOVE? *****************************************/
        const isCheckFirst = isKingInDanger(gameOptions.oppositeColour, gameOptions.activeColour)
        const isCheckSecond = isKingInDanger(gameOptions.oppositeColour, gameOptions.activeColour)

        verifyCheckAndMate(isCheckFirst);
        verifyCheckAndMate(isCheckSecond)
        /***************************************************************************************/


        if(!gameOptions.didGameEnd){
            setTimeout( () => {
                AIdoMove();
            }, 20)
        }

     }, 100)

 //   if(gameOptions.activeColour === "black"){

   

        
        
  //  }
   

};

AIdoMove = () => {
    const allCounters = getAllCounters(gameOptions.activeColour, true) ;

    const tabForCounters = [];

    let moves, coordinates;

    for(let i=0; i<allCounters.length; i++){
        
        coordinates = {x: allCounters[i].x, y:allCounters[i].y};

        moves = getArrayOfMoves(
            allCounters[i].typeOfCounter,
            allCounters[i].colour,
            allCounters[i].x,
            allCounters[i].y
            );

        tabForCounters.push({
            coordinates,
            moves
        })
    }
   
    const countersWithMoves = tabForCounters.filter( tab => {
        return tab.moves.length > 0;
    })

    let randomCounter = Math.floor(Math.random()*countersWithMoves.length);

    if(randomCounter === countersWithMoves.length){
        randomCounter--;
    }

    let randomMove = Math.floor(Math.random()*countersWithMoves[randomCounter].moves.length);

    if(randomMove === countersWithMoves[randomCounter].moves.length){
        randomMove--;
    }

   

    const origin = countersWithMoves[randomCounter].coordinates
    
    const destination = {
       x: countersWithMoves[randomCounter].moves[randomMove].x,
       y: countersWithMoves[randomCounter].moves[randomMove].y
    }
    
    const promotionBlock = document.querySelector(".select-counter-to-promote");


    if(!promotionBlock.classList.contains('invisible')){
        console.log("PROMOTION")
        promotePawn(imagesOfCounter[gameOptions.oppositeColour].queen,"queen")
    }


   changePositionOfCounter(origin, destination)
}