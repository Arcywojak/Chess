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
    getAllCounters,
    getArrayOfMoves,
    filterOvermoves,
    getCurrentPgn,
    getMoveFromOpenings,
    getCountersWithMoves;

import {isFieldTaken} from "./handleWithDOM.js";

import {openings} from "./openings/openings.js";

import {battleField, gameOptions} from "./variables.js";

import {canPawnAttack} from './findMoves.js';

import {addEnPassantIfPossible} from './specialMoves.js'

import { filterTabInCaseOfCheck } from "./LookForCheck.js";

import {convertPgnIntoMoves} from "./handlePGN.js"

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
    console.error("Something went wrong at getSomething.js, maybe you gave wrong the second parameter?")
}  

};

getPawnMoves = (team, x, y, copyOfBattleField) => {
    
    

    let numberOfPositionY = y,
        newPositionY,
        additionMoveY,
        isFirstMove,
        isBlocked,
        isAdditionBlocked,
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
    
    if(newPositionY >=0 && newPositionY <=7){
        isBlocked = isFieldTaken(
            copyOfBattleField,
            x,
            newPositionY
        );
    } else {
        isBlocked = true;
    }

    

    if (!isBlocked) {

        tabOfMoves.push(
            {
            x,
            "y": newPositionY
            }); // Check pos x, y+1/-1

        
        if(additionMoveY >=0 && additionMoveY <=7){
            isAdditionBlocked = isFieldTaken(
                copyOfBattleField,
                x,
                additionMoveY
            );
        } else {
            isAdditionBlocked = true;
        }
        

        if (isFirstMove) {

            if (!isAdditionBlocked) { // Check pos x, y+2/-2

                tabOfMoves.push({x,
                    "y": additionMoveY});

            }

        }

    }

    const enemy = getOppositeColour(team)

    const pawnAttackArray = canPawnAttack(enemy, x, y, copyOfBattleField)

    const enPassant = addEnPassantIfPossible(enemy, x, y, copyOfBattleField)

    tabOfMoves = [...tabOfMoves, ...pawnAttackArray, ...enPassant];

    tabOfMoves = filterOvermoves(tabOfMoves);

    return tabOfMoves;
}

getBishopMoves = (team, x, y, copyOfBattleField) => {

    let tabOfMoves = [];
        let takenField;


        for(let i = 1; (x+i <= 7 && y+i <=7); i++){
            takenField = isFieldTaken(copyOfBattleField, x+i, y+i);
            
            if(takenField){
                if(copyOfBattleField.fields[x+i][y+i].color !== team){
                    tabOfMoves.push({x:x+i, y:y+i})
                }

                break;
            }
            tabOfMoves.push({x:x+i, y:y+i});
        }

        for(let i = 1; (x+i <= 7 && y-i >=0); i++){
            takenField = isFieldTaken(copyOfBattleField ,x+i, y-i);

            if(takenField){
 
                if(copyOfBattleField.fields[x+i][y-i].color !== team){
                    tabOfMoves.push({x:x+i, y:y-i})
                }

                break;
            }
            tabOfMoves.push({x:x+i, y:y-i});
        }

        for(let i = 1; (x-i >=0 && y+i <=7); i++){
            takenField = isFieldTaken(copyOfBattleField,x-i, y+i);

            if(takenField){
                if(copyOfBattleField.fields[x-i][y+i].color !== team){

                    tabOfMoves.push({x:x-i, y:y+i})
                }

                break;
            }
            tabOfMoves.push({x:x-i, y:y+i});
        }

        for(let i = 1; (x-i >=0 && y-i >=0); i++){
            takenField = isFieldTaken(copyOfBattleField, x-i, y-i);

            if(takenField){
                if(copyOfBattleField.fields[x-i][y-i].color !== team){
                    tabOfMoves.push({x:x-i, y:y-i})
                }

                break;
            }
            tabOfMoves.push({x:x-i, y:y-i});
        }

        return tabOfMoves;
}

