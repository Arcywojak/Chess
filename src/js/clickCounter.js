import {getActiveCoordinates,
        getActiveField,
        getCoordinatesFromField,
        getFieldFromCoordinates} from './getSomething.js';

import {canPawnAttack,
    findPossibleMoves,
    isFieldTaken,
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves} from './showMoves.js';

let changePositionOfCounter,
    handleClick;


    
/*////////////// STRUCTURE OF FUNCTIONS ///////////////

    Which functions execute indyvidual functions 

    handleCLick
    |
    |-1) removeActivePosition
    |
    |-2) removeActivePosition, showActivePositon, O-canPawnAttack
    |
    |-3) getActiveCoordinates, getCoordinatesFromField, changePositionOfCounter

    removeActivePosition
    |
    |-getActiveField, removePossibleMoves

    showActivePosition
    |
    |-getActiveField, getCoordinatesFromField, findPossibleMoves

    removeActivePosition
    |
    |-getActiveField, removePossibleMoves

    getActiveCoordinates
    |
    |-getActiveField, 

    changePositionOfCounter
    |
    |-removeActivePosition

    canPawnAttack
    |
    |-getActiveField, getCoordinatesFromField,getFieldFromCoordinates(x2), showPossibleMove(x2)

    findPossibleMove
    |
    |-showPossibleMove

    -Number) - one of possible paths during executing

*///////////////////////////////////////////////////////
    
    changePositionOfCounter = (origin, destination) => {

        const originBlock = document.querySelector(`.x${origin.x}.y${origin.y}`),

            teamClass = originBlock.classList[3],
            counterClass = originBlock.classList[4];

        originBlock.classList.remove(
            teamClass,
            counterClass
        );
        const originBlockImg = originBlock.childNodes[0];

        originBlock.removeChild(originBlockImg);

        const destinationBlock = document.querySelector(`.x${destination.x}.y${destination.y}`);

        destinationBlock.classList.add(
            teamClass,
            counterClass
        );
        

        destinationBlock.appendChild(originBlockImg);

        removeActivePosition();

    };







    handleClick = (e) => {

        const field = e.target;

        const active = getActiveField();
        
           

        if(active === field) {

            removeActivePosition();

            return;
        }

            if (field.parentNode.classList.contains("white") || field.parentNode.classList.contains("black")) {

                removeActivePosition();
                showActivePosition(field);

               

                const team = field.parentNode.classList[3];

                let unfriendlyTeam = team === "white" ? "black" : "white";

                canPawnAttack(unfriendlyTeam);

            } else if (field.classList.contains("to-move")) {

                

                const from = getActiveCoordinates(),

                    to = getCoordinatesFromField(
                        field,
                        false
                    );

                changePositionOfCounter(
                    from,
                    to
                );

            }
        
    };

document.addEventListener(
    "click",
    handleClick
);