

class Chess {

    // If we give FEN as parameter, PGN is empty
    // If we give both FEN and PGN, FEN has priority
    // If we want to load only PGN, FEN parameter must be empty
    // If we give no parameters, the position is initial (basic FEN and empty PGN) 

    constructor(FEN, PGN){
        this.FEN = FEN || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        this.PGN = ''//(typeof(FEN) === "String" || typeof(PGN) !== "String")  ? "" : PGN;
        this.reset(FEN, PGN);
    }

    reset(FEN, PGN="") {
        if(PGN.length > 0) {
            FEN = this.transformPgnIntoFen();
        }
        this.game = {
            end: false,
            winner: null,
            reason: ""
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
        this.lastMove = {
            from: {
               column:null,
               rank:null
            },
            to: {
               column:null,
               rank:null 
            },
            colour: null,
            typeOfPiece: null,
        };
        this.colourToMove = this.fenFlags[this.fenFlagNumeration.SIDE_TO_MOVE];
        this.isPawnPromoting = false;
        this.isCheck = {
            status: false,
            coordinates: {
                rank: null,
                column: null
            }
        }
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
                            colour: null
                        }
                    }
                } else {

                    localBoard.fields[index][i] = {
                        typeOfPiece: rank[i],
                        colour: rank[i] === rank[i].toUpperCase() ? "w" : "b" //If letter is big, piece is white
                    }
                }

            }
    
        })

        return localBoard;
    }

    getFen(){
        return this.FEN;
    }

    getPawnMoves(rank, column, team){

        let numberOfRank = rank,
        newRank,
        additionMoveRank,
        isFirstMove,
        isBlocked,
        isAdditionBlocked,
        tabOfMoves = [];

    if (team === "w") {

        newRank = numberOfRank - 1;
        isFirstMove = numberOfRank === 6;

        additionMoveRank = newRank - 1;

    } else if (team === "b") {

        newRank = numberOfRank + 1;
        isFirstMove = numberOfRank === 1;

        additionMoveRank = newRank + 1;

    }

    if(newRank >=0 && newRank <=7){
        isBlocked = this.isFieldTaken(
           newRank,
           column
        );
    } else {
        isBlocked = true;
    }

    

    if (!isBlocked) {

        tabOfMoves.push(
            {
           rank: newRank,
           column
            });

        
        if(additionMoveRank >=0 && additionMoveRank <=7){
            isAdditionBlocked = this.isFieldTaken(
               additionMoveRank,
               column
            );
        } else {
            isAdditionBlocked = true;
        }
        

        if (isFirstMove) {

            if (!isAdditionBlocked) {

                tabOfMoves.push({
                            rank: additionMoveRank,
                            column
                                }
                    );

                }

            }

        }

        const pawnAttackMoves = this.getPawnAttackMoves(rank, column, team)

        const enPassantMoves = this.getEnPassantMoves(rank, column, team)

        tabOfMoves = [...tabOfMoves, ...pawnAttackMoves, ...enPassantMoves];

        tabOfMoves = this.filterOvermoves(tabOfMoves);

        return tabOfMoves;
    }
    
getKnightMoves(rank , column, team){

        const tabOfMoves = [
            {
                "rank":rank + 2,
                "column":column + 1
            },
            {
                "rank":rank + 2,
                "column":column - 1
            },
            {
                "rank":rank - 2,
                "column":column + 1
            },
            {
                "rank":rank - 2,
                "column":column - 1
            },
            {
                "rank":rank + 1,
                "column":column + 2
            },
            {
                "rank":rank - 1,
                "column":column + 2
            },
            {
                "rank":rank + 1,
                "column":column - 2
            },
            {
                "rank":rank - 1,
                "column":column - 2
            },
        ];

       const filteredTab = this.filterOvermoves(tabOfMoves);

       //Remove fields where we attack our team's pieces

       const moreFilteredTab = [];

       for (let i = 0; i < filteredTab.length; i++) {

        const {rank,column} = filteredTab[i];

        

        
        if(this.board.fields[rank][column].colour !== team) {
            
            moreFilteredTab.push(filteredTab[i]);

        }

    }

        return moreFilteredTab;
    }

