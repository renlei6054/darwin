function Zone(pos, dim) {
    "use strict";

    this.pos        = pos;                              // Position
    this.dim        = dim;                              // Dimensions

    this.cva        = document.createElement('canvas'); // Canvas buffer
    this.cva.width  = dim.x;
    this.cva.height = dim.y;
    this.ctx        = this.cva.getContext("2d");        // Contexte buffer

    this.ctx.initTexte();

    this.aChange    = false;                            // S'il y a de nouvelles données
}

(function () {
    "use strict";
    Zone.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.dim.x, this.dim.y);
    };
}());