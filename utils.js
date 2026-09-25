async function initCanvas(w, h){
    await Canvas(w, h);

    if (window.innerWidth !== w || window.innerHeight !== h) {
        console.error(`Canvas/window size mismatch: window is ${window.innerWidth}x${window.innerHeight}, expected ${w}x${h}. Run with --width ${w} --height ${h}.`);
        process.exit(1);
    }
}