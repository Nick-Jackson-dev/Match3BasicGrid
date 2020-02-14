// JavaScript Document
"use strict";

//TileField will inhert from powerupjsGameObjectGrid and hold tiles in a grid determined by the parameters passed

function TileField(rows, columns, layer, id) {
    powerupjs.GameObjectGrid.call(this, rows, columns, layer, id);

    this.matches = []; //{column, row, length, horizontal, eventually, square,T/L}
    this.moves = []; //{colum1, row1, column2, row2}

    this.prevSelected = null;
    this.selected = null;
}
TileField.prototype = Object.create(powerupjs.GameObjectGrid.prototype);

TileField.prototype.handleInput = function(delta) {
    powerupjs.GameObjectList.prototype.handleInput.call(this, delta);
    if (powerupjs.Touch.isTouchDevice) {
        this.handleTouchInput(delta);
    } else {
        this.handleComputerInput(delta);
    }
};


TileField.prototype.handleComputerInput = function(delta) {
    if (powerupjs.Mouse.left.pressed) {
        this.dragging = true;
    }
    for (let i = this.columns - 1; i >= 0; i--) {
        for (let j = this.rows - 1; j >= 0; j--) {
            if (powerupjs.Mouse.containsMouseDown(this.at(j, i).boundingBox)) {
                if (this.selected !== null && this.dragging) {
                    this.prevSelected = this.selected;
                    this.selectTile(this.at(j, i));
                    if (this.checkValidSwap(this.prevSelected)) {
                        this.handleSwap(this.prevSelected);
                        powerupjs.Mouse.resetDown();
                    }
                } else {
                    this.selectTile(this.at(j, i));
                    console.log(this.selected);
                }
            }
        }
    }
};

TileField.prototype.handleTouchInput = function(delta) {
    var tileFieldHolder = this.root.find(ID.tile_field_holder);
    if (powerupjs.Touch.containsTouchPress(tileFieldHolder.boundingBox)) {
        this.dragging = true;
    }
    for (let i = this.columns - 1; i >= 0; i--) {
        for (let j = this.rows - 1; j >= 0; j--) {
            if (powerupjs.Touch.containsTouch(this.at(j, i).boundingBox)) {
                if (this.selected !== null && this.dragging) {
                    this.prevSelected = this.selected;
                    this.selectTile(this.at(j, i));
                    if (this.checkValidSwap(this.prevSelected)) {
                        this.handleSwap(this.prevSelected);
                        powerupjs.Touch.reset();
                    }
                } else {
                    this.selectTile(this.at(j, i));
                    console.log(this.selected);
                }
            }
        }
    }
};

TileField.prototype.getTileXCoordinate = function(tile) {
    let x = Math.floor(tile.position.x / this.cellWidth);
    //console.log(x);
    return x;
};

TileField.prototype.getTileYCoordinate = function(tile) {
    let y = Math.floor(tile.position.y / this.cellHeight);
    //console.log(y);
    return y;
};

//unsure whether this is needed actually
TileField.prototype.getTileType = function(x, y) {
    if (x < 0 || x >= this.columns)
        return TileType.normal;
    if (y < 0 || y >= this.rows)
        return TileType.background;
    return this.at(x, y).type;
};

