class Net {
    constructor() {
        this.places = [];
        this.arcs = []
    }

    addArc(origin, destination) {
        let isValid = true;
        const destIn = destination.getInArcs();
        destIn.array.forEach(element => {
            let isValid = isValid && !element.getOrigin().hasConditions(origin);
        });
        if(isValid){
            const arc = new Arc(origin, destination);
            origin.addArc(arc, true);
            destination.addArc(arc, false);
            this.arcs.push(arc);
        }
        
        return isValid;
    }
    
    addPlace(place){
        this.places.push(place);
    }

    removePlace(place){
        let idx = this.places.indexOf(place);
        this.places.splice(idx,idx);
    }


    removeArc(arc){
        let idx = this.arcs.indexOf(arc);
        this.arcs.splice(idx,idx);
        let placeOrigin = arc.getOrigin();
        let placeDestination = arc.getDestination();
        placeOrigin.removeArc(arc);
        placeDestination.removeArc(arc);
    }
}