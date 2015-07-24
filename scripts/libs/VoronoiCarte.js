function triSitesSurX(siteA, siteB) {
    "use strict";

    if (siteA.x < siteB.x) {
        return -1;
    }
    if (siteA.x > siteB.x) {
        return 1;
    }
    return 0;
}

function VoronoiCarte(dim, seed) {
    "use strict";
    
    this.dim        = dim;
    this.seed       = seed;
    
    this.voronoi    = new Voronoi();
    this.sites      = [];
    this.bbox       = {xl: 0, xr: this.dim.x, yt: 0, yb: this.dim.y};
    this.nbCells    = 0;
    
    this.genereSites();
    this.relaxeSites(4);
    this.sites.sort(triSitesSurX);
    this.calculVoisins();
    this.setCellsIndexes();
}

(function () {
    "use strict";
    VoronoiCarte.prototype.cellLaPlusProche = function (pos) {
        return this.diagram.cells[this.sites[this.indexSiteLePlusProche(pos)].voronoiId];
    };

    VoronoiCarte.prototype.cell = function (iCell) {
        return this.diagram.cells[iCell];
    };

    VoronoiCarte.prototype.cellPos = function (iCell) {
        return {
            x : this.diagram.cells[iCell].site.x,
            y : this.diagram.cells[iCell].site.y
        };
    };

    VoronoiCarte.prototype.setCellsIndexes = function () {
        var iCell;

        for (iCell = 0; iCell < this.nbCells; iCell += 1) {
            this.cell(iCell).index = iCell;
        }
    };

    VoronoiCarte.prototype.genereSites = function () {
        Math.seedrandom(this.seed);

        var xmargin = 8,
            ymargin = 8,
            dx = (this.dim.x - xmargin * 2),
            dy = (this.dim.y - ymargin * 2),
            compteur;

        for (compteur = 0; compteur < C.CARTE_NB_CELLS; compteur += 1) {
            this.sites.push({
                x : Math.floor(Math.random() * dx + xmargin),
                y : Math.floor(Math.random() * dy + ymargin)
            });
        }

        this.voronoi.recycle(this.diagram);
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
    };

    VoronoiCarte.prototype.relaxeSites =  function (iterations) {
        if (!this.diagram) { return; }
        var cells,
            iCell,
            cell,
            site,
            sites,
            rn,
            dist,
            p,
            compteur;

        for (compteur = 0; compteur < iterations; compteur += 1) {
            cells = this.diagram.cells;
            iCell = cells.length;
            p = 1 / iCell * 0.1;
            sites = [];

            while (iCell > 0) {
                iCell -= 1;
                cell = cells[iCell];
                rn = Math.random();
                // probability of apoptosis
                if (rn >= p) {
                    site = this.cellCentroid(cell);
                    dist = U.distance(site, cell.site);
                    // don't relax too fast
                    if (dist > 2) {
                        site.x = (site.x + cell.site.x) / 2;
                        site.y = (site.y + cell.site.y) / 2;
                    }
                    // probability of mytosis
                    if (rn > (1 - p)) {
                        dist /= 2;
                        sites.push({
                            x: site.x + (site.x - cell.site.x) / dist,
                            y: site.y + (site.y - cell.site.y) / dist
                        });
                    }
                    sites.push(site);
                }
            }
            this.compute(sites);
        }

        this.nbCells = this.diagram.cells.length;
    };

    VoronoiCarte.prototype.cellCentroid = function (cell) {
        var x = 0,
            y = 0,
            halfedges = cell.halfedges,
            iHalfedge = halfedges.length,
            halfedge,
            v,
            p1,
            p2;
        while (iHalfedge) {
            iHalfedge -= 1;
            halfedge = halfedges[iHalfedge];
            p1 = halfedge.getStartpoint();
            p2 = halfedge.getEndpoint();
            v = p1.x * p2.y - p2.x * p1.y;
            x += (p1.x + p2.x) * v;
            y += (p1.y + p2.y) * v;
        }
        v = this.cellArea(cell) * 6;
        return {x : x / v, y : y / v};
    };

    VoronoiCarte.prototype.cellArea = function (cell) {
        var area = 0,
            halfedges = cell.halfedges,
            iHalfedge = halfedges.length,
            halfedge,
            p1,
            p2;
        while (iHalfedge) {
            iHalfedge -= 1;
            halfedge = halfedges[iHalfedge];
            p1 = halfedge.getStartpoint();
            p2 = halfedge.getEndpoint();
            area += p1.x * p2.y;
            area -= p1.y * p2.x;
        }
        area /= 2;
        return area;
    };

    VoronoiCarte.prototype.compute = function (sites) {
        this.sites = sites;
        this.voronoi.recycle(this.diagram);
        this.diagram = this.voronoi.compute(sites, this.bbox);
    };

    VoronoiCarte.prototype.calculVoisins = function () {
        var compteur1, compteur2;

        for (compteur1 = 0; compteur1 < this.diagram.cells.length; compteur1 += 1) {
            this.diagram.cells[compteur1].voisins = [];
            for (compteur2 = 0; compteur2 < this.diagram.cells[compteur1].halfedges.length; compteur2 += 1) {
                if (this.diagram.cells[compteur1].halfedges[compteur2].edge.lSite && this.diagram.cells[compteur1].halfedges[compteur2].edge.lSite.voronoiId !== compteur1) {
                    this.diagram.cells[compteur1].voisins.push(this.diagram.cells[this.diagram.cells[compteur1].halfedges[compteur2].edge.lSite.voronoiId]);
                }
                if (this.diagram.cells[compteur1].halfedges[compteur2].edge.rSite && this.diagram.cells[compteur1].halfedges[compteur2].edge.rSite.voronoiId !== compteur1) {
                    this.diagram.cells[compteur1].voisins.push(this.diagram.cells[this.diagram.cells[compteur1].halfedges[compteur2].edge.rSite.voronoiId]);
                }
            }
        }

    };

    VoronoiCarte.prototype.indexSiteLePlusProche = function (pos) {
        var indexDemarrage  = this.indexSiteLePlusProcheSurX(pos),
            distMin         = U.distance(pos, this.sites[indexDemarrage]),
            index           = indexDemarrage + 1,
            retour          = indexDemarrage,
            distTmp,
            maxIndex        = this.sites.length - 1,
            continuer       = index <= maxIndex;

        while (continuer) {
            if (Math.abs(this.sites[index].x - pos.x) > distMin) {
                continuer = false;
            } else {
                distTmp = U.distance(this.sites[index], pos);
                if (distTmp < distMin) {
                    retour  = index;
                    distMin = distTmp;
                }
            }

            index += 1;

            continuer = continuer && index <= maxIndex;

        }

        index       = indexDemarrage - 1;
        continuer   = index >= 0;

        while (continuer) {
            if (Math.abs(this.sites[index].x - pos.x) > distMin) {
                continuer = false;
            } else {
                distTmp = U.distance(this.sites[index], pos);
                if (distTmp < distMin) {
                    retour  = index;
                    distMin = distTmp;
                }
            }

            index -= 1;

            continuer = continuer && index >= 0;
        }

        return retour;
    };

    VoronoiCarte.prototype.indexSiteLePlusProcheSurX = function (pos) {
        var mid,
            lo = 0,
            hi = this.sites.length - 1;
        while (hi - lo > 1) {
            mid = Math.floor((lo + hi) / 2);
            if (this.sites[mid].x < pos.x) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        if (pos.x - this.sites[lo].x <= this.sites[hi].x - pos.x) {
            return lo;
        }
        return hi;
    };
}());