TileField.prototype.checkValidSwap = function(tile) {
    if (tile.type === TileType.special) {
        return true;
    } else if (tile === this.selected) {
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
TileField.prototype.canSwap = function(tile, tile2) {
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
TileField.prototype.handleSwap = function(tile) {
    this.dragging = false;
    this.swapTiles(tile, this.selected); //this has a timer for animation purposes
};

//takes into account special matches needed and then finds those then horizontal matches, then vertical matches
TileField.prototype.findMatches = function() {
    //matches array should be empty upon start
    this.matches = [];

    if (this.special) {
        //find special matches first 
    }
    this.findHorizontalMatches();
    this.findVerticalMatches();
};

//checks for clusters, adds them to an array and then removes the clusters and shifts cells until no clusters are left
TileField.prototype.resolveMatches = function() {
    this.findMatches();

    while (this.matches.length > 0) {
        this.removeMatches();
        //this.shiftTiles();
        this.findMatches();
    }
};

//tries all avalable swaps the types of adjacent tiles to identify if there are moves
TileField.prototype.findMoves = function() {
    this.moves = []; //reset moves
    this.findHorizontalMoves();
    this.findVerticalMoves();
    //console.log("there are " + this.moves.length + " moves you can make");
    this.matches = [];
};

TileField.prototype.removeMatches = function() {
    this.loopMatches();

    //calculate hoe much a tile should be shifted down
    for (var i = this.columns - 1; i >= 0; i--) {
        var shift = 0;
        for (var j = this.rows - 1; j >= 0; j--) {
            if (this.at(i, j).type === TileType.deleted) {
                shift++;
                this.at(i, j).shift = 0;
            } else {
                this.at(i, j).shift = shift;
            }
        }
    }
};

TileField.prototype.shiftTiles = function() {
    for (let i = this.columns - 1; i >= 0; i--) {
        for (let j = this.rows - 1; j >= 0; j--) { //loop bottom to top
            if (this.at(i, j).type === TileType.deleted) {
                var t = new BasicTile(TileType.basic);
                this.addAt(t, i, j);
            } else {
                //console.log("no shift");
                //swap tile to shift it
                var shift = this.at(i, j).shift;
                if (shift > 0) {
                    this.swap(i, j, i, j + shift);
                }
            }
            //reset shift
            this.at(i, j).shift = 0;
        }
    }
};

TileField.prototype.shiftTilesFall = function() {
    for (let i = this.columns - 1; i >= 0; i--) {
        for (let j = this.rows - 2; j >= 0; j--) { //loop bottom to top
            if (this.at(i, j + 1).type === TileType.deleted || this.at(i, j + 1).type === TileType.empty || !this.at(i, j + 1).isSolid()) {
                var nextTile = this.nextTileDown(this.at(i, j));
                this.at(i, j).falling = true;
            } else {
                //console.log("no shift");
                //swap tile to shift it
                var shift = this.at(i, j).shift;
                if (shift > 0) {
                    this.swap(i, j, i, j + shift);
                }
            }
            //reset shift
            this.at(i, j).shift = 0;
        }
    }
};

TileField.prototype.loopMatches = function() {
    for (var i = this.matches.length - 1; i >= 0; i--) {
        //column, row, length, horizontal
        var match = this.matches[i];
        var cOffset = 0;
        var rOffset = 0;
        for (let j = match.length - 1; j >= 0; j--) {
            this.lookAtMatch(match.column + cOffset, match.row + rOffset);
            if (match.horizontal) {
                cOffset++;
            } else if (!match.horizontal) {
                rOffset++;
            }
        }
    }
};

TileField.prototype.lookAtMatch = function(column, row) {
    this.at(column, row).deleteTile();
};

//swaps the type of 2 tiles - used for finding moves
TileField.prototype.typeSwap = function(x1, y1, x2, y2) {
    if (this.at(x1, y1) == null && this.at(x2, y2) == null) {
        //console.log("x1: " + x1 + " , y1: " + y1 + " x2: " + x2 + " , y2: " + y2);
        return;
    }
    if (this.at(x1, y1) == null) {
        console.log("x1: " + x1 + " , y1: " + y1);
        return;
    }
    if (this.at(x2, y2) == null) {
        //console.log("x2: " + x2 + " , y2: " + y2);
        return;
    }
    var swap = this.at(x1, y1);
    var swap2 = this.at(x2, y2);
    this.addAt(swap2, x1, y1);
    this.addAt(swap, x2, y2);
};
//swapping with no animation for loading of TileFields
TileField.prototype.swap = function(x1, y1, x2, y2) {
    if (this.at(x1, y1) == null && this.at(x2, y2) == null) {
        return;
    }
    if (this.at(x1, y1) == null) {
        return;
    }
    if (this.at(x2, y2) == null) {
        return;
    }
    var swap = this.at(x1, y1);
    var swap2 = this.at(x2, y2);
    this.addAt(swap2, x1, y1);
    this.addAt(swap, x2, y2);
};

//this one should have animation tied in someway; cannot get to work yet
TileField.prototype.swapTiles = function(tile1, tile2, swapBack) {
    var swapBack = typeof swapBack !== 'undefined' ? swapBack : false;
    if (tile1 == null || tile2 == null || !tile1.moveable || !tile2.moveable) {
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
        realTiles.findMatches();
        if (realTiles.matches.length > 0) {
            realTiles.resolveMatches();
            realTiles.deselect();
            realTiles.findMoves();
            if (realTiles.moves.length === 0) {
                //realTiles.shuffle();
            }
        } else if (!swapBack) {
            realTiles.swapTiles(swap, swap2, true); //this has timer, however nothing has to wait on this timer to run its course as it is just switching back if no valid match
        }
    }, 260, (this, tile1, tile2)); //takes about a quarter sec (ish) for the tiles to take eachothers' places
};

TileField.prototype.selectTile = function(tile) {
    var selectBorder = this.root.find(ID.select_border);
    if (tile.type === TileType.background) { // do not select background tiles
        return;
    }
    this.deselect();
    console.log("selecting tile at " + tile.position);
    this.selected = tile;
    this.selected.ID = ID.selected_tile;
    selectBorder.position = tile.position.copy();
    selectBorder.position.x += 340;
    selectBorder.position.y += 60;
};

TileField.prototype.deselect = function() {
    var selectBorder = this.root.find(ID.select_border)
    selectBorder.position = new powerupjs.Vector2(-2000, -2000);
    if (this.selected == null || this.selected == undefined) {
        return;
    }
    this.selected.ID = undefined;
    this.selected = null;
};


TileField.prototype.findHorizontalMoves = function() {
    for (let i = 0, r = this.rows; i < r; i++) {
        for (let j = this.columns; j >= 0; j--) {
            //swap, find clusters then swap back
            this.swap(j, i, j + 1, i);
            this.findMatches();
            this.typeSwap(j, i, j + 1, i);
            if (this.matches.length > 0) {
                this.moves.push({ column1: j, row1: i, column2: j + 1, row2: i });
            }
        }
    }
};

TileField.prototype.findVerticalMoves = function() {
    for (let i = 0, r = this.columns; i < r; i++) {
        for (let j = this.rows; j >= 0; j--) {
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
TileField.prototype.findHorizontalMatches = function() {
    for (let i = 0, r = this.rows; i < r; i++) {
        //start with a single tile
        let matchlength = 1;
        for (let j = 0, c = this.columns; j < c; j++) {
            //console.log("horizontal: " + this.at(j, i).type);
            let checkMatch = false;
            //check if the next tile is a background tile
            if (j == c - 1 || this.at(j, i).type != TileType.basic) {
                //last tile or last tile before a background/special anyways
                checkMatch = true;
            } else {
                //check the type and basicID of next tile to see if it is in the match
                if (this.at(j, i).type === TileType.basic && (this.at(j, i).basicTileID === this.at(j + 1, i).basicTileID)) {
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

TileField.prototype.findVerticalMatches = function() {
    for (let i = 0, c = this.columns; i < c; i++) {
        //start with a single tile
        let matchlength = 1;
        for (let j = 0, r = this.rows; j < r; j++) {
            //console.log("vertical: " + this.at(i, j).type);
            let checkMatch = false;
            //check if the next tile is a background tile
            if (j == r - 1 || this.at(j, i).type != TileType.basic) {
                //last tile or last tile before a background/special anyways
                checkMatch = true;
            } else {
                //check the type and basicID of next tile to see if it is in the match
                if (this.at(i, j).type === TileType.basic && (this.at(i, j).basicTileID === this.at(i, j + 1).basicTileID)) {
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