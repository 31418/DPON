class soundpool{
    constructor(url, settings = {}, poolsize = 3){
        this.count = 0
        this.sounds = [...Array(poolsize)].map((() => new sound(url, settings)))
    }
    play(settings){
        const index = this.count++ % this.sounds.length
        this.sounds[index].play(settings)
    }
    stop(){
        this.sounds.forEach(s => s.stop())
    }
}