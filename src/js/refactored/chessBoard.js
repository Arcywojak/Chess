

class ChessBoard {


    constructor(board, promotionBlock, endMessageBlock, clickable=true, draggable=true, gameMode="h"){

        this.board = board;
        this.promotionBlock = promotionBlock;
        this.endMessageBlock = endMessageBlock
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
                field.style.webkitTransform = `translate(${column * 100}%, ${rank * 100}%) rotate(0)`;
                field.style.MozTransform = `translate(${column * 100}%, ${rank * 100}%) rotate(0)`;
                field.style.msTransform = `translate(${column * 100}%, ${rank * 100}%) rotate(0)`;
                field.style.OTransform = `translate(${column * 100}%, ${rank * 100}%) rotate(0)`;
                field.style.transform = `translate(${column * 100}%, ${rank * 100}%) rotate(0)`;

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

                const numberOfField = rank*7 + rankNumber + rank + incrementNumber
           
                //if character is not a number, it mean it is a letter of a piece

              //  console.log(rank*7, rankNumber, rank, incrementNumber)

                if( 
                    isNaN(Number(rankAsString[rankNumber])) ){

                    if(!(fields[numberOfField].id)){

                        let img = document.createElement("img");

                        img.src = this.imagesOfPieces[ rankAsString[rankNumber] ];

                        img.style.cursor = "pointer";
                        img.style.width = "100%";
                        img.style.height = "100%";
                        img.id =  this.getPieceColour(rankAsString[rankNumber]) 

                        fields[numberOfField].appendChild(img);
                        fields[numberOfField].id =  rankAsString[rankNumber] 
                    } else {

                        let img = fields[numberOfField].childNodes[0];
                        
                        if(img.src !== this.imagesOfPieces[ rankAsString[rankNumber] ]){
                            img.src = this.imagesOfPieces[ rankAsString[rankNumber] ];

                            img.id = this.getPieceColour(rankAsString[rankNumber]);
                            fields[numberOfField].id = rankAsString[rankNumber]
                        }
                    }

                } else { // if we reach number, we must skip fields

                    for(let i=0; i < Number(rankAsString[rankNumber] ); i++){
                        if(fields[ numberOfField + i].id){
                            const img = fields[ numberOfField + i].childNodes[0];
                            fields[ numberOfField + i].removeChild(img);
                            fields[ numberOfField + i].removeAttribute("id");
                        }
                    }

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

 /*   updateBoard(FEN){
        const firstFenFlag = FEN.split(" ")[0];

        const ranks = firstFenFlag.split("/");

        const fields = this.board.querySelectorAll(".field");

        for(let rank = 0; rank < ranks.length; rank++){
            for(let column = 0; column < ranks[rank].length; column ++){
                const character = ranks[rank][column];

                if(isNaN(Number(character))){
                    if(fields[rank*7 + column + rank + incrementNumber])

                }
            }
        }
    }*/

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

    markFieldAsEndangered(coordinates){
        const field = this.board.querySelector(`.field.rank${coordinates.rank}.column${coordinates.column}`)

        field.classList.add("danger")
    }

    removeEndangeredField(){

        if(document.querySelector(".field.danger")){
            const field = document.querySelector(".field.danger");

            field.classList.remove("danger")
        }
        
    }

    showPromotionBlock(rank, column, color){
        const promotionOverlay = document.querySelector(".promotion-overlay");

        const promotionImages = this.promotionBlock.querySelectorAll("img");

        if(color === "w"){
            promotionImages[0].src = this.imagesOfPieces["Q"];
            promotionImages[0].id = "Q"
            promotionImages[1].src = this.imagesOfPieces["R"];
            promotionImages[1].id = "R"
            promotionImages[2].src = this.imagesOfPieces["B"];
            promotionImages[2].id = "B"
            promotionImages[3].src = this.imagesOfPieces["N"];
            promotionImages[3].id = "N"
        } else {
            promotionImages[0].src = this.imagesOfPieces["q"];
            promotionImages[0].id = "q"
            promotionImages[1].src = this.imagesOfPieces["r"];
            promotionImages[1].id = "r"
            promotionImages[2].src = this.imagesOfPieces["b"];
            promotionImages[2].id = "b"
            promotionImages[3].src = this.imagesOfPieces["n"];
            promotionImages[3].id = "n" 
        }

        if(rank === 0){

            this.promotionBlock.style.transform = `translate(${column * 100}%)`

        } else if(rank === 7){
           
            this.promotionBlock.style.transform = `translate(${column * 100}%,  100%)`

        }
        

        this.promotionBlock.classList.remove("invisible");
        promotionOverlay.classList.remove("invisible");
    }

    removePromotionBlock(){
        const promotionOverlay = document.querySelector(".promotion-overlay");

        this.promotionBlock.classList.add("invisible");
        promotionOverlay.classList.add("invisible");
    }

    showFinalMessage(){
        const block = document.querySelector("result-of-game");

        block.classList.remove("none");
    }
    removeFinalMessage(){
        const block = document.querySelector("result-of-game");

        block.classList.add("none");
    }

    reverseBoard(){

       // this.reverseAllFields();

        if(this.board.parentNode.style.transform === "rotate(180deg)"){

            this.board.parentNode.style.transform = "" 

            this.reverseAllFields(false);

        } else {

            this.board.parentNode.style.transform = "rotate(180deg)";

            this.reverseAllFields(true)
        }

    }

    reverseAllFields(fromWhiteToBlack){
        const fields = this.board.querySelectorAll(".field");

            fields.forEach(field => {
                
                let transformStyle = field.style.transform.split(" ");

                //Transform style are 3 words of style: 
                // 0. translate(X%,
                // 1. X%)
                // 2. rotate(Xdeg)

                let rotateStyle = transformStyle[2];

                if(fromWhiteToBlack){
                    rotateStyle = "rotate(180deg)";
                } else {
                    rotateStyle = "rotate(0)"; 
                }

                transformStyle[2] = rotateStyle;

                const transformStyleAsString = transformStyle.join(" ")

                field.style.transform = transformStyleAsString ;

            })
    }

    showMessageBlock(text){

      this.endMessageBlock.childNodes[1].innerText = text;

      this.endMessageBlock.classList.remove("none");
    }

    hideMessageBlock(){
        this.endMessageBlock.classList.add("none");
    }
}

export default ChessBoard;