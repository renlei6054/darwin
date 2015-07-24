var C = {
    NB_TYPES_CREATURES      : 10,
    TAILLE_GRILLE           : 24,
    TAILLE_CARTE_REF        : 400,
    PADDING_CARTE           : 5,
    HAUTEUR_ZOOM            : 40,
    NB_CREATURES_PAR_CELL   : 1000,

    CARTE_NB_CELLS      : 1000,

    CANVAS_DIM : { X: 900, Y: 900 },
    CANVAS_ID : {
        FOND : "fond",
        SOUSCOUCHE : "sousCouche",
        COUCHE : "couche",
        SURCOUCHE : "surCouche",
        TOOLTIPS : "tooltips"
    },
    
    TEXTES_ECHELLE : [
        "35 000 km",
        "1 000 km",
        "35 km",
        "1 km",
        "35 m",
        "1 m",
        "3.5 cm",
        "1 mm",
        "35 µm",
        "1 µm"
    ],

    TERRAIN : {
        INDEFINI    : "ind",
        OCEAN       : "oce",
        LAGON       : "lag",
        PLAGE       : "pla",
        PRAIRIE     : "pra",
        LAC         : "lac",
        FORET       : "for",
        MONTAGNE    : "mon",
        NEIGE       : "nei"

    },

    ACTIONS : {
        PEUPLEMENT  : "ppl",
        MINAGE      : "min",
        CONQUETE    : "con"
    },

    CHANGEMENTS : {
        POPULATION : 1,
        RESOURCES : 2,
        CARTE : 4,
        CARTE_INFOS : 8
    },
    
    COULEURS_CARTE_0 : [],
    COULEURS_CARTE_1 : [],
    COULEURS_ACTIONS : [],

    DELTAS : {
        REPRODUCTION    : "rep",
        PREDATION       : "pred",
        CANNIBALISME    : "cann"
    },

    COULEURS_DELTA      : [],
    COULEURS_DELTA_0    : [],

    ZONE_STATS_CREATURE : 0,
    ZONE_CREATURES      : 1,
    ZONE_CARTE          : 2,
    ZONE_ZOOM_CARTE     : 3,
    ZONE_TAB_CREATURE   : 4,
    ZONE_GLOBALE        : 5,
    ZONE_TPS_A_RES      : 6,
    ZONE_PORTRAIT       : 7,
    ZONE_RESOURCES      : 8,

    BIG0    : new Big(0),
    BIG1    : new Big(1),
    BIG10   : new Big(10),
    BIG1000 : new Big(1000),

    ORIGINE     : {x: 0, y: 0},

    DELTA_CLI   : 300
};

C.BIGCPC = new Big(C.NB_CREATURES_PAR_CELL);
C.BIGCNC = new Big(C.CARTE_NB_CELLS);

C.COULEURS_CARTE_1[C.TERRAIN.OCEAN]         = COPIC.B28;
C.COULEURS_CARTE_1[C.TERRAIN.PLAGE]         = COPIC.Y08;
C.COULEURS_CARTE_1[C.TERRAIN.PRAIRIE]       = COPIC.YG07;
C.COULEURS_CARTE_1[C.TERRAIN.FORET]         = COPIC.G29;
C.COULEURS_CARTE_1[C.TERRAIN.MONTAGNE]      = COPIC.W5;
C.COULEURS_CARTE_1[C.TERRAIN.LAC]           = COPIC.BG45;
C.COULEURS_CARTE_1[C.TERRAIN.NEIGE]         = COPIC.C00;
C.COULEURS_CARTE_1[C.TERRAIN.LAGON]         = COPIC.BG45;

C.COULEURS_CARTE_0[C.TERRAIN.OCEAN]         = COPIC.B23;
C.COULEURS_CARTE_0[C.TERRAIN.PLAGE]         = COPIC.Y0000;
C.COULEURS_CARTE_0[C.TERRAIN.PRAIRIE]       = COPIC.YG11;
C.COULEURS_CARTE_0[C.TERRAIN.FORET]         = COPIC.G21;
C.COULEURS_CARTE_0[C.TERRAIN.MONTAGNE]      = COPIC.W3;
C.COULEURS_CARTE_0[C.TERRAIN.LAC]           = COPIC.BG11;
C.COULEURS_CARTE_0[C.TERRAIN.NEIGE]         = COPIC.C2;
C.COULEURS_CARTE_0[C.TERRAIN.LAGON]         = COPIC.BG11;

C.COULEURS_DELTA[C.DELTAS.REPRODUCTION]     = COPIC.YG07;
C.COULEURS_DELTA[C.DELTAS.PREDATION]        = COPIC.YR02;
C.COULEURS_DELTA[C.DELTAS.CANNIBALISME]     = COPIC.R39;

C.COULEURS_DELTA_0[C.DELTAS.REPRODUCTION]   = COPIC.YG09;
C.COULEURS_DELTA_0[C.DELTAS.PREDATION]      = COPIC.YR09;
C.COULEURS_DELTA_0[C.DELTAS.CANNIBALISME]   = COPIC.R35;

C.COULEURS_ACTIONS[C.ACTIONS.PEUPLEMENT]    = COPIC.RV14;
C.COULEURS_ACTIONS[C.ACTIONS.CONQUETE]      = COPIC.Y06;
C.COULEURS_ACTIONS[C.ACTIONS.MINAGE]        = COPIC.V04;