import {initCounters} from "./initFunctions.js";

/** ******* INITIALIZE COUNTERS *********/
initCounters(
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

initCounters(
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
initCounters(
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

initCounters(
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
initCounters(
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

initCounters(
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
initCounters(
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

initCounters(
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
initCounters(
    "white",
    "queen",
    1,
    [
        {"x": 3,
            "y": 7}
    ]
);

initCounters(
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
initCounters(
    "white",
    "king",
    1,
    [
        {"x": 4,
            "y": 7}
    ]
);

initCounters(
    "black",
    "king",
    1,
    [
        {"x": 4,
            "y": 0}
    ]
);

/** ****************************************/