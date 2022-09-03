class Action{
    constructor(){
        this.conditions = Set();
    }

    getConditions(){
        return this.conditions;
    }

    hasConditions(conditionSet){
        let intersection = new Set(
            [...conditionSet].filter(x => this.conditions.has(x)));
        return intersection.size>0;
    }

}