class sound {
    constructor(url, settings = {}) {
        this.src = url
        this.options = Object.assign({volume: 1}, settings)
        const audio = Assests.sound(url);
        if (this.options.loop === true){
            audio.loop = true;
        }
        this.audio = audio;
    }
    play(overtop){
        const {audio, options} = this;
        const opts = Object.assign({time: 0}, options, overtop);
        audio.volume = opts.volume;
        audio.currentTime = opts.time;
        audio.play();
    }
    stop(){
        this.audio.pause();
    }
    get volume(){
        return this.audio.volume;
    }
    set volume(v){
        this.audio.volume = this.options.volume = v;
    }
}

class soundgroup {
    constructor(sounds){
        this.sounds = sounds
    }
    play(settings){
        randOneFrom(this.sounds).play(settings)
    }
    stop(){
        this.sounds.forEach(s => s.stop())
    }
}

