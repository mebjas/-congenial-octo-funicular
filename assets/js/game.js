/** *************************************************   */
/**            MAP 1 Temp data                          */
/** *************************************************   */
const MAP1 = {
    "upperBound": {"COUNT_CELL_X": 22, "COUNT_CELL_Y": 18},
    "territory": [{"x":11,"y":5},{"x":12,"y":5},{"x":12,"y":6},{"x":13,"y":6},{"x":13,"y":5},{"x":13,"y":4},{"x":12,"y":4},{"x":14,"y":6},{"x":13,"y":7},{"x":12,"y":7},{"x":13,"y":8},{"x":12,"y":8},{"x":13,"y":9},{"x":14,"y":10},{"x":13,"y":10},{"x":12,"y":9},{"x":11,"y":7},{"x":11,"y":6},{"x":10,"y":6},{"x":10,"y":7},{"x":9,"y":7},{"x":9,"y":6},{"x":10,"y":8},{"x":11,"y":8},{"x":9,"y":9},{"x":8,"y":9},{"x":9,"y":8},{"x":8,"y":7},{"x":8,"y":8},{"x":7,"y":9},{"x":7,"y":8},{"x":7,"y":7},{"x":8,"y":6},{"x":8,"y":5},{"x":9,"y":5},{"x":10,"y":5},{"x":10,"y":4},{"x":9,"y":4},{"x":9,"y":3},{"x":9,"y":10},{"x":8,"y":10},{"x":14,"y":4},{"x":15,"y":4},{"x":16,"y":4},{"x":15,"y":5},{"x":14,"y":5},{"x":15,"y":6},{"x":15,"y":7},{"x":14,"y":7},{"x":16,"y":6},{"x":15,"y":8},{"x":14,"y":8},{"x":14,"y":9},{"x":7,"y":5},{"x":7,"y":6},{"x":6,"y":5},{"x":6,"y":6},{"x":5,"y":5},{"x":6,"y":4},{"x":5,"y":4},{"x":5,"y":3},{"x":6,"y":7},{"x":6,"y":8},{"x":6,"y":9},{"x":7,"y":10},{"x":6,"y":10},{"x":5,"y":9},{"x":8,"y":4},{"x":7,"y":4},{"x":7,"y":3},{"x":8,"y":3},{"x":8,"y":2},{"x":7,"y":2},{"x":7,"y":1},{"x":9,"y":2},{"x":10,"y":2},{"x":10,"y":3},{"x":11,"y":4},{"x":17,"y":10},{"x":16,"y":11},{"x":17,"y":11},{"x":18,"y":10},{"x":17,"y":9},{"x":18,"y":9},{"x":19,"y":10},{"x":19,"y":9},{"x":19,"y":8},{"x":10,"y":14},{"x":11,"y":14},{"x":10,"y":15},{"x":11,"y":15},{"x":12,"y":14},{"x":12,"y":13},{"x":11,"y":13},{"x":13,"y":14},{"x":12,"y":15},{"x":13,"y":13}],
    "trees": [{"x":9,"y":4},{"x":5,"y":3},{"x":5,"y":4},{"x":6,"y":4},{"x":7,"y":4},{"x":8,"y":4},{"x":8,"y":5},{"x":9,"y":5},{"x":10,"y":6},{"x":10,"y":7},{"x":11,"y":6},{"x":10,"y":5},{"x":11,"y":7},{"x":11,"y":8},{"x":12,"y":8},{"x":12,"y":9},{"x":12,"y":7},{"x":7,"y":1},{"x":7,"y":2},{"x":7,"y":3},{"x":8,"y":2},{"x":12,"y":14},{"x":12,"y":13},{"x":11,"y":13},{"x":13,"y":14},{"x":12,"y":15},{"x":13,"y":13},{"x":17,"y":10},{"x":17,"y":9},{"x":18,"y":10},{"x":17,"y":11},{"x":18,"y":9},{"x":19,"y":10},{"x":19,"y":9}],
    "towers": [{"x":16,"y":11, "type": "BASIC"},{"x":19,"y":8, "type": "STRONG"},{"x":10,"y":14, "type": "STRONG"}],
    "players": [
        {
            "name": "minhaz",
            "territory": [{"x":16,"y":4},{"x":15,"y":4},{"x":15,"y":5}],
            "houses": [{"type": "CASTLE", "x":16,"y":4}],
            "human": [{"type": "FARMER", "x":15,"y":4}],
            "towers": [{"type": "BASIC", "x":15,"y":5}],
            "initialMoney": 10
        },
        {
            "name": "nida",
            "territory": [{"x":6,"y":10},{"x":5,"y":9},{"x":6,"y":9},{"x":7,"y":10}],
            "houses": [{"type": "CASTLE", "x":6,"y":10}, {"type": "BASIC", "x":7,"y":10}],
            "human": [{"type": "FARMER", "x":5,"y":9},{"type": "SPEARMAN", "x":6,"y":9}],
            "towers": [],
            "initialMoney": 10
        },
        {
            "name": "ashu",
            "territory": [{"x": 11, "y": 14}, {"x": 12, "y": 14}],
            "houses": [{"type": "CASTLE", "x": 11, "y": 14}],
            "human": [],
            "towers": []
        }
    ]
};


