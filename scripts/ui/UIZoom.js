function UIZoom(vue, zone) {
    "use strict";
    
    var me = this;
    
    this.vue = vue;
    this.zone = zone;
    
    this.vue.onInit.push(function () { me.dSurC(); me.d(); });
    this.vue.onChgtCrea.push(function () { me.d(); });
    
    this.vue.onChgt.push({
        fonction : function () { me.d(); },
        code : C.CHANGEMENTS.CARTE
    });
}

(function () {
    "use strict";
    UIZoom.prototype.dSurC = function () {
        var zone = this.zone,
            ctx = zone.ctx,
            iType,
            echelle = zone.dim.x / (((C.NB_TYPES_CREATURES - 1) * 70) + 70),
            posX;

        ctx.save();
        ctx.scale(echelle, echelle);
        ctx.fillStyle   = COPIC.NOIR;
        ctx.font        = '20pt Calibri';

        for (iType = 0; iType < C.NB_TYPES_CREATURES; iType += 1) {
            posX = 65 * iType + 50;
            ctx.led(posX, 30, COPIC.TRANSP);
        }

        ctx.restore();

        this.vue.ctxSurC.drawImage(zone.cva, zone.pos.x, zone.pos.y);
        zone.clear();
    };
    
    UIZoom.prototype.d = function () {
        var zone = this.zone,
            ctx = zone.ctx,
            iType,
            echelle = zone.dim.x / (((C.NB_TYPES_CREATURES - 1) * 70) + 70),
            posX;

        zone.clear();
        ctx.save();
        ctx.scale(echelle, echelle);

        for (iType = 0; iType < C.NB_TYPES_CREATURES; iType += 1) {
            posX = 65 * iType + 50;
            ctx.remplirCercle(posX, 30, 10, COPIC.N3);
        }

        posX = parseInt(this.vue.carteAffichee.niveau.mul(-1).add(C.NB_TYPES_CREATURES - 1).mul(65).add(50).toFixed(), 10);

        ctx.remplirCercle(posX, 30, 10, COPIC.YG23);

        ctx.restore();

        zone.aChange = true;
    };
}());