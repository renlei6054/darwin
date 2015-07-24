function Vue(darwin, idSousC, idC, idSurC, idFond) {
    "use strict";

    var me                  = this,
        iInterrupteur,
        iFonction,
        foo;

    this.darwin             = darwin;                               // Controleur lié à la vue
    this.creatureAffichee   = darwin.creatures[0];                  // Créature affichée
    this.carteAffichee      = darwin.creatures[0].carteEnCours;     // Carte affichée
    this.cvaSousC           = document.getElementById(C.CANVAS_ID.SOUSCOUCHE);
    this.ctxSousC           = this.cvaSousC.getContext("2d");
    this.cva                = document.getElementById(C.CANVAS_ID.COUCHE);
    this.ctx                = this.cva.getContext("2d");
    this.cvaSurC            = document.getElementById(C.CANVAS_ID.SURCOUCHE);
    this.ctxSurC            = this.cvaSurC.getContext("2d");
    this.cvaFond            = document.getElementById(C.CANVAS_ID.FOND);
    this.ctxFond            = this.cvaFond.getContext("2d");
    this.cvaTT              = document.getElementById(C.CANVAS_ID.TOOLTIPS);
    this.ctxTT              = this.cvaTT.getContext("2d");
    this.clignotement       = false;                                // Utilisé pour les clignotements
    this.tpsAResoudre       = 0;                                    // Temps restant à résoudre
    this.tpsAResoudreMax    = 0;                                    // Utilisé pour l'affichage
    this.animations         = [];                                   // Animations en cours
    this.onInit             = [];                                   // Fonctions appelées à l'initialisation
    this.onMove             = [];                                   // Fonction appelées on move
    this.onAnim             = [];                                   // Fonctions appelées à chaque frame
    this.onChgt             = [];                                   // Fonctions appelées au changement de population ou autre
    this.onChgtCrea         = [];                                   // Fonctions appelées au changement de créature affichée
        

    //this.animations[0]      = new Animation(this.ctxSurC, {x: 0, y: 800}, 1, {x: 0, y: 0}, TypesAnimations.plus);

    this.dim                = { x : this.cva.width, y : this.cva.height };

    this.dimGrille          = { x : Math.floor(this.dim.x / C.TAILLE_GRILLE), y : Math.floor(this.dim.y / C.TAILLE_GRILLE) };

    this.casesActives       = [];                                   // Tableau des cellules actives
    this.casesClickAction   = [];                                   // Tableau des actions au click
    this.casesOverAction    = [];                                   // Tableau des actions on hover
    this.initTableauxCells();                                       // Initialisation des tableaux

    
    
    this.interrupteurChange = null;
    this.interrupteurs      = [
        { posG: {x: 1, y: 30}, niveau : 0, maxNiveau : 2, callback : function (evt) {  } },     // Accélération
        { posG: {x: 3, y: 30}, niveau : 1, maxNiveau : 1, callback : function (evt) {  } },     // Cannibalisme
        { posG: {x: 5, y: 30}, niveau : 1, maxNiveau : 2, callback : function (evt) {  } }      // Mutation
    ];

    this.zones              = [];                                   // Zones de dessin

    this.zones[C.ZONE_STATS_CREATURE]   = new Zone({ x: U.tg(0.2),  y: U.tg(17)}, { x: U.tg(10),    y: U.tg(20)});
    this.zones[C.ZONE_TAB_CREATURE]     = new Zone({ x: U.tg(8),    y: U.tg(10)}, {  x: U.tg(10),    y: U.tg(20)});
    this.zones[C.ZONE_CARTE]            = new Zone({ x: U.tg(18.5), y: U.tg(12)}, {  x: U.tg(18.7),  y: U.tg(25)});
    this.zones[C.ZONE_CREATURES]        = new Zone({ x: 0,          y: 0}, {        x: this.dim.x,  y: U.tg(5)});
    this.zones[C.ZONE_ZOOM_CARTE]       = new Zone({ x: U.tg(18),   y: U.tg(10)}, {  x: U.tg(20),    y: U.tg(4)});
    this.zones[C.ZONE_GLOBALE]          = new Zone({ x: 0,          y: 0}, this.dim);
    this.zones[C.ZONE_TPS_A_RES]        = new Zone({ x: U.tg(1.5),  y: U.tg(31)}, { x: U.tg(10),    y: U.tg(2)});
    this.zones[C.ZONE_PORTRAIT]         = new Zone({ x: U.tg(0),    y: U.tg(10)}, {  x: U.tg(8),     y: U.tg(8)});
    this.zones[C.ZONE_RESOURCES]        = new Zone({ x: 0,          y: U.tg(5)}, {  x: this.dim.x,  y: U.tg(5)});
    
    this.tooltips = new UITooltips(this);
    
    foo = new UIBouton(this, {x: 1, y: 28}, true, TYPES_BOUTON.SPEEDUP);
    foo = new UIBouton(this, {x: 5, y: 28}, false, TYPES_BOUTON.MUTATION);
    foo = new UIBouton(this, {x: 3, y: 28}, false, TYPES_BOUTON.FOO);
    
    foo = new UIResources(this, this.zones[C.ZONE_RESOURCES]);
    foo = new UIPortrait(this, this.zones[C.ZONE_PORTRAIT]);
    foo = new UICarte(this, this.zones[C.ZONE_CARTE]);
    foo = new UIZoom(this, this.zones[C.ZONE_ZOOM_CARTE]);
    foo = new UIDashboard(this, this.zones[C.ZONE_STATS_CREATURE]);
    foo = new UIStatsCreature(this, this.zones[C.ZONE_TAB_CREATURE]);
    foo = new UIMiniStats(this, this.zones[C.ZONE_CREATURES]);
    
    for (iFonction = 0; iFonction < this.onInit.length; iFonction += 1) { this.onInit[iFonction](); }

    // Activation et dessin des interrupteurs
    for (iInterrupteur = 0; iInterrupteur < this.interrupteurs.length; iInterrupteur += 1) {
        this.setClickAction(this.interrupteurs[iInterrupteur].posG, {x: 2, y: 1}, this.onInterrupteurClick(this.interrupteurs[iInterrupteur]));
        this.dInterrupteur(this.interrupteurs[iInterrupteur]);
    }

    // Activation des zones ministats
    this.setClickAction({x: 0, y: 0}, {x: 3, y: 5}, function () { me.changeCreatureAffichee(me.darwin.creatures[0]); });


    this.cvaTT.addEventListener("mousemove", function (evt) { me.overCallback(evt); });
    this.cvaTT.addEventListener("mouseup", function (evt) { me.clickCallback(evt); });

    this.dFond();

    //this.dTpsAResoudreSurC(this.zones[C.ZONE_TPS_A_RES]);

    this.onFrame(Date.now());

    setInterval(function () { me.clignotement = !me.clignotement; }, C.DELTA_CLI);
}

