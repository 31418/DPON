
class MouseControls {
    constructor(container) {
      console.log('MouseControls constructor called');
      this.el = container || document.body;
  
      this.pos = { x: 0, y: 0 };
      this.isDown = false;
      this.pressed = false;
      this.released = false;
      TouchList.leftButton = false;
  
      // Handlers
      document.addEventListener("mousedown", e => this.down(e), false);
      document.addEventListener("mouseup", e => this.up(e), false);
      document.addEventListener("mousemove", e => this.move(e), false);
      //document.addEventListener("contextmenu", e => e.preventDefault());

    }
  
    mousePosFromEvent({ clientX, clientY }) {
      const { el, pos } = this;
      const rect = el.getBoundingClientRect();
      const xr = rect.width / el.clientWidth;
      const yr = rect.height / el.clientHeight;
      pos.x = (clientX - rect.left) ;
      pos.y = (clientY - rect.top) ;
    }
  
    down(e) {
      this.isDown = true;
      this.pressed = true;
      this.mousePosFromEvent(e);
      if (e.button === 2){
        this.leftButton = true
        this.isDown = false;
        this.pressed = false;
      }
    }
  
    up() {
      this.isDown = false;
      this.released = true;
      this.leftButton = false;
    }
  
    move(e) {
      this.mousePosFromEvent(e);
    }
    update() {
      this.released = false;
      this.pressed = false;
  }
}