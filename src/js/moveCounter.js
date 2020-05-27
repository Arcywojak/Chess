export let beatCounter,
        changePositionOfCounter;

import {updatePgn} from "./handlePGN.js";

import {AIdoMove} from "./artificalInteligence.js";

import {isFieldTaken,
        removeActivePosition,
        removeRecentMove,
        showRecentMove,
        toggleEndMessage} from "./handleWithDOM.js";

import {getFieldFromCoordinates} from "./getSomething.js";

import {verifyCheckAndMate} from "./LookForCheck.js";

import {
    battleField,
    changeColourOfActivePlayer,
    gameOptions,
    disableChangingColour
} from "./variables.js";

import {DoesKingDoCastling, 
        didPawnDoEnPassant, 
        doesPawnPromote,
        isDraw} from "./specialMoves.js";

const moveSound = document.querySelector("#move-sound"),
    beatSound = document.querySelector("#beat-sound");

changePositionOfCounter = (origin, destination, changeColour = true) => {

    gameOptions.lastMove.from.x = origin.x;
    gameOptions.lastMove.from.y = origin.y;
    gameOptions.lastMove.to.x = destination.x;
    gameOptions.lastMove.to.y = destination.y;
    gameOptions.lastMove.whoMoved.typeOfCounter = battleField.fields[origin.x][origin.y].typeOfCounter;
    gameOptions.lastMove.whoMoved.colour = battleField.fields[origin.x][origin.y].color;


    /** *****************GET ORIGIN AND DESTINATION FIELD ******************** */
    const originBlock = getFieldFromCoordinates(
            origin.x,
            origin.y
        ),
        destinationBlock = getFieldFromCoordinates(
            destination.x,
            destination.y
        ),

        /** ***************************************************** ******************** */


        /** ***********GET TYPE AND COLOUR OF ATTACKING AND ATTACKED COUNTERS ***********/
        colourOfMovingCounter = battleField.fields[origin.x][origin.y].color,
        typeOfMovingCounter = battleField.fields[origin.x][origin.y].typeOfCounter,
        colourOfTakenField = battleField.fields[destination.x][destination.y].color,
        counterOfTakenField = battleField.fields[destination.x][destination.y].typeOfCounter,
        originBlockImg = originBlock.childNodes[0],

        /** *******************************************************************************/

        takenField = isFieldTaken(
            destination.x,
            destination.y
        );

    /** ***********UPTADE PGN BEFORE ENTERING CHANGES AFTER MOVE*******************/

    if(changeColour){
        updatePgn(
            origin,
            destination,
            typeOfMovingCounter,
            counterOfTakenField,
        );
    }

    

    /** ***************************************************************** */

    /** ***************** CHECKING IF WE WANT TO DO CASTLING **************************/
    if (typeOfMovingCounter === "king") {

        DoesKingDoCastling(
            origin,
            destination
        );

    }

    /** *************************************************************************************/

    /** ***************** CHECKING IF A PAWN DID EN PASSANT **************************/
    if (typeOfMovingCounter === "pawn") {

        didPawnDoEnPassant(
            origin,
            destination
        );

    }

    /** *************************************************************************************/

    removeRecentMove();
    removeActivePosition();

    if(changeColour){
        changeColourOfActivePlayer();
    }
    
    showRecentMove(
        originBlock,
        destinationBlock
    );


    /** ************ABANDOM FIELD WE MOVED FROM ******************/
    originBlock.classList.remove(
        typeOfMovingCounter,
        colourOfMovingCounter
    );

    battleField.fields[origin.x][origin.y].color = null;
    battleField.fields[origin.x][origin.y].typeOfCounter = null;

    /** *********************************************************** */

    originBlockImg.style.transform =
     `translate(${(destination.x - origin.x) * 100}%, ${(destination.y - origin.y) * 100}%) 
     rotate(${gameOptions.reverseBoard})`;

     originBlockImg.style.width = "100%";
     originBlockImg.style.height = "100%";

    setTimeout(
        () => { // Delay code by 100ms to let animation works

            originBlockImg.style.transform = // Reset animation
        `translate(${(destination.x - origin.x) * 0}px, ${(destination.y - origin.y) * 0}px) 
        rotate(${gameOptions.reverseBoard})`;

            originBlock.removeChild(originBlockImg);

            battleField.fields[destination.x][destination.y].color = colourOfMovingCounter;
            battleField.fields[destination.x][destination.y].typeOfCounter = typeOfMovingCounter;


            //* *************CHECK IF WE BEAT OR MOVE INTO AN EMPTY FIELD ***************/
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
            //* *************************************************************************************/

            /** ***************** CHECKING IF A PAWN'S DREAM COMES TRUE *****************************/
            if (typeOfMovingCounter === "pawn") {

                doesPawnPromote(
                    destination,
                    colourOfMovingCounter
                );

            }

            /** *************************************************************************************/

            //* ******************IS CHECK AFTER THIS MOVE? *****************************************/
            verifyCheckAndMate();
            /** *************************************************************************************/

            /****************************** IS DRAW AFTER THIS MOVE? *****************************/
            isDraw();
            /*************************************************************************************** */
            
            if (
                !gameOptions.didGameEnd && 
                 gameOptions.activeColour === gameOptions.computerColor && 
                 changeColour &&
                 gameOptions.gameMode === "c"
                 ) {

                    setTimeout( () => {
                        
                        AIdoMove();  

                        
                    }, 50)
                              

            }

        },
        100
    );

    if(!gameOptions.gameStarted){ // first move

        setTimeout( () => {
                        
            disableChangingColour(); 
                
        }, 50)
        
    }

    gameOptions.gameStarted = true
};

