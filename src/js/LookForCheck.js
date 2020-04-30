import { getFieldFromCoordinates, getCoordinatesFromField } from "./getSomething.js";
import { findMovesForSomebody } from "./findMoves.js";

export let doesCounterEndangerKing,
           doesTeamEndangerEnemyKing;



    doesCounterEndangerKing = (tabOfMoves, colorOfHostileKing) => {

        let field = document.querySelector(`.king.${colorOfHostileKing}`)

        if(!field.classList.contains("danger")){    
        //  console.log(field)

            let otherColour = colorOfHostileKing === "white" ? "black" : "white";

            let fieldOfOtherKing = document.querySelector(`.king.${otherColour}`);

            if(fieldOfOtherKing.classList.contains("danger")){
                fieldOfOtherKing.classList.remove("danger");
            }

            let kingPosition = getCoordinatesFromField(field, false);

            for(let i=0; i<tabOfMoves.length; i++){
            
            if(kingPosition.x === tabOfMoves[i].x &&
                kingPosition.y === tabOfMoves[i].y){
                field.classList.add('danger');

                console.log("IN DANDER")

                return true;
            }
            }

            field.classList.remove("danger");

            return false;

        }
    }

    doesTeamEndangerEnemyKing = (friendlyColour) => {
        const hostileColour = friendlyColour === "white" ? "black" : "white";

        let typeOfCounter, coordinates;

        const allCountersOfFriendlyColour = document.querySelectorAll(`.${friendlyColour}`);
        //typeOfCounter, team, x, y, show

        allCountersOfFriendlyColour.forEach( field => {
            typeOfCounter = field.classList[4];
            coordinates = getCoordinatesFromField(field, false);
            const {x, y} = coordinates;

            findMovesForSomebody(typeOfCounter, friendlyColour, x, y, false);
        })
    }

