import {getActiveCoordinates,
        getActiveField,
        getCoordinatesFromField,
        getFieldFromCoordinates} from './getSomething.js';


export let canPawnAttack,
    isFieldTaken,
    findPossibleMoves,
    removeActivePosition,
    removePossibleMoves,
    showActivePosition,
    showPossibleMoves,
    findMovesForPawn;

    

        canPawnAttack = (unfriendlyColour) => {
        let activeField = getActiveField(true);

        let activeCoordinates = getCoordinatesFromField(activeField);

        let otherNumber = unfriendlyColour === "white" ? (
            1
        ) : (
            -1
        )

        let rightCoordinates = {
            x: activeCoordinates.x - 1,
            y: activeCoordinates.y + otherNumber
        }

        let leftCoordinates = {
            x: activeCoordinates.x + 1,
            y: activeCoordinates.y + otherNumber
        }

        const leftField = getFieldFromCoordinates(leftCoordinates.x, leftCoordinates.y);
        const rightField = getFieldFromCoordinates(rightCoordinates.x, rightCoordinates.y);
        

        if(leftField !== null){
            let team = leftField.classList[3];

            if(team === unfriendlyColour){
                showPossibleMoves([{x:leftCoordinates.x, y:leftCoordinates.y}])
            }
        }
        if(rightField !== null){
            let team = rightField.classList[3];

            if(team === unfriendlyColour){
                showPossibleMoves([{x:rightCoordinates.x, y:rightCoordinates.y}])
            }
        }


        
    };

    findMovesForPawn = (team, x, y) => {
        let numberOfPositionY = y,
            newPositionY,
            additionMoveY,
            isFirstMove,
            enemy = team === "white" ? "black" : "white",
            tabOfMoves = [];

        if (team === "white") {

            newPositionY = numberOfPositionY - 1;
            isFirstMove = numberOfPositionY === 6;

            additionMoveY = newPositionY - 1;

        } else if (team === "black") {

            newPositionY = numberOfPositionY + 1;
            isFirstMove = numberOfPositionY === 1;

            additionMoveY = newPositionY + 1;

        }

        let isBlocked = isFieldTaken(x, newPositionY)

        if(!isBlocked){
            tabOfMoves.push({x, "y":newPositionY}); //check pos x, y+1/-1

            let isAdditionBlocked = isFieldTaken(x, additionMoveY);

            console.log(isFirstMove)
            if(isFirstMove){
                if(!isAdditionBlocked){ //check pos x, y+2/-2
                    tabOfMoves.push(
                        {x,
                        "y": additionMoveY}
                        );
                }
            }
        }
        canPawnAttack(enemy);
        showPossibleMoves(tabOfMoves);
    };

    removeActivePosition = () => {
        
        let activeField = getActiveField();

        if (activeField !== null ) {

            activeField.classList.remove("active");

            removePossibleMoves();

        }

    },

    showActivePosition = (target) => {
    
        const activeField = getActiveField(true);

        if (!(activeField === target)) {

            target.classList.add("active");

            const team = target.parentNode.classList[3];
            const typeOfCounter = target.parentNode.classList[4]

            const coordinates = getCoordinatesFromField(
                    target,
                    true
                ),

                {x, y} = coordinates;

            findPossibleMoves(
                team,
                x,
                y,
                typeOfCounter
            );

        }


    };
        showPossibleMoves = (arrayOfMoves) => {

        if( !(typeof(arrayOfMoves) === 'undefined') ){

        const tabOfPossibleMoves = [];

        console.log(arrayOfMoves)

        for (let i = 0; i < arrayOfMoves.length; i++) {

            tabOfPossibleMoves[i] = document.querySelector(`.x${arrayOfMoves[i].x}.y${arrayOfMoves[i].y}`);

            tabOfPossibleMoves[i].classList.add("to-move");

        }
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
    findPossibleMoves = (team, x, y, typeOfCounter) => {

        switch(typeOfCounter){
            case 'pawn':

                
                findMovesForPawn(team, x, y);
                return;
            
            default :return
        }
    };

    isFieldTaken = (x,y) => {
        let field = getFieldFromCoordinates(x,y);
        let lengthOfClassList = field.classList.length;

        if(lengthOfClassList > 3){ //it mean the field is taken by some counter
            return true;
        }

        return false;
    }
   