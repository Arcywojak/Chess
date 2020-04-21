
/** ***********  FUNCTIONS  ************//*

//initCounters:
//@4 params:
   -team (expect to be 'white' or 'black')
   -

*//** ************************************/


const innerBoard = document.querySelector(".board-inner"),

    imagesOfCounter = {
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
    },

    whitePlayer = {
        "team": "white",
        "counters": {
            "pawn": [],
            "knight": [],
            "bishop": [],
            "rook": [],
            "queen": [],
            "king": []
        }
    },
    blackPlayer = {
        "team": "black",
        "counters": {
            "pawn": [],
            "knight": [],
            "bishop": [],
            "rook": [],
            "queen": [],
            "king": []
        }
    };


export const initPositionOfCounters = (team, counterName) => {

    let player;

    if (team === "white") {

        player = whitePlayer;

    } else if (team === "black") {

        player = blackPlayer;

    }

    const quantityOfCounters = player.counters[counterName].length,

        counterArray = player.counters[counterName];

    for (let i = 0; i < quantityOfCounters; i++) {

        const div = document.createElement("div");

        div.classList.add(
            `${team}`,
            `${counterName}`,
            `nr${i}`
        );

        const imageOfCounter = document.createElement("img");

        imageOfCounter.src = imagesOfCounter[team][counterName];

        div.appendChild(imageOfCounter);

        div.style.webkitTransform = `translate(${counterArray[i].position.x}px, ${counterArray[i].position.y}px)`;
        div.style.MozTransform = `translate(${counterArray[i].position.x}px, ${counterArray[i].position.y}px)`;
        div.style.msTransform = `translate(${counterArray[i].position.x}px, ${counterArray[i].position.y}px)`;
        div.style.OTransform = `translate(${counterArray[i].position.x}px, ${counterArray[i].position.y}px)`;
        div.style.transform = `translate(${counterArray[i].position.x}px, ${counterArray[i].position.y}px)`;

        innerBoard.appendChild(div);

    }

};

export const initCounters = (team = "", typeOfCounter = "", numberOfCounters = null, position = 0) => {

    let player;

    if (team === "white") {

        player = whitePlayer;

    } else if (team === "black") {

        player = blackPlayer;

    }

    const playerTypeOfCounter = player.counters[typeOfCounter];

    for (let i = 0; i < numberOfCounters; i++) {

        const counter = {
            team,
            "position": {
                "x": position[i].x * 78.5,
                "y": position[i].y * 78.5
            }
        };

        playerTypeOfCounter[i] = counter;

    }

    initPositionOfCounters(
        team,
        typeOfCounter
    );


};