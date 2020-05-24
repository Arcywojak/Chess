
export let changeColourOfActivePlayer,
    showWinner,
    switchTeams,
    updatePlayerToMove;

export const COLOR_CLASS = 3;
export const TYPE_OF_COUNTER_CLASS = 4;

export const board = document.querySelector(".board");

export const gameOptions = {
    "reverseBoard": 0,
    "numberOfMove": 0,
    "activeColour": "white",
    "oppositeColour": "black",
    "didGameEnd": false,
    "winner": null,
    "lastMove": {
        "from": {
            "x": null,
            "y": null
        },
        "to": {
            "x": null,
            "y": null
        },
        "whoMoved": {
            "typeOfCounter": null,
            "colour": null
        }
    }
};

export const nameOfFieldsX = {
    "0": "a",
    "1": "b",
    "2": "c",
    "3": "d",
    "4": "e",
    "5": "f",
    "6": "g",
    "7": "h"
};

export const nameOfFieldsY = { // I know that is strange
    "0": 8,
    "1": 7,
    "2": 6,
    "3": 5,
    "4": 4,
    "5": 3,
    "6": 2,
    "7": 1
};

export const charOfCounter = {
    "pawn": "",
    "knight": "N",
    "bishop": "B",
    "rook": "R",
    "queen": "Q",
    "king": "K"
};

const reverseArray = (array) => {
    return array.slice().reverse();
};

export const pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

export const pawnEvalBlack = reverseArray(pawnEvalWhite);

export const knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

export const bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

export const bishopEvalBlack = reverseArray(bishopEvalWhite);

export const rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

export const rookEvalBlack = reverseArray(rookEvalWhite);

export const evalQueen =
    [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

export const kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

export const kingEvalBlack = reverseArray(kingEvalWhite);


updatePlayerToMove = () => {

    const field = document.querySelector(".game-info-h2");

    field.innerText = `${gameOptions.activeColour} move`;

};

changeColourOfActivePlayer = () => {

    if (gameOptions.activeColour === "white") {

        gameOptions.activeColour = "black";
        gameOptions.oppositeColour = "white";

    } else {

        gameOptions.activeColour = "white";
        gameOptions.oppositeColour = "black";

    }

    updatePlayerToMove();

};


showWinner = () => {

    const field = document.querySelector(".game-info-h2");

    field.innerText = `checkmate, ${gameOptions.oppositeColour} won`;

};

export const battleField = {
    "fields": []
};

export const imagesOfCounter = {
    "white": {
        "pawn": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wp.png",
        "knight": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wn.png",
        "bishop": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wb.png",
        "rook": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wr.png",
        "queen": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wq.png",
        "king": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wk.png"
    },
    "black": {
        "pawn": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/bp.png",
        "knight": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/bn.png",
        "bishop": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/bb.png",
        "rook": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/br.png",
        "queen": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/bq.png",
        "king": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/bk.png"
    }
};

export const activeCounterPosition = {
    "x": null,
    "y": null
};

switchTeams = (switchOrNot = true) => {

    if (switchOrNot) {

        if (gameOptions.reverseBoard === 0) {

            gameOptions.reverseBoard = 180;

        } else {

            gameOptions.reverseBoard = 0;

        }

        //   TurnAroundAllCounters();

    }

    if (gameOptions.reverseBoard === 180) {

        board.classList.add("reverse");

    } else {

        board.classList.remove("reverse");

    }

};