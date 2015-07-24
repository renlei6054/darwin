
function Darwin() {
    "use strict";

    var iCoord,
        coordPremiereCase,
        iCell = 0,
        demiNbCells = Math.round(C.CARTE_NB_CELLS / 2);

    this.intervaleMin       = 0;

    this.graineGlobale      = Date.now().toString();                                                                    // Graine globale de la partie
    this.carteGlobale       = new Carte(C.BIG0, this.graineGlobale);                                                         // Carte globale (premier niveau)

    // On trouve la première case de sable sur la carte globale
    while (this.carteGlobale.cell(iCell).typeTerrain !== C.TERRAIN.OCEAN) {
        iCell += 1;
    }

    coordPremiereCase = iCell;

    this.intervalesDelta        = [];   // Intervales d'application des deltas
    this.inverseIntervalesDelta = [];   // Inverses des intervaux
    this.avancementsDelta       = [];   // Taux d'avancement des delta
    this.resources              = [];   // Quantités de resources disponibles
    this.resourcesPrec          = [];   // Quantités de resources disponibles le tour d'avant
    this.resourcesEvol          = [];   // Variation de resources
    this.resourcesEnAttente     = [];   // Variations de resources en attente

    this.setIntervaleDelta(C.DELTAS.CANNIBALISME, 10000);
    this.setIntervaleDelta(C.DELTAS.PREDATION, 10000);
    this.setIntervaleDelta(C.DELTAS.REPRODUCTION, 2000);

    this.creatures          = [                                                                                         // Types de créatures
        new Creature(new Big(C.NB_TYPES_CREATURES - 1), new Big(990), coordPremiereCase, null, this)
    ];

    this.calcIntervaleMin();

    this.avancementsDelta[C.DELTAS.CANNIBALISME]    = 0;
    this.avancementsDelta[C.DELTAS.PREDATION]       = 0;
    this.avancementsDelta[C.DELTAS.REPRODUCTION]    = 0;

    U.eachTerrain(this, function (terrain) {
        this.resources[terrain]          = C.BIG0;
        this.resourcesPrec[terrain]      = C.BIG0;
        this.resourcesEvol[terrain]      = 0;
        this.resourcesEnAttente[terrain] = C.BIG0;
    });
}

