class KeyControls {
  constructor() {
    this.keys = {};
    document.addEventListener(
      "keydown",
      (e) => {
        e.preventDefault();
        this.keys[e.code] = true;
      },
      false
    );

    document.addEventListener(
      "keyup",
      (e) => {
        e.preventDefault();
        this.keys[e.code] = false;
      },
      false
    );
    console.log("KeyControls initialized");
  }
  get action() {
    if (this.keys.KeyE) {
      console.log("action");
      return true;
    } else {
      return false;
    }
  }
  get tab() {
    if (this.keys.Tab) {
      return true;
    }
  }
  get one() {
    if (this.keys.Digit1) {
      return true;
    } else {
      return false;
    }
  }
  get two() {
    if (this.keys.Digit2) {
      return true;
    } else {
      return false;
    }
  }
  get three() {
    if (this.keys.Digit3) {
      return true;
    } else {
      return false;
    }
  }
  get four() {
    if (this.keys.Digit4) {
      return true;
    } else {
      return false;
    }
  }
  get five() {
    if (this.keys.Digit5) {
      return true;
    } else {
      return false;
    }
  }
  get six() {
    if (this.keys.Digit6) {
      return true;
    } else {
      return false;
    }
  }

  get seven() {
    if (this.keys.Digit7) {
      return true;
    } else {
      return false;
    }
  }

  get eight() {
    if (this.keys.Digit8) {
      return true;
    } else {
      return false;
    }
  }

  get nine() {
    if (this.keys.Digit9) {
      return true;
    } else {
      return false;
    }
  }
  get numberHeld() {
    if (this.keys.Digit0) {
      return 0;
    } else if (this.keys.Digit1) {
      return 1;
    } else if (this.keys.Digit2) {
      return 2;
    } else if (this.keys.Digit3) {
      return 3;
    } else if (this.keys.Digit4) {
      return 4;
    } else if (this.keys.Digit5) {
      return 5;
    } else if (this.keys.Digit6) {
      return 6;
    } else if (this.keys.Digit7) {
      return 7;
    } else if (this.keys.Digit8) {
      return 8;
    } else if (this.keys.Digit9) {
      return 9;
    } else {
      return null;
    }
  }
  get numberHeldAligned() {
    if (this.keys.Digit0) {
      return 9;
    } else if (this.keys.Digit1) {
      return 0;
    } else if (this.keys.Digit2) {
      return 1;
    } else if (this.keys.Digit3) {
      return 2;
    } else if (this.keys.Digit4) {
      return 3;
    } else if (this.keys.Digit5) {
      return 4;
    } else if (this.keys.Digit6) {
      return 5;
    } else if (this.keys.Digit7) {
      return 6;
    } else if (this.keys.Digit8) {
      return 7;
    } else if (this.keys.Digit9) {
      return 8;
    } else {
      return null;
    }
  }

  get shift() {
    if (this.keys.ShiftLeft || this.keys.ShiftRight) {
      return true;
    } else {
      return false;
    }
  }
  get r() {
    if (this.keys.KeyR) {
      return true;
    } else {
      return false;
    }
  }
  get t() {
    if (this.keys.KeyT) {
      return true;
    } else {
      return false;
    }
  }
  get p() {
    if (this.keys.KeyP) {
      return true;
    } else {
      return false;
    }
  }
  get b() {
    if (this.keys.KeyB) {
      return true;
    } else {
      return false;
    }
  }
  get q() {
    if (this.keys.KeyQ) {
      return true;
    } else {
      return false;
    }
  }
  get esc() {
    if (this.keys.Escape) {
      return true;
    } else {
      return false;
    }
  }
  get l() {
    if (this.keys.KeyL) {
      return "true";
    } else {
      return false;
    }
  }
  get space() {
    if (this.keys.Space) {
      return true;
    } else {
      return false;
    }
  }
  get x() {
    if (this.keys.KeyD || this.keys.ArrowRight) {
      return 1;
    } else if (this.keys.KeyA || this.keys.ArrowLeft) {
      return -1;
    } else {
      return 0;
    }
  }
  get y() {
    if (this.keys.KeyS || this.keys.ArrowDown) {
      return 1;
    } else if (this.keys.KeyW || this.keys.ArrowUp) {
      return -1;
    } else {
      return 0;
    }
  }
}
