function UIResources(vue, zone) {
    "use strict";
    
    var me = this;
    
    this.vue        = vue;
    this.zone       = zone;
    this.darwin     = vue.darwin;
    this.echelle    = zone.dim.x / (90 * Object.size(C.TERRAIN) - 90);
    
    this.vue.onInit.push(function () { me.dSurC(); me.d(); });
    this.vue.onChgt.push({
        fonction : function () { me.d(); },
        code : C.CHANGEMENTS.RESOURCES
    });
}

(function () {
    "use strict";
    
    UIResources.prototype.dSurC = function () {
        var ctx = this.zone.ctx,
            randomDelta = [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0},
            ],
            traceRandom = function () {
                ctx.beginPath();
                ctx.circle(11, 11, 8);
               /* ctx.moveTo(5 + randomDelta[0].x, 5 + randomDelta[0].y);
                ctx.lineTo(18 + randomDelta[1].x, 5 + randomDelta[1].y);
                ctx.lineTo(18 + randomDelta[2].x, 18 + randomDelta[2].y);
                ctx.lineTo(5 + randomDelta[3].x, 18 + randomDelta[3].y);*/
                ctx.closePath();
            },
            strokeRandom = function () {
                ctx.rndStroke(function () {
                    traceRandom();
                    this.stroke();
                }, { vibration: 5, nbVibrations: 10 });
            };

        ctx.save();

        ctx.translate(5, 0);
        ctx.scale(this.echelle, this.echelle);
        
        ctx.strokeStyle = COPIC.W10;
        ctx.lineWidth   = 1.5;

        U.eachTerrain(this, function (terrain) {
            if (terrain !== C.TERRAIN.INDEFINI) {
                randomDelta = [
                    {x: Math.floor(3 - 6 * Math.random()), y: Math.floor(3 - 6 * Math.random())},
                    {x: Math.floor(3 - 6 * Math.random()), y: Math.floor(3 - 6 * Math.random())},
                    {x: Math.floor(3 - 6 * Math.random()), y: Math.floor(3 - 6 * Math.random())},
                    {x: Math.floor(3 - 6 * Math.random()), y: Math.floor(3 - 6 * Math.random())},
                ];
                ctx.fillStyle = C.COULEURS_CARTE_1[terrain];
                traceRandom();
                ctx.fill();
                strokeRandom();
                ctx.translate(90, 0);
            }
        });

        ctx.restore();

        this.vue.ctxSurC.drawImage(this.zone.cva, this.zone.pos.x, this.zone.pos.y);
        this.zone.clear();
    };
    
    UIResources.prototype.d = function () {
        var ctx = this.zone.ctx,
            compteur = 0,
            zone = this.zone;

        zone.clear();

        ctx.save();

        ctx.translate(32, 2);
        ctx.scale(this.echelle, this.echelle);

        ctx.fillStyle = COPIC.W10;

        U.eachTerrain(this.vue, function (terrain) {
            if (terrain !== C.TERRAIN.INDEFINI) {
                if (this.darwin.resourcesEvol[terrain] === 1) {
                    this.animations.push(new Animation(this.ctxSousC, {x: zone.pos.x, y : zone.pos.y}, 1, {x: 32 + 90 * compteur, y: -20}, TypesAnimations.plus));
                }
                ctx.big(this.darwin.resources[terrain], 0, 0);
                ctx.translate(90, 0);
                compteur += 1;
            }
        });

        ctx.restore();

        zone.aChange = true;
    };
    
}());