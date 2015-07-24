function Creature(type, population, iCellGlobale, proie, darwin) {
    "use strict";

    this.type                   = type;
    this.darwin                 = darwin;                                   // Controleur
    this.population             = population;                               // Population
    this.populationPrec         = population;                               // Population précédente
    this.populationEvol         = 0;                                        // Evolution de la population
    this.populationEnAttente    = C.BIG0;                                   // Evolution en attente
    this.iCellEnCours           = Math.floor(C.CARTE_NB_CELLS / 2);         // Coordonnees de la case en cours d'exploration par la créature
    this.iCellGlobale           = iCellGlobale;                             // Coordonnees de la cellule en cours de minage sur la carte globale
    this.avancementMinage       = 0;                                        // Avancement en cours du minage
    this.avancementPeuplement   = 0;                                        // Avancement du peuplement

    this.carteEnCours           = new Carte(                                // Carte en cours d'exploiration
        this.type,
        darwin.graineGlobale,
        darwin.carteGlobale,
        iCellGlobale
    );

    this.nbCreaturesParCell         = C.BIG0;                       // Nombre de créature par cell sur la carte en cours
    this.nbCellsParCellCarte        = C.BIG1;                       // Nombre de cellule à l'echelle de la créature par cellule carte
    this.calcNbCreaturesParCell();
    this.proie                      = proie;                        // Créature mangée par la créature quand elle n'est pas cannibale

    this.graine                     = Date.now().toString();        // "graine" de la créature
    this.actionEnCours              = C.ACTIONS.CONQUETE;           // Action en cours
    this.nbCellsConquises           = C.BIG0;                       // Nombre de cells conquises
    this.nbCellsMinees              = C.BIG0;                       // Nombre de cells minées
    this.populationSurCellEnCours   = C.BIG0;
    this.deltasFinCycleTotal        = C.BIG0;                       // Somme des deltas
    this.popInitPeuplement          = C.BIG0;                       // Population au début d'un repeuplement

    this.genome = {                                 // Génome de la creature

        decouverteRessources   : [],                // Quantité de resources découvertes par cell et par type de terrain
        tpsMinage              : [],                // Temps de minage

        nbSacrificesMutation   : C.BIG0,            // Nombre de sacrifice pour opérer une mutation
        txCreaturesMangees     : C.BIG0,            // Ratio nombre de créatures mangées par cycle / population
        txReproduction         : C.BIG0,            // Ratio nombre de naissances par cycle / population
        resistanceVoyage       : C.BIG0,            // Résistance aux voyages
        resistanceAttaque      : C.BIG0             // Résistance aux attaques
    };

    this.morphologie    = {};                       // Morphologie de la créature
    this.deltasFinCycle = [];                       // Deltas appliqués à la population à chaque fin de cycle correspondant
    this.deltasRatio    = [];                       // Ratios respectif de chaque delta
    this.deltasPrec     = [];                       // Deltas avant le dernier paliers
    this.deltasEvol     = [];                       // Evolution des deltas


    this.predateur      = null;                     // Créature qui mange cette créature
    this.cannibale      = false;                    // Créature cannibale ?

    U.eachDelta(this, function (delta) {
        this.deltasFinCycle[delta]    = C.BIG0;
        this.deltasRatio[delta]       = 0;
        this.deltasPrec[delta]        = C.BIG0;
        this.deltasEvol[delta]        = 0;
    });

    this.genGenome();
    this.genMorphologie();
    this.calcDeltas();

    if (this.proie) {
        this.proie.predateur = this;
    }

}

