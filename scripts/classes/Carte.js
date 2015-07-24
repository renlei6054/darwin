function Carte(niveau, graineGlobale, carteGlobale, iCellGlobale, nbCellsConquises) {
    "use strict";

    var iCell, compteur;

    nbCellsConquises = typeof nbCellsConquises !== "undefined" ? nbCellsConquises : 0;

    this.niveau             = niveau;
    this.nbCellsConquises   = 0;
    this.estCarteGlobale    = niveau.eq(0);

    if (!this.estCarteGlobale && typeof carteGlobale === "undefined") {
        carteGlobale = new Carte(0, graineGlobale);
    }

    // Type de terrain de la carte (si indefini carte globale avec tous les terrains)
    this.typeTerrain    = this.estCarteGlobale ? C.TERRAIN.INDEFINI : carteGlobale.cell(iCellGlobale).typeTerrain;
    this.graine         = parseInt(graineGlobale, 10) + (this.estCarteGlobale ? 0 : Math.random());    // Graine pour l'initialisation de l'aléatoire de la carte

    this.voronoi        = new VoronoiCarte(                             // Voronoi de la carte
        {x: C.TAILLE_CARTE_REF, y: C.TAILLE_CARTE_REF},
        this.graine
    );

    this.nbCells        = this.voronoi.nbCells;                         // Nombre de cellules de la carte


    this.cellAConquerir = [];

    // Coordonnees de chaque cellule
    for (iCell = 0; iCell < this.nbCells; iCell += 1) {
        this.cell(iCell).index          = iCell;   // Coordonnees de la cellule
        this.cell(iCell).conquise       = false;   // Cellule conquise ou non
        this.cell(iCell).aConquerir     = false;   // Cellule marquée à conquérir ou non
    }

    Math.seedrandom(this.graine);                                       // Réinitialisation du générateur aléatoire

    if (this.typeTerrain === C.TERRAIN.INDEFINI) {
        this.generateur  = {                                            // Données pour la génération de l'île
            startAngle      : 2 * Math.PI * Math.random(),
            bumps           : Math.ceil(6 * Math.random()),
            dipAngle        : 2 * Math.PI * Math.random(),
            dipWidth        : 0.5 * Math.random() + 0.2,
            island_factor   : 1.07 // 1.0 -> 2.0
        };

        this.calculTerrain();
    } else {
        for (iCell = 0; iCell < this.nbCells; iCell += 1) {
            this.cell(iCell).typeTerrain = this.typeTerrain;
        }
    }

    for (compteur = 0; compteur < nbCellsConquises; compteur += 1) {
        this.setCellConquise(this.cellSuivanteNonConquise());
    }
}

