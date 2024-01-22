document.getElementById('play-btn').addEventListener('click', function() {
var ctrlVideo = document.getElementById("vid-play");  
    if (ctrlVideo.paused) {
        ctrlVideo.play();   
        this.style.display = 'none';
    } else {
        ctrlVideo.pause();
        this.style.display = 'block';
    }
});