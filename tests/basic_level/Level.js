// JavaScript Document
"use strict"

//level loads and draws the tiles of the level and any pertinant information
//holds a lot of information so inherits from powerupjs.GameObjectList
//holds the tilegrid, the background, also is generic for a level type since specific leveltypes inherit from it


function Level(levelData, special) {
    powerupjs.GameObjectList.call(this);

    this.special = typeof special !== 'undefined' ? this.special : false;
    this.showMoves = false;
    this.dragging = false;
    this.levelData = levelData;
    //background would normally load elsewhere (upon going to level in the playingstate) based on the player location
    this.add(new powerupjs.SpriteGameObject(sprites.background_charybdo_treasure_cave, ID.layer_background));
    this.tileFieldHolder = new powerupjs.SpriteGameObject(sprites.background_standard_tile_field, ID.layer_background_1);
    this.tileFieldHolder.origin = this.tileFieldHolder.center;
    this.tileFieldHolder.position = new powerupjs.Vector2(powerupjs.Game.size.x / 2, powerupjs.Game.size.y / 2);
    this.add(this.tileFieldHolder);

    this.matches = []; //{column, row, length, horizontal, eventually, square,T/L}
    this.moves = []; //{colum1, row1, column2, row2}

    this.prevSelected = null;
    this.selected = null;


    this.loadTiles();
}

Level.prototype = Object.create(powerupjs.GameObjectList.prototype);

Level.prototype.update = function(delta) {
    powerupjs.GameObjectList.prototype.update.call(this, delta);
};

Level.prototype.handleInput = function(delta) {
    powerupjs.GameObjectList.prototype.handleInput.call(this, delta);
    /*if (powerupjs.Mouse.containsMousePress(new powerupjs.Rectangle(0, 0, 1000, 1000))) {
        this.resolveMatches();
        console.log("resolved mathces");
        //need to be able to make at least one move so find out if there are any moves
        this.findMoves();
        console.log("found moves");
        for (let i = this.tiles.rows - 1; i >= 0; i--) {
            for (let j = this.tiles.columns - 1; j >= 0; j--) {
                if (this.tiles.at(j, i).type === TileType.deleted) {
                    console.log("this tile type is deleted");
                }
                if (this.tiles.at(j, i).shift > 0) {
                    console.log("row: " + i + ", col: " + j + " - shift = " + this.tiles.at(j, i).shift);
                    break;
                }
            }
        }
    }*/
    if (powerupjs.Touch.isTouchDevice) {
        this.handleTouchInput(delta);
    } else {
        this.handleComputerInput(delta);
    }
};

Level.prototype.handleComputerInput = function(delta) {
    if (powerupjs.Mouse.left.pressed) {
        this.dragging = true;
    }
    for (let i = this.tiles.columns - 1; i >= 0; i--) {
        for (let j = this.tiles.rows - 1; j >= 0; j--) {
            if (powerupjs.Mouse.containsMouseDown(this.tiles.at(j, i).boundingBox)) {
                if (this.selected !== null && this.dragging) {
                    this.prevSelected = this.selected;
                    this.selectTile(this.tiles.at(j, i));
                    if (this.checkValidSwap(this.prevSelected)) {
                        this.handleSwap(this.prevSelected);
                        powerupjs.Mouse.resetDown();
                    }
                } else {
                    this.selectTile(this.tiles.at(j, i));
                    console.log(this.selected);
                }
            }
        }
    }
};

Level.prototype.handleTouchInput = function(delta) {
    if (powerupjs.Touch.containsTouchPress(this.tileFieldHolder.boundingBox)) {
        this.dragging = true;
    }
    for (let i = this.tiles.columns - 1; i >= 0; i--) {
        for (let j = this.tiles.rows - 1; j >= 0; j--) {
            if (powerupjs.Touch.containsTouch(this.tiles.at(j, i).boundingBox)) {
                if (this.selected !== null && this.dragging) {
                    this.prevSelected = this.selected;
                    this.selectTile(this.tiles.at(j, i));
                    if (this.checkValidSwap(this.prevSelected)) {
                        this.handleSwap(this.prevSelected);
                        powerupjs.Touch.reset();
                    }
                } else {
                    this.selectTile(this.tiles.at(j, i));
                    console.log(this.selected);
                }
            }
        }
    }
};

