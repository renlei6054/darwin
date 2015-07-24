/*
    TYPES DE CREATURES : de 0 à NB_TYPES_CREATURES-1 (0 la plus grande, NB_TYPES_CREATURES-1 la plus petite)
    ZOOM CARTE : de 0 ) NB_TYPES_CREATURES-1 (0 la plus grande, NB_TYPES_CREATURES-1 la plus petite)

*/

$(function () {
    "use strict";

    var darwin,
        vue,
        iCanvas,
        nbImages = Object.size(I),
        nbImagesChargees = 0,
        nomImage,
        onLoadImage = function () {
            nbImagesChargees += 1;
            if (nbImagesChargees === 4 * nbImages) {
                darwin  = new Darwin();
                vue     = new Vue(darwin, "sousCouche", "couche", "surCouche", "fond");
            }
        },
        loadImage = function (image, type) {
            return function (data) {
                var compteur;
                image.image      = [new Image(), new Image(), new Image()];
                image.contour    = new Image();


                image.contour.onload    = onLoadImage;

                for (compteur = 0; compteur < 3; compteur += 1) {
                    image.image[compteur].onload      = onLoadImage;
                    image.image[compteur].src = 'data:image/svg+xml;base64,' + window.btoa(
                        data.replace(/#ff0000/g, COULEURS_I[compteur][type]).replace(/#000000/g, COPIC.W10).replace(/<sodipodi[^>]*\/>/mg, "")
                    );
                }

                image.contour.src = 'data:image/svg+xml;base64,' + window.btoa(
                    data.replace(/fill:#.{6}/g, "fill:none").replace(/#000000/g, COPIC.W10).replace(/<sodipodi[^>]*\/>/mg, "")
                );
            };
        };


    for (iCanvas in C.CANVAS_ID) {
        if (C.CANVAS_ID.hasOwnProperty(iCanvas)) {
            $("<canvas/>").
                attr("id", C.CANVAS_ID[iCanvas]).
                attr("width", C.CANVAS_DIM.X).
                attr("height", C.CANVAS_DIM.Y).appendTo("body");
        }
    }
    
    
    
    for (nomImage in I) {
        if (I.hasOwnProperty(nomImage)) {
            $.get(I[nomImage].source, loadImage(I[nomImage], I[nomImage].type), "text");
        }
    }

});