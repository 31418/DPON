class State {
    constructor(state) {
        this.set(state)
    }
    set(state){
        this.last = this.state
        this.state = state
        this.time = 0
        this.justSetState = true
    }
    get(){
        return this.state
    }
    update(dt){
        this.first = this.justSetState
        this.justSetState = false
        this.time += this.first ? 0 : dt;
    }
}