class Game {
    constructor() {
        this._currentMap = undefined;
        this.players = [];
        this.turn = 0;
    }

    /** Renders the full mesh of the game. */ 
    _renderFullMesh(upperBound) {
        if (!upperBound) {
            upperBound = {};
        }
        if (upperBound.COUNT_CELL_X) {
            COUNT_CELLS_X = upperBound.COUNT_CELL_X;
        }
        if (upperBound.COUNT_CELL_Y) {
            COUNT_CELLS_Y = upperBound.COUNT_CELL_Y;
        }

        for (var i = 0; i < COUNT_CELLS_Y; i++) {
            for (var j = 0; j < COUNT_CELLS_X; j++) {
                insertCell(j, i, CONTAINER);
            }
        }
    }

    /** Renders the full territory as per map. */ 
    _renderTerritory(territory) {
        territory.forEach(cell => {
            var territoryObj = new NeutralTerritory(cell.x, cell.y);
            territoryObj.render();
        });
    }

    /** Render player territories. */
    _renderPlayers(players) {
        const $this = this;
        players.forEach(function(player, index) {
            var initialMoney = 0;
            if (player.initialMoney) {
                initialMoney = parseInt(player.initialMoney);
                if (initialMoney < 0) {
                    throw `initialMoney for ${player.name} is negative, not allowed!`
                }
            }
            const playerObj = new Player(index + 1, player.name, initialMoney);
            $this.players.push(playerObj);

            // render the territory
            player.territory.forEach(function(cell) {
                (new PlayerTerritory(cell.x, cell.y, playerObj)).render();
            });

            // render homes
            player.houses.forEach(function(house) {
                houseOf(house.type, house.x, house.y, playerObj).render();
            });

            // render humans
            player.human.forEach(function(person) {
                humanOf(person.type, person.x, person.y, playerObj).render();
            });

            // render towers
            player.towers.forEach(function(tower) {
                towerOf(tower.type, tower.x, tower.y, playerObj).render();
            });
        })
    }

    /** Renders trees in the territory. */
    _renderTrees(trees) {
        if (!trees) {
            return;
        }

        const treeCount = OBJECT_MAPPING[BASE_TREES].length;
        trees.forEach(function(tree) {
            const index = parseInt(Math.random() * 100000) % treeCount;
            var treeObj = index 
                ? new PalmTree(tree.x, tree.y)
                : new PineTree(tree.x, tree.y);
            treeObj.render();
        });
    }

    /** Renders anonymus towers not belonging to any players. */
    _renderAnonymousTowers(towers) {
        if (!towers) {
            return;
        }

        towers.forEach(function(tower) {
            towerOf(tower.type, tower.x, tower.y, /* owner= */ undefined).render();
        });
    }

    /** Sets the non reachable islands as not selectable */
    _setUnreachableTerritoryNonSelectable() {
        const valid = {};

        function spreadValidity(key) {
            if (key in valid) {
                return;
            }
            valid[key] = true;
            const x = TERRITORYMAP[key].x;
            const y = TERRITORYMAP[key].y;
            const neighbours = getNeighbours(x, y);
            for (var i = 0; i < neighbours.length; i++) {
                const cell = neighbours[i];
                const key = getCellIdFromCell(cell);
                if (!isValidTerritory(cell.x, cell.y)) {
                    continue;
                }

                spreadValidity(key);
            }
        }

        const territoryKeys = Object.keys(TERRITORYMAP);
        for (var i = 0; i < territoryKeys.length; i++) {
            const key = territoryKeys[i];
            if (key in valid) {
                continue;
            }
            if (TERRITORYMAP[key].owner) {
                console.log(TERRITORYMAP[key].owner);
                // found owner.
                spreadValidity(key);
            }
        }

        // Now mark those not valid to not be selectable
        for (var i = 0; i < territoryKeys.length; i++) {
            const key = territoryKeys[i];
            if (!(key in valid)) {
                $(`#${key}`).removeClass("selectable");
            }
        }
    }

    render() {
        if (!this._currentMap) {
            alert("No map loaded");
            return;
        }

        this._renderFullMesh(this._currentMap.mapData.upperBound);
        this._renderTerritory(this._currentMap.mapData.territory);
        this._renderPlayers(this._currentMap.mapData.players);
        this._renderTrees(this._currentMap.mapData.trees);
        this._renderAnonymousTowers(this._currentMap.mapData.towers);
        this._setUnreachableTerritoryNonSelectable();
    }

    loadMap(mapData) {
        this._currentMap = new Map(mapData);
        this.render();
    }
}


/** *************************************************   */
/**            DEBUG                                    */
/** *************************************************   */
// DEBUG: map data collection
var DATA = [];
$(document).ready(() => {
    var game = new Game();
    game.loadMap(MAP1);

    $(".cell.selectable").click(function(e) {
        $(".cell.selected").removeClass("selected");
        const x = parseInt($(this).attr('x'));
        const y = parseInt($(this).attr('y'));
        $(this).addClass("player1");
        console.log(OBJMAP[getCellId(x, y)]);
        console.log(TERRITORYMAP[getCellId(x, y)]);
        DATA.push({x: x, y: y});
    });
})
