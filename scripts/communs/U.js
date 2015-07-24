var U = {};
(function () {
    "use strict";
    U.tg            = function (nb) { return typeof nb !== "undefined" ? C.TAILLE_GRILLE * nb : C.TAILLE_GRILLE; };
    U.distance      = function (a, b) { var dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); };
    U.tableauRempli = function (v, l) { var retour = [], compteur; for (compteur = 0; compteur < l; compteur += 1) { retour.push(v); } return retour; };
    U.repete        = function (fonction, nb) { var compteur; for (compteur = 0; compteur < nb; compteur += 1) { fonction(); } };

    U.eachTerrain = function (element, fonction) {
        var iTerrain;

        for (iTerrain in C.TERRAIN) {
            if (C.TERRAIN.hasOwnProperty(iTerrain)) {
                fonction.call(element, C.TERRAIN[iTerrain]);
            }
        }
    };

    U.eachDelta = function (element, fonction) {
        var iDelta;

        for (iDelta in C.DELTAS) {
            if (C.DELTAS.hasOwnProperty(iDelta)) {
                fonction.call(element, C.DELTAS[iDelta]);
            }
        }
    };

    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());

    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size += 1;
            }
        }
        return size;
    };
    

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
}());