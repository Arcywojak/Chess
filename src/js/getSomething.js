export let getActiveCoordinates,
    getActiveField,
    getCoordinatesFromField,
    getFieldFromCoordinates,
    getPawnMoves,
    getBishopMoves,
    getRookMoves,
    getKnightMoves,
    getKingMoves,
    getQueenMoves,
    getOppositeColour,
    getAllCountersExceptKing;

    import {
        isFieldTaken,
        removeActivePosition,
        removePossibleMoves,
        showActivePosition,
        showPossibleMoves} from "./handleWithDOM.js";
import { COLOR_CLASS, battleField } from "./variables.js";

getFieldFromCoordinates = (x, y) => {

    if(typeof(x) !== 'number' || typeof(y) !== 'number'){
        throw new Error(`Something is wrong with parameters: x:${x}, y:${y}`)
    }

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
    try {

    const coordinates = fromParent // If true, get it from parentNode
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

}    catch {
    throw new Error("Something went wrong at getSomething.js, maybe you gave wrong the second parameter?")
}  

};

getPawnMoves = (team, x, y) => {

    let numberOfPositionY = y,
        newPositionY,
        additionMoveY,
        isFirstMove,
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

        tabOfMoves.push(
            {
            x,
            "y": newPositionY
            }); // Check pos x, y+1/-1

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

    let tabOfMoves = [];
        let takenField;


        for(let i = 1; (x+i <= 7 && y+i <=7); i++){
            takenField = isFieldTaken(x+i, y+i);
            
            if(takenField){
                if(battleField.fields[x+i][y+i].color !== team){
                    tabOfMoves.push({x:x+i, y:y+i})
                }

                break;
            }
            tabOfMoves.push({x:x+i, y:y+i});
        }

        for(let i = 1; (x+i <= 7 && y-i >=0); i++){
            takenField = isFieldTaken(x+i, y-i);

            if(takenField){
 
                if(battleField.fields[x+i][y-i].color !== team){
                    tabOfMoves.push({x:x+i, y:y-i})
                }

                break;
            }
            tabOfMoves.push({x:x+i, y:y-i});
        }

        for(let i = 1; (x-i >=0 && y+i <=7); i++){
            takenField = isFieldTaken(x-i, y+i);

            if(takenField){
                if(battleField.fields[x-i][y+i].color !== team){

                    tabOfMoves.push({x:x-i, y:y+i})
                }

                break;
            }
            tabOfMoves.push({x:x-i, y:y+i});
        }

        for(let i = 1; (x-i >=0 && y-i >=0); i++){
            takenField = isFieldTaken(x-i, y-i);

            if(takenField){
                if(battleField.fields[x-i][y-i].color !== team){
                    tabOfMoves.push({x:x-i, y:y-i})
                }

                break;
            }
            tabOfMoves.push({x:x-i, y:y-i});
        }

        return tabOfMoves;
}

getKnightMoves = (team , x, y) => {

        const tabOfMoves = [
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

            if ( (move.x >= 0 && move.x <= 7) && (move.y >= 0 && move.y <= 7) ) {

                return move;

            }

        });

    const moreFilteredTab = [];

    for (let i = 0; i < filteredTab.length; i++) {

        const {x, y} = filteredTab[i];
        
        if(battleField.fields[x][y].color !== team) {
            
            moreFilteredTab.push(filteredTab[i]);

        }

    }

        return moreFilteredTab;
}

getRookMoves = (team, x, y) => {

    let tabOfMoves = [];
        let takenField;

    for(let i = 1; x+i<=7; i++){
        takenField = isFieldTaken(x+i, y);

            if(takenField){
               
                if(battleField.fields[x+i][y].color !== team){
                    tabOfMoves.push({x:x+i, y:y})
                }

                break;
            }
            tabOfMoves.push({x:x+i, y:y});

    }

    for(let i = 1; x-i>=0; i++){
        takenField = isFieldTaken(x-i, y);

            if(takenField){
               
                if(battleField.fields[x-i][y].color !== team){
                    tabOfMoves.push({x:x-i, y:y})
                }

                break;
            }
            tabOfMoves.push({x:x-i, y:y});

    }

    for(let i = 1; y-i>=0; i++){
        takenField = isFieldTaken(x, y-i);

            if(takenField){

                if(battleField.fields[x][y-i].color !== team){
                    tabOfMoves.push({x:x, y:y-i})
                }

                break;
            }
            tabOfMoves.push({x:x, y:y-i});

    }

    for(let i = 1; y+i<=7; i++){
        takenField = isFieldTaken(x, y+i);

            if(takenField){
        
                if(battleField.fields[x][y+i].color !== team){
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
 
    let takenField;
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
            
                    if(battleField.fields[x][y].color !== team){
                        filteredTab.push({x:x, y:y})
                    }

                } else {
                    filteredTab.push({x:x, y:y});
                }
        }  
    }

    return filteredTab;

    
};

getOppositeColour = (colour) => {
    if(colour === "white"){
        return "black"
    }

    return "white";
}

getAllCountersExceptKing = (colour) => {
    let tabOfCounters = [];

    

    for(let x=0; x<=7; x++){
        for(let y=0; y<=7; y++){
            if(battleField.fields[x][y].color === colour && battleField.fields[x][y].typeOfCounter !== "king"){
                tabOfCounters.push({
                   x : x,
                   y : y,
                   colour: battleField.fields[x][y].color,
                   typeOfCounter: battleField.fields[x][y].typeOfCounter
                });
            }
        }
    }

    return tabOfCounters;
}