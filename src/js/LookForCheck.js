import { getFieldFromCoordinates, getCoordinatesFromField } from "./getSomething.js";

export let doesCounterEndangerKing,
           doesFieldContainKing;



    doesCounterEndangerKing = (tabOfMoves, colorOfHostileKing) => {
        let field = document.querySelector(`.king.${colorOfHostileKing}`)

        let otherColour = colorOfHostileKing === "white" ? "black" : "white";

        let fieldOfOtherKing = document.querySelector(`.king.${otherColour}`);

        if(fieldOfOtherKing.classList.contains("danger")){
            fieldOfOtherKing.classList.remove("danger");
        }

        let kingPosition = getCoordinatesFromField(field);

        for(let i=0; i<tabOfMoves.length; i++){
        
         if(kingPosition.x === tabOfMoves[i].x &&
            kingPosition.y === tabOfMoves[i].y){
             field.classList.add('danger');

             return;
         }
        }

        field.classList.remove("danger");
    }