getKnightMoves = (team , x, y, copyOfBattleField) => {

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

        

       const filteredTab = filterOvermoves(tabOfMoves);

    const moreFilteredTab = [];

    for (let i = 0; i < filteredTab.length; i++) {

        const {x, y} = filteredTab[i];
        
        if(copyOfBattleField.fields[x][y].color !== team) {
            
            moreFilteredTab.push(filteredTab[i]);

        }

    }

        return moreFilteredTab;
}

getRookMoves = (team, x, y, copyOfBattleField) => {

    let tabOfMoves = [];
        let takenField;

    for(let i = 1; x+i<=7; i++){
        takenField = isFieldTaken(copyOfBattleField, x+i, y);

            if(takenField){
               
                if(copyOfBattleField.fields[x+i][y].color !== team){
                    tabOfMoves.push({x:x+i, y:y})
                }

                break;
            }
            tabOfMoves.push({x:x+i, y:y});

    }

    for(let i = 1; x-i>=0; i++){
        takenField = isFieldTaken(copyOfBattleField, x-i, y);

            if(takenField){
               
                if(copyOfBattleField.fields[x-i][y].color !== team){
                    tabOfMoves.push({x:x-i, y:y})
                }

                break;
            }
            tabOfMoves.push({x:x-i, y:y});

    }

    for(let i = 1; y-i>=0; i++){
        takenField = isFieldTaken(copyOfBattleField,x , y-i);

            if(takenField){

                if(copyOfBattleField.fields[x][y-i].color !== team){
                    tabOfMoves.push({x:x, y:y-i})
                }

                break;
            }
            tabOfMoves.push({x:x, y:y-i});

    }

    for(let i = 1; y+i<=7; i++){
        takenField = isFieldTaken(copyOfBattleField, x, y+i);

            if(takenField){
        
                if(copyOfBattleField.fields[x][y+i].color !== team){
                    tabOfMoves.push({x:x, y:y+i})
                }

                break;
            }
            tabOfMoves.push({x:x, y:y+i});
    }

    

    return tabOfMoves;
}

getQueenMoves = (team, x, y, copyOfBattleField) => {
    const rookPower = getRookMoves(team, x, y, copyOfBattleField);
    const bishopPower = getBishopMoves(team, x, y, copyOfBattleField);
    const queenMoves = rookPower.concat(bishopPower);

    return queenMoves;
}

getKingMoves = (team, x, y, copyOfBattleField) => {
 
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

    const enemyColour = getOppositeColour(team);

    const hostileKing = document.querySelector(`.${enemyColour}.king`);

    const hostileKingCoordintes = getCoordinatesFromField(hostileKing);

    


//REMOVE IMPOSSIBLE MOVES (ATTACKING FRIENDS AND APPROACHING THE ENEMY KING)
    for(let i=0; i < tabOfMoves.length; i++){

        const {x, y} = tabOfMoves[i];

        if(x>=0 && x<=7 && y>=0 && y<=7){      

            takenField = isFieldTaken(copyOfBattleField, x, y);

            if(
                Math.abs(hostileKingCoordintes.x - x)>1 ||
                Math.abs(hostileKingCoordintes.y - y)>1 
              ) {

                if(takenField){
            
                    if(copyOfBattleField.fields[x][y].color !== team){
                         
                            filteredTab.push({x:x, y:y})
                    }

                } else {
                    filteredTab.push({x:x, y:y});
                }
            }
        }  
    }
/******************************************************************* */
    



    return filteredTab;

    
};

getOppositeColour = (colour) => {
    if(colour === "white"){
        return "black"
    }

    return "white";
}

