function UIStatsCreature(vue, zone) {
    "use strict";
    
    var me = this;
    
    this.vue = vue;
    this.zone = zone;
    
    this.echelle = zone.dim.x / 200;
    
    this.vue.onInit.push(function () { me.dSurC(); me.d(); });
    this.vue.onChgtCrea.push(function () { me.d(); });
    
    this.vue.onChgt.push({
        fonction : function () { me.dSurC(); },
        code : C.CHANGEMENTS.CARTE + C.CHANGEMENTS.CARTE_INFOS
    });
    this.vue.onChgt.push({
        fonction : function () { me.d(); },
        code : C.CHANGEMENTS.POPULATION
    });
}

(function () {
    "use strict";
    
    UIStatsCreature.prototype.dSurC = function () {
        var zone    = this.zone,
            ctx     = zone.ctx,
            posX    = 45;

        zone.clear();
        ctx.save();
        ctx.scale(this.echelle, this.echelle);

        ctx.fillStyle       = COPIC.W10;
        ctx.textAlign       = 'right';

        ctx.fillText("Pop : ", posX, 50);
        ctx.fillStyle = C.COULEURS_DELTA_0[C.DELTAS.REPRODUCTION];
        ctx.fillText("Rep : ", posX, 75);
        ctx.fillStyle = C.COULEURS_DELTA_0[C.DELTAS.PREDATION];
        ctx.fillText("Pré : ", posX, 100);
        ctx.fillStyle = C.COULEURS_DELTA_0[C.DELTAS.CANNIBALISME];
        ctx.fillText("Can : ", posX, 125);
        ctx.fillStyle       = COPIC.W10;
        ctx.fillText("Ter : ", posX, 150);

        ctx.restore();

        this.vue.ctxSurC.clearZone(zone);

        this.vue.ctxSurC.drawImage(zone.cva, zone.pos.x, zone.pos.y);
        zone.clear();
    };
    
    UIStatsCreature.prototype.d = function () {
        var zone    = this.zone,
            vue     = this.vue,
            ctx     = zone.ctx,
            texte,
            pos1 = 50,
            pos2 = pos1 + 60,
            creature = this.vue.creatureAffichee;

        zone.clear();

        if (creature.populationEvol === 1) {
            vue.animations.push(new Animation(vue.ctxSousC, {x: zone.pos.x, y : zone.pos.y}, this.echelle, {x: pos1, y: 30}, TypesAnimations.plus));
        } else if (creature.populationEvol === -1) {
            vue.animations.push(new Animation(vue.ctxSousC, {x: zone.pos.x, y : zone.pos.y}, this.echelle, {x: pos1, y: 30}, TypesAnimations.moins));
        }

        ctx.save();
        ctx.scale(this.echelle, this.echelle);

        ctx.fillStyle       = COPIC.W10;

        ctx.big(creature.population, pos1, 50);
        ctx.fillText("/", pos1 + 49, 50);
        ctx.big(creature.nbCellsConquises.mul(C.NB_CREATURES_PAR_CELL), pos2, 50);
        ctx.big(creature.deltasFinCycle[C.DELTAS.REPRODUCTION], pos1, 75);
        ctx.big(creature.deltasFinCycle[C.DELTAS.REPRODUCTION].mul(creature.darwin.inverseIntervalesDelta[C.DELTAS.REPRODUCTION]), pos2, 75);
        ctx.fillText("/s", pos2 + 49, 75);
        ctx.big(creature.deltasFinCycle[C.DELTAS.PREDATION].abs(), pos1, 100);
        ctx.big(creature.deltasFinCycle[C.DELTAS.CANNIBALISME].abs(), pos1, 125);
        ctx.big(creature.nbCellsConquises, pos1, 150);

        ctx.restore();



        zone.aChange = true;
    };
    
}());