(function () {
    "use strict";

    // Fait avancer les paramètres en fonction d'un delta de temps
    Darwin.prototype.avance = function (deltaTs, creatureAffichee) {

        var me = this,
            palierAtteind = false,      // S'il y a des modifications sur la population ou les taux
            iCreature,
            avancementDelta,
            nbCycles,
            creature,
            paliers = {
                changementCarte : false,
                changementCarteInfos : false,
                changementPopulation : false,
                changementResources : false
            },
            cellsConquises,
            compteur,
            niveauNouvelleCarte,
            typeTerrain,
            populationTheorique;

        this.majResourcesPrec();

        U.eachTerrain(this, function (terrain) {
            this.resources[terrain] = this.resources[terrain].add(this.resourcesEnAttente[terrain]);
            this.resourcesEnAttente[terrain] = C.BIG0;
        });


        if (deltaTs > 2 * this.intervaleMin) {
            nbCycles = Math.floor(deltaTs / this.intervaleMin);
            U.repete(function () { me.avance(me.intervaleMin); }, nbCycles);
            deltaTs = deltaTs - this.intervaleMin * nbCycles;
        }

        // Traitement des créature en cours de minage
        for (iCreature = 0; iCreature < this.creatures.length; iCreature += 1) {
            creature = this.creatures[iCreature];
            creature.majDeltasPrec();
            if (creature.actionEnCours === C.ACTIONS.MINAGE) {
                creature.avancementMinage += deltaTs;
            }
            creature.population = creature.population.add(creature.populationEnAttente);
            if (!creature.populationEnAttente.eq(C.BIG0)) {
                palierAtteind = true;
            }
            creature.populationEnAttente = C.BIG0;
        }

        // Modification de la population en fonction de l'avancement des deltas
        U.eachDelta(this, function (delta) {
            avancementDelta                 = this.avancementsDelta[delta] + deltaTs;
            nbCycles                        = Math.floor(avancementDelta / this.intervalesDelta[delta]);
            this.avancementsDelta[delta]    = avancementDelta - (nbCycles * this.intervalesDelta[delta]);

            palierAtteind = palierAtteind || nbCycles > 0;

            if (nbCycles) {
                for (iCreature = 0; iCreature < this.creatures.length; iCreature += 1) {
                    this.creatures[iCreature].population = this.creatures[iCreature].population.add(this.creatures[iCreature].deltasFinCycle[delta].mul(nbCycles)).round(0, 0);
                    this.creatures[iCreature].calcDeltas();
                }
            }
        });

        paliers.changementPopulation = palierAtteind;

        // S'il y a un changement dans la population
        if (palierAtteind) {
            for (iCreature = 0; iCreature < this.creatures.length; iCreature += 1) {

                creature = this.creatures[iCreature];

                populationTheorique = creature.nbCellsConquises.mul(C.NB_CREATURES_PAR_CELL).round(0, 0);

                creature.population = creature.population.setMin(C.BIG0);
                creature.cannibale = creature.cannibale && !creature.population.eq(C.BIG0);

                if (creature.actionEnCours === C.ACTIONS.MINAGE) {
                    creature.population = creature.population.setMax(populationTheorique);
                } else if (creature.actionEnCours === C.ACTIONS.PEUPLEMENT && creature.population.gt(populationTheorique)) {
                    creature.actionEnCours = C.ACTIONS.CONQUETE;
                }

                creature.populationSurCellEnCours = creature.population.sub(populationTheorique).setMin(C.BIG0);

                // Si une ou plusieurs case est conquise
                if (creature.populationSurCellEnCours.gt(creature.nbCreaturesParCell)) {
                    // Nombre de cells conquises par rapport à la taille de la carte en cours
                    cellsConquises = parseInt(creature.populationSurCellEnCours.div(creature.nbCreaturesParCell).round(0, 0), 10);
                    // Nombre total de cells conquises par la créature (à l'échelle de la créature)
                    creature.nbCellsConquises = creature.nbCellsConquises.add(creature.nbCellsParCellCarte.mul(cellsConquises));

                    // On ramène la population au nombre de cells conquises
                    creature.population = creature.nbCellsConquises.mul(C.NB_CREATURES_PAR_CELL).round(0, 0);

                    // Si la carte en cours est complétement conquise on change de carte
                    if (creature.carteEnCours.nbCellsConquises + cellsConquises >= creature.carteEnCours.nbCells) {
                        if (creature.deltasFinCycleTotal.abs().gt(creature.nbCreaturesParCell.mul(C.CARTE_NB_CELLS).mul(0.03))) {
                            niveauNouvelleCarte = creature.carteEnCours.niveau.sub(1).setMin(C.BIG0);
                        } else if (creature.deltasFinCycleTotal.abs().lt(creature.nbCreaturesParCell.mul(C.CARTE_NB_CELLS).mul(0.0003))) {
                            niveauNouvelleCarte = creature.carteEnCours.niveau.add(1).setMax(creature.type);
                        } else {
                            niveauNouvelleCarte = creature.carteEnCours.niveau;
                        }

                        creature.calcNbCreaturesParCell(niveauNouvelleCarte);

                        creature.carteEnCours = new Carte(
                            niveauNouvelleCarte,
                            this.graineGlobale,
                            this.carteGlobale,
                            creature.iCellGlobale,
                            creature.population.mod(creature.nbCreaturesParCell.mul(C.CARTE_NB_CELLS)).div(creature.nbCreaturesParCell).round(0, 0).toString()
                        );



                        if (creature === creatureAffichee) {
                            paliers.changementCarte = true;
                        }
                    // Sinon on marque comme conquises des cells sur la carte actuelle
                    } else {
                        creature.carteEnCours.setCellConquise(creature.cellEnCours());

                        for (compteur = 0; compteur < cellsConquises - 1; compteur += 1) {
                            creature.carteEnCours.setCellConquise(creature.carteEnCours.cellSuivanteNonConquise());
                        }
                    }
                    creature.iCellEnCours               = creature.carteEnCours.cellSuivanteNonConquise().index;
                    creature.populationSurCellEnCours   = creature.population.sub(creature.nbCellsConquises.mul(C.NB_CREATURES_PAR_CELL));
                    paliers.changementCarteInfos        = true;//creature === creatureAffichee;
                    creature.actionEnCours              = C.ACTIONS.MINAGE;
                    creature.avancementMinage           = 0;

                } else if (creature.population.lt(creature.nbCellsConquises.mul(C.NB_CREATURES_PAR_CELL))) {
                    if (creature.actionEnCours !== C.ACTIONS.PEUPLEMENT || creature.population.lt(creature.popInitPeuplement)) {
                        creature.popInitPeuplement = creature.population;
                    }
                    creature.actionEnCours          = C.ACTIONS.PEUPLEMENT;
                    creature.avancementPeuplement   = creature.population.sub(creature.popInitPeuplement).div(populationTheorique.sub(creature.popInitPeuplement));
                }
            }


        }

        for (iCreature = 0; iCreature < this.creatures.length; iCreature += 1) {
            creature    = this.creatures[iCreature];
            creature.calcDeltasEvols();
            typeTerrain = creature.cellEnCours().typeTerrain;
            if (creature.actionEnCours === C.ACTIONS.MINAGE && creature.avancementMinage >= creature.genome.tpsMinage[typeTerrain]) {

                creature.actionEnCours = C.ACTIONS.CONQUETE;
                this.resources[typeTerrain] = this.resources[creature.cellEnCours().typeTerrain].add(creature.genome.decouverteRessources[typeTerrain].mul(creature.nbCellsConquises.sub(creature.nbCellsMinees)));
                creature.nbCellsMinees = creature.nbCellsConquises;
                paliers.changementResources = true;

            }
        }

        this.calcResourcesEvol();

        return paliers;
    };

    // Calcul l'intervale minimum
    Darwin.prototype.calcIntervaleMin = function () {
        var iDelta,
            iCreature,
            iTerrain;

        this.intervaleMin = this.intervalesDelta[C.DELTAS.REPRODUCTION];

        U.eachDelta(this, function (delta) { this.intervaleMin = Math.min(this.intervaleMin, this.intervalesDelta[delta]); });

        for (iCreature = 0; iCreature < this.creatures.length; iCreature += 1) {
            for (iTerrain in C.TERRAIN) {
                if (C.TERRAIN.hasOwnProperty(iTerrain) && this.creatures[iCreature].genome.tpsMinage[C.TERRAIN[iTerrain]]) {
                    this.intervaleMin = Math.min(this.intervaleMin, this.creatures[iCreature].genome.tpsMinage[C.TERRAIN[iTerrain]]);
                }
            }

        }
    };

    // Met à jour un interval delta
    Darwin.prototype.setIntervaleDelta = function (delta, valeur) {
        this.intervalesDelta[delta] = valeur;
        this.inverseIntervalesDelta[delta] = C.BIG1000.div(valeur);
    };

    // Met à jour les resources précédentes
    Darwin.prototype.majResourcesPrec = function () {
        U.eachTerrain(this, function (terrain) {
            this.resourcesPrec[terrain]  = this.resources[terrain];
        });
    };

    // Calcul l'évolution des resources
    Darwin.prototype.calcResourcesEvol = function () {
        U.eachTerrain(this, function (terrain) {
            if (this.resources[terrain].gt(this.resourcesPrec[terrain])) {
                this.resourcesEvol[terrain] = 1;
            } else if (this.resources[terrain].lt(this.resourcesPrec[terrain])) {
                this.resourcesEvol[terrain] = -1;
            } else {
                this.resourcesEvol[terrain] = 0;
            }
        });
    };

}());