getBishopMoves(rank, column, team){
        
        let tabOfMoves = [];
        let takenField;


        for(let i = 1; (rank + i <= 7 && column + i <=7); i++){
            takenField =this.isFieldTaken(rank+i, column+i);
            
            if(takenField){
                if(this.board.fields[rank+i][column+i].colour !== team){
                    tabOfMoves.push({rank:rank+i, column:column+i})
                }

                break;
            }
            tabOfMoves.push({rank:rank+i,column:column+i});
        }

        for(let i = 1; (rank+i <= 7 && column-i >=0); i++){
            takenField =this.isFieldTaken(rank+i, column-i);

            if(takenField){
 
                if(this.board.fields[rank+i][column-i].colour !== team){
                    tabOfMoves.push({rank:rank+i, column:column-i})
                }

                break;
            }
            tabOfMoves.push({rank:rank+i, column:column-i});
        }

        for(let i = 1; (rank-i >=0 && column+i <=7); i++){
            takenField =this.isFieldTaken(rank-i,column+i);

            if(takenField){
                if(this.board.fields[rank-i][column+i].colour !== team){

                    tabOfMoves.push({rank:rank-i, column:column+i})
                }

                break;
            }
            tabOfMoves.push({rank:rank-i,column:column+i});
        }

        for(let i = 1; (rank-i >=0 && column-i >=0); i++){
            takenField =this.isFieldTaken(rank-i,column-i);

            if(takenField){
                if(this.board.fields[rank-i][column-i].colour !== team){
                    tabOfMoves.push({rank:rank-i,column:column-i})
                }

                break;
            }
            tabOfMoves.push({rank:rank-i, column:column-i});
        }

        return tabOfMoves;
    }