//use tiles in level data to load the tilegrid
Level.prototype.loadTiles = function() {
    this.tiles = new TileField(this.levelData.tiles.length, this.levelData.tiles[0].length, ID.tiles);
    this.tiles.position = new powerupjs.Vector2(342, 61);
    this.add(this.tiles);
    this.selectBorder = new powerupjs.SpriteGameObject(sprites.selected_tile_overlay, ID.layer_overlays, ID.selectBorder);
    this.selectBorder.position = new powerupjs.Vector2(-2000, -2000);
    this.selectBorder.parent = this.tiles;
    this.add(this.selectBorder);
    var done = false;

    this.tiles.cellWidth = 74;
    this.tiles.cellHeight = 74;
    //loading the tiles in the grid
    while (!done) {
        //generates a board
        for (var y = 0, ly = this.tiles.rows; y < ly; ++y) {
            for (var x = 0, lx = this.tiles.columns; x < lx; ++x) {
                var t = this.loadTile(this.levelData.tiles[y][x], x, y); //(tile character, sheetindex(x), sheetindex (y))
                this.tiles.addAt(t, x, y);
            }
        }
        //reolve all matches upon loading
        this.resolveMatches();
        //need to be able to make at least one move so find out if there are any moves
        this.findMoves();
        //end loop
        if (this.moves.length > 0) {
            done = true;
        }
    }
};

//return true if the clciked on tile can be swapped with the current selected tile and false otherwise
//called in handleInput
Level.prototype.checkValidSwap = function(tile) {
    if (tile.type === TileType.special) {
        return true;
    } else if (tile === this.selected) {
        console.log("same Tile");
        return false;
    } else if (tile.type === TileType.deleted || tile.type === TileType.background) {
        console.log("deleted or background tile");
        return false;
    } else if (this.selected === undefined || this.selected == null) {
        console.log("no selected tile");
        return false;
    } else {
        return this.canSwap(tile, this.selected);
    }
};

//check if the tile and the seleccted tile can swap (ie are adjacent)
Level.prototype.canSwap = function(tile, tile2) {
    let x1 = tile.xCoordinate;
    let y1 = tile.yCoordinate;
    let x2 = tile2.xCoordinate;
    let y2 = tile2.yCoordinate;
    if ((Math.abs(x1 - x2) == 1 && y1 == y2) || (Math.abs(y1 - y2) == 1 && x1 == x2)) {
        console.log("can swap");
        return true;
    }
    console.log("cannot swap");
    return false;
};

//swaps the tiles, stops taking input for touch or hold, then checks for matches and resolves, if no matches it swaps them back and makes the newly clicked one the selected tile
Level.prototype.handleSwap = function(tile) {
    console.log("selected position: " + this.selected.position);
    tile.stopped = false;
    this.selected.stopped = false;

    this.dragging = false;
    this.swapTiles(tile, this.selected); //this has a timer for animation purposes
    /*//all this should wait on that timer to execute properly
    this.findMatches();
    if (this.matches.length > 0) {
        this.resolveMatches();
        this.deselect();
        this.findMoves();
        if (this.moves.length === 0) {
            //this.shuffle();
        }
    } else {
        this.swapTiles(tile, this.selected);
    }*/

    /*this.dragging = false;
    $LAB
        .swapTiles(tile, this.selected).wait() //this has a timer for animation purposes
        .finishHandlingSwap(tile);
    */

};

