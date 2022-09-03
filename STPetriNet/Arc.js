class Arc {

    constructor(origin, destination) {
        this.origin = origin;
        this.destination = destination;
    }

    getOrigin(){
        return this.origin;
    }

    getDestination(){
        return this.destination;
    }

    setOrigin(place){
        this.origin = place;
    }

    setDestination(place){
        this.destination = place;
    }
}