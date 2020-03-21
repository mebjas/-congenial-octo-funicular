/** *************************************************   */
/**            MAP 1 Temp data                          */
/** *************************************************   */
const MAP1 = {
    "upperBound": {"COUNT_CELL_X": 22, "COUNT_CELL_Y": 18},
    "territory": [{"x":11,"y":5},{"x":12,"y":5},{"x":12,"y":6},{"x":13,"y":6},{"x":13,"y":5},{"x":13,"y":4},{"x":12,"y":4},{"x":14,"y":6},{"x":13,"y":7},{"x":12,"y":7},{"x":13,"y":8},{"x":12,"y":8},{"x":13,"y":9},{"x":14,"y":10},{"x":13,"y":10},{"x":12,"y":9},{"x":11,"y":7},{"x":11,"y":6},{"x":10,"y":6},{"x":10,"y":7},{"x":9,"y":7},{"x":9,"y":6},{"x":10,"y":8},{"x":11,"y":8},{"x":9,"y":9},{"x":8,"y":9},{"x":9,"y":8},{"x":8,"y":7},{"x":8,"y":8},{"x":7,"y":9},{"x":7,"y":8},{"x":7,"y":7},{"x":8,"y":6},{"x":8,"y":5},{"x":9,"y":5},{"x":10,"y":5},{"x":10,"y":4},{"x":10,"y":4},{"x":9,"y":4},{"x":9,"y":3},{"x":9,"y":10},{"x":8,"y":10},{"x":14,"y":4},{"x":15,"y":4},{"x":16,"y":4},{"x":15,"y":5},{"x":15,"y":5},{"x":14,"y":5},{"x":15,"y":6},{"x":13,"y":7},{"x":15,"y":7},{"x":14,"y":7},{"x":16,"y":6},{"x":15,"y":8},{"x":14,"y":8},{"x":14,"y":9},{"x":7,"y":5},{"x":7,"y":6},{"x":6,"y":5},{"x":6,"y":6},{"x":5,"y":5},{"x":5,"y":5},{"x":6,"y":4},{"x":5,"y":4},{"x":6,"y":4},{"x":5,"y":3},{"x":6,"y":7},{"x":6,"y":8},{"x":6,"y":9},{"x":7,"y":10},{"x":6,"y":10},{"x":6,"y":10},{"x":5,"y":9},{"x":8,"y":4},{"x":7,"y":4},{"x":7,"y":3},{"x":8,"y":3},{"x":8,"y":2},{"x":7,"y":2},{"x":7,"y":1},{"x":9,"y":2},{"x":10,"y":2},{"x":10,"y":3},{"x":11,"y":4},{"x":17,"y":10},{"x":16,"y":11},{"x":17,"y":11},{"x":18,"y":10},{"x":17,"y":9},{"x":18,"y":9},{"x":19,"y":10},{"x":19,"y":9},{"x":19,"y":8},{"x":10,"y":14},{"x":11,"y":14},{"x":10,"y":15},{"x":11,"y":15},{"x":12,"y":14},{"x":12,"y":13},{"x":11,"y":13},{"x":13,"y":14},{"x":12,"y":15},{"x":13,"y":13}],
    "trees": [{"x":9,"y":4},{"x":5,"y":3},{"x":5,"y":4},{"x":6,"y":4},{"x":7,"y":4},{"x":8,"y":4},{"x":8,"y":5},{"x":9,"y":5},{"x":10,"y":6},{"x":10,"y":7},{"x":11,"y":6},{"x":10,"y":5},{"x":11,"y":7},{"x":11,"y":7},{"x":11,"y":8},{"x":12,"y":8},{"x":12,"y":9},{"x":12,"y":7},{"x":7,"y":1},{"x":7,"y":2},{"x":7,"y":3},{"x":8,"y":2},{"x":12,"y":14},{"x":12,"y":13},{"x":11,"y":13},{"x":13,"y":14},{"x":12,"y":15},{"x":13,"y":13}],
    "players": [
        {
            "name": "minhaz",
            "territory": [{"x":16,"y":4},{"x":15,"y":4},{"x":15,"y":5}],
            "houses": [{"type": "CASTLE", "x":16,"y":4}],
            "human": [{"type": "FARMER", "x":15,"y":4}],
            "towers": [{"type": "BASIC", "x":15,"y":5}]
        },
        {
            "name": "nida",
            "territory": [{"x":6,"y":10},{"x":5,"y":9},{"x":6,"y":9},{"x":7,"y":10}],
            "houses": [{"type": "CASTLE", "x":6,"y":10}, {"type": "BASIC", "x":7,"y":10}],
            "human": [{"type": "FARMER", "x":5,"y":9},{"type": "SPEARMAN", "x":6,"y":9}],
            "towers": []
        }
    ]
};

/** *************************************************   */
/**             GLOBAL CONSTANTS & Variables            */
/** *************************************************   */
var MESH_WIDTH = document.getElementById("main").offsetWidth;
var MESH_HEIGHT = document.getElementById("main").offsetHeight;
const CELL_SIZE = 30;
const CELL_GAP = 2;
const SQRT_3 = Math.sqrt(3);
const HALF_CELL_SIZE = CELL_SIZE / 2;
const SQRT_3_BY_2_CELL_SIZE = CELL_SIZE * SQRT_3 / 2;

