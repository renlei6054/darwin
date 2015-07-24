function UIDashboard(vue, zone) {
    "use strict";
    
    var me = this;
    
    this.vue = vue;
    this.zone = zone;
    
    this.vue.onInit.push(function () { me.dSurC(); me.d(); });
    this.vue.onAnim.push(function () { me.d(); });
    this.vue.onChgtCrea.push(function () { me.d(); });
}

(function () {
    "use strict";
    
    UIDashboard.prototype.dSurC = function () {
        var zone    = this.zone,
            ctx     = zone.ctx,
            echelle = ctx.canvas.width / 250;

        ctx.save();
        ctx.scale(echelle, echelle);

        ctx.led(50, 50);
        ctx.led(95, 50);
        ctx.led(140, 50);

        ctx.lineWidth     = 3;
        ctx.strokeStyle   = COPIC.NOIR;

        ctx.rndStroke(function () { this.strokeArc(95, 200, 70, 0, 2 * Math.PI); });    // Contour extérieur donut
        ctx.rndStroke(function () { this.strokeArc(95, 200, 40, 0, 2 * Math.PI); });    // Contour intérieur donut

        ctx.lineWidth = 2;
        ctx.strokeStyle = tinycolor(COPIC.BLANC).setAlpha(0.3).toRgbString();

        ctx.rndStroke(function () { this.strokeArc(95, 200, 62, Math.PI, 1.5 * Math.PI); }, { vibration: 8, nbVibrations: 7 });
        ctx.rndStroke(function () { this.strokeArc(95, 200, 44, Math.PI, 1.5 * Math.PI); }, { vibration: 8, nbVibrations: 7 });
        ctx.rndStroke(function () { this.strokeArc(95, 200, 62, 0, 0.5 * Math.PI); }, { vibration: 8, nbVibrations: 7 });
        ctx.rndStroke(function () { this.strokeArc(95, 200, 44, 0, 0.5 * Math.PI); }, { vibration: 8, nbVibrations: 7 });

        ctx.barreAvancementSurC(35, 70);

        ctx.restore();

        this.vue.ctxSurC.drawImage(zone.cva, zone.pos.x, zone.pos.y);
        zone.clear();
    };
    
    UIDashboard.prototype.d = function () {
        var zone    = this.zone,
            vue     = this.vue,
            ctx     = zone.ctx,
            creature = this.vue.creatureAffichee,
            echelle = ctx.canvas.width / 250,
            proportion,
            angleDebut = 0,
            angleFin,
            niveaux = [],
            positif;

        zone.clear();

        ctx.save();
        ctx.scale(echelle, echelle);


        if (creature.actionEnCours === C.ACTIONS.PEUPLEMENT) {
            ctx.remplirCercle(50, 50, 10, vue.clignotement ? COPIC.YR16 : COPIC.YR00);
            ctx.remplirCercle(95, 50, 10, COPIC.R24);
            ctx.remplirCercle(140, 50, 10, COPIC.R24);
        } else if (creature.actionEnCours === C.ACTIONS.CONQUETE) {
            ctx.remplirCercle(50, 50, 10, COPIC.YG23);
            ctx.remplirCercle(95, 50, 10, vue.clignotement ? COPIC.YR16 : COPIC.YR00);
            ctx.remplirCercle(140, 50, 10, COPIC.R24);
        } else {
            ctx.remplirCercle(50, 50, 10, COPIC.YG23);
            ctx.remplirCercle(95, 50, 10, COPIC.YG23);
            ctx.remplirCercle(140, 50, 10, vue.clignotement ? COPIC.YR16 : COPIC.YR00);
        }


        U.eachDelta(this, function (delta) {
            niveaux[delta]   = 60 * vue.darwin.avancementsDelta[delta] / vue.darwin.intervalesDelta[delta];
        });

        U.eachDelta(this, function (delta) {
            positif     = creature.deltasFinCycle[delta].gt(0);
            proportion  = creature.deltasRatio[delta];
            angleFin    = angleDebut + proportion * 2 * Math.PI;
            ctx.donutPartiel(95, 200, 40, 30, angleDebut, angleFin, C.COULEURS_DELTA[delta]);

            if (positif) {
                if (niveaux[delta] > 30) {
                    ctx.donutPartiel(95, 200, 40, 30 - (niveaux[delta] - 30), angleDebut, angleFin, C.COULEURS_DELTA_0[delta]);
                } else {
                    ctx.donutPartiel(95, 200, 40 + 30 - niveaux[delta], niveaux[delta], angleDebut, angleFin, C.COULEURS_DELTA_0[delta]);
                }
            } else {
                if (niveaux[delta] > 30) {
                    ctx.donutPartiel(95, 200, 40 + niveaux[delta] - 30, 2 * 30 - niveaux[delta], angleDebut, angleFin,  C.COULEURS_DELTA_0[delta]);
                } else {
                    ctx.donutPartiel(95, 200, 40, niveaux[delta], angleDebut, angleFin,  C.COULEURS_DELTA_0[delta]);
                }
            }

            angleDebut = angleFin;
        });

        if (creature.actionEnCours === C.ACTIONS.CONQUETE) {
            if (creature.deltasFinCycleTotal.gt(creature.nbCreaturesParCell)) {
                ctx.barreAvancement(35, 70, niveaux[C.DELTAS.REPRODUCTION] / 60, C.COULEURS_ACTIONS[C.ACTIONS.CONQUETE]);
            } else {
                ctx.barreAvancement(35, 70, parseFloat(creature.populationSurCellEnCours.div(creature.nbCreaturesParCell).toString()), C.COULEURS_ACTIONS[C.ACTIONS.CONQUETE]);
            }
        } else if (creature.actionEnCours === C.ACTIONS.MINAGE) {
            ctx.barreAvancement(35, 70, creature.avancementMinage / creature.genome.tpsMinage[creature.cellEnCours().typeTerrain], C.COULEURS_ACTIONS[C.ACTIONS.MINAGE]);
        } else if (creature.actionEnCours === C.ACTIONS.PEUPLEMENT) {
            ctx.barreAvancement(35, 70, creature.avancementPeuplement, C.COULEURS_ACTIONS[C.ACTIONS.PEUPLEMENT]);
        }
       // }
        ctx.fillStyle = COPIC.W10;

        ctx.big(creature.population, 70, 190);



        ctx.restore();
        zone.aChange = true;
    };
    
}());