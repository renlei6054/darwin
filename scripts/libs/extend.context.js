(function () {
    "use strict";

    CanvasRenderingContext2D.prototype.dImageReplaceColor = function (image, coulSrc, coulDst, x, y) {
        var cva = document.createElement('canvas'),
            ctx,
            imageData,
            compteur;

        cva.width  = image.width;
        cva.height = image.height;
        ctx        = cva.getContext("2d");

        ctx.drawImage(image, 0, 0);

        imageData = ctx.getImageData(0, 0, image.width, image.height);

        for (compteur = 0; compteur < imageData.data.length; compteur += 4) {
            if (imageData.data[compteur] === coulSrc.r && imageData.data[compteur + 1] === coulSrc.g && imageData.data[compteur + 2] === coulSrc.b) {
                imageData.data[compteur] = coulDst.r;
                imageData.data[compteur + 1] = coulDst.g;
                imageData.data[compteur + 2] = coulDst.b;
            }
        }

        this.putImageData(imageData, x, y);
    };

    CanvasRenderingContext2D.prototype.clearZone = function (zone) {
        this.clearRect(zone.pos.x, zone.pos.y, zone.dim.x, zone.dim.y);
    };

    CanvasRenderingContext2D.prototype.circle = function (centerX, centerY, rayon) {
        this.arc(centerX, centerY, rayon, 0, 2 * Math.PI, false);
    };

    CanvasRenderingContext2D.prototype.remplirCercle = function (centerX, centerY, rayon, couleur) {
        this.beginPath();
        this.fillStyle = couleur;
        this.arc(centerX, centerY, rayon, 0, 2 * Math.PI, false);
        this.fill();
    };
    
    CanvasRenderingContext2D.prototype.strokeArc = function (centerX, centerY, rayon, debut, fin, anticlockwise) {
        anticlockwise = typeof anticlockwise !== "undefined" ? anticlockwise : false;
        this.beginPath();
        this.arc(centerX, centerY, rayon, debut, fin, anticlockwise);
        this.stroke();
    };
    CanvasRenderingContext2D.prototype.fillArc = function (centerX, centerY, rayon, debut, fin, anticlockwise) {
        anticlockwise = typeof anticlockwise !== "undefined" ? anticlockwise : false;
        this.beginPath();
        this.arc(centerX, centerY, rayon, debut, fin, anticlockwise);
        this.fill();
    };

    CanvasRenderingContext2D.prototype.big = function (nombre, posX, posY) {
        var nb = new Big(nombre),
            unite = Math.floor(nb.e / 3),
            couleurs = [COPIC.N0, COPIC.YG07, COPIC.YR16, COPIC.R24, COPIC.B79],
            compteur,
            modulo = couleurs.length;

        this.save();

        nb.c = nb.c.slice(0, 3);
        nb.e %= 3;
        this.textAlign = 'right';
        //this.fillStyle = COPIC.N10;
        this.fillText(nb.toPrecision(3), posX + 32, posY);
        //this.fillText(unite.toString(), posX, posY);

        this.lineWidth = 1;
        this.strokeStyle = COPIC.NOIR;

        this.fillStyle = couleurs[unite % modulo];
        this.beginPath();
        this.rect(posX + 34.5, posY - 6 + 8.5, 6, 6);
        this.fill();
        this.stroke();
        unite = Math.floor(unite / modulo);

        this.fillStyle = couleurs[unite % modulo];
        this.beginPath();
        this.rect(posX + 34.5 + 6, posY - 6 + 8.5, 6, 6);
        this.fill();
        this.stroke();
        unite = Math.floor(unite / modulo);

        this.fillStyle = couleurs[unite % modulo];
        this.beginPath();
        this.rect(posX + 34.5, posY + 8.5, 6, 6);
        this.fill();
        this.stroke();
        unite = Math.floor(unite / modulo);

        this.fillStyle = couleurs[unite % modulo];
        this.beginPath();
        this.rect(posX + 34.5 + 6, posY + 8.5, 6, 6);
        this.fill();
        this.stroke();

        this.restore();
    };

    CanvasRenderingContext2D.prototype.initTexte = function () {
        this.textBaseline = 'hanging';
        this.textAlign = 'left';
        this.font = '15pt Mouse Memoirs';
    };

    CanvasRenderingContext2D.prototype.rRect = function (posX, posY, dimX, dimY, rayon) {
        this.moveTo(posX + rayon, posY);
        this.lineTo(posX + dimX - rayon, posY);
        this.quadraticCurveTo(posX + dimX, posY, posX + dimX, posY + rayon);
        this.lineTo(posX + dimX, posY + dimY - rayon);
        this.quadraticCurveTo(posX + dimX, posY + dimY, posX + dimX - rayon, posY + dimY);
        this.lineTo(posX + rayon, posY + dimY);
        this.quadraticCurveTo(posX, posY + dimY, posX, posY + dimY - rayon);
        this.lineTo(posX, posY + rayon);
        this.quadraticCurveTo(posX, posY, posX + rayon, posY);
    };

    CanvasRenderingContext2D.prototype.rndStroke = function (fonction, params) {
        var compteur,
            p = {
                vibration : 9,
                nbVibrations : 20,
                opaciteMax : 0.3,
                dessinePremiere : true
            };

        $.extend(p, params);

        Math.seedrandom(Date.now().toString());

        if (p.dessinePremiere) { fonction.call(this, this); }

        for (compteur = 0; compteur < p.nbVibrations; compteur += 1) {
            this.save();
            this.translate(p.vibration * (0.5 - Math.random()), p.vibration * (0.5 - Math.random()));
            this.lineWidth = 1;
            this.globalAlpha = p.opaciteMax * Math.random();
            //this.strokeStyle = tinycolor(this.strokeStyle).setAlpha(opaciteMax * Math.random()).toRgbString();
            fonction.call(this, this);
            this.restore();
        }
    };

    CanvasRenderingContext2D.prototype.rndLine = function (x1, y1, x2, y2) {
        this.strokeStyle    = COPIC.NOIR;
        this.lineWidth      = 1;

        this.rndStroke(function () {
            this.beginPath();
            this.moveTo(x1, y1);
            this.lineTo(x2, y2);
            this.stroke();
        }, { vibration: 4, nbVibrations: 10 });
    };

    CanvasRenderingContext2D.prototype.led = function (centerX, centerY, couleur) {

        var rayon = 10;

        couleur = typeof couleur !== "undefined" ? couleur : COPIC.TRANSP;

        this.lineWidth      = 3;
        this.strokeStyle    = COPIC.NOIR;
        this.fillStyle      = couleur;

        this.fillArc(centerX, centerY, rayon, 0, 2 * Math.PI);

        this.rndStroke(function () { this.strokeArc(centerX, centerY, rayon, 0, 2 * Math.PI); }, { vibration: 7, nbVibrations: 20 });

        this.strokeStyle = "rgba(255, 255, 255, 0.5)";
        this.lineWidth = 1.8;
        this.rndStroke(function () { this.strokeArc(centerX, centerY, 0.6 * rayon, Math.PI, 1.5 * Math.PI); }, { vibration: 5, nbVibrations: 2 });
        this.rndStroke(function () { this.strokeArc(centerX, centerY, 0.6 * rayon,  0, 0.5 * Math.PI); }, { vibration: 5, nbVibrations: 2 });

    };

    CanvasRenderingContext2D.prototype.bouton = function (centerX, centerY, couleur) {

        var rayon = 20;

        couleur = typeof couleur !== "undefined" ? couleur : COPIC.TRANSP;

        this.lineWidth      = 3;
        this.strokeStyle    = "#000000";
        this.fillStyle      = couleur;

        this.fillArc(centerX, centerY, rayon, 0, 2 * Math.PI, false);

        this.rndStroke(function () { this.strokeArc(centerX, centerY, rayon, 0, 2 * Math.PI); }, { vibration: 10, nbVibrations: 20 });
        this.rndStroke(function () { this.strokeArc(centerX, centerY, rayon * 0.7, 0, 2 * Math.PI); }, { vibration: 10, nbVibrations: 20 });

        this.strokeStyle = "rgba(255, 255, 255, 0.5)";
        this.lineWidth = 1.8;
        this.rndStroke(function () { this.strokeArc(centerX, centerY, 0.85 * rayon, Math.PI, 1.5 * Math.PI); }, { vibration: 8, nbVibrations: 4 });
        this.rndStroke(function () { this.strokeArc(centerX, centerY, 0.4 * rayon,  0, 0.5 * Math.PI); }, { vibration: 8, nbVibrations: 4 });

        this.strokeStyle = "rgba(0, 0, 0, 0.5)";
        this.rndStroke(function () { this.strokeArc(centerX, centerY, 0.4 * rayon, Math.PI, 1.5 * Math.PI); }, { vibration: 8, nbVibrations: 4 });
        this.rndStroke(function () { this.strokeArc(centerX, centerY, 0.85 * rayon,  0, 0.5 * Math.PI); }, { vibration: 8, nbVibrations: 4 });

    };

    CanvasRenderingContext2D.prototype.boutonOver = function (centerX, centerY) {

        var rayon = 20;

        this.strokeStyle = "rgba(255, 255, 255, 0.5)";
        this.lineWidth = 1.8;
        this.rndStroke(function () { this.strokeArc(centerX, centerY, 0.85 * rayon, 0, 0.5 * Math.PI); }, { vibration: 8, nbVibrations: 4 });
        this.strokeStyle = "rgba(0, 0, 0, 0.5)";
        this.rndStroke(function () { this.strokeArc(centerX, centerY, 0.85 * rayon, Math.PI, 1.5 * Math.PI); }, { vibration: 8, nbVibrations: 4 });

    };

    CanvasRenderingContext2D.prototype.donutPartiel = function (centerX, centerY, rayon, epaisseur, angleDebut, angleFin, couleur) {
        this.lineWidth = epaisseur || 1;
        this.strokeStyle = couleur;
        this.strokeArc(centerX, centerY, rayon + epaisseur / 2, angleDebut, angleFin, false);
    };

    CanvasRenderingContext2D.prototype.interrupteur = function (posX, posY, niveau, maxNiveau, couleur) {

        var dimX    = 26,
            rayon   = 7,
            posRondX;

        if (typeof couleur === "undefined") {
            if (niveau === 0) {
                this.fillStyle = COPIC.R24;
                posRondX = posX + rayon;
            } else if (niveau === 2 || (maxNiveau === 1 && niveau === 1)) {
                this.fillStyle = COPIC.YG23;
                posRondX = posX + dimX - rayon;
            } else {
                this.fillStyle = COPIC.YR16;
                posRondX = posX + dimX / 2;
            }
        } else {
            this.fillStyle = couleur;
        }

        this.beginPath();
        this.rRect(posX - 1, posY, dimX + 2, 2 * rayon, 8);
        this.fill();

        this.fillStyle = COPIC.N3;
        this.beginPath();
        this.circle(posRondX, posY + rayon, rayon - 1);
        this.fill();

        this.strokeStyle = COPIC.NOIR;
        this.lineWidth = 2;
        this.rndStroke(function () {
            this.beginPath();
            this.rRect(posX - 1, posY, dimX + 2, 2 * rayon, 8);
            this.stroke();
            this.beginPath();
            this.circle(posRondX, posY + rayon, rayon - 1);
            this.stroke();
        }, { vibration: 8, nbVibrations: 10 });



    };

    CanvasRenderingContext2D.prototype.barreAvancementSurC = function (posX, posY) {

        var dimX = 120,
            dimY = 15;

        this.strokeStyle = COPIC.NOIR;
        this.lineWidth = 2;
        this.rndStroke(function () {
            this.beginPath();
            this.rRect(posX - 1, posY, dimX + 2, dimY, 8);
            this.stroke();
        }, { vibration: 5, nbVibrations: 20 });

        this.strokeStyle = COPIC.N0;
        this.lineWidth = 1;
        this.rndStroke(function () {
            var posYTmp = posY + 5;
            this.beginPath();
            this.moveTo(posX, posYTmp);
            this.lineTo(posX + dimX, posYTmp);
            this.stroke();
        }, { vibration: 3, nbVibrations: 10 });

        this.strokeStyle = COPIC.BG78;
        this.lineWidth = 1;
        this.rndStroke(function () {
            var posYTmp = posY + dimY - 5;
            this.beginPath();
            this.moveTo(posX, posYTmp);
            this.lineTo(posX + dimX, posYTmp);
            this.stroke();
        }, { vibration: 3, nbVibrations: 10 });

    };

    CanvasRenderingContext2D.prototype.barreRatioSurc = CanvasRenderingContext2D.prototype.barreAvancementSurC;

    CanvasRenderingContext2D.prototype.barreAvancement = function (posX, posY, avancement, couleur) {

        var dimX = 120,
            dimY = 15;

        avancement = Math.min(1, Math.max(0, avancement));

        this.beginPath();
        this.fillStyle = COPIC.T7;
        this.rect(posX, posY, dimX, dimY);
        this.fill();

        this.beginPath();
        this.fillStyle = typeof couleur !== "undefined" ? couleur : COPIC.BG13;
        this.rect(posX, posY, dimX * avancement, dimY);
        this.fill();

    };

    CanvasRenderingContext2D.prototype.barreRatio = function (posX, posY, ratios) {

        var dimX = 120,
            dimY = 15,
            currentPos = posX;

        U.eachDelta(this, function (delta) {
            this.beginPath();
            this.fillStyle = C.COULEURS_DELTA[delta];
            this.fillRect(currentPos, posY, dimX * ratios[delta], dimY);
            currentPos += dimX * ratios[delta];
        });

        this.strokeStyle = COPIC.N0;
        this.lineWidth = 1;
        this.rndStroke(function () {
            var posYTmp = posY + 5;
            this.beginPath();
            this.moveTo(posX, posYTmp);
            this.lineTo(posX + dimX, posYTmp);
            this.stroke();
        }, { vibration: 3, nbVibrations: 10 });

        this.strokeStyle = COPIC.BG78;
        this.lineWidth = 1;
        this.rndStroke(function () {
            var posYTmp = posY + dimY - 5;
            this.beginPath();
            this.moveTo(posX, posYTmp);
            this.lineTo(posX + dimX, posYTmp);
            this.stroke();
        }, { vibration: 3, nbVibrations: 10 });
    };

    CanvasRenderingContext2D.prototype.remplirCellCarte = function (cell, couleur) {
        var halfedges,
            nHalfedges,
            v,
            iHalfedge;

        couleur = typeof couleur !== "undefined" ? couleur : (cell.conquise ? C.COULEURS_CARTE_1[cell.typeTerrain] : C.COULEURS_CARTE_0[cell.typeTerrain]);

        if (cell) {
            halfedges = cell.halfedges;
            nHalfedges = halfedges.length;
            if (nHalfedges > 2) {
                v = halfedges[0].getStartpoint();
                this.beginPath();
                this.moveTo(v.x, v.y);
                for (iHalfedge = 0; iHalfedge < nHalfedges; iHalfedge += 1) {
                    v = halfedges[iHalfedge].getEndpoint();
                    this.lineTo(v.x, v.y);
                }
                this.fillStyle = couleur;
                this.fill();
            }
        }
    };


        // Dessin d'une créature
    CanvasRenderingContext2D.prototype.dCreature = function (creature, pos, dimXY) {
        var echelles = {
                pattes : 1.2,
                corps : 0.3 * Math.random() + 0.7,
                tete : 1,
                oreilles : 1.2,
                yeux : 0.3 * Math.random() + 0.7,
                museau : 1,
                anneau : 1
            },
            x,
            y,
            random3 = function () {return Math.floor(3 * Math.random()); },
            random2 = function () {return Math.floor(2 * Math.random()); },
            couleurCorps = random3(),
            imageTmp;

        this.save();

        this.translate(pos.x, pos.y);
        this.scale(dimXY / 100, dimXY / 100);

        // Dessin des pattes
        this.save();
        this.scale(echelles.pattes, echelles.pattes);

        x = 50 / echelles.pattes - 50;
        y = (1 - echelles.pattes) * (100 / echelles.pattes);
        this.drawImage(I.PATTES1.image[random3()], x, y);
        this.rndStroke(function () {
            this.drawImage(I.PATTES1.contour, x, y);
        }, { vibration: 5 / echelles.pattes, nbVibrations: 15 });

        this.restore();

        // Dessin du corps
        this.save();
        this.scale(echelles.corps, echelles.corps);

        x = 50 / echelles.corps - 50;
        y = (1 - echelles.corps) * (100 / echelles.corps);

        imageTmp = "CORPS" + (random2() + 1).toString();

        this.drawImage(I[imageTmp].image[couleurCorps], x, y);
        this.rndStroke(function () {
            this.drawImage(I[imageTmp].contour, x, y);
        }, { vibration: 5 / echelles.corps, nbVibrations: 15 });

        this.restore();

        // Dessin de la tête
        this.save();
        this.scale(echelles.tete, echelles.tete);

        x = 50 / echelles.tete - 50;
        y = 0;
        imageTmp = "TETE" + (random2() + 1).toString();


        this.drawImage(I[imageTmp].image[couleurCorps], x, y);
        this.rndStroke(function () {
            this.drawImage(I[imageTmp].contour, x, y);
        }, { vibration: 5 / echelles.tete, nbVibrations: 15 });

        this.restore();


        // Dessin des oreilles
        this.save();
        this.scale(echelles.oreilles, echelles.oreilles);

        x = 50 / echelles.oreilles - 50;
        y = 0;

        this.drawImage(I.OREILLES1.image[couleurCorps], x, y);
        this.rndStroke(function () {
            this.drawImage(I.OREILLES1.contour, x, y);
        }, { vibration: 5 / echelles.oreilles, nbVibrations: 15 });

        this.restore();


        // Dessin de yeux

        this.save();
        this.scale(echelles.yeux, echelles.yeux);

        x = 50 / echelles.yeux - 50;
        y = 0;

        imageTmp = "YEUX" + (random2() + 1).toString();

        this.drawImage(I[imageTmp].image[random3()], x, y);
        this.rndStroke(function () {
            this.drawImage(I[imageTmp].contour, x, y);
        }, { vibration: 3 / echelles.yeux, nbVibrations: 8 });

        this.restore();

        // Dessin du museau
        this.save();
        this.scale(echelles.museau, echelles.museau);

        x = 50 / echelles.museau - 50;
        y = 40 / echelles.museau - 40;

        this.drawImage(I.MUSEAU2.image[random3()], x, y);
        this.rndStroke(function () {
            this.drawImage(I.MUSEAU2.contour, x, y);
        }, { vibration: 5 / echelles.museau, nbVibrations: 8 });

        this.restore();

        // Dessin de l'anneau
        this.save();
        this.scale(echelles.anneau, echelles.anneau);

        x = 50 / echelles.anneau - 50;
        y = 40 / echelles.anneau - 40;
        imageTmp = "ANNEAU" + (random2() + 1).toString();

        this.drawImage(I[imageTmp].image[random3()], x, y);
        this.rndStroke(function () {
            this.drawImage(I[imageTmp].contour, x, y);
        }, { vibration: 3 / echelles.anneau, nbVibrations: 8 });

        this.restore();

        this.restore();
    };

}());