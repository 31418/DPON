

class TitleScreen extends AddRemoveUpdate {
    constructor(game, controls, onStart){
        super()
        this.controls = controls
        this.onStart = onStart


        const drawText = (text, pos, size = 24) => {
            const font = `${size}pt 'VT323', monospace`
            const texty = new Text(text, { font: font, fill: "#161212ff" });
            texty.pos = pos;
            return this.add(texty);
        }

        const fakeControls = {
            x: 0,
            y: 0,
            action: false
          };

        this.add(new Level(game.w * 1, game.h * 1))

        this.animDone = false

        "squizzball".split("").map((c, i) => {
            const text = this.add(new Text(c, { font: '80pt VT323, monospace', fill: "#003f61ff" }));
            text.pos = { x: 60 + i * 50, y: -i * 200 };
            this.add(
                new Timer(1.5, p =>  text.pos.y = elasticOut(p) * 320 - 150, () => this.animDone = true, rand(0.2, 3) * 0.2)
            )
        })

        this.add(new Timer(1.5, p => {}, () => drawText('E: Easy difficulty', {x: 60, y: game.h / 2 + 50}, 24), 0))
        this.add(new Timer(1.5, p => {}, () => drawText('R: Medium difficulty', {x: 60, y: game.h / 2 + 80}, 24), 0))
        this.add(new Timer(1.5, p => {}, () => drawText('T: Hard difficulty', {x: 60, y: game.h / 2 + 110}, 24), 0))

        const squizz = this.add(new Squizz(fakeControls));
        squizz.update = () => {};
        squizz.pos = { x: 140, y: 200 };


    }
    update(dt, t){
        super.update(dt, t);
        const { title, controls } = this;
        if (this.animDone) {
        if (controls.action) {
          this.onStart(1);
        }
        else if (controls.r){
            this.onStart(2);
        }
        else if (controls.t){
            this.onStart(3);
        }
    }
    }
}



class StatsScreen extends AddRemoveUpdate {
    constructor(game, controls, onStart){
        super()
        this.controls = controls
        this.onStart = onStart


        

        const drawText = (text, pos, size = 24) => {
            const font = `${size}pt 'VT323', monospace`
            const texty = new Text(text, { font: font, fill: "#161212ff" });
            texty.pos = pos;
            return this.add(texty);
        }

        drawText('Stats', { x: game.w / 2, y: 50 }, 48);
        drawText('Press E to return to title screen', { x: game.w / 2, y: game.h - 100 }, 24);

        drawText('Games played: ' + localStorage.getItem('gamesPlayedSquizzBall'), { x: 60, y: 150 }, 24);
        drawText('----', { x: 60, y: 180 }, 24);
        
    

    }
    update(dt, t){
        super.update(dt, t);
        const { title, controls } = this;
        if (controls.action){
            this.onStart();
        }
    }
    
}

class CreditsScreen extends AddRemoveUpdate {
    constructor(game, controls, onStart){
        super()
        this.controls = controls
        this.onStart = onStart


        

        const drawText = (text, pos, size = 24) => {
            const font = `${size}pt 'VT323', monospace`
            const texty = new Text(text, { font: font, fill: "#161212ff" });
            texty.pos = pos;
            return this.add(texty);
        }
        drawText('Credits', { x: game.w / 2, y: 50 }, 48);
        drawText('Made by Bruce Lu', { x: 60, y: 150 }, 24);
        drawText('Press E to return to title screen', { x: game.w / 2, y: game.h - 100 }, 24);
        
    

    }
    update(dt, t){
        super.update(dt, t);
        const { title, controls } = this;
        if (controls.action){
            this.onStart();
        }
    }
    
}