(function () {
    "use strict";
    // Calcul du nombre de créature par cell suivant la carte
    Creature.prototype.calcNbCreaturesParCell = function (niveau) {

        niveau = typeof niveau !== "undefined" ? niveau : this.carteEnCours.niveau;

        var deltaCarteCreature = parseInt(this.type.sub(niveau).toFixed(), 10);

        this.nbCreaturesParCell = C.BIGCNC.pow(deltaCarteCreature).mul(C.NB_CREATURES_PAR_CELL);
        this.nbCellsParCellCarte   = C.BIGCNC.pow(deltaCarteCreature);
    };

    // Calcul des deltas en fonction de la population et du génome (éventuellement delta de la proie si non cannibale)
    Creature.prototype.calcDeltas = function () {

        if (!this.cannibale) {
            if (this.proie) {
                this.proie.deltasFinCycle[C.DELTAS.PREDATION]   = this.population.mul(this.genome.txCreaturesMangees).round(0, 0).mul(-1);
                this.proie.calcDeltaGlobal();
                this.deltasFinCycle[C.DELTAS.CANNIBALISME]      = C.BIG0;
                this.cannibale                                  = this.proie.deltasFinCycle[C.DELTAS.PREDATION].abs().gt(this.proie.population);
            }
        }

        if (this.cannibale) {

            this.deltasFinCycle[C.DELTAS.CANNIBALISME] = this.population.mul(-0.1).mul(this.genome.txCreaturesMangees).round(0, 0);
            if (this.proie) {
                this.proie.deltasFinCycle[C.DELTAS.PREDATION] = C.BIG0;
                this.proie.calcDeltaGlobal();
            }

        }


        this.deltasFinCycle[C.DELTAS.REPRODUCTION]  = this.population.mul(this.genome.txReproduction);
        this.calcDeltaGlobal();

        //console.log(this.type + " > " + this.population.c.length);
    };

    // Mise à jour des deltas précédents avec les valeurs actuelles
    Creature.prototype.majDeltasPrec = function () {
        this.populationPrec = this.population;

        U.eachDelta(this, function (delta) { this.deltasPrec[delta] = this.deltasFinCycle[delta]; });
    };

    // Mise à jour de l'évolution des deltasFinCycle
    Creature.prototype.calcDeltasEvols = function () {

        if (this.population.gt(this.populationPrec)) {
            this.populationEvol = 1;
        } else if (this.population.lt(this.populationPrec)) {
            this.populationEvol = -1;
        } else {
            this.populationEvol = 0;
        }

        U.eachDelta(this, function (delta) {
            if (this.deltasFinCycle[delta].gt(this.deltasPrec[delta])) {
                this.deltasEvol[delta] = 1;
            } else if (this.deltasFinCycle[delta].lt(this.deltasPrec[delta])) {
                this.deltasEvol[delta] = -1;
            } else {
                this.deltasEvol[delta] = 0;
            }
        });
    };

    // Calcul du delta global par seconde
    Creature.prototype.calcDeltaGlobal = function () {
        var total       = C.BIG0,
            totalAbs    = C.BIG0;

        U.eachDelta(this, function (delta) {
            total       = total.add(this.deltasFinCycle[delta].mul(this.darwin.inverseIntervalesDelta[delta]));
            totalAbs    = totalAbs.add(this.deltasFinCycle[delta].mul(this.darwin.inverseIntervalesDelta[delta]).abs());
        });

        U.eachDelta(this, function (delta) {
            this.deltasRatio[delta] = totalAbs.eq(C.BIG0) ? 0 : parseFloat(this.deltasFinCycle[delta].mul(this.darwin.inverseIntervalesDelta[delta]).abs().div(totalAbs).toPrecision(3));
        });

        this.deltasFinCycleTotal = total.round(0, 0);

    };

    // Génération du génome en fonction de la graine
    Creature.prototype.genGenome = function () {
        this.genome.decouverteRessources[C.TERRAIN.OCEAN]         = new Big(5);
        this.genome.decouverteRessources[C.TERRAIN.PLAGE]         = new Big(5);
        this.genome.decouverteRessources[C.TERRAIN.PRAIRIE]       = new Big(5);
        this.genome.decouverteRessources[C.TERRAIN.FORET]         = new Big(5);
        this.genome.decouverteRessources[C.TERRAIN.MONTAGNE]      = new Big(5);
        this.genome.decouverteRessources[C.TERRAIN.LAC]           = new Big(5);
        this.genome.decouverteRessources[C.TERRAIN.NEIGE]         = new Big(5);
        this.genome.decouverteRessources[C.TERRAIN.LAGON]         = new Big(5);

        this.genome.tpsMinage[C.TERRAIN.OCEAN]       = 5000;
        this.genome.tpsMinage[C.TERRAIN.PLAGE]       = 1000;
        this.genome.tpsMinage[C.TERRAIN.PRAIRIE]     = 5000;
        this.genome.tpsMinage[C.TERRAIN.FORET]       = 5000;
        this.genome.tpsMinage[C.TERRAIN.MONTAGNE]    = 5000;
        this.genome.tpsMinage[C.TERRAIN.LAC]         = 5000;
        this.genome.tpsMinage[C.TERRAIN.NEIGE]       = 5000;
        this.genome.tpsMinage[C.TERRAIN.LAGON]       = 5000;

        this.genome.nbSacrificesMutation    = new Big(-2000);
        this.genome.txCreaturesMangees      = C.BIG10;
        this.genome.txReproduction          = C.BIG1.div(this.type.mul(-1).add(C.NB_TYPES_CREATURES).add(1).mul(10));
        this.genome.resistanceVoyage        = 1;
        this.genome.resistanceAttaque       = 1;
    };

    // Génération de la morphologie en fonction du genome
    Creature.prototype.genMorphologie = function () { };

    // Renvoie la cellule en cours de conquête
    Creature.prototype.cellEnCours = function () {
        return this.carteEnCours.cell(this.iCellEnCours);
    };
}());
