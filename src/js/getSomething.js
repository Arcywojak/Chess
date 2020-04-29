export let getActiveCoordinates,
    getActiveField,
    getCoordinatesFromField,
    getFieldFromCoordinates,
    getPawnMoves,
    getBishopMoves,
    getRookMoves,
    getKnightMoves,
    getKingMoves,
    getQueenMoves;

    import {
        findPossibleMoves,
        isFieldTaken,
        removeActivePosition,
        removePossibleMoves,
        showActivePosition,
        showPossibleMoves} from "./showMoves.js";

getFieldFromCoordinates = (x, y) => {

    const field = document.querySelector(`.x${x}.y${y}`);

    return field;

};

getActiveField = (parent) => {

    const active = document.querySelector(".active");

    if (active !== null) {

        if (parent === true) {

            return active.parentNode;

        }

        return active;


    }

    return null;

};

getActiveCoordinates = () => {

    const activeCounter = getActiveField(true),

        coordinates = {
            "x": Number(activeCounter.classList[1].charAt(1)), // X position
            "y": Number(activeCounter.classList[2].charAt(1)) // Y position
        };

    return coordinates;


};

getCoordinatesFromField = (field, fromParent) => {

    const coordinates = fromParent // If true, get if from parentNode
        ? {
            "x": Number(field.parentNode.classList[1].charAt(1)), // X position
            "y": Number(field.parentNode.classList[2].charAt(1)) // Y position
        }
        : // If false, get directly from field
    {
        "x": Number(field.classList[1].charAt(1)), // X position
        "y": Number(field.classList[2].charAt(1)) // Y position
    };


    return coordinates;

};

getPawnMoves = (team, x, y) => {
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

    const isBlocked = isFieldTaken(
        x,
        newPositionY
    );

    if (!isBlocked) {

        tabOfMoves.push({x,
            "y": newPositionY}); // Check pos x, y+1/-1

        const isAdditionBlocked = isFieldTaken(
            x,
            additionMoveY
        );

        if (isFirstMove) {

            if (!isAdditionBlocked) { // Check pos x, y+2/-2

                tabOfMoves.push({x,
                    "y": additionMoveY});

            }

        }

    }

    return tabOfMoves;
}

getBishopMoves = (team, x, y) => {
    const enemy = team === "white" ? "black" : "white";
    let tabOfMoves = [];
        let takenField;
        let field;

        for(let i = 1; (x+i <= 7 && y+i <=7); i++){
            takenField = isFieldTaken(x+i, y+i);

            if(takenField){
                field = getFieldFromCoordinates(x+i, y+1);
                if(field.classList[3] === enemy){
                    tabOfMoves.push({x:x+i, y:y+i})
                }

                break;
            }
            tabOfMoves.push({x:x+i, y:y+i});
        }

        for(let i = 1; (x+i <= 7 && y-i >=0); i++){
            takenField = isFieldTaken(x+i, y-i);

            if(takenField){
                field = getFieldFromCoordinates(x+i, y-i);
                if(field.classList[3] === enemy){
                    tabOfMoves.push({x:x+i, y:y-i})
                }

                break;
            }
            tabOfMoves.push({x:x+i, y:y-i});
        }

        for(let i = 1; (x-i >=0 && y+i <=7); i++){
            takenField = isFieldTaken(x-i, y+i);

            if(takenField){
                field = getFieldFromCoordinates(x-i, y+i);
                if(field.classList[3] === enemy){
                    tabOfMoves.push({x:x-i, y:y+i})
                }

                break;
            }
            tabOfMoves.push({x:x-i, y:y+i});
        }

        for(let i = 1; (x-i >=0 && y-i >=0); i++){
            takenField = isFieldTaken(x-i, y-i);

            if(takenField){
                field = getFieldFromCoordinates(x-i, y-i);
                if(field.classList[3] === enemy){
                    tabOfMoves.push({x:x-i, y:y-i})
                }

                break;
            }
            tabOfMoves.push({x:x-i, y:y-i});
        }

        return tabOfMoves;
}

