var TYPE_I = {
    MUSEAU      : "mus",
    CORPS       : "corp",
    TETE        : "tet",
    PATTES      : "pat",
    YEUX        : "yeu",
    ANNEAU      : "ann",
    OREILLES    : "ore"
};

var COULEURS_I = [{}, {}, {}];

COULEURS_I[0][TYPE_I.MUSEAU]    = COPIC.RV10;
COULEURS_I[1][TYPE_I.MUSEAU]    = COPIC.RV25;
COULEURS_I[2][TYPE_I.MUSEAU]    = COPIC.R24;

COULEURS_I[0][TYPE_I.CORPS]     = COPIC.E33;
COULEURS_I[1][TYPE_I.CORPS]     = COPIC.W00;
COULEURS_I[2][TYPE_I.CORPS]     = COPIC.V04;

COULEURS_I[0][TYPE_I.TETE]      = COPIC.E33;
COULEURS_I[1][TYPE_I.TETE]      = COPIC.W00;
COULEURS_I[2][TYPE_I.TETE]      = COPIC.V04;

COULEURS_I[0][TYPE_I.PATTES]    = COPIC.E89;
COULEURS_I[1][TYPE_I.PATTES]    = COPIC.E07;
COULEURS_I[2][TYPE_I.PATTES]    = COPIC.YG63;

COULEURS_I[0][TYPE_I.YEUX]      = COPIC.E27;
COULEURS_I[1][TYPE_I.YEUX]      = COPIC.B52;
COULEURS_I[2][TYPE_I.YEUX]      = COPIC.BG15;

COULEURS_I[0][TYPE_I.ANNEAU]    = COPIC.YR04;
COULEURS_I[1][TYPE_I.ANNEAU]    = COPIC.C3;
COULEURS_I[2][TYPE_I.ANNEAU]    = COPIC.Y06;

COULEURS_I[0][TYPE_I.OREILLES]  = COPIC.E33;
COULEURS_I[1][TYPE_I.OREILLES]  = COPIC.W00;
COULEURS_I[2][TYPE_I.OREILLES]  = COPIC.V04;


var I = {
    MUSEAU1     : { source: "images/museau1.svg",   type: TYPE_I.MUSEAU     },
    MUSEAU2     : { source: "images/museau2.svg",   type: TYPE_I.MUSEAU     },
    CORPS1      : { source: "images/corps1.svg",    type: TYPE_I.CORPS      },
    CORPS2      : { source: "images/corps2.svg",    type: TYPE_I.CORPS      },
    TETE1       : { source: "images/tete1.svg",     type: TYPE_I.TETE       },
    TETE2       : { source: "images/tete2.svg",     type: TYPE_I.TETE       },
    PATTES1     : { source: "images/pattes1.svg",   type: TYPE_I.PATTES     },
    YEUX1       : { source: "images/yeux1.svg",     type: TYPE_I.YEUX       },
    YEUX2       : { source: "images/yeux2.svg",     type: TYPE_I.YEUX       },
    ANNEAU1     : { source: "images/anneau1.svg",   type: TYPE_I.ANNEAU     },
    ANNEAU2     : { source: "images/anneau2.svg",   type: TYPE_I.ANNEAU     },
    OREILLES1   : { source: "images/oreilles1.svg", type: TYPE_I.OREILLES   }

};