getRookMoves(rank, column, team){

        let tabOfMoves = [];
        let takenField;

    //add right moves

     for(let i = 1;column+i<=7; i++){
        takenField =this.isFieldTaken(rank, column + i);

            if(takenField){
            
                if(this.board.fields[rank][column + i].colour !== team){
                    tabOfMoves.push({rank,column:column+i})
                }

                break;
            }
            tabOfMoves.push({rank, column: column + i});

        }

    //add left moves

    for(let i = 1;column-i>=0; i++){
        takenField =this.isFieldTaken(rank ,column - i);

            if(takenField){
               
                if(this.board.fields[rank][column - i].colour !== team){
                    tabOfMoves.push({rank, column:column - i})
                }

                break;
            }
            tabOfMoves.push({rank, column:column - i});

    }

    //add top moves

    for(let i = 1;rank-i>=0; i++){
        takenField =this.isFieldTaken(rank-i, column);

            if(takenField){

                if(this.board.fields[rank-i][column].colour !== team){
                    tabOfMoves.push({rank:rank-i, column})
                }

                break;
            }
            tabOfMoves.push({rank:rank-i, column});

    }

    //add bottom moves

    for(let i = 1;rank+i<=7; i++){
        takenField =this.isFieldTaken(rank+i, column);

            if(takenField){
        
                if(this.board.fields[rank+i][column].colour !== team){
                    tabOfMoves.push({rank:rank+i, column:column})
                }

                break;
            }
            tabOfMoves.push({rank:rank+i, column:column});
    }

    

    return tabOfMoves;
    }

    getQueenMoves(rank, column, team){

        const rookPower = this.getRookMoves(rank, column, team);
        const bishopPower = this.getBishopMoves(rank, column, team);
        const queenMoves = rookPower.concat(bishopPower);

        return queenMoves;
    }

    getKingMoves(rank, column, team){

        let takenField;
        let filteredTab = [];
    
        let tabOfMoves = [
            {
               rank:rank,
               column:column-1
            },
            {
               rank:rank,
               column:column+1
            },
            {
               rank:rank-1,
               column:column
            },
            {
               rank:rank+1,
               column:column
            },
            {
               rank:rank-1,
               column:column-1
            },
            {
               rank:rank+1,
               column:column+1
            },
            {
               rank:rank-1,
               column:column+1
            },
            {
               rank:rank+1,
               column:column-1
            },
        ];
    
        const hostileColour = this.getOppositeColour(team);
    
        const hostileKingCoordintes = this.getKingCoordinates(hostileColour) 
    
    //REMOVE IMPOSSIBLE MOVES (ATTACKING FRIENDS AND APPROACHING THE ENEMY KING)
        for(let i=0; i < tabOfMoves.length; i++){
    
            const {rank, column} = tabOfMoves[i];
    
            if(rank>=0 &&column<=7 &&rank>=0 &&rank<=7){      
    
                takenField =this.isFieldTaken(rank, column);
    
                if(
                    Math.abs(hostileKingCoordintes.rank - rank)>1 ||
                    Math.abs(hostileKingCoordintes.column - column)>1 
                  ) {
    
                    if(takenField){
                
                        if(this.board.fields[rank][column].colour !== team){
                             
                                filteredTab.push({rank:rank,column:column})
                        }
    
                    } else {
                        filteredTab.push({rank:rank,column:column});
                    }
                }
            }  
        }
    /******************************************************************* */
        
        const castlingMoves = this.getCastlingMoves(rank, column, team);

        const kingMoves = castlingMoves.concat(filteredTab);
    
    
        return kingMoves;
        
    }

    getCastlingMoves(rank, column, team){

        /*MAGIC NUMBERS:
            SHORT CASTLING
                column:5 the field on the right of King, here rook comes when castling (f1)
                column:6 the field on the right of King, here king comes when castling (g1)

            LONG CASTLING
                column:3 the field on the left of King, here comes rook when castling (d1)
                column:2 the field on the left of King, here king comes when castling (c1)
                column:1 the field on the left of King                                (b1)
        */
        let shortCastlingLetter, 
            longCastlingLetter

        const castlingMoves = [];

        if(team === "w"){
            shortCastlingLetter = "K";
            longCastlingLetter = "Q";
        } else {
            shortCastlingLetter = "k";
            longCastlingLetter = "q";
        }
        
        const castlingFenFlag = this.fenFlags[this.fenFlagNumeration.CASTLING_ABILITY];

        if(
            castlingFenFlag.includes(shortCastlingLetter) &&
            !(this.isFieldTaken(rank, 5)) &&
            !(this.isFieldTaken(rank, 6))
          ){
            const shortCastlingMoves = [
                {
                    rank : rank,
                    column: 5
                },
                {
                    rank : rank,
                    column: 6
                }
            ]

            const filteredShortCastlingMoves = this.filterMovesInCaseOfCheck(rank, column, team, shortCastlingMoves);

            if(filteredShortCastlingMoves.length === 2){ //Both moves  are possible
                //we push only second move because that is the move to castle
                castlingMoves.push(shortCastlingMoves[1])
            }
        }

        if(
            castlingFenFlag.includes(longCastlingLetter) &&
            !(this.isFieldTaken(rank, 3)) &&
            !(this.isFieldTaken(rank, 2)) &&
            !(this.isFieldTaken(rank, 1)) 
          ){

            const longCastlingMoves = [
                {
                    rank : rank,
                    column: 3
                },
                {
                    rank : rank,
                    column: 2
                },
                {
                    rank : rank,
                    column: 1
                }
            ]

            const filteredLongCastlingMoves = this.filterMovesInCaseOfCheck(rank, column, team, longCastlingMoves);

            if(filteredLongCastlingMoves.length === 3){ //Both moves  are possible
                //we push only second move because that is the move to castle
                castlingMoves.push(longCastlingMoves[1])
            }
        }

        return castlingMoves;

    }

    getPawnAttackMoves(rank, column, team){
        
        const tabOfMoves = [],

        unfriendlyColour = this.getOppositeColour(team),

        // This number decide if the pawn go up or down through the this.board
        moveRank = unfriendlyColour === "w"
            ? 1
            : -1,
        // //////////////////////////////////////////////////////////////////////

        rightCoordinates = {
            "rank": rank + moveRank,
            "column": column + 1
        },

        leftCoordinates = {
            "rank": rank + moveRank,
            "column":column - 1
        };

    if (leftCoordinates.column >= 0 && 
        leftCoordinates.rank <= 7 && 
        leftCoordinates.rank >= 0) {

        if (this.board.fields[leftCoordinates.rank][leftCoordinates.column].colour === unfriendlyColour) {

            tabOfMoves.push({
                "rank": leftCoordinates.rank,
                "column": leftCoordinates.column
                });

        }

    }

    if (rightCoordinates.column <= 7 &&
        leftCoordinates.rank <= 7 && 
        leftCoordinates.rank >= 0) {

        if (this.board.fields[rightCoordinates.rank][rightCoordinates.column].colour === unfriendlyColour) {

            tabOfMoves.push({
                "rank": rightCoordinates.rank,
                "column": rightCoordinates.column
                });

        }

    }


    return tabOfMoves;

    }

    getEnPassantMoves(rank, column, team){

        if(
            this.lastMove.typeOfPiece === "p" 
                &&
            Math.abs(this.lastMove.from.rank - this.lastMove.to.rank) === 2
                &&
            this.lastMove.to.rank === rank
                &&
            Math.abs(this.lastMove.to.column - column) === 1
          ) {
            
                let rankToReturn;

                if (team === "w") { 

                   rankToReturn =rank - 1; //PAWN GOES TO BLACK'S SIDE

                } else {

                   rankToReturn =rank + 1; //PAWN GOES TO WHITE'S SIDE

                }

                return [
                    {"rank": rankToReturn,
                     "column": this.lastMove.to.column}
                ];
        } else return []
    }

    getOppositeColour(team){
        return team === "w" ? "b" : "w"
    }

    filterOvermoves = (tabOfMoves) => {
        const filteredTab = tabOfMoves.filter( move => {
            if(move.rank <=7 && 
               move.rank >=0 &&
               move.column <=7 && 
               move.column >=0 
               ) {
                   return move;
               }
        })
    
        return filteredTab;
    };

    isFieldTaken = (rank, column) => {

        if(
            rank > 7 ||
            rank < 0 ||
            column > 7 ||
            column < 0
            ){
                return false;
            }

        if (this.board.fields[rank][column].colour !== null) { // It mean the field is taken by some counter

            return true;

        }

        return false;

    };

    getKingCoordinates(colour){

        const neededLetter = colour === "w" ? "K" : "k"

        const kingCoordinates = {
           column:null,
           rank:null
        }

        for(let i=0; i<=7; i++){
            for(let j=0; j<=7; j++){
                if(this.board.fields[i][j].typeOfPiece === neededLetter){
                    kingCoordinates.rank = i;
                    kingCoordinates.column = j;
                }
            }
        }

        return kingCoordinates;
    }

    getArrayOfMoves(rank, column, filterTab = true){

        let tabOfMoves;
        const typeOfPiece = (this.board.fields[rank][column].typeOfPiece).toLowerCase();
        const team = this.board.fields[rank][column].colour;

        switch(typeOfPiece){

            case 'p':

                tabOfMoves = this.getPawnMoves(rank, column, team);

                
                
                break;
    
            case 'n':
    
                tabOfMoves = this.getKnightMoves(rank, column, team);
    
                break;
    
            case 'b':
    
                tabOfMoves = this.getBishopMoves(rank, column, team);
    
                break;
    
            case 'r':
    
                tabOfMoves = this.getRookMoves(rank, column, team);
    
                break;
    
            case 'q':
                
                tabOfMoves = this.getQueenMoves(rank, column, team);
    
                break;
    
            case 'k':
                
                tabOfMoves = this.getKingMoves(rank, column, team);
    
                break;
    
            default: throw new Error("You have probably given wrong name of counter");
        }

        if(filterTab){
            tabOfMoves = this.filterMovesInCaseOfCheck(rank, column, team, tabOfMoves)
        }
    
        return tabOfMoves;
        
}

    filterMovesInCaseOfCheck(rank, column, team, tabOfMoves){

        let willBeCheck;

        const filteredTab = [];

        for(let i=0; i<tabOfMoves.length; i++){

            willBeCheck = this.willBeKingInDangerAfterMove({rank, column},tabOfMoves[i], team);

            


            if(!willBeCheck){
                filteredTab.push( tabOfMoves[i] );
            }

        }

        

        return filteredTab;

    }

    willBeKingInDangerAfterMove(from, to, team){

    //Temporary change the condition of board
        const pieceTypeFrom = this.board.fields[from.rank][from.column].typeOfPiece;
        const colourFrom = this.board.fields[from.rank][from.column].colour
        const pieceTypeTo = this.board.fields[to.rank][to.column].typeOfPiece;
        const colourTo = this.board.fields[to.rank][to.column].colour
        
        this.board.fields[from.rank][from.column].typeOfPiece = null;
        this.board.fields[from.rank][from.column].colour = null;

        this.board.fields[to.rank][to.column].typeOfPiece = pieceTypeFrom;
        this.board.fields[to.rank][to.column].colour = colourFrom;

        const isCheck = this.isKingInDanger(team, false);

    //Undo changes

        this.board.fields[from.rank][from.column].typeOfPiece = pieceTypeFrom;
        this.board.fields[from.rank][from.column].colour = colourFrom;

        this.board.fields[to.rank][to.column].typeOfPiece = pieceTypeTo;
        this.board.fields[to.rank][to.column].colour = colourTo;



        return isCheck;
    }

    isKingInDanger(team, updateCheckStatus=true){

        const hostileColour = this.getOppositeColour(team);

        const kingCoordinates = this.getKingCoordinates(team)

        const hostilePiecesWithMoves = this.getPiecesWithMoves(hostileColour, false);



        for(let i=0; i<hostilePiecesWithMoves.length; i++){
            
            for(let j=0; j<hostilePiecesWithMoves[i].moves.length; j++){
               
                const {rank, column} = hostilePiecesWithMoves[i].moves[j]
                if(rank === kingCoordinates.rank && column === kingCoordinates.column){

                    if(updateCheckStatus){
                        this.isCheck.status = true;
                        this.isCheck.coordinates.rank = kingCoordinates.rank;
                        this.isCheck.coordinates.column = kingCoordinates.column;
                    }   

                    return true;
                }
                
            }
        }

        if(updateCheckStatus){
            this.isCheck.status = false;
            this.isCheck.coordinates.rank = null;
            this.isCheck.coordinates.column = null;
        }
        

        return false;
    }

    getPiecesWithMoves(team, filter=true, specificPiece=null){
        let tabOfMoves = [];

        if(specificPiece){
            
            for(let rank=0; rank<=7; rank++){
                for(let column=0; column<=7; column++){
                    if(
                        this.board.fields[rank][column].colour === team &&
                        this.board.fields[rank][column].typeOfPiece.toLowerCase() === specificPiece.toLowerCase()
                        ) {
                            return {
                                rank,
                                column,
                                colour: team,
                                typeOfPiece: this.board.fields[rank][column].typeOfPiece,
                                moves: this.getArrayOfMoves(rank, column, filter)
                            }
                        }
                }
            }
        }

        for(let rank=0; rank<=7; rank++){
            for(let column=0; column<=7; column++){
                if(this.board.fields[rank][column].colour === team){

                    tabOfMoves.push({
                        rank,
                        column,
                        colour: team,
                        typeOfPiece: this.board.fields[rank][column].typeOfPiece,
                        moves: this.getArrayOfMoves(rank, column, filter)
                    })

                }
            }
        }

        return tabOfMoves;
    }

    makeMove(from, to, reverseColours = true){

        const pieceType = this.board.fields[from.rank][from.column].typeOfPiece;
        const colour = this.board.fields[from.rank][from.column].colour;

        // If pawn moved or something was killed we reset the halfmove clock
        // in other case we increment halfmove clock

        if(pieceType.toLowerCase() === "p" || this.isFieldTaken(to.rank, to.column)){
            this.updateFifthFenFlag(-1);
        } else{
            this.updateFifthFenFlag(1);
        }

        this.checkMoveOfPawn(from, to)

        this.checkConditionOfCastlings(from, to);    

        this.lastMove.from.rank = from.rank;
        this.lastMove.from.column = from.column;
        this.lastMove.to.rank = to.rank;
        this.lastMove.to.column = to.column;

        //Add piece to his new place
        this.board.fields[to.rank][to.column].colour = colour;
        this.board.fields[to.rank][to.column].typeOfPiece = pieceType;

        //Remove piece from his old place
        this.board.fields[from.rank][from.column].colour = null;
        this.board.fields[from.rank][from.column].typeOfPiece = null;

        //It is needed when we do castling
        if(reverseColours){
            this.lastMove.colour = colour;
            this.lastMove.typeOfPiece = pieceType;
            this.colourToMove = this.colourToMove === "w" ? "b" : "w";
        } 

        this.verifyGameStatus();

        this.updateFen();
    }

    checkMoveOfPawn(from, to){

        const pieceType = this.board.fields[from.rank][from.column].typeOfPiece;
        const colour = this.board.fields[from.rank][from.column].colour;
        
        if(pieceType.toLowerCase() === "p") {
            
        }
        if(pieceType.toLowerCase() === "p"){

            /* CHECK IF EN PASSANT OCCURED */
            //  IF pawn made move, he attacked somebody and there were 
            //  nobody at destination it mean that it did enPassant

            if( from.column !== to.column && !this.isFieldTaken(to.rank, to.column) ) {
                //remove the pawn it killed

                const rankToRemove = colour === "w" ? (to.rank + 1) : (to.rank - 1)

                this.board.fields[rankToRemove][to.column].colour = null;
                this.board.fields[rankToRemove][to.column].typeOfPiece = null;
            }

            /* CHECK IF PAWN DID PROMOTE */

            if(to.rank === 0 || to.rank === 7){
                this.isPawnPromoting = true;
            }
        }
    }

    checkConditionOfCastlings(from, to){

        const pieceType = this.board.fields[from.rank][from.column].typeOfPiece;

        if(pieceType.toLowerCase() === "k"){
            if(pieceType === "K"){
                this.updateThirdFenFlag(["K", "Q"]);
            } else {
                this.updateThirdFenFlag(["k", "q"]); 
            }

            if(Number(from.column) - Number(to.column) === -2){ 
                //SHORT CASTLING, we must also move rook
                const rookMove = {
                    from: {
                        rank: from.rank,
                        column: 7
                    },
                    to: {
                        rank: from.rank,
                        column: to.column - 1 //on the left of the king
                    }
                }

                this.makeMove(rookMove.from, rookMove.to, false);
            }

            if(Number(from.column) - Number(to.column) === 2){ 
                //LONG CASTLING, we must also move rook
                const rookMove = {
                    from: {
                        rank: from.rank,
                        column: 0
                    },
                    to: {
                        rank: from.rank,
                        column: to.column + 1 //on the right of the king
                    }
                }

                this.makeMove(rookMove.from, rookMove.to, false);
            }
        }

    //The code below will help when castling was not done and we move rook for the first time
        if(pieceType.toLowerCase() === "r"){
            
            if(from.rank === 7){
                if(from.column === 7) {

                    this.updateThirdFenFlag(["K"])

                } else if(from.column === 0){

                    this.updateThirdFenFlag(["Q"])
                }
            } else if(from.rank === 0){

                if(from.column === 7) {

                    this.updateThirdFenFlag(["k"])

                } else if(from.column === 0){

                    this.updateThirdFenFlag(["q"])
                }
            }
        }
    }

    updateFen(){
        this.updateFirstFenFlag();
        this.updateSecondFenFlag();
    
    }

    updateFirstFenFlag(){
        const fenFlags = this.fenFlags;

      

        let newFirstFenFlag = '';

        for(let rank = 0; rank <=7; rank++){
            for(let column = 0; column <=7; column++){
                if(this.isFieldTaken(rank, column)){
                    newFirstFenFlag = `${newFirstFenFlag}${this.board.fields[rank][column].typeOfPiece}`;
                } else {

                    let counter = 1;

                    if(column <= 7){

                        column++;

                        while( !this.isFieldTaken(rank, column) && column <= 7){
                            counter++;
                            column++;
                             
                        }
                    
                        newFirstFenFlag = `${newFirstFenFlag}${counter}`;
                            
                            
                        if(column <=7){
                            newFirstFenFlag = `${newFirstFenFlag}${this.board.fields[rank][column].typeOfPiece}`;
                        }
                        
                    }

                     
                }
            }
            if(rank < 7){
                newFirstFenFlag = `${newFirstFenFlag}/`; 
            }     
        }

        fenFlags[this.fenFlagNumeration.PIECE_PLACEMENT] = newFirstFenFlag;

        this.FEN = fenFlags.join(" ");
    }

    updateSecondFenFlag(){
        const fenFlags = this.fenFlags;

        

        if(fenFlags[this.fenFlagNumeration.SIDE_TO_MOVE] === "w"){
            fenFlags[this.fenFlagNumeration.SIDE_TO_MOVE] = "b"
        } else{
            fenFlags[this.fenFlagNumeration.SIDE_TO_MOVE] = "w";
        }

        this.FEN = fenFlags.join(" ");
    }

    updateThirdFenFlag(letters){
        const fenFlags = this.fenFlags;

        const thirdFenFlag = fenFlags[this.fenFlagNumeration.CASTLING_ABILITY];

        const thirdFenFlagAsArray = thirdFenFlag.split("");

        let filteredThirdFenFlag = thirdFenFlagAsArray.filter( char => {

            let isLetter = false;

            for(let i=0; i<letters.length; i++){
                if(letters[i] === char){
                    isLetter = true;
                    break;
                }
            }
            if(!isLetter){
                return char
            }
    })

        filteredThirdFenFlag = filteredThirdFenFlag.join("");

        if(filteredThirdFenFlag === ""){
            filteredThirdFenFlag = "-";
        }

        fenFlags[this.fenFlagNumeration.CASTLING_ABILITY] = filteredThirdFenFlag;

        this.FEN = fenFlags.join(" ");
    }

    updateFifthFenFlag(number){
        const fenFlags = this.fenFlags;

        let fifthFenFlag = fenFlags[this.fenFlagNumeration.HALFMOVE_CLOCK];
        let fifthFenFlagAsNumber = Number(fifthFenFlag);

        if(number === 1){
            fifthFenFlagAsNumber++;
        } else {
            fifthFenFlagAsNumber = 0;
        }

        fifthFenFlag = fifthFenFlagAsNumber.toString();

        fenFlags[this.fenFlagNumeration.HALFMOVE_CLOCK] = fifthFenFlag;

        this.FEN = fenFlags.join(" ");

        
    }

    promotePawn(typeOfPiece){

        if(this.isPawnPromoting){

            this.board.fields[this.lastMove.to.rank][this.lastMove.to.column].typeOfPiece = typeOfPiece;

            this.isPawnPromoting = false;
    
            this.updateFen();

            //we must verify if we check opposite king after promotion

            const team = this.board.fields[this.lastMove.to.rank][this.lastMove.to.column].colour

            const getOppositeColour = this.getOppositeColour(team)
    
            this.verifyGameStatus();
        }
        
    }

    verifyGameStatus(){
        const isCheck = this.isKingInDanger(this.colourToMove);

        if(isCheck){
            this.verifyMate(this.colourToMove);
        } else {
            this.verifyStalemate(this.colourToMove);
        }

        this.verifyHalfmoveClock();
    }

    verifyMate(team){
        const piecesWithMoves = this.getPiecesWithMoves(team);
        let mate = true;

        for(let numberOfPiece = 0; numberOfPiece<piecesWithMoves.length; numberOfPiece++){
            if(piecesWithMoves[numberOfPiece].moves.length > 0){
                mate = false;
                break;
            }
        }

        if(mate){

            const colourOfWinner = this.getOppositeColour(team) === "w" ? "White" : "Black";

            this.game.end = true;
            this.game.winner = this.getOppositeColour(team);
            this.game.reason = `${colourOfWinner} has won by checkmate`
        }
  
    }

    verifyStalemate(team){
        const piecesWithMoves = this.getPiecesWithMoves(team);
        let stalemate = true;
        for(let numberOfPiece = 0; numberOfPiece<piecesWithMoves.length; numberOfPiece++){
            if(piecesWithMoves[numberOfPiece].moves.length > 0){
                stalemate = false;
                break;
            }
        }

        if(stalemate){
            const colourBeingInStalemate = team === "w" ? "White" : "Black";
        
            this.game.end = true;
            this.game.winner = "DRAW";
            this.game.reason = `Draw, ${colourBeingInStalemate} king is in stalemate`;
        }
 
    }

    verifyHalfmoveClock(){
        const fenFlags = this.fenFlags;

        const fifthFenFlag = fenFlags[this.fenFlagNumeration.HALFMOVE_CLOCK];

        const fifthFenFlagAsNumber = Number(fifthFenFlag);

        if(fifthFenFlagAsNumber >=100){
            this.game.end = true;
            this.game.winner = "DRAW";
            this.game.reason = "Draw, 100 moves without any action";
        }
    }

    didGameEnd(){
        return false;
    }


    
}

const chess = new Chess();


export default Chess;