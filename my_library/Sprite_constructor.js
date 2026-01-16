class Sprite {
    constructor(texture) {
        this.texture = texture;
        this.pos = new Vector();
        this.anchor = { x: 0, y: 0 };
        this.pivot = { x: 0, y: 0 };
        this.scale = { x: 1, y: 1 };
        this.frame = {x:0, y:0}
    }
}