class Text {
    constructor(text = '', style = {}) {
        this.pos = { x: 0, y: 0 };
        this.text = text;
        this.style = style;
    }
}

class CanvasRenderer {
    constructor(w, h) { // Added constructor to initialize width, height, and canvas context
        this.w = w;
        this.h = h;
        this.view = document.createElement('canvas');
        this.view.width = w;
        this.view.height = h;
        this.ctx = this.view.getContext('2d');
    }

    render(container) {
        const { ctx } = this;
        const renderRec = (container) => { // Changed function declaration to arrow function for proper scoping
            container.children.forEach(child => {
                ctx.save();
                if (child.pos) {
                    ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
                }

                if (child.text) { // Added rendering logic for Text objects
                    ctx.font = child.style.font || "10pt sans-serif";
                    ctx.fillStyle = child.style.fill || "black";
                    ctx.textAlign = child.style.align || "left";
                    ctx.fillText(child.text, 0, 0);
                }

                if (child.children) {
                    renderRec(child);
                }
                ctx.restore();
            });
        };
        ctx.clearRect(0, 0, this.w, this.h);
        renderRec(container);
    }
}

