function UITooltips(vue) {
    "use strict";
    
    var me = this,
        cva,
        ctx;
    
    this.vue            = vue;
    this.tooltipEnCours = null;
    this.prepos         = {x: 0, y: 0};
    this.casesActives   = [];
    this.indexTooltip   = [];
    this.tooltips       = [];
    
    this.vue.ctxTT.initTexte();
    
    vue.onMove.push(function (evt) {
        var rect    = me.vue.cva.getBoundingClientRect(),
            pos,
            indexCell = me.vue.indexCaseGrilleEvt(evt);
        
        if (me.tooltipEnCours) {
            me.vue.ctxTT.clearRect(me.prepos.x, me.prepos.y, me.tooltipEnCours.dim.x, me.tooltipEnCours.dim.y);
        }
        
        if (me.casesActives[indexCell]) {
            pos = { x : evt.clientX - rect.left, y : evt.clientY - rect.top + 30 };
            me.prepos = pos;
            me.tooltipEnCours = me.tooltips[me.indexTooltip[indexCell]];
            me.vue.ctxTT.drawImage(me.tooltipEnCours.canvas, pos.x, pos.y);
        } else {
            me.tooltipEnCours = null;
        }
        
    });
    
    cva        = document.createElement('canvas'); // Canvas buffer
    cva.width  = 70;
    cva.height = 100;
    ctx        = cva.getContext("2d");        // Contexte buffer
    
    ctx.fillStyle = COPIC.W0;
    ctx.fillRect(0, 0, 70, 100);
    ctx.fillStyle = COPIC.W10;
    ctx.initTexte();
    ctx.fillText("Coucou", 0, 0);
    
    this.ajoutTT({x: 0, y: 0}, {x: 3, y: 4}, cva);
}

(function () {
    "use strict";
    
    UITooltips.prototype.ajoutTT = function (pos, dim, canvas) {
        var compteurX,
            compteurY,
            index = this.tooltips.push({ canvas: canvas, dim: { x: canvas.width, y: canvas.height } }) - 1;

        if (typeof canvas !== "undefined") {
            for (compteurX = 0; compteurX < dim.x; compteurX += 1) {
                for (compteurY = 0; compteurY < dim.y; compteurY += 1) {
                    this.casesActives[this.vue.indexCaseGrille({x: pos.x + compteurX, y: pos.y + compteurY})]   = true;
                    this.indexTooltip[this.vue.indexCaseGrille({x: pos.x + compteurX, y: pos.y + compteurY})]   = index;
                }
            }
        }
    };
    
}());