getKnightMoves = (team , x, y) => {
    const enemy = team === "white" ? "black" : "white",
        tabOfMoves = [
            {
                "x": x + 1,
                "y": y + 2
            },
            {
                "x": x + 1,
                "y": y - 2
            },
            {
                "x": x - 1,
                "y": y - 2
            },
            {
                "x": x - 1,
                "y": y + 2
            },
            {
                "x": x + 2,
                "y": y + 1
            },
            {
                "x": x + 2,
                "y": y - 1
            },
            {
                "x": x - 2,
                "y": y + 1
            },
            {
                "x": x - 2,
                "y": y - 1
            }
        ];

       const filteredTab = tabOfMoves.filter((move) => {

            if (move.x >= 0 && move.x <= 7 && (move.y >= 0 && move.y <= 7)) {

                return move;

            }

        });

    const moreFilteredTab = [];

    for (let i = 0; i < filteredTab.length; i++) {

        const {x, y} = filteredTab[i],

            field = getFieldFromCoordinates(
                x,
                y
            );

        if (!(field.classList[3] === team)) {

            moreFilteredTab.push(filteredTab[i]);

        }

    }

        return moreFilteredTab;
}

getRookMoves = (team, x, y) => {
    const enemy = team === "white" ? "black" : "white";
    let tabOfMoves = [];
        let takenField;
        let field;

    for(let i = 1; x+i<=7; i++){
        takenField = isFieldTaken(x+i, y);

            if(takenField){
                field = getFieldFromCoordinates(x+i, y);
                if(field.classList[3] === enemy){
                    tabOfMoves.push({x:x+i, y:y})
                }

                break;
            }
            tabOfMoves.push({x:x+i, y:y});

    }

    for(let i = 1; x-i>=0; i++){
        takenField = isFieldTaken(x-i, y);

            if(takenField){
                field = getFieldFromCoordinates(x-i, y);
                if(field.classList[3] === enemy){
                    tabOfMoves.push({x:x-i, y:y})
                }

                break;
            }
            tabOfMoves.push({x:x-i, y:y});

    }

    for(let i = 1; y-i>=0; i++){
        takenField = isFieldTaken(x, y-i);

            if(takenField){
                field = getFieldFromCoordinates(x, y-i);
                if(field.classList[3] === enemy){
                    tabOfMoves.push({x:x, y:y-i})
                }

                break;
            }
            tabOfMoves.push({x:x, y:y-i});

    }

    for(let i = 1; y+i<=7; i++){
        takenField = isFieldTaken(x, y+i);

            if(takenField){
                field = getFieldFromCoordinates(x, y+i);
                if(field.classList[3] === enemy){
                    tabOfMoves.push({x:x, y:y+i})
                }

                break;
            }
            tabOfMoves.push({x:x, y:y+i});
    }

    

    return tabOfMoves;
}

getQueenMoves = (team, x, y) => {
    const rookPower = getRookMoves(team, x, y);
    const bishopPower = getBishopMoves(team, x, y);
    const queenMoves = rookPower.concat(bishopPower);

    return queenMoves;
}

getKingMoves = (team, x, y) => {
    const enemy = team === "white" ? "black" : "white";
    let takenField;
    let field;
    let filteredTab = [];

    let tabOfMoves = [
        {
            x:x,
            y:y-1
        },
        {
            x:x,
            y:y+1
        },
        {
            x:x-1,
            y:y
        },
        {
            x:x+1,
            y:y
        },
        {
            x:x-1,
            y:y-1
        },
        {
            x:x+1,
            y:y+1
        },
        {
            x:x-1,
            y:y+1
        },
        {
            x:x+1,
            y:y-1
        },
    ];

    for(let i=0; i < tabOfMoves.length; i++){

        const {x, y} = tabOfMoves[i];

        if(x>=0 && x<=7 && y>=0 && y<=7){      

            takenField = isFieldTaken(x, y);
                if(takenField){
                    field = getFieldFromCoordinates(x, y);
                    if(field.classList[3] === enemy){
                        filteredTab.push({x:x, y:y})
                    }

                } else {
                    filteredTab.push({x:x, y:y});
                }
        }  
    }

    return filteredTab;

    
}