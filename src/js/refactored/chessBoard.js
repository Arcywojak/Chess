

class ChessBoard {


    constructor(board, clickable=true, draggable=true, gameMode="h"){

        this.board = board;
        this.clickable = clickable;
        this.draggable = draggable;

        this.imagesOfPieces = {
            "P": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wp.png",
            "N": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wn.png",
            "B": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wb.png",
            "R": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wr.png",
            "Q": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wq.png",
            "K": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/wk.png",
            "p": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/bp.png",
            "n": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/bn.png",
            "b": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/bb.png",
            "r": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/br.png",
            "q": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/bq.png",
            "k": "http://images.chesscomfiles.com/chess-themes/pieces/neo/80/bk.png"
        }
        this.gameMode = gameMode;
    }

    setBoard(FEN){

        this.setEmptyBoard();
        this.fillBoardInPieces(FEN);
    }

    setEmptyBoard(){

        this.board.style.position = "relative";

        let valueOfTransformY,
            valueOfTransformX,
            field;

        for(let rank=0; rank<=7; rank++){
            valueOfTransformY = 100 * rank;

            for(let column=0; column<=7; column++){
                valueOfTransformX = 100 * column;

                field = document.createElement("div");

                field.style.width = "12.5%";
                field.style.height = "12.5%";
                field.style.position = "absolute";
                field.style.webkitTransform = `translate(${column * 100}%, ${rank * 100}%)`;
                field.style.MozTransform = `translate(${column * 100}%, ${rank * 100}%)`;
                field.style.msTransform = `translate(${column * 100}%, ${rank * 100}%)`;
                field.style.OTransform = `translate(${column * 100}%, ${rank * 100}%)`;
                field.style.transform = `translate(${column * 100}%, ${rank * 100}%)`;

                field.classList.add(
                "field",
                `rank${rank}`,
                `column${column}`
                    );

                this.board.appendChild(field);

            }

        }
    }

    fillBoardInPieces(FEN){

        const fen = FEN || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

        const piecesFenFlag = fen.split(" ")[0];

        const ranks = piecesFenFlag.split("/");

        const fields = this.board.querySelectorAll(".field")

        let incrementNumber = 0;
       

        for(let rank=0; rank<ranks.length; rank++){

            const rankAsString = ranks[rank]
          
            for(let rankNumber = 0; rankNumber<rankAsString.length; rankNumber++){
           
                //if character is not a number, it mean it is a letter of a piece

                if( isNaN(Number(rankAsString[rankNumber])) ){
                    let img = document.createElement("img");

                    img.src = this.imagesOfPieces[ rankAsString[rankNumber] ];

                    img.style.cursor = "pointer";
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.id = ( this.getPieceColour(rankAsString[rankNumber]) )

                    fields[ rank*7 + rankNumber + rank + incrementNumber].appendChild(img);
                    fields[ rank*7 + rankNumber + rank + incrementNumber].id =  rankAsString[rankNumber] 

                } else { // if we reach number, we must skip fields
                    incrementNumber += Number(rankAsString[rankNumber] - 1);
                }
            }

            incrementNumber = 0;
        }

    }

    changePositionOfPiece(from, to){

        const originField = this.board.querySelector(`.field.rank${from.rank}.column${from.column}`);
        const originId = originField.id;
        const destinationField = this.board.querySelector(`.field.rank${to.rank}.column${to.column}`);

        const imgOfOldPosition = originField.childNodes[0];

        originField.removeAttribute("id");
        originField.removeChild(imgOfOldPosition);
        destinationField.id = originId;


        if( 
            (imgOfOldPosition.src === this.imagesOfPieces["p"] && to.rank === 8) ||
            (imgOfOldPosition.src === this.imagesOfPieces["P"] && to.rank === 0)
        ) {
            //situation when pawn promoted

            this.showPromotionBlock(to.rank, to.column);
        }

        if(destinationField.childNodes.length > 0){
            //If destination field was taken, we only replace images

            destinationField.childNodes[0].src = imgOfOldPosition.src
        } else {

            destinationField.appendChild(imgOfOldPosition)

        }
    }

    markFieldsAsLastMove(from, to){

        const fromField = this.board.querySelector(`.field.rank${from.rank}.column${from.column}`)
        const toField = this.board.querySelector(`.field.rank${to.rank}.column${to.column}`)

        fromField.classList.add("last-move");
        toField.classList.add("last-move");
    }

    removeLastMoveFields(){

        if(this.board.querySelectorAll(".field.last-move")){
            const fields = this.board.querySelectorAll(".field.last-move");

            fields.forEach(field => {
                field.classList.remove("last-move");
            })
        }
    }

    showActiveField(field, arrayOfFields){

        if(this.activeField !== field){
            this.removeActiveField();

            field.classList.add("active");
            this.showFieldToMove(arrayOfFields);
        } else {
            this.removeActiveField();
        }
    }

    removeActiveField(){

        

        if(this.board.querySelector(".field.active")){

            const field = this.board.querySelector(".field.active");
            field.classList.remove("active");

            this.removeFieldsToMove();
        }

        
    }

    removeFieldsToMove(){
            const fields = document.querySelectorAll(".to-move");

            fields.forEach(field => {
                field.classList.remove("to-move");
            })
    }

    showFieldToMove(arrayOfFields){

            let field;

        for (let i = 0; i < arrayOfFields.length; i++) {

            field = this.board.querySelector(`.rank${arrayOfFields[i].rank}.column${arrayOfFields[i].column}`);
            field.classList.add("to-move");
        }
    }


    showPromotionBlock(){

    }

    getPieceColour(piece){
        switch(piece){
            case "P":
            case "N":
            case "B":
            case "R":
            case "Q":
            case "K":
                return "w";
            case "p":
            case "n":
            case "b":
            case "r":
            case "q":
            case "k":
                return "b";

            default: return;
        }
    }

    getCoordinatesFromActiveField(){
        const field = this.board.querySelector(".field.active");

        if(field){
            const coordinates = {
                rank: Number(field.classList[1].slice(-1) ),
                column: Number(field.classList[2].slice(-1) )
            }

            return coordinates;
        }
    }
}

export default ChessBoard;