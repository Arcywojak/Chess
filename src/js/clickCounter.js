let getActiveField,
    showActivePosition,
    removeActivePosition,
    removePossibleMoves,
    getActiveCoordinates,
    showPossibleMoves,
    changePositionOfCounter,
    canPawnAttack,
    findPossibleMoves,
    getCoordinatesFromField,
    getFieldFromCoordinates,
    handleClick;

    




 getActiveField = (parent) => {
    const active = document.querySelector(".active");

    if(active !== null){
        if(parent === true){
            return active.parentNode;
        } else {
            return active;
        }
        
    }

    return null;
    
};

getFieldFromCoordinates = (x,y) => {
    const field = document.querySelector(`.x${x}.y${y}`);

    return field;
}

showActivePosition = (target) => {
    
        const activeField = getActiveField(true);

        if (!(activeField === target)) {

            target.classList.add("active");

            const team = target.parentNode.classList[3];

            const coordinates = getCoordinatesFromField(
                    target,
                    true
                ),

                {x, y} = coordinates;

            findPossibleMoves(
                team,
                x,
                y
            );

        }


    };
    removeActivePosition = () => {
        
        let activeField = getActiveField();

        if (activeField !== null ) {

            activeField.classList.remove("active");

            removePossibleMoves();

        }

    },
    getActiveCoordinates = () => {

        const activeCounter = getActiveField(true);

        const coordinates = {
            "x": Number(activeCounter.classList[1].charAt(1)), // X position
            "y": Number(activeCounter.classList[2].charAt(1)) // Y position
        };

        return coordinates;


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


    
    changePositionOfCounter = (origin, destination) => {
        console.log("A")
        const originBlock = document.querySelector(`.x${origin.x}.y${origin.y}`),

            teamClass = originBlock.classList[3],
            counterClass = originBlock.classList[3];

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
        const RightField = getFieldFromCoordinates(rightCoordinates.x, rightCoordinates.y);
        

        if(leftField !== null){
            let team = leftField.classList[3];

            if(team === unfriendlyColour){
                showPossibleMoves([{x:leftCoordinates.x, y:leftCoordinates.y}])
            }
        }
        if(RightField !== null){
            let team = leftField.classList[3];

            if(team === unfriendlyColour){
                showPossibleMoves([{x:rightCoordinates.x, y:rightCoordinates.y}])
            }
        }


        
    };

    findPossibleMoves = (team, x, y) => {

        let numberOfPositionY = y,
            newPositionY,
            additionMove,
            isFirstMove,
            enemy;

        if (team === "white") {

            enemy === "black";
            newPositionY = numberOfPositionY - 1;
            isFirstMove = numberOfPositionY === 6;

            additionMove = newPositionY - 1;

        } else if (team === "black") {

            enemy === "black";
            newPositionY = numberOfPositionY + 1;
            isFirstMove = numberOfPositionY === 1;

            additionMove = newPositionY + 1;

        }

        const tabOfMoves = [
            {x,
                "y": newPositionY}
        ];

        if (isFirstMove) {

            tabOfMoves.push({x,
                "y": additionMove});

        }

        showPossibleMoves(tabOfMoves);

    };
    getCoordinatesFromField = (field, fromParent) => {

        const coordinates = fromParent // If true, get if from parentNode
            ? {
                "x": Number(field.parentNode.classList[1].charAt(1)), // X position
                "y": Number(field.parentNode.classList[2].charAt(1)) // Y position
            }
            : // If false, get directly from field
        {
            x: Number(field.classList[1].charAt(1)), // X position
            y: Number(field.classList[2].charAt(1)) // Y position
        };


        return coordinates;

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