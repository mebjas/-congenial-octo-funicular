/** *************************************************   */
/**             GLOBAL CONSTANTS & Variables            */
/** *************************************************   */
var MESH_WIDTH = document.getElementById("main").offsetWidth;
var MESH_HEIGHT = document.getElementById("main").offsetHeight;
const CONTAINER = $("#container #main");
const CELL_SIZE = 30;
const CELL_GAP = 2;
const SQRT_3 = Math.sqrt(3);
const HALF_CELL_SIZE = CELL_SIZE / 2;
const SQRT_3_BY_2_CELL_SIZE = CELL_SIZE * SQRT_3 / 2;

// Can be modified by game instance. This is a global variable modify safely.
// TODO(mebjas): This is definitely a bad idea to make this globally modifiable.
var COUNT_CELLS_X = Math.ceil(MESH_WIDTH / (SQRT_3 * CELL_SIZE)) - 2;
var COUNT_CELLS_Y = Math.ceil(MESH_HEIGHT / (CELL_SIZE * 3 / 2)) - 2;

const ROOT_ASSETS_PATH = "./assets/img/";
const BASE_HOUSES = "houses";
const BASE_HUMAN = "human";
const BASE_TOWERS = "towers";
const BASE_TREES = "trees";
const IMAGE_SOURCES = {
    "houses_CASTLE": "castle.png",
    "houses_BASIC": "farm1.png",
    "human_FARMER": "man0.png",
    "human_SPEARMAN": "man1.png",
    "human_KNIGHT": "man2.png",
    "human_PALLADIN": "man3.png",
    "towers_BASIC": "tower.png",
    "towers_STRONG": "strong_tower.png",
    "trees_PALM" : "palm.png",
    "trees_PINE": "pine.png"
};
const OBJECT_MAPPING = {
    "houses": ["CASTLE", "BASIC"],
    "human": ["FARMER", "SPEARMAN", "KNIGHT", "PALLADIN"],
    "towers": ["BASIC", "STRONG"],
    "trees": ["PALM", "PINE"]
};
const IMAGE_MAPS = {};

// global map of objects
const OBJMAP = {};
const TERRITORYMAP = {};

/** *************************************************   */
/**             GLOBAL Methods                          */
/** *************************************************   */
function getCellId(x, y) {
    return `cell_${x}_${y}`;
}

function getCellIdFromCell(cell) {
    return `cell_${cell.x}_${cell.y}`;
}

function getJqueryCellId(x, y) {
    return `#cell_${x}_${y}`
}

function getJqueryCellIdFromCell(cell) {
    return `#cell_${cell.x}_${cell.y}`;
}

/** For a given cells gives neighbour cells. */
function getNeighbours(x, y) {
    if (x < 0 || y < 0 || x >= COUNT_CELLS_X || y >= COUNT_CELLS_Y) {
        throw `(${x}, ${y}) is an invalid cell`;
    }

    const selection = [];
    if (x > 0) {
        selection.push({x: x - 1, y: y});
    }
    if (y > 0) {
        selection.push({x: x, y: y - 1});
    }

    if (x < COUNT_CELLS_X - 1) {
        selection.push({x: x + 1, y: y});
    }
    if (y < COUNT_CELLS_Y - 1) {
        selection.push({x: x, y: y + 1});
    }
    
    if (y % 2 == 0) {
        if (x > 0 && y > 0) {
            selection.push({x: x - 1, y: y - 1});
        }
        if (x > 0 && y < COUNT_CELLS_Y - 1) {
            selection.push({x: x - 1, y: y + 1});
        }
    } else {
        if (x < COUNT_CELLS_X - 1 && y > 0) {
            selection.push({x: x + 1, y: y - 1});
        }
        if (x < COUNT_CELLS_X - 1 && y < COUNT_CELLS_Y - 1) {
            selection.push({x: x + 1, y: y + 1});
        }
    }

    return selection;
}

