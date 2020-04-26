export let getActiveCoordinates,
    getCoordinatesFromField,
    getFieldFromCoordinates,
    getActiveField;

    getFieldFromCoordinates = (x,y) => {
        const field = document.querySelector(`.x${x}.y${y}`);
    
        return field;
    }

    getActiveField = (parent) => {
        const active = document.querySelector(".active");
    
        if(active !== null){
            if(parent === true){
                return active.parentNode;
            } else {
                return active;
            }
            
        }
    
        return null;
        
    };

    getActiveCoordinates = () => {

        const activeCounter = getActiveField(true);

        const coordinates = {
            "x": Number(activeCounter.classList[1].charAt(1)), // X position
            "y": Number(activeCounter.classList[2].charAt(1)) // Y position
        };

        return coordinates;


    };

    getCoordinatesFromField = (field, fromParent) => {

        const coordinates = fromParent // If true, get if from parentNode
            ? {
                "x": Number(field.parentNode.classList[1].charAt(1)), // X position
                "y": Number(field.parentNode.classList[2].charAt(1)) // Y position
            }
            : // If false, get directly from field
        {
            x: Number(field.classList[1].charAt(1)), // X position
            y: Number(field.classList[2].charAt(1)) // Y position
        };


        return coordinates;

    };