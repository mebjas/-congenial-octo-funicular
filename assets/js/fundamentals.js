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
const BASE_MISC = "misc";
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
    "trees_PINE": "pine.png",
    "misc_SHEILD": "sheild.png",
};
const OBJECT_MAPPING = {
    "houses": ["CASTLE", "BASIC"],
    "human": ["FARMER", "SPEARMAN", "KNIGHT", "PALLADIN"],
    "towers": ["BASIC", "STRONG"],
    "trees": ["PALM", "PINE"],
    "misc": ["SHEILD"],
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

/** For a given cells gives neighbour cells that are owned by {@parm owner}. */
function getOwnedNeighbours(x, y, owner) {
    if (!owner) {
        throw "Owner is null";
    }

    const fullNeighbourHood = getNeighbours(x, y);
    const ownedNeighbours = [];
    for (var i = 0; i < fullNeighbourHood.length; i++) {
        const cell = fullNeighbourHood[i];
        if (!isValidTerritory(cell.x, cell.y)) {
            continue;
        }
        const key = getCellIdFromCell(cell);
        if (TERRITORYMAP[key].owner === owner) {
            ownedNeighbours.push(cell);
        }
    }

    return ownedNeighbours;
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
    
    static get DEFAULT_SHEILD_TIMEOUT() {
        return 1000;
    }

    setSheildTimeout(callback) {
        this._lastSheildTimeoutCallback = callback;
        this._sheildTimeout = setTimeout(() => {
            if (this._lastSheildTimeoutCallback) {
                this._lastSheildTimeoutCallback();
            }
        }, Player.DEFAULT_SHEILD_TIMEOUT);
    }

    cancelSheildTimeout() {
        // If something was set, call it.
        if (this._lastSheildTimeoutCallback) {
            this._lastSheildTimeoutCallback();
        }

        if (this._sheildTimeout) {
            clearTimeout(this._sheildTimeout);
            this._sheildTimeout = undefined;
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

    static get ELEM_CLASS_NAME() {
        return "SingleEntityObj";
    }

    render() {
        if (!this.imageSrc) {
            throw `render() called without setting image at (${this.x},${this.y})`;
        }

        const target = $(getJqueryCellId(this.x, this.y));
        const objClassName = SingleEntityObj.ELEM_CLASS_NAME;
        target.children(objClassName).remove();
        target.append(`<img class='${objClassName}' src="${this.imageSrc}">`);
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

    getLegalMovementOptions() {}

    _throwIfIllegalMovementRequested(x, y) {
        if (!isValidTerritory(x, y)) {
            throw `(${x}, ${y}) is an invalid destination.`;
        }

        // TODO(mebjas): Implement this;
    }

    moveTo(x, y) {
        this._throwIfIllegalMovementRequested(x, y);

        const currentKey = getCellId(this.x, this.y);
        const currentTerritory = TERRITORYMAP[currentKey];
        const nextKey = getCellId(x, y);
        const nextTerritory = TERRITORYMAP[nextKey];
        const ownerOfThisHuman = currentTerritory.owner;

        // if the next location has any entity remove it.
        if (nextTerritory.hasSingleEntityObj()) {
            nextTerritory.removeSingleEntityObj();
        }

        // change ownership of next territory
        if (nextTerritory.hasOwner()) {
            nextTerritory.changeOwner(ownerOfThisHuman);
        } else {
            TERRITORYMAP[nextKey] = new PlayerTerritory(x, y, ownerOfThisHuman);
            TERRITORYMAP[nextKey].render();
        }

        // current position to become blank.
        delete OBJMAP[currentKey];
        currentTerritory.removeSingleEntityObj();

        // render again on the new location
        this.x = x;
        this.y = y;
        this.render();

        // TODO(mebjas): Add support for economy impact.
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

    onClick() {
        const key = getCellId(this.x, this.y);
        const owner = TERRITORYMAP[key].owner;
        if (!owner) {
            // click supported for owned towers only.
            return;
        }

        // cancel all existing sheilds
        owner.cancelSheildTimeout();

        const ownedNeighbours = getOwnedNeighbours(this.x, this.y, owner);
        for (var i = 0; i < ownedNeighbours.length; i++) {
            TERRITORYMAP[getCellIdFromCell(ownedNeighbours[i])].showSheild();
        }

        owner.setSheildTimeout(function() {
            for (var i = 0; i < ownedNeighbours.length; i++) {
                TERRITORYMAP[getCellIdFromCell(ownedNeighbours[i])].removeSheild();
            }
        });
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
class Territory extends BaseObject {
    constructor(x, y, growth, /* Optional */ owner) {
        super(x, y, growth);

        if (new.target == Territory) {
            throw "cannot create instance of Territory directly";
        }

        this.owner = owner;
    }

    /** Removed the single entity object in this territory. */
    removeSingleEntityObj() {
        const cellElem = $(getJqueryCellId(this.x, this.y));
        cellElem.children(`.${SingleEntityObj.ELEM_CLASS_NAME}`).remove();
    }

    /** Returns true if the territory has some {@link SingleEntityObj} instance in it. */
    hasSingleEntityObj() {
        const cellElem = $(getJqueryCellId(this.x, this.y));
        return cellElem.children(`.${SingleEntityObj.ELEM_CLASS_NAME}`).length > 0;
    }

    hasOwner() {
        return this.owner != undefined;
    }

    onClick() {
        // TODO(mebjas): Following logic is just for debug, remove it.
        console.log(this);
        const singleEntityObj = OBJMAP[getCellId(this.x, this.y)];
        if (singleEntityObj) {
            console.log(singleEntityObj);
        }
    }
}

class NeutralTerritory extends Territory {
    constructor(x, y) {
        super(x, y, /* growth= */ 0);

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

class PlayerTerritory extends Territory {
    constructor(x, y, /* Player */ owner) {
        super(x, y, /* growth= */ 1, owner);

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

    _isSheildVisible() {
        const cellElem = $(getJqueryCellId(this.x, this.y));
        return cellElem.children(".sheild").length > 0;
    }

    /** Shows sheild in this player territory. */
    showSheild() {
        const cellElem = $(getJqueryCellId(this.x, this.y));
        if (!this._isSheildVisible()) {
            const imageSource = getImage(BASE_MISC, "SHEILD");
            cellElem.append(`<img class='sheild' src="${imageSource}">`);
        } else {
            cellElem.children(".sheild").show();
        }
    }

    /** Possibly hides the sheild in this player territory. */
    removeSheild() {
        const cellElem = $(getJqueryCellId(this.x, this.y));
        cellElem.children(".sheild").hide();
    }

    /** Change current owner and render. */
    changeOwner(newOwner) {
        if (!newOwner) {
            throw "newOwner is mandatory for changing territory ownership";
        }
        const currentPlayerClass = `player${this.owner.id}`;
        this.owner = newOwner;

        // remove current class
        const cellElem = $(getJqueryCellId(this.x, this.y));
        cellElem.removeClass(currentPlayerClass);
        this.render();
    }
}

////////// MAP and Game //////////////////////////////

class Map {
    constructor(mapData) {
        this.mapData = this._getVerifiedMapData(mapData);
    }

    _getVerifiedMapData(mapData) {
        const requiredKeys = ["territory", "players"];

        // Do validations prior to modification.
        for (var i = 0; i < requiredKeys.length; i++) {
            const requiredKey = requiredKeys[i];
            if (!(requiredKey in mapData)) {
                throw `${requiredKey} missing in mapData, it's non optional`;
            }
        }

        if (!("trees" in mapData)) {
            mapData["trees"] = [];
        }

        if (!("towers" in mapData)) {
            mapData["towers"] = [];
        }

        // Verify player data.
        if (mapData["players"].length < 2) {
            throw `A map should define minimum two players`;
        }

        for (var i = 0; i < mapData["players"].length; i++) {
            mapData["players"][i] = this._getVerifiedPlayer(mapData["players"][i]);
        }

        return mapData;
    }

    _getVerifiedPlayer(player) {
        if (!player.name) {
            throw "Player name is missing.";
        }

        if (!player.territory || player.territory.length < 1) {
            throw "Player needs atleast one territory.";
        }

        if (!player.houses || player.houses.length < 1) {
            throw "Player needs atleast one house.";
        }

        if (!player.human) {
            player.human = [];
        }

        if (!player.towers) {
            player.towers = [];
        }

        const tempTerritoryMapping = {};
        for (var i = 0; i < player.territory.length; i++) {
            const territory = player.territory[i];
            const key = getCellIdFromCell(territory);
            tempTerritoryMapping[key] = true;
        }

        function verifyMapping(entities, type) {
            for (var i = 0; i < entities.length; i++) {
                const entity = entities[i];
                const key = getCellIdFromCell(entity);
                if (!(key in tempTerritoryMapping)) {
                    throw `houses, humans, towers should belong to player.territory. `
                        +`Entity of type ${type} cannot be added to (${entity.x}, ${entity.y}).`
                }
            }
        }

        verifyMapping(player.houses);
        verifyMapping(player.human);
        verifyMapping(player.towers);

        if (!player.initialMoney) {
            player.initialMoney = 0;
        } else if (player.initialMoney < 0) {
            throw `Player initialMoney cannot be negative, ${player.initialMoney} is invalid for ${player.name}`;
        }

        return player;
    }
}