/** Returns true if a certain cell is a valid territory. */
function isValidTerritory(x, y) {
    return getCellId(x, y) in TERRITORYMAP;
}

/** Renders a certain hexagonal cell on {@param target} at given coordinates. */
function insertCell(x, y, target) {
    const top = (y + 1) * CELL_GAP + y * CELL_SIZE * 3 / 2;
    var left = (x + 1) * CELL_GAP + (x * SQRT_3 * CELL_SIZE);
    if (y % 2) {
        left += (SQRT_3 * CELL_SIZE / 2);
    }

    const width = SQRT_3 * CELL_SIZE;
    const height = 2 * CELL_SIZE;
    const cellId = getCellId(x, y);
    const elemHTML = `<div class='cell' id='${cellId}' x='${x}' y='${y}'></div>`;
    const cell = $(elemHTML);
    cell.css("top", top +"px");
    cell.css("left", left +"px");
    cell.css("width", width +"px");
    cell.css("height", height +"px");

    const topChild = $("<div class='top'></div>");
    topChild.css("border-bottom-width", `${HALF_CELL_SIZE}px`);
    topChild.css("border-left", `${SQRT_3_BY_2_CELL_SIZE}px solid transparent`);
    topChild.css("border-right", `${SQRT_3_BY_2_CELL_SIZE}px solid transparent`);

    const middleChild = $("<div class='middle'></div>");
    middleChild.css("width", (SQRT_3 * CELL_SIZE) +"px");
    middleChild.css("height", CELL_SIZE +"px");

    const bottomChild = $("<div class='bottom'></div>");
    bottomChild.css("border-top-width", `${HALF_CELL_SIZE}px`);
    bottomChild.css("border-left", `${SQRT_3_BY_2_CELL_SIZE}px solid transparent`);
    bottomChild.css("border-right", `${SQRT_3_BY_2_CELL_SIZE}px solid transparent`);

    cell.append(topChild);
    cell.append(middleChild);
    cell.append(bottomChild);
    target.append(cell);
}

/** Gets image for a given {@param base} and {@param type}. */
function getImage(base, type) {
    if (!(base in OBJECT_MAPPING)) {
        throw `unsupported base ${base}`;
    }

    if (OBJECT_MAPPING[base].indexOf(type) == -1) {
        throw `${type} is not supported in ${base}`;
    }

    const key = `${base}_${type}`;
    if (!(key in IMAGE_MAPS)) {
        if (!(key in IMAGE_SOURCES)) {
            throw `${base}, ${type} combination source not available`;
        }

        IMAGE_MAPS[key] = ROOT_ASSETS_PATH +IMAGE_SOURCES[key];
    }

    return IMAGE_MAPS[key];
}

/** *************************************************   */
/**             Object classes                          */
/** *************************************************   */
class BaseObject {
    constructor(x, y, growth) {
        if (new.target == BaseObject) {
            throw "cannot create instance of BaseObject directly";
        }

        this.x = x;
        this.y = y;
        this.growth = growth;
        this.registered = false;
    }

    render() {
        throw "Not implemented in BaseObject";
    }
}

class Player {
    constructor(id, name, initialMoney) {
        this.id = id;
        this.name = name;

        // TODO(mebjas): add logic to initialize this with map.
        // TODO(mebjas): add logic to update this
        this.economy = {
            money: initialMoney,
            growth: 0
        }
    } 
}

/**
 * Type of objects which can exist only one at a time.
 * Also, these objects can only exist over a mapped territories.
 */
class SingleEntityObj extends BaseObject {
    constructor(x, y, growth) {
        super(x, y, growth);
        if (new.target == SingleEntityObj) {
            throw "cannot create instance of SingleEntityObj directly";
        }

        this.imageSrc = undefined;

        const key = getCellId(x, y);
        if (!(key in TERRITORYMAP)) {
            throw `SingleEntityObj cannot be created over Ocean (${x},${y}). `
                +"A territory is needed below it.";
        }

        if (key in OBJMAP) {
            throw `An SingleEntityObj is already registered at (${x},${y})`;
        }

        OBJMAP[key] = this;
    }

