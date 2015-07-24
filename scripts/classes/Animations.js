function TypesAnimation(dim, nbFrames, duree, nbBoucles, fonction) {
    "use strict";

    this.dim            = dim;
    this.nbFrames       = nbFrames;
    this.duree          = duree;
    this.nbBoucles      = nbBoucles;

    this.cva            = document.createElement('canvas');
    this.cva.width      = dim.x;
    this.cva.height     = dim.y * nbFrames;
    this.ctx            = this.cva.getContext("2d");

    this.dureeFrame     = Math.floor(duree / nbFrames);
    this.dureeTotale    = duree * nbBoucles;

    fonction(this.ctx);
}

var TypesAnimations;

(function () {
    "use strict";
    TypesAnimation.prototype.dessineFrame = function (ctx, noFrame) {
        ctx.drawImage(this.cva, 0, noFrame * this.dim.y, this.dim.x, this.dim.y, 0, 0, this.dim.x, this.dim.y);
    };

    TypesAnimations = {
        moins : new TypesAnimation({x: 60, y: 30}, 20, 500, 1, function (ctx) {
            var compteur,
                dMoins = function () {
                    ctx.beginPath();
                    ctx.rect(2, 7, 16, 6);
                    ctx.fill();
                    //ctx.stroke();
                };
            ctx.save();
            ctx.fillStyle   = COPIC.R29;
            ctx.strokeStyle = COPIC.W10;
            ctx.lineWidth   = 1;

            ctx.translate(0, 0);
            for (compteur = 0; compteur < 20; compteur += 1) {
                //ctx.globalAlpha = Math.sin(0.1 * Math.PI * compteur);
                ctx.save();
                ctx.rect(0, 0, 60, 30);
                ctx.clip();
                ctx.globalAlpha = 1 - (compteur / 20);

                ctx.save();
                ctx.translate(0, 10 - compteur);
                ctx.scale(0.8, 0.8);
                dMoins();
                ctx.restore();

                ctx.save();
                ctx.translate(15, 15 - 0.8 * compteur);
                dMoins();
                ctx.restore();

                ctx.save();
                ctx.translate(30, 15 - 1.2 * compteur);
                ctx.scale(0.8, 0.8);
                dMoins();
                ctx.restore();

                ctx.restore();
                //ctx.fillRect(-10, 5, 10, 10);
                ctx.translate(0, 30);
            }
            ctx.restore();
        }),
        plus : new TypesAnimation({x: 60, y: 30}, 20, 500, 1, function (ctx) {
            var compteur,
                dCroix = function () {
                    ctx.beginPath();
                    ctx.moveTo(7, 2);
                    ctx.lineTo(13, 2);
                    ctx.lineTo(13, 7);
                    ctx.lineTo(18, 7);
                    ctx.lineTo(18, 13);
                    ctx.lineTo(13, 13);
                    ctx.lineTo(13, 18);
                    ctx.lineTo(7, 18);
                    ctx.lineTo(7, 13);
                    ctx.lineTo(2, 13);
                    ctx.lineTo(2, 7);
                    ctx.lineTo(7, 7);
                    ctx.closePath();
                    ctx.fill();
                    //ctx.stroke();
                };
            ctx.save();
            ctx.fillStyle   = COPIC.YG09;
            ctx.strokeStyle = COPIC.W10;
            ctx.lineWidth   = 1;

            ctx.translate(0, 0);
            for (compteur = 0; compteur < 20; compteur += 1) {
                //ctx.globalAlpha = Math.sin(0.1 * Math.PI * compteur);
                ctx.save();
                ctx.rect(0, 0, 60, 30);
                ctx.clip();
                ctx.globalAlpha = 1 - (compteur / 20);

                ctx.save();
                ctx.translate(0, 10 - compteur);
                ctx.scale(0.8, 0.8);
                dCroix();
                ctx.restore();

                ctx.save();
                ctx.translate(15, 15 - 0.8 * compteur);
                dCroix();
                ctx.restore();

                ctx.save();
                ctx.translate(30, 15 - 1.2 * compteur);
                ctx.scale(0.8, 0.8);
                dCroix();
                ctx.restore();

                ctx.restore();
                //ctx.fillRect(-10, 5, 10, 10);
                ctx.translate(0, 30);
            }
            ctx.restore();
        })
    };
}());

function Animation(ctx, pos, echelle, posRelative, typeAnimation) {
    "use strict";

    this.startTS        = Date.now();
    this.ctx            = ctx;
    this.pos            = pos;
    this.posRelative    = posRelative;
    this.echelle        = echelle;
    this.typeAnimation  = typeAnimation;
}

(function () {
    "use strict";

    Animation.prototype.dessine = function () {
        var deltaTS = Date.now() - this.startTS;

        this.ctx.save();
        this.ctx.translate(this.pos.x, this.pos.y);
        this.ctx.scale(this.echelle, this.echelle);
        this.ctx.translate(this.posRelative.x, this.posRelative.y);
        this.ctx.clearRect(0, 0, this.typeAnimation.dim.x, this.typeAnimation.dim.y);

        if (deltaTS > this.typeAnimation.dureeTotale && this.typeAnimation.nbBoucles !== -1) {
            this.ctx.restore();
            return false;
        } else {

            this.typeAnimation.dessineFrame(this.ctx, Math.floor(deltaTS / this.typeAnimation.dureeFrame) % this.typeAnimation.nbFrames);
            this.ctx.restore();
            return true;
        }
    };

}());