Level.prototype.finishHandlingSwap = function(tile) {
    console.log("sure hope it waits");
    this.findMatches();
    if (this.matches.length > 0) {
        this.resolveMatches();
        this.deselect();
        this.findMoves();
        if (this.moves.length === 0) {
            //this.shuffle();
        }
    } else {
        this.swapTiles(tile, this.selected); //this has timer, however nothing has to wait on this timer to run its course as it is just switching back if no valid match
    }
};

//takes into account special matches needed and then finds those then horizontal matches, then vertical matches
Level.prototype.findMatches = function() {
    //matches array should be empty upon start
    this.matches = [];

    if (this.special) {
        //find special matches first 
    }
    this.findHorizontalMatches();
    this.findVerticalMatches();
};

//checks for clusters, adds them to an array and then removes the clusters and shifts cells until no clusters are left
Level.prototype.resolveMatches = function() {
    this.findMatches();

    while (this.matches.length > 0) {
        this.removeMatches();
        this.shiftTiles();
        this.findMatches();
    }
};

//tries all avalable swaps the types of adjacent tiles to identify if there are moves
Level.prototype.findMoves = function() {
    this.moves = []; //reset moves
    this.findHorizontalMoves();
    this.findVerticalMoves();
    //console.log("there are " + this.moves.length + " moves you can make");
    this.matches = [];
};

Level.prototype.removeMatches = function() {
    this.loopMatches();

    //calculate hoe much a tile should be shifted down
    for (var i = this.tiles.columns - 1; i >= 0; i--) {
        var shift = 0;
        for (var j = this.tiles.rows - 1; j >= 0; j--) {
            if (this.tiles.at(i, j).type === TileType.deleted) {
                shift++;
                this.tiles.at(i, j).shift = 0;
            } else {
                this.tiles.at(i, j).shift = shift;
            }
        }
    }
};

//swaps the type of 2 tiles - used for finding moves
Level.prototype.typeSwap = function(x1, y1, x2, y2) {
    if (this.tiles.at(x1, y1) == null && this.tiles.at(x2, y2) == null) {
        //console.log("x1: " + x1 + " , y1: " + y1 + " x2: " + x2 + " , y2: " + y2);
        return;
    }
    if (this.tiles.at(x1, y1) == null) {
        console.log("x1: " + x1 + " , y1: " + y1);
        return;
    }
    if (this.tiles.at(x2, y2) == null) {
        //console.log("x2: " + x2 + " , y2: " + y2);
        return;
    }
    var swap = this.tiles.at(x1, y1);
    var swap2 = this.tiles.at(x2, y2);
    this.tiles.addAt(swap2, x1, y1);
    this.tiles.addAt(swap, x2, y2);
};
//swapping with no animation for loading of levels
Level.prototype.swap = function(x1, y1, x2, y2) {
    if (this.tiles.at(x1, y1) == null && this.tiles.at(x2, y2) == null) {
        return;
    }
    if (this.tiles.at(x1, y1) == null) {
        return;
    }
    if (this.tiles.at(x2, y2) == null) {
        return;
    }
    var swap = this.tiles.at(x1, y1);
    var swap2 = this.tiles.at(x2, y2);
    this.tiles.addAt(swap2, x1, y1);
    this.tiles.addAt(swap, x2, y2);
};

