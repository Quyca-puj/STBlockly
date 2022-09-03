class Place {
 
    constructor(name){
        this.name =name;
        this.character = character;
        this.in = new Array();
        this.out = new Array();
    }

    setAction(action){
        this.action=action;
    }

    setCharacter(character){
        this.character = character;

    }

    addArc(arc, toPlace){
        if(toPlace){
            this.in.push(arc);
        }else{
            this.out.push(arc);
        }
    }

    removeArc(arc){
        let idx = this.in.indexOf(arc);
        if(idx!=-1){
            this.in.splice(idx,idx);
        }else{
            idx = this.out.indexOf(arc);
            this.out.splice(idx,idx);
        }
    }

    getInArcs(){
        return this.in;
    }

    getOutArcs(){
        return this.out;
    }
}