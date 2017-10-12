"use strict";

var client = new WebTorrent();

plyr.setup();

var trackers = [
    "wss://tracker.openwebtorrent.com",
    "wss://tracker.btorrent.xyz",
    "wss://tracker.fastcast.nz"
]

function id(id) {
    return document.getElementById(id);
}

function bytes(num) {
  var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  if (neg) num = -num
  if (num < 1) return (neg ? '-' : '') + num + ' B'
  exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = Number((num / Math.pow(1000, exponent)).toFixed(2))
  unit = units[exponent]
  return (neg ? '-' : '') + num + ' ' + unit
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


if (WebTorrent.WEBRTC_SUPPORT) {

    id("line").innerHTML = "<br>";

    if (getParameterByName("v")) {

        if (getParameterByName("v").length == 40) {

            id("line").innerHTML = "Connecting to cornflix...";

            id("loading").removeAttribute("hidden");

            var hash = getParameterByName('v');

            var noPeerFoundTimeout = setTimeout(function () {
                id("line").innerHTML = "Movie not available at the moment. <a href='/'>Try another movie.</a>";
            }, 22000);

            client.add(hash, { announce: trackers }, function (torrent) {

                clearInterval(noPeerFoundTimeout);

                var tips = [
                    "<a href='https://www.facebook.com/sharer/sharer.php?u=https%3A//cornflix.nl' target='_blank'>Share cornflix on facebook</a> while we prepare your movie.",
                    "<a href='https://twitter.com/home?status=Free%20movie%20streaming%3A%20https%3A//cornflix.nl%20via%20%40cornflixteam' target='_blank'>Share cornflix on twitter</a> while we prepare your movie.",
                    "<a href='https://twitter.com/cornflixteam' target='_blank'>Follow cornflix on twitter</a> while your movie is loading."
                ]

                var tip = tips[Math.floor(Math.random() * tips.length)];

                var torrentname = torrent.name.replace(/(\[.*?\])/g, '').replace(/(\(.*?\))/g, '');

                document.title = "Cornflix - " + torrentname;

                id("line").innerHTML = "Downloading <i>" + torrentname + "</i> <span id='down'>(0 KB/s)</span>";

                var loadingInteval = setInterval(function () {

                    id("down").innerHTML = "(" + bytes(torrent.downloadSpeed) + "/s)"

                    id("loadingbar").style.width = Math.round(torrent.progress * 100 * 100) / 1.2 + "%";

                    if (torrent.progress > 0.006) {

                        id("line").innerHTML = tip + "<span hidden id='down'></span>" ;

                    }

                    if (torrent.progress > 0.012) {

                        clearInterval(loadingInteval);

                        var file = torrent.files.find(function (file) {

                            return file.name.endsWith('.mp4');

                        });

                        if (file) {

                            id("big").setAttribute("hidden", true);

                            file.renderTo('video');

                            id("logo").removeAttribute("hidden");

                            id("player").removeAttribute("hidden");


                        }
                    }

                }, 1500);

            });

        } else {

            location.assign("/");

        }

    } else {

        location.assign("/");

    }

} else {

    id("line").innerHTML = "Your web browser is not compatible with Cornflix. <br> <a href='https://www.google.com/chrome/browser/desktop/index.html' target='_blank'>Install  Google Chrome</a>.";

}
