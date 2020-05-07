export const COLOR_CLASS = 3;
export const TYPE_OF_COUNTER_CLASS = 4

export const gameOptions = {
    activeColour: "white",
    oppositeColour: "black",
    didGameEnd:false,
    winner:null
}

export const changeColourOfActivePlayer = () => {
    if(gameOptions.activeColour === "white"){
        gameOptions.activeColour = "black";
        gameOptions.oppositeColour = "white";
    } else {
        gameOptions.activeColour = "white"
        gameOptions.oppositeColour = "black";
    }

    updatePlayerToMove();
}


export const updatePlayerToMove = () => {
    let field = document.querySelector('.game-info-h2');

    field.innerText = `${gameOptions.activeColour} move`;
}

export const showWinner = () => {
    let field = document.querySelector('.game-info-h2');

    field.innerText = `checkmate, ${gameOptions.oppositeColour} won`;
}

export    const battleField = {
    fields: []
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






