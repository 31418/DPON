const cache = {}
let remaining = 0
let total = 0

const readyListeners = []
const progressListeners = []
let completed = false;  


function done(){
    completed = true;
    readyListeners.forEach(cb => cb());
}

function onAssetLoad(e) {
  if (completed) {
    console.warn("Warning: asset defined after preload.", e.target);
    return;
  }

  remaining--;
  progressListeners.forEach(cb => cb(total - remaining, total));
  if (remaining === 0) {
    // We're done loading
    done();
  }
}


function load(url, create){
    if (cache[url]){
        return cache[url]
    }
    const asset = create(url, onAssetLoad)
    remaining++
    total++

    cache[url] = asset
    return asset;
}

const Assests = {
    image(url){
        return load(url, (url, onAssetLoad) => {
            const img = new Image()
            img.src = url
            img.addEventListener('load', onAssetLoad, false)
            return img
        })
    },
    sound(url){
        return load(url, (url, onAssetLoad) => {
            const audio = new Audio()
            audio.src = url
            const onLoad = e => {
                audio.removeEventListener('canplay', onLoad)
                onAssetLoad(e)
            }
            audio.addEventListener('canplay', onLoad, false)
            return audio;
        }).cloneNode()

    },
    onReady(cb){
        readyListeners.push(cb)

        if (remaining === 0){
            done()
        }
    
    },
    onProgress(cb){
        progressListeners.push(cb)
    }
}