getAllCounters = (specificCounter, colour, withKing=true, copyOfBattleField) => {
    //WITH KING - We need this parameter because if we look for check, we don't need king (he can't do check)
    //            but if we want to know whether mate occured or not, we need king to see if he can escape

    let tabOfCounters = [];  
    
    if(specificCounter === null){

        for(let x=0; x<=7; x++){
            for(let y=0; y<=7; y++){
                if(copyOfBattleField.fields[x][y].color === colour){
                    if(copyOfBattleField.fields[x][y].typeOfCounter === "king" && !withKing){
                        continue;
                    }

                    tabOfCounters.push({
                    x : x,
                    y : y,
                    colour: copyOfBattleField.fields[x][y].color,
                    typeOfCounter: copyOfBattleField.fields[x][y].typeOfCounter
                    });
                }
            }
        }
    } else {

        for(let x=0; x<=7; x++){
            for(let y=0; y<=7; y++){
                if(copyOfBattleField.fields[x][y].color === colour &&
                   copyOfBattleField.fields[x][y].typeOfCounter === specificCounter){
                       
                       tabOfCounters.push({
                        x,
                        y,
                        colour: copyOfBattleField.fields[x][y].color,
                        typeOfCounter: copyOfBattleField.fields[x][y].typeOfCounter
                       })
                   }
            }
            
        }

    }
    

    return tabOfCounters;
}

getArrayOfMoves = (typeOfCounter, team, x, y, filterTab, copyOfBattleField) => {
 
    let tabOfMoves;

    switch(typeOfCounter){
        case 'pawn':

            tabOfMoves = getPawnMoves(team, x, y, copyOfBattleField);
            
            break;

        case 'knight':

            tabOfMoves = getKnightMoves(team, x, y, copyOfBattleField);

            break;

        case 'bishop':

            tabOfMoves = getBishopMoves(team, x, y, copyOfBattleField);

            break;

        case 'rook':

            tabOfMoves = getRookMoves(team, x, y, copyOfBattleField);

            break;

        case 'queen':
            
            tabOfMoves = getQueenMoves(team, x, y, copyOfBattleField);

            break;

        case 'king':
            
            tabOfMoves = getKingMoves(team, x, y, copyOfBattleField);

            break;

        default: throw new Error("You have probably given wrong name of counter");
    }

    if(filterTab){
        tabOfMoves = filterTabInCaseOfCheck(x, y, tabOfMoves, copyOfBattleField);
    }
    

    return tabOfMoves;
}

filterOvermoves = (tabOfMoves) => {
    const filteredTab = tabOfMoves.filter( move => {
        if(move.x <=7 && 
           move.x >=0 &&
           move.y <=7 && 
           move.y >=0 
           ) {
               return move;
           }
    })

    return filteredTab;
};

getMoveFromOpenings = () => {

    const pgnBlock = document.querySelector(".pgn-text");

    const currentPgn = pgnBlock.innerText;

    let matchingPgns = [];

    for(let i=0; i<openings.length; i++){

        if(openings[i].moves.length <= currentPgn.length) {
            continue;
        }

        let cutOpening = openings[i].moves.slice(0, currentPgn.length);

            //CUT OPENING MUST BE SHORTER BECAUSE WE NEED AT LEAST ONE MORE MOVE TO EXECUTE
        if(cutOpening.replace(/\s+/g, "") === currentPgn.replace(/\s+/g, "") ){

            matchingPgns.push(openings[i])  
        }
    }

    if(matchingPgns.length === 0){
        return null;
    }

    let randomOpening = Math.floor(Math.random() * matchingPgns.length);

        if (randomOpening === matchingPgns.length) {

            randomOpening--;

        }

       const randomOpeningMove = convertPgnIntoMoves(
                                    matchingPgns[randomOpening].moves,
                                    Math.round(gameOptions.numberOfMove*2)
                                );


       return randomOpeningMove;

        

}

getCountersWithMoves = (color, copyOfBattleField) => {
    
    const allCounters = getAllCounters(
        null,
        gameOptions.activeColour,
        true,
        copyOfBattleField
    ),

    
    countersWithMoves = [];

    

    let coordinates, moves;

for (let i = 0; i < allCounters.length; i++) {

    coordinates = {"x": allCounters[i].x,
        "y": allCounters[i].y};

    moves = getArrayOfMoves(
        allCounters[i].typeOfCounter,
        allCounters[i].colour,
        allCounters[i].x,
        allCounters[i].y,
        true,
        copyOfBattleField
    );

    countersWithMoves.push({
        coordinates,
        type: allCounters[i].typeOfCounter,
        moves
    });

    }
    

    const filteredTab = countersWithMoves.filter((tab) => tab.moves.length > 0);

    return filteredTab;
}