//this one should have animation tied in someway; cannot get to work yet
Level.prototype.swapTiles = function(tile1, tile2, swapBack) {
    this.special = typeof special !== 'undefined' ? this.special : false;
    var swapBack = typeof swapBack !== 'undefined' ? swapBack : false;
    if (tile1 == null || tile2 == null) {
        console.log("tiles don't exist");
        return;
    }

    let x1 = tile1.xCoordinate;
    let y1 = tile1.yCoordinate;
    let x2 = tile2.xCoordinate;
    let y2 = tile2.yCoordinate;
    if (x1 > x2) {
        tile1.shiftingLeft = true;
        tile2.shiftingRight = true;
    } else if (x1 < x2) {
        tile1.shiftingRight = true;
        tile2.shiftingLeft = true;
    } else if (y1 > y2) {
        tile1.shiftingUp = true;
        tile2.shiftingDown = true;
    } else if (y1 < y2) {
        tile1.shiftingDown = true;
        tile2.shiftingUp = true;
    }
    var swap = tile1;
    var swap2 = tile2;
    setTimeout(function(tiles) {
        var realTiles = tiles.parent;
        realTiles.addAt(swap2, x1, y1);
        realTiles.addAt(swap, x2, y2);
        realTiles.at(x1, y1).beStill();
        realTiles.at(x2, y2).beStill();
        console.log("sure hope it waits");
        realTiles.parent.findMatches();
        if (realTiles.parent.matches.length > 0) {
            realTiles.parent.resolveMatches();
            realTiles.parent.deselect();
            realTiles.parent.findMoves();
            if (realTiles.parent.moves.length === 0) {
                //realTiles.parent.shuffle();
            }
        } else if (!swapBack) {
            realTiles.parent.swapTiles(swap, swap2, true); //this has timer, however nothing has to wait on this timer to run its course as it is just switching back if no valid match
        }
    }, 260, (this.tiles, tile1, tile2)); //takes about a quarter sec (ish) for the tiles to take eachothers' places
    //uncomment this and the animation works but the matching is delayed to the next switch.
    //also it doesn't continue with the method that calls this one, so if there is no match it doesn't switch back.
    //this is because it is actually returning to that previous method and checking for matches before this setTimeout even executes.
    //this.tiles.addAt(swap2, x1, y1);
    //his.tiles.addAt(swap, x2, y2);
    //tile1.beStill(); //comment for animation; uncomment to make matches instant - note that animation is broken
};

Level.prototype.shiftTiles = function() {
    for (var i = this.tiles.columns - 1; i >= 0; i--) {
        for (var j = this.tiles.rows - 1; j >= 0; j--) { //loop bottom to top
            if (this.tiles.at(i, j).type === TileType.deleted) {
                var t = new BasicTile(TileType.basic);
                this.tiles.addAt(t, i, j);
            } else {
                //console.log("no shift");
                //swap tile to shift it
                var shift = this.tiles.at(i, j).shift;
                if (shift > 0) {
                    this.swap(i, j, i, j + shift);
                }
            }
            //reset shift
            this.tiles.at(i, j).shift = 0;
            console.log(this.tiles.at(i, j).shift);
        }
    }
};

Level.prototype.loopMatches = function() {
    for (var i = this.matches.length - 1; i >= 0; i--) {
        //column, row, length, horizontal
        var match = this.matches[i];
        var cOffset = 0;
        var rOffset = 0;
        for (let j = match.length - 1; j >= 0; j--) {
            this.lookAtMatch(i, match.column + cOffset, match.row + rOffset, match);
            if (match.horizontal) {
                cOffset++;
            } else if (!match.horizontal) {
                rOffset++;
            }
        }
    }
};

Level.prototype.lookAtMatch = function(index, column, row, match) {
    this.tiles.at(column, row).type = TileType.deleted;
};

Level.prototype.selectTile = function(tile) {
    if (tile.type === TileType.background) { // do not select background tiles
        return;
    }
    this.deselect();
    console.log("selecting tile at " + tile.position);
    this.selected = tile;
    this.selected.ID = ID.selected;
    this.selectBorder.position = tile.position.copy();
    this.selectBorder.position.x += 340;
    this.selectBorder.position.y += 60;
};

Level.prototype.deselect = function() {
    this.selectBorder.position = new powerupjs.Vector2(-2000, -2000);
    if (this.selected == null || this.selected == undefined) {
        return;
    }
    this.selected.ID = undefined;
    this.selected = null;
};


