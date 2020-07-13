import { getOppositeColour } from "../getSomething";

class Chess {

    // If we give FEN as parameter, PGN is empty
    // If we give both FEN and PGN, FEN has priority
    // If we want to load only PGN, FEN parameter must be empty
    // If we give no parameters, the position is initial (basic FEN and empty PGN) 

    constructor(FEN, PGN){
        this.FEN = FEN || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        this.PGN = ''//(typeof(FEN) === "String" || typeof(PGN) !== "String")  ? "" : PGN;
        this.reset();
    }

    reset() {
        if(this.PGN.length > 0) {
            this.FEN = this.transformPgnIntoFen();
        }
        this.fenFlagNumeration = {
            PIECE_PLACEMENT : 0,
            SIDE_TO_MOVE : 1,
            CASTLING_ABILITY : 2,
            EN_PASSANT_TARGET_SQUAR : 3,
            HALFMOVE_CLOCK : 4,
            FULL_MOVE_COUNTER : 5
        }
        this.fenFlags = this.FEN.split(' ');
        this.board = this.getBoardCondition();
    }

    transformPgnIntoFen(){
        // TO DO
        return;
    }

    getBoardCondition(){
        const localBoard = {
            fields: []
        }

        const firstFenHeader = this.fenFlags[this.fenFlagNumeration.PIECE_PLACEMENT]

        firstFenHeader.split("/").map( (rank, index) => {
            
            localBoard.fields[index] = [];

            for(let i = 0; i<rank.length; i++){
                
                
                if( !isNaN(rank[i]) ){
        
                    for(let numberOfEmptyField = i;
                            numberOfEmptyField < Number(rank[i]) + i; 
                            numberOfEmptyField++ ) {

                               
     
                        localBoard.fields[index][numberOfEmptyField] = {
                            typeOfPiece: null,
                            color: null
                        }
                    }
                } else {

                    localBoard.fields[index][i] = {
                        typeOfPiece: rank[i],
                        color: rank[i] === rank[i].toUpperCase() ? "w" : "b" //If letter is big, piece is white
                    }
                }

            }
    
        })

        return localBoard;
    }

    getFen(){
        return this.FEN;
    }

    getPawnMoves(x, y, team){

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

        const pawnAttackMoves = this.getPawnAttackMoves(x, y, team)

        const enPassantMoves = this.getEnPassantMoves(x, y, team)

        tabOfMoves = [...tabOfMoves, ...pawnAttackMoves, ...enPassantMoves];

        tabOfMoves = this.filterOvermoves(tabOfMoves);

        return tabOfMoves;
    }
    
    getKnightMoves(x, y, team){

    }

    getBishopMoves(x, y, team){

    }

    getQueenMoves(x, y, team){

    }

    getKingMoves(x, y, team){
        
    }

    getPawnAttackMoves(x, y, team){
        
        const tabOfMoves = [],

        unfriendlyColour = getOppositeColour(team),

        // This number decide if the pawn go up or down through the battlefield
        moveY = unfriendlyColour === "w"
            ? 1
            : -1
        // //////////////////////////////////////////////////////////////////////

        rightCoordinates = {
            "x": x + 1,
            "y": y + moveY
        },

        leftCoordinates = {
            "x": x - 1,
            "y": y + moveY
        };

    if (leftCoordinates.x >= 0 && leftCoordinates.y <= 7 && leftCoordinates.y >= 0) {

        if (battleField.fields[leftCoordinates.x][leftCoordinates.y].color === unfriendlyColour) {

            tabOfMoves.push({"x": leftCoordinates.x,
                "y": leftCoordinates.y});

        }

    }

    if (rightCoordinates.x <= 7 && rightCoordinates.y <= 7 && rightCoordinates.y >= 0) {

        if (battleField.fields[rightCoordinates.x][rightCoordinates.y].color === unfriendlyColour) {

            tabOfMoves.push({"x": rightCoordinates.x,
                "y": rightCoordinates.y});

        }

    }


    return tabOfMoves;

    }

    getOppositeColour(team){
        return team === "w" ? "b" : "w;"
    }


    
}

const chess = new Chess();

export default Chess;