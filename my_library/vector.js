console.log('Loading vector.js');
class Vector{
    static from(v){
        return new Vector().copy(v)
    }
    constructor(x = 0, y = 0){
        this.set(x, y)
    }
    mag(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    copy({x, y}){
        this.x = x;
        this.y = y;
        return this;
    }
    increase({x, y}){
        this.x += x;
        this.y += y;
        return this;
    }
    multiply(s){
        this.x *= s;
        this.y *= s;
        return this;
    }
    clone(){
        return Vector.from(this)
    }
    normalize(){
        const mag = this.mag()
        if (mag > 0){
            this.x /= mag;
            this.y /= mag;
        }
        return this;
    }
    dot({x, y}){
        return this.x * x + this.y * y;
    }
}