Level.prototype.findHorizontalMoves = function() {
    for (let i = 0, r = this.tiles.rows; i < r; i++) {
        for (let j = this.tiles.columns; j >= 0; j--) {
            //swap, find clusters then swap back
            this.swap(j, i, j + 1, i);
            this.findMatches();
            this.typeSwap(j, i, j + 1, i);
            if (this.matches.length > 0) {
                this.moves.push({ column1: j, row1: i, column2: j + 1, row2: i });
                //console.log(" horizontal - moves: " + this.moves.length);
            }

        }
    }
};

Level.prototype.findVerticalMoves = function() {
    for (let i = 0, r = this.tiles.columns; i < r; i++) {
        for (let j = this.tiles.rows; j >= 0; j--) {
            //swap, find clusters then swap back
            this.swap(j, i, j, i + 1);
            this.findMatches();
            this.typeSwap(j, i, j, i + 1);
            if (this.matches > 0) {
                this.moves.push({ column1: i, row1: j, column2: i, row2: j + 1 });
                console.log("vertical - moves: " + this.moves.length);
            }
        }
    }
};
Level.prototype.findHorizontalMatches = function() {
    for (let i = 0, r = this.tiles.rows; i < r; i++) {
        //start with a single tile
        let matchlength = 1;
        for (let j = 0, c = this.tiles.columns; j < c; j++) {
            //console.log("horizontal: " + this.tiles.at(j, i).type);
            let checkMatch = false;
            //check if the next tile is a background tile
            if (j == c - 1 || this.tiles.at(j, i).type != TileType.basic) {
                //last tile or last tile before a background/special anyways
                checkMatch = true;
            } else {
                //check the type and basicID of next tile to see if it is in the match
                if (this.tiles.at(j, i).type === TileType.basic && (this.tiles.at(j, i).basicTileID === this.tiles.at(j + 1, i).basicTileID)) {
                    matchlength += 1;
                } else {
                    //different type of tile
                    checkMatch = true;
                }
            }
            //if there was a match add it to the arary of matches starting with the first to the left and the matchlength and horizontal
            if (checkMatch) {
                if (matchlength >= 3) {
                    this.matches.push({ column: j + 1 - matchlength, row: i, length: matchlength, horizontal: true });
                }
                matchlength = 1;
            }
        }
    }
};

Level.prototype.findVerticalMatches = function() {
    for (let i = 0, c = this.tiles.columns; i < c; i++) {
        //start with a single tile
        let matchlength = 1;
        for (let j = 0, r = this.tiles.rows; j < r; j++) {
            //console.log("vertical: " + this.tiles.at(i, j).type);
            let checkMatch = false;
            //check if the next tile is a background tile
            if (j == r - 1 || this.tiles.at(j, i).type != TileType.basic) {
                //last tile or last tile before a background/special anyways
                checkMatch = true;
            } else {
                //check the type and basicID of next tile to see if it is in the match
                if (this.tiles.at(i, j).type === TileType.basic && (this.tiles.at(i, j).basicTileID === this.tiles.at(i, j + 1).basicTileID)) {
                    matchlength += 1;
                } else {
                    //different type of tile
                    checkMatch = true;
                }
            }
            //if there was a match add it to the arary of matches starting with the first to the left and the matchlength and horizontal
            if (checkMatch) {
                if (matchlength >= 3) {
                    this.matches.push({ column: i, row: j + 1 - matchlength, length: matchlength, horizontal: false });
                }
                matchlength = 1;
            }
        }
    }
};

//loadtile based on character
Level.prototype.loadTile = function(tileType, x, y) {
    switch (tileType) {
        case '?':
            console.log("added basic type");
            return this.loadBasicTile(TileType.basic);
        default:
            return this.loadBasicTile(TileType.background);
    }
};


Level.prototype.loadBasicTile = function(tileType) {
    var t = new BasicTile(tileType);
    return t;
};