document.addEventListener('DOMContentLoaded', () => {
    var video = document.getElementById('player');
    var src = 'aseets/video/jfe_aboutus_final.m3u8'
    const defaultOptions = {};
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.on(Hls.Events.MANIFEST_PARSED, function(event, data){
            const availableQualities = hls.levels.map((l) => l.height)
            defaultOptions.controls = 
            [
                'play-large',
                'restart',
                'rewind', 
                'play',
                'fast-forward', 
                'progress',
                'current-time',
                'duration', 
                'mute',
                'volume', 
                'captions', 
                'settings',
                'pip', 
                'airplay', 
                'download',
                'fullscreen', 
            ];
            defaultOptions.quality = {
                default: availableQualities[0],
                Options: availableQualities,
                forced: true,
                onChange: (e) => updateQuality(e)
            }
            new plyr(video, defaultOptions);
        });
        hls.attachMedia(video);
        window.hls = hls;
    }
    function updateQuality(newQuality){
        window.hls.levels.forEach((level, leveIndex) => {
            if(level.height === newQuality) {
                window.hls.currentLevel = leveIndex;
            }
        })
    }
})