
class UserInterface {
    constructor(interfaceBlock){
        this.interfaceBlock = interfaceBlock;
    }

    updateFen(FEN){
        const fenBlock = this.interfaceBlock.querySelector(".text-block.fen .text");

        fenBlock.innerText = FEN;
    }

    updatePgn(pgn){
        const pgnBlock = this.interfaceBlock.querySelector(".text-block.pgn");

        pgnBlock.innerText = pgn;
    }

    updateColour(colour = "w"){
        const colourBlock = this.interfaceBlock.querySelector(".turn-colour");

        if(colour === "w"){
            colourBlock.classList.remove("black-colour");
        } else {
            colourBlock.classList.add("black-colour");
        }
    }


}

export default UserInterface;