

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

    if (team === "white") {

        newRank = numberOfRank - 1;
        isFirstMove = numberOfRank === 6;

        additionMoveRank = newRank - 1;

    } else if (team === "black") {

        newRank = numberOfRank + 1;
        isFirstMove = numberOfRank === 1;

        additionMoveRank = newRank + 1;

    }

    if(newRank >=0 && newRank <=7){
        isBlocked = isFieldTaken(
           newRank,
            Column
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
            isAdditionBlocked = isFieldTaken(
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
       console.log(filteredTab)

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
            takenField = isFieldTaken(rank+i, column+i);
            
            if(takenField){
                if(this.board.fields[rank+i][column+i].colour !== team){
                    tabOfMoves.push({rank:rank+i, column:column+i})
                }

                break;
            }
            tabOfMoves.push({rank:rank+i,column:column+i});
        }

        for(let i = 1; (rank+i <= 7 && column-i >=0); i++){
            takenField = isFieldTaken(rank+i, column-i);

            if(takenField){
 
                if(this.board.fields[rank+i][column-i].colour !== team){
                    tabOfMoves.push({rank:rank+i, column:column-i})
                }

                break;
            }
            tabOfMoves.push({rank:rank+i, column:column-i});
        }

        for(let i = 1; (rank-i >=0 && column+i <=7); i++){
            takenField = isFieldTaken(rank-i,column+i);

            if(takenField){
                if(this.board.fields[rank-i][column+i].colour !== team){

                    tabOfMoves.push({rank:rank-i, column:column+i})
                }

                break;
            }
            tabOfMoves.push({rank:rank-i,column:column+i});
        }

        for(let i = 1; (rank-i >=0 && column-i >=0); i++){
            takenField = isFieldTaken(rank-i,column-i);

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

getRookMoves(column,rank, team){

        let tabOfMoves = [];
        let takenField;

     for(let i = 1;column+i<=7; i++){
        takenField = isFieldTaken(rank, column + i);

            if(takenField){
            
                if(this.board.fields[rank][column + i].colour !== team){
                    tabOfMoves.push({rank,column:column+1})
                }

                break;
            }
            tabOfMoves.push({rank, column: column + 1});

        }

    for(let i = 1;column-i>=0; i++){
        takenField = isFieldTaken(rank ,column - i);

            if(takenField){
               
                if(this.board.fields[rank][column - i].colour !== team){
                    tabOfMoves.push({rank, column:column - i})
                }

                break;
            }
            tabOfMoves.push({rank, column:column - i});

    }

    for(let i = 1;rank-i>=0; i++){
        takenField = isFieldTaken(rank-i, column);

            if(takenField){

                if(this.board.fields[rank-i][column].colour !== team){
                    tabOfMoves.push({rank:rank-i, column})
                }

                break;
            }
            tabOfMoves.push({rank:rank-i, column});

    }

    for(let i = 1;rank+i<=7; i++){
        takenField = isFieldTaken(rank+i, column);

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
        const rookPower = getRookMoves(rank, column, team);
        const bishopPower = getBishopMoves(rank, column, team);
        const queenMoves = rookPower.concat(bishopPower);

        return queenMoves;
    }

    getKingMoves(rank, column, team){

        let takenField;
        let filteredTab = [];
    
        let tabOfMoves = [
            {
               column:rank,
               rank:y-1
            },
            {
               column:rank,
               rank:y+1
            },
            {
               column:rank-1,
               rank:y
            },
            {
               column:rank+1,
               rank:y
            },
            {
               column:rank-1,
               rank:y-1
            },
            {
               column:rank+1,
               rank:y+1
            },
            {
               column:rank-1,
               rank:y+1
            },
            {
               column:rank+1,
               rank:y-1
            },
        ];
    
        const hostileColour = getOppositeColour(team);
    
        const hostileKing = getKingCoordinates(hostileColour)
    
        
    
        
    
    
    //REMOVE IMPOSSIBLE MOVES (ATTACKING FRIENDS AND APPROACHING THE ENEMY KING)
        for(let i=0; i < tabOfMoves.length; i++){
    
            const {rank, column} = tabOfMoves[i];
    
            if(rank>=0 &&column<=7 &&rank>=0 &&rank<=7){      
    
                takenField = isFieldTaken(rank,rank);
    
                if(
                    Math.abs(hostileKingCoordintes.rank -column)>1 ||
                    Math.abs(hostileKingCoordintes.y -rank)>1 
                  ) {
    
                    if(takenField){
                
                        if(this.board.fields[rank][y].color !== team){
                             
                                filteredTab.push({rank:rank,rank:y})
                        }
    
                    } else {
                        filteredTab.push({rank:rank,rank:y});
                    }
                }
            }  
        }
    /******************************************************************* */
        
    
    
    
        return filteredTab;
        
    }

    getPawnAttackMoves(rank, column, team){
        
        const tabOfMoves = [],

        unfriendlyColour = getOppositeColour(team),

        // This number decide if the pawn go up or down through the this.board
        moveRank = unfriendlyColour === "w"
            ? 1
            : -1
        // //////////////////////////////////////////////////////////////////////

        rightCoordinates = {
            "rank": rank + moveRank,
            "column": column + 1
        },

        leftCoordinates = {
            "rank": rank + moveRank,
            "column":column - 1
        };

    if (leftCoordinates.column >= 0 ) {

        if (this.board.fields[leftCoordinates.rank][leftCoordinates.column].colour === unfriendlyColour) {

            tabOfMoves.push({
                "rank": leftCoordinates.rank,
                "column": leftCoordinates.column
                });

        }

    }

    if (rightCoordinates.column <= 7) {

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
        }
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

    getArrayOfMoves(rank, column){

        let tabOfMoves;
        const typeOfPiece = (this.board[rank][column].typeOfPiece).toLowerCase();
        const team = this.board[rank][column].colour;

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
    
                tabOfMoves = getRookMoves(rank, column, team);
    
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
            tabOfMoves = filterTabInCaseOfCheck(rank, column, team, tabOfMoves);
        }
        
    
        return tabOfMoves;
        
}

    filterMovesInCaseOfCheck(rank, column, team, tabOfMoves){

        let willBeCheck;

        const filteredTab = [];

        for(let i=0; i<tabOfMoves.length; i++){

            willBeCheck = willBeKingInDangerAfterMove(rank, column, team, tabOfMoves[i]);

            if(!willBeCheck){
                filteredTab.push[ tabOfMoves[i] ]
            }

        }

        return filteredTab;

    }


    
}

const chess = new Chess();

const string = "abcdef"

console.log(chess.board)
console.log(chess.getKnightMoves(0,1,"b"))

export default Chess;