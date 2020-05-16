import {fillFieldsInCounters, initPositionOfCounters_DOM, setEmptyBattleField} from "./initFunctions.js";
import {battleField} from "./variables.js";
import {setOptionsForCastling} from "./specialMoves.js";


/** ******* INITIALIZE COUNTERS *********/


setEmptyBattleField();

fillFieldsInCounters(
    "white",
    "pawn",
    8,
    [
        {"x": 0,
            "y": 6},
        {"x": 1,
            "y": 6},
        {"x": 2,
            "y": 6},
        {"x": 3,
            "y": 6},
        {"x": 4,
            "y": 6},
        {"x": 5,
            "y": 6},
        {"x": 6,
            "y": 6},
        {"x": 7,
            "y": 6}
    ]
);

fillFieldsInCounters(
    "black",
    "pawn",
    8,
    [
        {"x": 0,
            "y": 1},
        {"x": 1,
            "y": 1},
        {"x": 2,
            "y": 1},
        {"x": 3,
            "y": 1},
        {"x": 4,
            "y": 1},
        {"x": 5,
            "y": 1},
        {"x": 6,
            "y": 1},
        {"x": 7,
            "y": 1}
    ]
);

/** **************************************/

/** ******* INITIALIZE KNIGHTS ***********/
fillFieldsInCounters(
    "white",
    "knight",
    2,
    [
        {"x": 1,
            "y": 7},
        {"x": 6,
            "y": 7}
    ]
);

fillFieldsInCounters(
    "black",
    "knight",
    2,
    [
        {"x": 1,
            "y": 0},
        {"x": 6,
            "y": 0}
    ]
);

/** ***************************************/

/** ******** INITIALIZE BISHOPS ***********/
fillFieldsInCounters(
    "white",
    "bishop",
    2,
    [
        {"x": 2,
            "y": 7},
        {"x": 5,
            "y": 7}
    ]
);

fillFieldsInCounters(
    "black",
    "bishop",
    2,
    [
        {"x": 2,
            "y": 0},
        {"x": 5,
            "y": 0}
    ]
);

/** ***************************************/

/** ******** INITIALIZE ROOKS ***********/
fillFieldsInCounters(
    "white",
    "rook",
    2,
    [
        {"x": 0,
            "y": 7},
        {"x": 7,
            "y": 7}
    ]
);

fillFieldsInCounters(
    "black",
    "rook",
    2,
    [
        {"x": 0,
            "y": 0},
        {"x": 7,
            "y": 0}
    ]
);

/** ***************************************/

/** ******** INITIALIZE QUEENS ***********/
fillFieldsInCounters(
    "white",
    "queen",
    1,
    [
        {"x": 3,
            "y": 7}
    ]
);

fillFieldsInCounters(
    "black",
    "queen",
    1,
    [
        {"x": 3,
            "y": 0}
    ]
);

/** ****************************************/

/** ******** INITIALIZE KINGS ***********/
fillFieldsInCounters(
    "white",
    "king",
    1,
    [
        {"x": 4,
            "y": 7}
    ]
);

fillFieldsInCounters(
    "black",
    "king",
    1,
    [
        {"x": 4,
            "y": 0}
    ]
);

/** ****************************************/

initPositionOfCounters_DOM();

setOptionsForCastling();