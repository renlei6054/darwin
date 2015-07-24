var TYPES_BOUTON;

(function () {
    "use strict";
    TYPES_BOUTON = {
        FOO : {
            callback : function () { },
            estActif : function () { return false; }
        },
        SPEEDUP : {
            callback : function () { this.vue.tpsAResoudre += 1000 * 30; },
            estActif : function () { return true; }
        },
        MUTATION : {
            callback : function () {
                var me = this, iCreature;
                
                me.actif = false;
                me.inActive();
                me.vue.creatureAffichee.populationEnAttente = me.vue.creatureAffichee.genome.nbSacrificesMutation;
                if (me.vue.creatureAffichee.predateur) {
                    me.vue.creatureAffichee.predateur.populationEnAttente = new Big(2000);
                } else {
                    iCreature = me.vue.darwin.creatures.push(new Creature(
                        me.vue.creatureAffichee.type.sub(1),
                        C.BIG1000,
                        me.vue.creatureAffichee.iCellGlobale,
                        me.vue.creatureAffichee,
                        me.vue.darwin
                    )) - 1;

                    me.vue.setClickAction({x: 3 * iCreature, y: 0}, {x: 3, y: 5}, function () { me.vue.changeCreatureAffichee(me.vue.darwin.creatures[iCreature]); });
                    me.vue.changeCreatureAffichee(me.vue.darwin.creatures[iCreature]);
                }
            },
            estActif : function () { return this.vue.creatureAffichee.population.gt(2000); }
        }
    };
}());

function UIBouton(vue, posG, actif, type) {
    "use strict";
    
    var me  = this;
    
    this.vue        = vue;
    this.posG       = posG;
    this.actif      = actif;
    this.type       = type;
    this.over       = false;
    this.callback   = type.callback;
    this.estActif   = type.estActif;
    
    this.vue.onInit.push(function () { me.dSousC(); });
    this.vue.onMove.push(function () { me.over = false; });
    this.vue.onAnim.push(function () { if (me.actif && me.over) { me.d(); } });
    this.vue.onChgt.push({
        fonction : function () { if (me.estActif() && !me.actif) { me.active(); } else if (!me.estActif() && me.actif) { me.inActive(); } },
        code : C.CHANGEMENTS.POPULATION + C.CHANGEMENTS.RESOURCES
    });
    
    if (this.actif) { this.active(); } else { this.inActive(); }
}

(function () {
    "use strict";
    
    UIBouton.prototype.dSousC = function () {
        var echelle = U.tg(2) / 65;

        this.vue.ctxSousC.clearRect(U.tg(this.posG.x), U.tg(this.posG.y), U.tg(2), U.tg(2));

        this.vue.ctxSousC.save();
        this.vue.ctxSousC.scale(echelle, echelle);

        this.vue.ctxSousC.bouton((U.tg(this.posG.x) + 30) / echelle, (U.tg(this.posG.y) + 30) / echelle, this.actif ? COPIC.R24 : COPIC.W3);

        this.vue.ctxSousC.restore();
    };
    
    UIBouton.prototype.d = function () {
        var zone    = this.vue.zones[C.ZONE_GLOBALE],
            ctx     = zone.ctx,
            echelle = U.tg(2) / 65;

        ctx.save();
        ctx.scale(echelle, echelle);
        ctx.boutonOver((U.tg(this.posG.x) + 30) / echelle, (U.tg(this.posG.y) + 30) / echelle);
        ctx.restore();

        zone.aChange = true;
    };
    
    UIBouton.prototype.active = function () {
        var me = this,
            vue = this.vue;
        
        me.actif = true;
        
        vue.setClickAction(me.posG, {x: 2, y: 2}, function () { me.callback.call(me); });
        vue.setOverAction(me.posG, {x: 2, y: 2}, function () { me.over = true; });
        me.dSousC();
    };
    
    UIBouton.prototype.inActive = function () {
        var me = this,
            vue = this.vue;
        
        me.actif = false;
        
        vue.clearClickAction(me.posG, {x: 2, y: 2});
        vue.clearOverAction(me.posG, {x: 2, y: 2});
        me.dSousC();
    };
        
}());