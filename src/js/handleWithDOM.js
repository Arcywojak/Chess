
export let  removeActivePosition,
            showActivePosition,
            showRecentMove,
            removeRecentMove,
            removePossibleMoves,
            showPossibleMoves,
            isFieldTaken,
            setCounterToPromoteImages,
            toggleOverlayAndPromotionBlock;  
            
import {getActiveField,
        getFieldFromCoordinates,
        getCoordinatesFromField
} from './getSomething.js'

import {
    COLOR_CLASS,
    TYPE_OF_COUNTER_CLASS,
    gameOptions,
    updatePlayerToMove,
    changeColourOfActivePlayer,
    battleField,
    imagesOfCounter
} from './variables.js'



removeActivePosition = () => {

    const activeField = getActiveField();

    if (activeField !== null) {

        activeField.classList.remove("active");

        removePossibleMoves();

    }

};

showActivePosition = (target) => {

    const activeField = getActiveField(true);

    if (!(activeField === target)) {

        target.classList.add("active");

        const team = target.parentNode.classList[COLOR_CLASS],
            typeOfCounter = target.parentNode.classList[TYPE_OF_COUNTER_CLASS],

            coordinates = getCoordinatesFromField(
                target,
                true
            ),

            {x, y} = coordinates;

    }


};

showRecentMove = (fieldOrigin, fieldDestination) => {
    fieldOrigin.classList.add('last-move');

    fieldDestination.classList.add('last-move');
};

removeRecentMove = () => {
    let fields = document.querySelectorAll(".last-move");

    if(fields !== null){

    fields.forEach(field => {
        field.classList.remove("last-move");
    })

    }
};

removePossibleMoves = () => {

    const previouslyToMove = document.querySelectorAll(".to-move");

    if (previouslyToMove !== null) {

        previouslyToMove.forEach((div) => {

            div.classList.remove("to-move");

        });

    }

};

showPossibleMoves = (arrayOfMoves) => {

    if (!(typeof arrayOfMoves === "undefined")) {

        const tabOfPossibleMoves = [];

        for (let i = 0; i < arrayOfMoves.length; i++) {

            tabOfPossibleMoves[i] = document.querySelector(`.x${arrayOfMoves[i].x}.y${arrayOfMoves[i].y}`);

            tabOfPossibleMoves[i].classList.add("to-move");

        }

    }

};

isFieldTaken = (x, y) => {

    try{
        if (battleField.fields[x][y].color !== null) { // It mean the field is taken by some counter

            return true;
    
        }
    
        return false;
    } catch (error) {
        console.error(`Error with parameters:${x}, ${y} \n ${error}`)
    }

    

};
setCounterToPromoteImages = (team) => {
    const promotionFields = document.querySelectorAll(".counter-to-promote");

    console.log(team)

    let images;

    if(team === "white"){
        images = imagesOfCounter.white;
    } else {
        images = imagesOfCounter.black;
    }
        promotionFields[0].childNodes[1].src = images.queen;
        promotionFields[1].childNodes[1].src = images.knight;
        promotionFields[2].childNodes[1].src = images.rook;
        promotionFields[3].childNodes[1].src = images.bishop;
 
        promotionFields[0].childNodes[1].src = images.queen;
        promotionFields[1].childNodes[1].src = images.knight;
        promotionFields[2].childNodes[1].src = images.rook;
        promotionFields[3].childNodes[1].src = images.bishop;
    
}

toggleOverlayAndPromotionBlock = (coordinates) => {

        const selectPrize = document.querySelector(".select-counter-to-promote");
        const promotionOverlay = document.querySelector(".promotion-overlay");

        selectPrize.classList.toggle("invisible")
        promotionOverlay.classList.toggle("invisible")

        if(coordinates){
            selectPrize.style.webkitTransform = `translate(${coordinates.x*78.5}px, ${coordinates.y*78.5}px)`;
            selectPrize.style.MozTransform = `translate(${coordinates.x*78.5}px, ${coordinates.y*78.5}px)`;
            selectPrize.style.msTransform = `translate(${coordinates.x*78.5}px, ${coordinates.y*78.5}px)`;
            selectPrize.style.OTransform = `translate(${coordinates.x*78.5}px, ${coordinates.y*78.5}px)`;
            selectPrize.style.transform = `translate(${coordinates.x*78.5}px, ${coordinates.y*78.5}px)`;
        }
}