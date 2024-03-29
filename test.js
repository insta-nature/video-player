document.addEventListener("DOMContentLoaded", function() {
    let e = document.querySelectorAll(".video-container");

    function t(e, t) {
        e.paused ? (e.play(), t.textContent = "pause") : (e.pause(), t.textContent = "play_arrow")
    }

    function r(e, t, r, i) {
        let n = t.getBoundingClientRect(),
            l = n.bottom - i.clientY,
            a;
        a = l < 5 ? 0 : l > n.height - 5 ? n.height : l;
        let o = a / n.height;
        e.volume = o, r.style.height = 100 * o + "%"
    }

    function i(e, t, r, i, n) {
        if (n || "click" === i.type) {
            let l = i.clientX - t.getBoundingClientRect().left,
                a = l / t.offsetWidth;
            e.currentTime = a * e.duration, r.style.width = 100 * a + "%"
        }
    }

    function n(e, t) {
        let r = l(e.currentTime),
            i = l(Math.round(e.duration - e.currentTime));
        t.textContent = `${r} / ${i}`
    }

    function l(e) {
        let t = Math.floor(e / 3600),
            r = Math.floor(e % 3600 / 60).toString().padStart(2, "0"),
            i = Math.floor(e % 60).toString().padStart(2, "0");
        if (t > 0) {
            let n = t.toString().padStart(2, "0");
            return `${n}:${r}:${i}`
        }
        return `${r}:${i}`
    }

    function a(e) {
        try {
            let t = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID),
                r = new chrome.cast.ApiConfig(t, () => {}, e => {
                    var t;
                    return t = e, void(t === chrome.cast.ReceiverAvailability.AVAILABLE ? console.log("Chromecast receiver available.") : console.log("Chromecast receiver not available."))
                });
            chrome.cast.initialize(r, () => {
                console.log("Chromecast API successfully initialized."), e.style.display = "block", e.addEventListener("click", () => {
                    var e, r;
                    return e = t, void(e && chrome.cast.requestSession(e => {
                        let t = r.currentSrc,
                            i = r.type,
                            n = new chrome.cast.media.MediaInfo(t, i),
                            l = new chrome.cast.media.LoadRequest(n);
                        e.loadMedia(l, () => {}, console.error)
                    }, console.error))
                })
            }, console.error)
        } catch (i) {
            console.error("Failed to initialize Chromecast API:", i)
        }
    }
    e.forEach(e => {
        let l = e.querySelector("video"),
            o = e.querySelector(".timestamp"),
            s = e.querySelector(".toggle-play-pause"),
            c = e.querySelector(".toggle-fullscreen"),
            d = e.querySelector(".toggle-picture-in-picture"),
            u = e.querySelector(".toggle-airplay"),
            v = e.querySelector(".toggle-chromecast"),
            y = e.querySelector(".buffered-amount-bar"),
            m = e.querySelector(".current-progress-bar"),
            g = e.querySelector(".progress-bar-container"),
            p = e.querySelector(".volume-container"),
            f = p.querySelector(".volume-slider"),
            b = f.querySelector(".line"),
            E = p.querySelector(".toggle-volume"),
            n = e.querySelector(".play-btn"),
            h = !1,
            L = !1;
        l.addEventListener("loadedmetadata", () => n(l, o)), l.addEventListener("timeupdate", () => {
            (function e(t, r) {
                let i = t.currentTime / t.duration * 100;
                r.style.width = i + "%"
            })(l, m), n(l, o)
        }), l.addEventListener("progress", () => (function e(t, r) {
            if (t.buffered.length > 0) {
                let i = t.buffered.end(t.buffered.length - 1),
                    n = i / t.duration * 100;
                r.style.width = n + "%"
            }
        })(l, y)), g.addEventListener("mousedown", () => h = !0), g.addEventListener("mouseup", () => h = !1), g.addEventListener("mousemove", e => i(l, g, m, e, h)), g.addEventListener("click", e => i(l, g, m, e, h)), s.addEventListener("click", () => t(l, s)), l.addEventListener("click", () => t(l, s)), f.addEventListener("mousedown", () => L = !0), document.addEventListener("mouseup", () => L = !1), document.addEventListener("mousemove", e => {
            L && r(l, f, b, e)
        }), f.addEventListener("click", e => r(l, f, b, e)), E.addEventListener("click", () => {
            var e, t;
            return e = l, t = E, void(e.muted ? (e.muted = !1, t.textContent = "volume_up") : (e.muted = !0, t.textContent = "volume_off"))
        });
        let $;
        p.addEventListener("mouseenter", () => {
                clearTimeout($), f.classList.add("show-slider")
            }), p.addEventListener("mouseleave", () => {
                L || ($ = setTimeout(() => {
                    f.classList.remove("show-slider")
                }, 300))
            }), document.addEventListener("mouseup", () => {
                L = !1, ! function e(t) {
                    let r = t.getBoundingClientRect();
                    return r.top <= window.event.clientY && window.event.clientY <= r.bottom && r.left <= window.event.clientX && window.event.clientX <= r.right
                }(f) && ($ = setTimeout(() => {
                    f.classList.remove("show-slider")
                }, 300))
            }), document.pictureInPictureEnabled ? (d.style.display = "block", d.addEventListener("click", () => {
                var e;
                return e = l, void(document.pictureInPictureElement ? document.exitPictureInPicture() : e.requestPictureInPicture())
            })) : d.style.display = "none", document.fullscreenEnabled || document.webkitFullscreenEnabled ? (c.style.display = "block", c.addEventListener("click", () => {
                var t;
                return t = e, void(document.fullscreenElement ? document.exitFullscreen() : t.requestFullscreen())
            })) : c.style.display = "none", window.WebKitPlaybackTargetAvailabilityEvent ? (u.style.display = "block", u.addEventListener("click", () => {
                var e;
                return e = l, void(window.WebKitPlaybackTargetAvailabilityEvent ? e.addEventListener("webkitplaybacktargetavailabilitychanged", t => {
                    "available" === t.availability && e.webkitShowPlaybackTargetPicker()
                }) : alert("AirPlay is not supported in this browser."))
            })) : u.style.display = "none",
            function e(t) {
                try {
                    chrome.cast && chrome.cast.isAvailable ? (console.log("Chromecast API is available."), a(t)) : (console.log("Attempting to initialize Chromecast API..."), setTimeout(() => a(t), 1e3))
                } catch (r) {
                    console.error("Chromecast API is not supported in this browser.")
                }
            }(v)
    })
});