(function () {
    "use strict";

    // Fonction appelée à chaque frame
    Vue.prototype.onFrame = function (dernierTs) {
        var deltaTS         = Date.now() - dernierTs,
            nouvDernierTs   = Date.now(),
            iZone,
            iAnimation,
            iFonction,
            me              = this,
            paliers,
            paliersBin      = 0,
            chgtTAR         = false;    // indique un changement dans le temps à résoudre

        this.tpsAResoudre += deltaTS;

        if (this.tpsAResoudre > 2 * this.darwin.intervaleMin) {
            if (this.tpsAResoudreMax === 0) {
                this.tpsAResoudreMax    = this.tpsAResoudre;
                chgtTAR                 = true;
            } else if (this.tpsAResoudreMax < this.tpsAResoudre) {
                this.tpsAResoudreMax = this.tpsAResoudre;
            }
            deltaTS = this.darwin.intervaleMin;
            this.tpsAResoudre -= deltaTS;

        } else {
            chgtTAR = this.tpsAResoudreMax !== 0;
            this.tpsAResoudre       = 0;
            this.tpsAResoudreMax    = 0;
        }

        // S'il y a des données dans le buffer on les affiche tout de suite
        
        for (iZone = 0; iZone < this.zones.length; iZone += 1) {
            if (this.zones[iZone].aChange) {
                if (iZone !== C.ZONE_GLOBALE) {
                    this.ctx.clearZone(this.zones[iZone]);
                }
                this.ctx.drawImage(this.zones[iZone].cva, this.zones[iZone].pos.x, this.zones[iZone].pos.y);
                this.zones[iZone].aChange = false;
            }
        }

        // Dessin des animations
        for (iAnimation = 0; iAnimation < this.animations.length; iAnimation += 1) {
            if (!this.animations[iAnimation].dessine()) {
                this.animations.splice(iAnimation, 1);
            }
        }


        this.zones[C.ZONE_GLOBALE].clear();

        paliers = this.darwin.avance(deltaTS, this.creatureAffichee);


        paliersBin += paliers.changementPopulation ? C.CHANGEMENTS.POPULATION : 0;
        paliersBin += paliers.changementResources ? C.CHANGEMENTS.RESOURCES : 0;
        paliersBin += paliers.changementCarte ? C.CHANGEMENTS.CARTE : 0;
        paliersBin += paliers.changementCarteInfos ? C.CHANGEMENTS.CARTE_INFOS : 0;
        
        if (paliersBin !== 0) {
            for (iFonction = 0; iFonction < this.onChgt.length; iFonction += 1) {
                if (this.onChgt[iFonction].code & paliersBin) {
                    this.onChgt[iFonction].fonction();
                }
            }
        }
        
        if (paliers.changementCarte) { this.carteAffichee = this.creatureAffichee.carteEnCours; }

        for (iFonction = 0; iFonction < this.onAnim.length; iFonction += 1) { this.onAnim[iFonction](); }

        if (this.interrupteurChange) {
            this.dInterrupteur(this.interrupteurChange);
            this.interrupteurChange = null;
        }

        if (this.tpsAResoudre) {
            if (chgtTAR) { this.dTpsAResoudreSurC(this.zones[C.ZONE_TPS_A_RES]); }
            this.dTpsAResoudre(this.zones[C.ZONE_TPS_A_RES]);
        } else if (chgtTAR) {
            this.zones[C.ZONE_TPS_A_RES].clear();
            this.ctxSurC.clearZone(this.zones[C.ZONE_TPS_A_RES]);
        }

        requestAnimFrame(function () { me.onFrame(nouvDernierTs); });
    };


    Vue.prototype.dInterrupteur = function (interrupteur) {
        var ctx     = this.ctxSurC,
            echelle = U.tg(2) / 60;

        ctx.clearRect(U.tg(interrupteur.posG.x), U.tg(interrupteur.posG.y), U.tg(2), U.tg());

        ctx.save();
        ctx.scale(echelle, echelle);

        ctx.interrupteur(
            (U.tg(interrupteur.posG.x) + 18.5) / echelle,
            (U.tg(interrupteur.posG.y) + 7) / echelle,
            interrupteur.niveau,
            interrupteur.maxNiveau
        );
        ctx.restore();
    };

    // Dessin de la barre d'avancement Temps à résoudre
    Vue.prototype.dTpsAResoudreSurC = function (zone) {
        var ctx     = zone.ctx,
            echelle = ctx.canvas.width / 250;

        ctx.save();
        ctx.scale(echelle, echelle);

        ctx.barreAvancementSurC(10, 10);

        ctx.restore();

        this.ctxSurC.drawImage(zone.cva, zone.pos.x, zone.pos.y);
        zone.clear();
    };

    Vue.prototype.dTpsAResoudre = function (zone) {
        var ctx     = zone.ctx,
            echelle = ctx.canvas.width / 250;

        ctx.save();
        ctx.scale(echelle, echelle);

        ctx.barreAvancement(10, 10, this.tpsAResoudre / this.tpsAResoudreMax);

        ctx.restore();

        zone.aChange = true;
    };

    // Dessin du fond
    Vue.prototype.dFond = function () {
        var ctx = this.ctxFond,
            iCell,
            echelle = this.cvaFond.width / C.TAILLE_CARTE_REF,
            carte = this.darwin.carteGlobale,
            edges = carte.voronoi.diagram.edges;

        ctx.save();
        //ctx.translate(C.PADDING_CARTE, C.PADDING_CARTE);
        ctx.scale(echelle, echelle);

        // Remplissage des cellules
        for (iCell = 0; iCell < carte.nbCells; iCell += 1) {
            //ctx.remplirCellCarte(carte.cell(iCell), C.COULEURS_CARTE_1[carte.cell(iCell).typeTerrain]);
            ctx.remplirCellCarte(carte.cell(iCell));
        }

        ctx.strokeStyle = tinycolor(COPIC.W5).setAlpha(0.4).toString();
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
        }, { vibration: 7, nbVibrations: 8, opaciteMax: 0.8, dessinePremiere : false });

        ctx.restore();

        ctx.fillStyle = "rgba(230, 230, 230, 0.5)";
        ctx.fillRect(0, 0, this.cvaFond.width, this.cvaFond.height);
    };



    Vue.prototype.changeCreatureAffichee = function (creature) {
        if (creature !== this.creatureAffichee) {
            
            var iFonction;
            
            this.creatureAffichee = creature;
            this.carteAffichee    = creature.carteEnCours;


            this.ctxSurC.clearZone(this.zones[C.ZONE_CREATURES]);

            for (iFonction = 0; iFonction < this.onChgt.length; iFonction += 1) {
                if (this.onChgt[iFonction].code & C.CHANGEMENTS.POPULATION) {
                    this.onChgt[iFonction].fonction();
                }
            }
            
            for (iFonction = 0; iFonction < this.onChgtCrea.length; iFonction += 1) {
                this.onChgtCrea[iFonction]();
            }
        }
    };

    Vue.prototype.setClickAction = function (pos, dim, action) {
        var compteurX,
            compteurY;

        if (typeof action !== "undefined") {
            for (compteurX = 0; compteurX < dim.x; compteurX += 1) {
                for (compteurY = 0; compteurY < dim.y; compteurY += 1) {
                    this.casesActives[this.indexCaseGrille({x: pos.x + compteurX, y: pos.y + compteurY})]       = true;
                    this.casesClickAction[this.indexCaseGrille({x: pos.x + compteurX, y: pos.y + compteurY})]   = action;
                }
            }
        }
    };

    Vue.prototype.clearClickAction = function (pos, dim) {
        var compteurX,
            compteurY;

        for (compteurX = 0; compteurX < dim.x; compteurX += 1) {
            for (compteurY = 0; compteurY < dim.y; compteurY += 1) {
                this.casesActives[this.indexCaseGrille({x: pos.x + compteurX, y: pos.y + compteurY})]       = false;
            }
        }
    };

    Vue.prototype.setOverAction = function (pos, dim, action) {
        var compteurX,
            compteurY;

        if (typeof action !== "undefined") {
            for (compteurX = 0; compteurX < dim.x; compteurX += 1) {
                for (compteurY = 0; compteurY < dim.y; compteurY += 1) {
                    this.casesActives[this.indexCaseGrille({x: pos.x + compteurX, y: pos.y + compteurY})]      = true;
                    this.casesOverAction[this.indexCaseGrille({x: pos.x + compteurX, y: pos.y + compteurY})]   = action;
                }
            }
        }
    };

    Vue.prototype.clearOverAction = function (pos, dim) {
        var compteurX,
            compteurY;

        for (compteurX = 0; compteurX < dim.x; compteurX += 1) {
            for (compteurY = 0; compteurY < dim.y; compteurY += 1) {
                this.casesActives[this.indexCaseGrille({x: pos.x + compteurX, y: pos.y + compteurY})]      = false;
            }
        }

    };

    // Callback sur over
    Vue.prototype.overCallback = function (evt) {
        var indexCell = this.indexCaseGrilleEvt(evt),
            iFunction;

        for (iFunction = 0; iFunction < this.onMove.length; iFunction += 1) { this.onMove[iFunction](evt); }
        
        if (this.casesActives[indexCell]) {
            $(this.cvaTT).css('cursor', 'pointer');
            if (this.casesOverAction[indexCell]) {
                this.casesOverAction[indexCell](evt);
            }
        } else {
            $(this.cvaTT).css('cursor', 'auto');
        }
        
        
    };

    // Callback sur click
    Vue.prototype.clickCallback = function (evt) {
        var indexCell = this.indexCaseGrilleEvt(evt);

        if (this.casesClickAction[indexCell]) {
            this.casesClickAction[indexCell](evt);
        }
    };

    // Initialisation des tableaux de casesActives
    Vue.prototype.initTableauxCells = function () {
        var compteurX, compteurY;

        for (compteurX = 0; compteurX < this.dimGrille.x; compteurX += 1) {
            for (compteurY = 0; compteurY < this.dimGrille.y; compteurY += 1) {
                this.casesActives[this.indexCaseGrille({x: compteurX, y: compteurY})] = false;
            }
        }
    };

    // Normalise des coordonnees souris
    Vue.prototype.normalizeEventCoords = function (evt) {
        var x = 0,
            y = 0;
        if (evt.pageX || evt.pageY) {
            x = evt.pageX;
            y = evt.pageY;
        } else if (evt.clientX || evt.clientY) {
            x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return {x: x - this.cva.offsetLeft, y: y - this.cva.offsetTop };
    };

    // Renvoie l'index de la case dans la grille suivant ses coordonnees
    Vue.prototype.indexCaseGrille = function (pos) {
        return pos.x + this.dimGrille.x * pos.y;
    };

    // Renvoie l'index de la case sur la grille en fonction d'un evt souris
    Vue.prototype.indexCaseGrilleEvt = function (evt) {
        var rect    = this.cva.getBoundingClientRect();

        return this.indexCaseGrille(
            {
                x : Math.floor((evt.clientX - rect.left) / C.TAILLE_GRILLE),
                y : Math.floor((evt.clientY - rect.top) / C.TAILLE_GRILLE)
            }
        );
    };

    // Renvoie une fonction qui met à jour un interrupteur suite à un click
    Vue.prototype.onInterrupteurClick = function (interrupteur) {
        var me = this;
        return function () {
            interrupteur.niveau = (interrupteur.niveau + 1) % (interrupteur.maxNiveau + 1);
            me.interrupteurChange = interrupteur;
            interrupteur.callback();
        };

    };

}());