    render() {
        if (!this.imageSrc) {
            throw `render() called without setting image at (${this.x},${this.y})`;
        }

        const target = $(getJqueryCellId(this.x, this.y));
        // remove image if exists
        target.children("img").remove();
        // insert the image.
        target.append(`<img src="${this.imageSrc}">`);
    }
}

class OwnedSingleEntityObj extends SingleEntityObj {
    constructor(x, y, owner, growth, power, cost) {
        super(x, y, growth);

        if (new.target == OwnedSingleEntityObj) {
            throw "cannot create instance of OwnedSingleEntityObj directly";
        }

        if (power < 0 || cost < 0) {
            throw "power and cost cannot be < 0";
        }

        const key = getCellId(x, y);
        if (TERRITORYMAP[key].owner == undefined) {
            throw `Cannot create an OwnedSingleEntityObj at `
                +`(${this.x},${this.y}) as it's anonymous owned`
        }

        if (TERRITORYMAP[key].owner.id != owner.id) {
            throw `Cannot create an OwnedSingleEntityObj at `
                +`(${this.x},${this.y}) because of id mismatch.`;
        }

        this.power = power;
        this.cost = cost;
    }
}

////////// TREES //////////////////////////////

class PalmTree extends SingleEntityObj {
    constructor(x, y) {
        super(x, y, /* growth= */ -1);
        this.imageSrc = getImage(BASE_TREES, "PALM");
    }
}

class PineTree extends SingleEntityObj {
    constructor(x, y) {
        super(x, y, /* growth= */ -1);
        this.imageSrc = getImage(BASE_TREES, "PINE");
    }
}

////////// House //////////////////////////////
class House extends OwnedSingleEntityObj {
    constructor(x, y, owner, growth, power, cost) {
        super(x, y, owner, growth, power, cost);
        if (new.target == House) {
            throw "cannot create instance of House directly";
        }
    }
}

class BasicHouse extends House {
    constructor(x, y, owner) {
        super(x, y, owner, /* growth= */ 4, /* power= */ 0, /* cost= */ 10);
        this.imageSrc = getImage(BASE_HOUSES, "BASIC");
    }
}

class CastleHouse extends House {
    constructor(x, y, owner) {
        super(x, y, owner, /* growth= */ 5, /* power= */ 1, /* cost= */ 15);
        this.imageSrc = getImage(BASE_HOUSES, "CASTLE");
    }
}

function houseOf(type, x, y, owner) {
    switch (type) {
        case "CASTLE": return new CastleHouse(x, y, owner);
        case "BASIC": return new BasicHouse(x, y, owner);
    }

    throw `Unsupported house type ${type}`;
}

////////// Human //////////////////////////////
class Human extends OwnedSingleEntityObj {
    constructor(x, y, owner, growth, power, cost, range, canKillSamePower) {
        super(x, y, owner, growth, power, cost);

        if (new.target == Human) {
            throw "cannot create instance of Human directly";
        }

        if (range < 0) {
            throw "range cannot be < 0";
        }

        this.range = range;
        this.canKillSamePower = false;
        if (canKillSamePower && canKillSamePower == true) {
            this.canKillSamePower = true;
        }
    }
}

class Farmer extends Human {
    constructor(x, y, owner) {
        super(x, y, owner, /* growth= */ -2, /* power= */ 1, 
            /* cost= */ 10, /* range= */ 4);
        this.imageSrc = getImage(BASE_HUMAN, "FARMER");
    }
}

class Spearman extends Human {
    constructor(x, y, owner) {
        super(x, y, owner, /* growth= */ -6, /* power= */ 2, 
            /* cost= */ 20, /* range= */ 4);
        this.imageSrc = getImage(BASE_HUMAN, "SPEARMAN");
    }
}

