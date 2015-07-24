function UIMiniStats(vue, zone) {
    "use strict";
    
    var me = this;
    
    this.vue = vue;
    this.zone = zone;
    
    this.vue.onInit.push(function () { me.dSurC(); });
    this.vue.onChgtCrea.push(function () { me.dSurC(); me.d(); });
    this.vue.onChgt.push({
        fonction : function () { me.d(); },
        code : C.CHANGEMENTS.POPULATION
    });
}

(function () {
    "use strict";
    
    UIMiniStats.prototype.dSurC = function () {
        var zone  = this.zone,
            ctx = zone.ctx,
            iCreature;

        zone.clear();

        ctx.rndLine(0, U.tg(4), zone.dim.x, U.tg(4));

        for (iCreature = 0; iCreature < this.vue.darwin.creatures.length; iCreature += 1) {
            ctx.save();

            ctx.translate(U.tg(3 * iCreature), 0);
            ctx.scale(U.tg(3) / 150, U.tg(3) / 150);

            ctx.led(30, 140, COPIC.TRANSP);
            ctx.led(60, 140, COPIC.TRANSP);
            ctx.led(90, 140, COPIC.TRANSP);
            ctx.led(120, 140, COPIC.TRANSP);
            ctx.barreAvancementSurC(15, 165);

            ctx.dCreature(this.vue.darwin.creatures[iCreature], { x: 18, y : 8 }, 114);

            ctx.restore();
        }

        this.vue.ctxSurC.drawImage(zone.cva, zone.pos.x, zone.pos.y);
        zone.clear();
    };
    
    UIMiniStats.prototype.d = function () {
        var zone = this.zone,
            ctx = zone.ctx,
            iCreature,
            creature;

        //ctx.rndLine(0, U.tg(4), zone.dim.x, U.tg(4));

        for (iCreature = 0; iCreature < this.vue.darwin.creatures.length; iCreature += 1) {
            creature = this.vue.darwin.creatures[iCreature];
            //this.dCreatureMinistats(ctx, this.darwin.creatures[iCreature], {x: U.tg(3 * iCreature), y: 0}, U.tg(3));

            ctx.save();

            ctx.translate(U.tg(3 * iCreature), 0);
            ctx.scale(U.tg(3) / 150, U.tg(3) / 150);

            if (creature.actionEnCours === C.ACTIONS.PEUPLEMENT) {
                ctx.remplirCercle(30, 140, 10, COPIC.YR16);
                ctx.remplirCercle(60, 140, 10, COPIC.R24);
                ctx.remplirCercle(90, 140, 10, COPIC.R24);
            } else if (creature.actionEnCours === C.ACTIONS.CONQUETE) {
                ctx.remplirCercle(30, 140, 10, COPIC.YG23);
                ctx.remplirCercle(60, 140, 10, COPIC.YR16);
                ctx.remplirCercle(90, 140, 10, COPIC.R24);
            } else {
                ctx.remplirCercle(30, 140, 10, COPIC.YG23);
                ctx.remplirCercle(60, 140, 10, COPIC.YG23);
                ctx.remplirCercle(90, 140, 10, COPIC.YR16);
            }

            ctx.remplirCercle(120, 140, 10, COPIC.R24);

            /*ctx.remplirCercle(30, 140, 10, COPIC.YG23);
            ctx.remplirCercle(60, 140, 10, COPIC.YG23);
            ctx.remplirCercle(90, 140, 10, COPIC.YR16);
            ctx.remplirCercle(120, 140, 10, COPIC.R24);*/

            ctx.barreRatio(15, 165, creature.deltasRatio);

            //this.dCreature(ctx, this.darwin.creatures[iCreature], { x: 18, y : 8 }, 114);
            ctx.restore();
        }
        
        zone.aChange = true;
    };
    
}());