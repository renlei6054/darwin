(function () {
    "use strict";

    Big.prototype.setMin = function (valeur) {
        if (this.lt(valeur)) {
            return valeur;
        } else {
            return this;
        }
    };

    Big.prototype.setMax = function (valeur) {
        if (this.gt(valeur)) {
            return valeur;
        } else {
            return this;
        }
    };
}());