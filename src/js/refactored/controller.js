
class Controller {

    constructor(chess, chessBoard, userInterface, gameMode = "h", computerColour = "b"){
        this.chess = chess;
        this.chessBoard = chessBoard;
        this.userInterface = userInterface;
        this.gameMode = {
            mode: gameMode,
            computerColour: computerColour
        }
    }

    clickPiece(e){

        //Game does not end 
        //  AND
        //No computer plays OR It is not computer turn
        if( 
            !this.chess.game.end && 
            ( (this.gameMode.mode === "h") || this.gameMode.computerColour !== this.chess.colourToMove ) 
            ){

            //If piece is active and we click on him again, he will no longer be active

            if(e.target.parentNode.classList.contains("active")){

                this.chessBoard.removeActiveField();

                return;
            }   

            if (e.target.id === this.chess.colourToMove ) {

                const rank = Number( (e.target.parentNode.classList[1]).slice(-1) );
                const column = Number( (e.target.parentNode.classList[2]).slice(-1) );


                const arrayOfMoves = this.chess.getArrayOfMoves(rank, column)

                this.chessBoard.showActiveField(e.target.parentNode, arrayOfMoves)

                return;
            }

            if(e.target.classList.contains("to-move")){

                const to = {
                    rank: Number(e.target.classList[1].slice(-1) ),
                    column: Number(e.target.classList[2].slice(-1) )
                }

                const from = this.chessBoard.getCoordinatesFromActiveField();

                this.movePiece(from, to)

                
            }
        }
    }

    movePiece(from, to){
        this.chess.makeMove(from, to);
        this.chessBoard.fillBoardInPieces(this.chess.FEN)
        this.chessBoard.removeLastMoveFields();
        this.chessBoard.removeEndangeredField();
        this.chessBoard.markFieldsAsLastMove(from, to);
        this.chessBoard.removeActiveField();
        if(this.chess.isCheck.status){
            this.chessBoard.markFieldAsEndangered(this.chess.isCheck.coordinates);
        }

        if(this.chess.isPawnPromoting){

            //we must take the opposite colour because the turn of promoting 
            //pawn has ended despite the fact the he has not promoted yet.

            const colour = this.chess.getOppositeColour(this.chess.colourToMove)

            this.chessBoard.showPromotionBlock(to.rank, to.column, colour);
        }

        this.userInterface.updateFen(this.chess.FEN)
        this.userInterface.updateColour(this.chess.colourToMove);

        if(this.chess.game.end){
            this.chessBoard.showMessageBlock(this.chess.game.reason);
        }
    }

    clickPromotionBlock(e){
        if(e.target.nodeName === "IMG"){

            const imageCharacter = e.target.id;

            this.chess.promotePawn(imageCharacter)

            this.chessBoard.fillBoardInPieces(this.chess.FEN);

            this.chessBoard.removePromotionBlock();

            if(this.chess.isCheck.status){
                this.chessBoard.markFieldAsEndangered(this.chess.isCheck.coordinates);
            }
        }
    }

    addAllEventListeners(){

        this.chessBoard.board.addEventListener("click", (e) => {
            this.clickPiece(e)
        })

        this.chessBoard.promotionBlock.addEventListener("click", (e) => {
            this.clickPromotionBlock(e);
        })

        const resetButton = this.userInterface.interfaceBlock.querySelector(".game-info .restart-button");
        
        resetButton.addEventListener("click", this.resetGame);

        const switchButton = this.userInterface.interfaceBlock.querySelector(".game-info .switch-button");
        
        switchButton.addEventListener("click", () => {
            this.chessBoard.reverseBoard();
        }); 

        const endMessageButton = this.chessBoard.endMessageBlock.childNodes[3];

        endMessageButton.addEventListener("click", () => {
            this.chessBoard.hideMessageBlock();
        })
    }

    resetGame(){
        window.location.reload();
    }

}

export default Controller