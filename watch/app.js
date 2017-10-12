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
                id("line").innerHTML = "Movie not available at the moment. <a href='/'><br>Try another movie.</a>";
            }, 12000);

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

                id("line").innerHTML = torrentname;

                var loadingInteval = setInterval(function () {

                    id("line").innerHTML = "Downloading " + bytes(torrent.downloadSpeed) + "/s from " + torrent.numPeers + (torrent.numPeers === 1 ? " cornflix user" : " cornflix users");

                    id("loadingbar").style.width = Math.round(torrent.progress * 100 * 100) / 1.2 + "%";

                    if (torrent.progress > 0.008) {

                        id("line").innerHTML = tip ;

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

                        } else {

                            id("line").innerHTML = "Error: Invalid file";

                        }
                    }

                }, 1700);

            });

        } else {

            location.assign("/");

        }

    } else {

        location.assign("/");

    }

}