(function () {
    "use strict";
    // Renvoie la cellule suivante à conquérir en partant de l'actuelle
    Carte.prototype.cellSuivanteNonConquise = function () {
        if (this.cellAConquerir.length > 0) {
            return this.cellAConquerir.shift();
        } else {
            return this.cell(Math.floor(C.CARTE_NB_CELLS / 2));
        }
    };

    // Marque une celle comme conquise et recalcule les cases à conquérir
    Carte.prototype.setCellConquise = function (cell) {
        var iVoisin;
        cell.conquise = true;
        this.nbCellsConquises += 1;
        for (iVoisin = 0; iVoisin < cell.voisins.length; iVoisin += 1) {
            if (!(cell.voisins[iVoisin].conquise || cell.voisins[iVoisin].aConquerir)) {
                this.cellAConquerir.push(cell.voisins[iVoisin]);
                cell.voisins[iVoisin].aConquerir = true;
            }
        }
    };

    // Retourne une cell en fonction des coordonnees
    Carte.prototype.getCell = function (coords) { return {}; };

    // Retourne la première case à découvrir de la carte
    Carte.prototype.premiereCell = function () { return {}; };

    // Retourne une cellule en fonction de son index
    Carte.prototype.cell = function (iCell) { return this.voronoi.cell(iCell); };

    // Position du point voronoi d'une cellule
    Carte.prototype.cellPos = function (iCell) { return this.voronoi.cellPos(iCell); };

    // Retourne la cellule la plus proche d'une position
    Carte.prototype.cellLaPlusProche = function (pos) { return this.voronoi.cellLaPlusProche(pos); };

    // Calcul le terrain de chaque cellule de la carte
    Carte.prototype.calculTerrain = function () {
        var cell, iCell;

        // Initialisation des sites si est terre ou non
        for (iCell = 0; iCell < this.nbCells; iCell += 1) {
            this.cell(iCell).typeTerrain = C.TERRAIN.INDEFINI;
            this.cell(iCell).estTerre = this.estTerre({x : this.cellPos(iCell).x - C.TAILLE_CARTE_REF / 2, y :  this.cellPos(iCell).y - C.TAILLE_CARTE_REF / 2 });
        }

        this.setOcean(this.cellLaPlusProche({ x : 0, y : 0 }));

        // Installe les lacs
        for (iCell = 0; iCell < this.nbCells; iCell += 1) {
            if (this.cell(iCell).typeTerrain === C.TERRAIN.INDEFINI && !this.cell(iCell).estTerre) {
                this.cell(iCell).typeTerrain = C.TERRAIN.LAC;
            }
        }

        this.setTerrain(C.TERRAIN.PLAGE, C.TERRAIN.OCEAN, C.TERRAIN.INDEFINI);      // Plages
        this.setTerrain(C.TERRAIN.PLAGE, C.TERRAIN.LAC, C.TERRAIN.INDEFINI);        // Plages autour des lacs
        this.setTerrain(C.TERRAIN.PRAIRIE, C.TERRAIN.PLAGE, C.TERRAIN.INDEFINI);    // Prairies
        this.setTerrain(C.TERRAIN.FORET, C.TERRAIN.PRAIRIE, C.TERRAIN.INDEFINI);    // Forets
        this.setTerrain(C.TERRAIN.MONTAGNE, C.TERRAIN.FORET, C.TERRAIN.INDEFINI);   // Montagne

        // Installe la neige
        for (iCell = 0; iCell < this.nbCells; iCell += 1) {
            if (this.cell(iCell).typeTerrain === C.TERRAIN.INDEFINI) {
                this.cell(iCell).typeTerrain = C.TERRAIN.NEIGE;
            }
        }

        this.setTerrain(C.TERRAIN.LAGON, C.TERRAIN.PLAGE, C.TERRAIN.OCEAN);         // Lagons

    };

    // Set les océans
    Carte.prototype.setOcean = function (cell) {
        var iVoisin;

        cell.typeTerrain = C.TERRAIN.OCEAN;

        for (iVoisin = 0; iVoisin < cell.voisins.length; iVoisin += 1) {
            if (cell.voisins[iVoisin].typeTerrain === C.TERRAIN.INDEFINI && !cell.voisins[iVoisin].estTerre) {
                this.setOcean(cell.voisins[iVoisin]);
            }
        }
    };

    // Set les terrains de manière concentrique
    Carte.prototype.setTerrain = function (type, typeVoisin, typeInitial) {
        var iCell,
            iVoisin,
            aAssigner;

        for (iCell = 0; iCell < this.nbCells; iCell += 1) {
            if (this.cell(iCell).typeTerrain === typeInitial) {
                aAssigner = false;
                for (iVoisin = 0; iVoisin < this.cell(iCell).voisins.length; iVoisin += 1) {
                    if (this.cell(iCell).voisins[iVoisin].typeTerrain === typeVoisin) {
                        aAssigner = true;
                    }
                }
                if (aAssigner) {
                    this.cell(iCell).typeTerrain = type;
                }
            }
        }
    };

    // Détermine si une case est terre ou non
    Carte.prototype.estTerre = function (pos) {
        var angle   = Math.atan2(pos.y, pos.x),
            length  = 1.1 * (Math.max(Math.abs(pos.x), Math.abs(pos.y)) + U.distance(pos, {x : 0, y : 0})) / Math.min(C.TAILLE_CARTE_REF, C.TAILLE_CARTE_REF),
            r1      = 0.5 + 0.40 * Math.sin(this.generateur.startAngle + this.generateur.bumps * angle + Math.cos((this.generateur.bumps + 3) * angle)),
            r2      = 0.7 - 0.20 * Math.sin(this.generateur.startAngle + this.generateur.bumps * angle - Math.sin((this.generateur.bumps + 2) * angle));
        if (Math.abs(angle - this.generateur.dipAngle) < this.generateur.dipWidth || Math.abs(angle - this.generateur.dipAngle + 2 * Math.PI) < this.generateur.dipWidth || Math.abs(angle - this.generateur.dipAngle - 2 * Math.PI) < this.generateur.dipWidth) {
            r1 = r2 = 0.2;
        }
        return (length < r1 || (length > r1 * this.generateur.island_factor && length < r2));
    };
}());