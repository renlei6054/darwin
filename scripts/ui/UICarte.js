function UICarte(vue, zone) {
    "use strict";
    
    var me = this;
    
    this.vue = vue;
    this.zone = zone;
    
    this.echelle = (this.zone.dim.x - 2 * C.PADDING_CARTE) / C.TAILLE_CARTE_REF;
    
    this.vue.onInit.push(function () { me.dSousC(); me.dSurC(); me.d(); });
    this.vue.onChgtCrea.push(function () { me.dSousC(); me.dSurC(); me.d(); });
    this.vue.onAnim.push(function () { me.d(); });
    
    this.vue.onChgt.push({
        fonction : function () { me.dSurC(); },
        code : C.CHANGEMENTS.CARTE
    });
    this.vue.onChgt.push({
        fonction : function () { me.dSousC(); },
        code : C.CHANGEMENTS.CARTE + C.CHANGEMENTS.CARTE_INFOS
    });
}

(function () {
    "use strict";
    
    UICarte.prototype.dSousC = function () {
        var ctx = this.zone.ctx,
            iCell;

        ctx.save();
        ctx.translate(C.PADDING_CARTE, C.PADDING_CARTE + C.HAUTEUR_ZOOM);
        ctx.scale(this.echelle, this.echelle);

        // Remplissage des cellules
        for (iCell = 0; iCell < this.vue.carteAffichee.nbCells; iCell += 1) {
            ctx.remplirCellCarte(this.vue.carteAffichee.cell(iCell));
        }

        ctx.restore();

        this.vue.ctxSousC.drawImage(this.zone.cva, this.zone.pos.x, this.zone.pos.y);
        this.zone.clear();
    };
    
    UICarte.prototype.dSurC = function () {
        var zone = this.zone,
            ctx = zone.ctx,
            carte = this.vue.carteAffichee,
            edges = carte.voronoi.diagram.edges,
            iCell;

        zone.clear();

        ctx.save();
        ctx.translate(C.PADDING_CARTE, C.PADDING_CARTE + C.HAUTEUR_ZOOM);
        ctx.scale(this.echelle, this.echelle);

        ctx.strokeStyle = tinycolor(COPIC.NOIR).setAlpha(0.4).toString();
        ctx.lineWidth   = 1;

        // Dessin des contours des cellules
        ctx.rndStroke(function (ctx) {
            var iEdge, edge, v;
            ctx.beginPath();
            for (iEdge = 0; iEdge < edges.length; iEdge += 1) {
                edge    = edges[iEdge];
                v       = edge.va;
                ctx.moveTo(v.x, v.y);

                v       = edge.vb;
                ctx.lineTo(v.x, v.y);
            }
            ctx.stroke();
        }, { vibration: carte.niveau, nbVibrations: carte.niveau, opaciteMax: 1 });

        ctx.lineWidth   = 1;
        ctx.strokeStyle = COPIC.NOIR;

        // Dessin du cadre
        ctx.rndStroke(function (ctx) {
            ctx.beginPath();
            ctx.rect(0, 0, C.TAILLE_CARTE_REF, C.TAILLE_CARTE_REF);
            ctx.stroke();
        }, { vibration: 8, nbVibrations: 10 });

        // Dessin de l'échelle
        ctx.strokeStyle = COPIC.W10;
        ctx.lineWidth = 3;
        ctx.translate(0, -10);
        ctx.rndStroke(function () {
            this.beginPath();
            this.moveTo(0, -10);
            this.lineTo(0, 0);
            this.moveTo(C.TAILLE_CARTE_REF, -10);
            this.lineTo(C.TAILLE_CARTE_REF, -0);
            this.moveTo(0, -5);
            this.lineTo(C.TAILLE_CARTE_REF, -5);
            this.stroke();
        }, { vibration: 3, nbVibrations: 5, opaciteMax: 0.8 });

        ctx.fillStyle = COPIC.W10;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(C.TEXTES_ECHELLE[carte.niveau], C.TAILLE_CARTE_REF / 2, -10);

        ctx.restore();

        this.vue.ctxSurC.clearZone(zone);
        this.vue.ctxSurC.drawImage(zone.cva, zone.pos.x, zone.pos.y);
        zone.clear();
    };
    
    UICarte.prototype.d = function () {
        var zone = this.zone,
            carte = this.vue.carteAffichee,
            ctx = zone.ctx;

        zone.clear();

        ctx.save();
        ctx.translate(C.PADDING_CARTE, C.PADDING_CARTE + C.HAUTEUR_ZOOM);
        ctx.scale(this.echelle, this.echelle);

        if (this.vue.clignotement) {
            ctx.remplirCellCarte(this.vue.creatureAffichee.cellEnCours(), COPIC.R24);
        }
        ctx.restore();
        zone.aChange = true;
    };
}());