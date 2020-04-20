
const innerBoard = document.querySelector(".board-inner"),

    allPawns1 = [], // Bottom side of the board
    allPawns2 = [], // Top side of the board

    row = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
    ],
    column = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
    ],

    initializePawns = () => {

        for (let numberOfPawn = 0; numberOfPawn < 8; numberOfPawn++) {

            const pawn1 = {
                    "move": {
                        "x": 0,
                        "y": 1
                    },
                    "position": { // 78.5px is the basic move
                        "x": 78.5 * column[numberOfPawn],
                        "y": 78.5 * row[6]
                    }
                },

                pawn2 = {
                    "move": {
                        "x": 0,
                        "y": 1
                    },
                    "position": { // 78.5px is the basic move
                        "x": 78.5 * numberOfPawn,
                        "y": 78.5 * row[1]
                    }
                };

            allPawns1.push(pawn1);
            allPawns2.push(pawn2);

        }

    },


    whitePawns = allPawns1,
    blackPawns = allPawns2,

    updatePositionOfPawns = () => {

        console.log("A");
        whitePawns.map((pawn, index) => {

            const pawnDiv = document.createElement("div");

            pawnDiv.classList.add(
                "white",
                "pawn"
            );

            image = document.createElement("img");

            image.src = "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wp.png";


            pawnDiv.appendChild(image);

            pawnDiv.style.webkitTransform = `translate(${pawn.position.x}px, ${pawn.position.y}px)`;
            pawnDiv.style.MozTransform = `translate(${pawn.position.x}px, ${pawn.position.y}px)`;
            pawnDiv.style.msTransform = `translate(${pawn.position.x}px, ${pawn.position.y}px)`;
            pawnDiv.style.OTransform = `translate(${pawn.position.x}px, ${pawn.position.y}px)`;
            pawnDiv.style.transform = `translate(${pawn.position.x}px, ${pawn.position.y}px)`;

            console.log(pawnDiv);

            innerBoard.appendChild(pawnDiv);

        });

    };

initializePawns();
updatePositionOfPawns();