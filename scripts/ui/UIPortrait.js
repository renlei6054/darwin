function UIPortrait(vue, zone) {
    "use strict";
    
    var me = this;
    
    this.vue    = vue;
    this.zone   = zone;
    
    this.vue.onInit.push(function () { me.d(); });
    this.vue.onChgtCrea.push(function () { me.d(); });
}

(function () {
    "use strict";
    
    UIPortrait.prototype.d = function () {
        var zone = this.zone,
            vue = this.vue,
            ctx = zone.ctx,
            echelle = 1 - parseInt(vue.creatureAffichee.type.toFixed(), 10) * 0.1;
        zone.clear();

        ctx.dCreature(vue.creatureAffichee, {x: zone.cva.width * (1 - echelle) / 2, y: zone.cva.height * (1 - echelle) / 2}, zone.cva.width * echelle);

        vue.ctxSousC.clearZone(zone);
        vue.ctxSousC.drawImage(zone.cva, zone.pos.x, zone.pos.y);
    };
    
}());