class Knight extends Human {
    constructor(x, y, owner) {
        super(x, y, owner, /* growth= */ -18, /* power= */ 3, 
            /* cost= */ 30, /* range= */ 5);
        this.imageSrc = getImage(BASE_HUMAN, "KNIGHT");
    }
}

class Palladin extends Human {
    constructor(x, y, owner) {
        super(x, y, owner, /* growth= */ -36, /* power= */ 4, 
            /* cost= */ 40, /* range= */ 5, 
            /* canKillSamePower= */ true);
        this.imageSrc = getImage(BASE_HUMAN, "PALLADIN");
    }
}

function humanOf(type, x, y, owner) {
    switch(type) {
        case "PALLADIN": return new Palladin(x, y, owner);
        case "KNIGHT": return new Knight(x, y, owner);
        case "SPEARMAN": return new Spearman(x, y, owner);
        case "FARMER": return new Farmer(x, y, owner);
    }

    throw `Unsupported human type ${type}`;
}

////////// Towers //////////////////////////////
class Tower extends SingleEntityObj {
    constructor(x, y, owner, growth, power, cost, range) {
        super(x, y, growth);

        if (new.target == Tower) {
            throw "cannot create instance of Tower directly";
        }

        if (power < 0 || cost < 0 || range < 0) {
            throw "power, cost or range cannot be < 0";
        }

        const key = getCellId(x, y);
        if (TERRITORYMAP[key].owner != undefined) {
            if (TERRITORYMAP[key].owner.id != owner.id) {
                throw `Cannot create a Tower at mapped territory `
                    +`(${this.x},${this.y}) because of id mismatch.`;
            }
        }

        this.power = power;
        this.cost = cost;
        this.range = range;
    }
}

class BasicTower extends Tower {
    constructor(x, y, owner) {
        super(x, y, owner, /* growth= */ -1, /* power= */ 2, 
            /* cost= */ 15, /* range= */ 1);
        this.imageSrc = getImage(BASE_TOWERS, "BASIC");
    }
}

class StrongTower extends Tower {
    constructor(x, y, owner) {
        super(x, y, owner, /* growth= */ -6, /* power= */ 3, 
            /* cost= */ 35, /* range= */ 1);
        this.imageSrc = getImage(BASE_TOWERS, "STRONG");
    }
}

function towerOf(type, x, y, owner) {
    switch(type) {
        case "BASIC": return new BasicTower(x, y, owner);
        case "STRONG": return new StrongTower(x, y, owner);
    }

    throw `Unsupported tower type ${type}`;
}

////////// Territory //////////////////////////////
class NeutralTerritory extends BaseObject {
    constructor(x, y) {
        super(x, y, /* growth= */ 0);
        this.owner = undefined;

        const key = getCellId(x, y);
        // registeration
        if (key in TERRITORYMAP) {
            throw `a Territory is already registered in ${x}, ${y}`;
        }
        TERRITORYMAP[key] = this;
        this.registered = true;
    }

    render() {
        $(getJqueryCellId(this.x, this.y)).addClass("unexplored");
        $(getJqueryCellId(this.x, this.y)).addClass("selectable");
    }
}

class PlayerTerritory extends BaseObject {
    constructor(x, y, /* Player */ owner) {
        super(x, y, /* growth= */ 1);
        this.owner = owner;

        const key = getCellId(x, y);
        if (!(key in TERRITORYMAP)) {
            throw "a PlayerTerritory can only be rendered over an existing NeutralTerritory. "
            + `None found at (${x}, ${y})`;
        }
        TERRITORYMAP[key] = this;
        this.registered = true;
    }

    render() {
        const playerClass = `player${this.owner.id}`;
        const cellElem = $(getJqueryCellId(this.x, this.y));
        cellElem.removeClass("unexplored");
        cellElem.addClass(playerClass);
    }
}

////////// MAP and Game //////////////////////////////

class Map {
    constructor(mapData) {
        // TODO(mebjas): validate the json data
        this.mapData = mapData;
    }
}