const COUNT_CELLS_X = Math.ceil(MESH_WIDTH / (SQRT_3 * CELL_SIZE)) - 2;
const COUNT_CELLS_Y = Math.ceil(MESH_HEIGHT / (CELL_SIZE * 3 / 2)) - 2;

const BASE_HOUSES = "houses";
const BASE_HUMAN = "human";
const BASE_TOWERS = "towers";
const BASE_TREES = "trees";
// TODO(mebjas): use the above constants in definition of below ones.
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
/** *************************************************   */
/**             GLOBAL Methods                          */
/** *************************************************   */

/** Logging method */
function log(message) {
    const loggingSpace = document.getElementById("logging");
    const logEntry = document.createElement("div");
    logEntry.innerText = message;
    loggingSpace.appendChild(logEntry);
    loggingSpace.scrollTop = loggingSpace.scrollHeight;
    console.log(message);
}

function getCellId(x, y) {
    return `cell_${x}_${y}`
}

// 0 1
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

function renderFullMesh(upperBound) {
    if (!upperBound) {
        upperBound = {};
    }
    console.log(upperBound);

    const count_x = upperBound.COUNT_CELL_X ? upperBound.COUNT_CELL_X : COUNT_CELLS_X;
    const count_y = upperBound.COUNT_CELL_Y ? upperBound.COUNT_CELL_Y : COUNT_CELLS_Y;
    console.log(count_x, count_y);

    log(`COUNTS: ${count_x} X ${count_y}`);
    for (i = 0; i < count_y; i++) {
        for (j = 0; j < count_x; j++) {
            insertCell(j, i, $("#container #main"));
        }
    }
}

function renderTerritory(territory) {
    territory.forEach(cell => {
        $("#" +getCellId(cell.x, cell.y)).addClass("unexplored");
    });
}

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

        // IMAGE_MAPS[key] = new Image();
        // IMAGE_MAPS[key].src = "./assets/img/" +IMAGE_SOURCES[key];
        IMAGE_MAPS[key] = "./assets/img/" +IMAGE_SOURCES[key];
    }

    return IMAGE_MAPS[key];
}

function renderTrees(trees) {
    const treeCount = OBJECT_MAPPING[BASE_TREES].length;
    function getRandomTree() {
        const index = parseInt(Math.random() * 100000) % treeCount;
        const tree = OBJECT_MAPPING[BASE_TREES][index];
        const imgSrc = getImage(BASE_TREES, tree);
        return `<img src="${imgSrc}">`;
    }

    trees.forEach(function(tree) {
        const cellElem = $("#" +getCellId(tree.x, tree.y));
        cellElem.append(getRandomTree());
    });
}

function renderPlayer(player, id) {
    const playerClass = `player${id}`;

    log("renderring player territory...");
    player.territory.forEach(function(cell) {
        const cellElem = $("#" +getCellId(cell.x, cell.y));
        cellElem.removeClass("unexplored");
        cellElem.addClass(playerClass);
    });

    log("renderring player houses...");
    player.houses.forEach(function(house) {
        const imgSrc = getImage(BASE_HOUSES, house.type);
        const imgElem = `<img src="${imgSrc}">`
        const cellElem = $("#" +getCellId(house.x, house.y));
        cellElem.append(imgElem);
    });

    log("renderring player human...");
    player.human.forEach(function(person) {
        const imgSrc = getImage(BASE_HUMAN, person.type);
        const imgElem = `<img src="${imgSrc}">`
        const cellElem = $("#" +getCellId(person.x, person.y));
        cellElem.append(imgElem);
    });

    log("renderring player towers...");
    player.towers.forEach(function(tower) {
        const imgSrc = getImage(BASE_TOWERS, tower.type);
        const imgElem = `<img src="${imgSrc}">`
        const cellElem = $("#" +getCellId(tower.x, tower.y));
        cellElem.append(imgElem);
    });
}

function loadGame() {
    log(`Mesh info: ${MESH_WIDTH} X ${MESH_HEIGHT}`);

    log("rendering full mesh...");
    renderFullMesh(MAP1.upperBound);

    log("rendering current territory...");
    renderTerritory(MAP1.territory);

    log("rendering players...");
    MAP1.players.forEach(function(player, index) {
        log(`rendering player: ${player.name}`);
        renderPlayer(player, index + 1);
    });

    log("renderring trees...");
    renderTrees(MAP1.trees);
}

loadGame();

// map data collection
var DATA = [];
$(document).ready(() => {
    $(".cell").click(function(e) {
        // $(".cell.selected").removeClass("selected");
        const x = parseInt($(this).attr('x'));
        const y = parseInt($(this).attr('y'));
        $(this).addClass("player1");
        console.log(`Selected: ${x},${y}`);
        DATA.push({x: x, y: y});
    });
})
