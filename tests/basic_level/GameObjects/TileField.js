// JavaScript Document
"use strict";

//TileField will inhert from powerupjsGameObjectGrid and hold tiles in a grid determined by the parameters passed
//handles behaviors of the grid and when those behaviors effect the tiles within it

function TileField(rows, columns, special, layer, id) {
    powerupjs.GameObjectGrid.call(this, rows, columns, layer, id);
    this.special = special;
    this.chainsLeft = 0; //counts up when special tile gets activated and down when the special tile deletes so that shiftTiles method is not called more than once
    this.straightVerticalMatches = []; //{column, row, length, horizontal}
    this.straightHorizontalMatches = []; //{column, row, length, horizontal}
    //this.squareMatches = []; //{column, row} - getting rid of homing rockets
    this.intersectingMatches = []; //{columnHor, rowHor, lengthHor, columnVer, rowVer, lengthVer}
    this.longMatches = [];
    this.extraLongMatches = [];
    this.moves = []; //{colum1, row1, column2, row2}

    this.prevSelected = null;
    this.selected = null;
}
TileField.prototype = Object.create(powerupjs.GameObjectGrid.prototype);

TileField.prototype.handleInput = function(delta) {
    if (this.shifting) {
        return;
    }
    powerupjs.GameObjectGrid.prototype.handleInput.call(this, delta);

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
                if (this.at(j, i).velocity.x !== 0 || this.at(j, i).velocity.y !== 0) {
                    return;
                }
                if (this.selected !== null && this.dragging) {
                    this.prevSelected = this.selected;
                    this.selectTile(this.at(j, i));

                    if (this.checkValidSwap(this.prevSelected)) {
                        this.swapTiles(this.prevSelected, this.selected);
                        powerupjs.Mouse.resetDown();
                    }
                } else { //if there is no current selection
                    this.selectTile(this.at(j, i));
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
                if (this.at(j, i).velocity.x !== 0 || this.at(j, i).velocity.y !== 0) {
                    return;
                }
                if (this.selected !== null && this.dragging) {

                    this.prevSelected = this.selected;
                    this.selectTile(this.at(j, i));

                    if (this.checkValidSwap(this.prevSelected)) {
                        this.swapTiles(this.prevSelected, this.selected);
                        powerupjs.Touch.reset();
                    }
                } else {
                    this.selectTile(this.at(j, i));
                }
            }
        }
    }
};

TileField.prototype.reset = function() {
    powerupjs.GameObjectGrid.prototype.reset.call(this);
    this.deselect();
};

TileField.prototype.getTileXCoordinate = function(tile) {
    return Math.floor(tile.position.x / this.cellWidth);
};

TileField.prototype.getTileYCoordinate = function(tile) {
    return Math.floor(tile.position.y / this.cellHeight);
};

//checks for clusters, adds them to an array and then removes the clusters and shifts cells until no clusters are left
TileField.prototype.resolveMatches = function(initializing) {
    var initializing = typeof initializing != 'undefined' ? initializing : false;
    this.findMatches(initializing);

    while (this.straightVerticalMatches.length > 0 ||
        this.straightHorizontalMatches.length > 0 ||
        //this.squareMatches.length > 0 || //getting rid of homign rockets
        this.intersectingMatches.length > 0 ||
        this.longMatches.length > 0 ||
        this.extraLongMatches.length > 0) {
        this.removeMatches(initializing);
        if (!initializing) {
            this.shiftTiles();
        } else {
            this.shiftTilesFast();
        }
        this.findMatches(initializing);
    }
};

TileField.prototype.findMatches = function(initializing) {
    var initializing = typeof initializing != 'undefined' ? initializing : false;
    //matches array should be empty upon start
    this.straightHorizontalMatches = [];
    this.straightVerticalMatches = [];
    this.longMatches = [];
    this.extraLongMatches = [];
    this.findHorizontalMatches(initializing);
    this.findVerticalMatches(initializing);
    if (!initializing && this.special) { //finds long, extra long, T, L and Square matches and handles the insertion of the appropriate special tile
        this.intersectingMatches = [];
        //this.squareMatches = [];//getting rid of homing rockets
        this.findVoidBombs();
        //this.findHomingRockets(); //getting rid of homing rockets
    }
};

//tries all avalable swaps the types of adjacent tiles to identify if there are moves
TileField.prototype.findMoves = function(initializing) {
    var initializing = typeof initializing != 'undefined' ? initializing : false;
    this.moves = []; //reset moves
    this.findHorizontalMoves(initializing);
    this.findVerticalMoves(initializing);
    //console.log("there are " + this.moves.length + " moves you can make");
    if (this.moves.length === 0) {
        console.log("no moves");
        //this.shuffle();
        //this.findMoves();
    }
    this.straightHorizontalMatches = [];
    this.straightVerticalMatches = [];
};

TileField.prototype.removeMatches = function(initializing) {
    var initializing = typeof initializing != 'undefined' ? initializing : false;
    this.loopMatches(initializing); //looks at matches and deletes tiles

    //calculate how much a tile should be shifted down based on whether tiles below are empty or deleted type
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


TileField.prototype.shiftTilesFast = function() {
    for (let i = this.columns - 1; i >= 0; i--) {
        for (let j = this.rows - 1; j >= 0; j--) { //loop bottom to top
            if (this.at(i, j).type === TileType.deleted) {
                var t = new BasicTile(TileType.basic);
                this.addAt(t, i, j);
            } else {
                var shift = this.at(i, j).shift;
                if (shift > 0) { //swap tile to shift it
                    //a set interval here may work if the remove matches is called at a different time and tiles are generated from t
                    this.swap(i, j, i, j + shift);
                }
            }
            //reset shift
            this.at(i, j).shift = 0;
        }
    }
};

TileField.prototype.shiftTiles = function() {
    this.shifting = false;
    var intervalTimer = undefined;
    //put basic tiles in place of deleted first row tiles 
    //eventually this will only be if not special, if special first check for special spawner
    for (let i = 0, r = this.columns; i < r; i++) {
        if (this.at(i, 0).type === TileType.deleted) {
            this.addAt(new BasicTile(TileType.basic), i, 0);
        }
    }
    //see what needs a shift based on deleted tiles
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
    //go one by one shifting tiles one down and reiterate loop if one shifts
    for (let i = this.columns - 1; i >= 0; i--) {
        for (let j = this.rows - 1; j >= 0; j--) { //loop bottom to top
            if (this.at(i, j).type === TileType.deleted) {
                //deleted tiles will be assigned no shift
                this.at(i, j).shift = 0;
            } else {
                var shift = this.at(i, j).shift;
                if (shift > 0) { //swap tile to shift it
                    this.shifting = true;
                    //setTimeout for animation, initiate falling
                    intervalTimer = (this.cellHeight / this.at(i, j).tileSpeed) * 1000;
                    this.at(i, j).falling = true;
                    setTimeout(function(tiles, col, row) {
                        tiles.at(col, row).shift -= 1;
                        tiles.swap(col, row, col, row + 1);
                        if (tiles.at(col, row + 1).shift <= 0) {
                            tiles.at(col, row + 1).falling = false;
                            tiles.at(col, row + 1).shift = 0;
                        }
                    }, intervalTimer, this, i, j);
                }
            }
        }
    }
    setTimeout(function(tiles) {
        if (tiles.shifting) {
            tiles.shiftTiles();
        } else {
            tiles.findMatches();
            if (tiles.straightVerticalMatches.length > 0 ||
                tiles.straightHorizontalMatches.length > 0 ||
                //tiles.squareMatches.length > 0 || //getting rid of homing rockets
                tiles.intersectingMatches.length > 0 ||
                tiles.longMatches.length > 0 ||
                tiles.extraLongMatches.length > 0) {
                setTimeout(function(tiles) {
                    tiles.loopMatches();
                    tiles.shiftTiles();
                }, 80, tiles); //provides the little delay when matches are made from tiles falling into place
            } else {
                return;
            }
        }
    }, (intervalTimer), this);
};

//handles deleting tiles in matches and inserting special tiles if applicable
TileField.prototype.loopMatches = function(initializing) {
    var initializing = typeof initializing != 'undefined' ? initializing : false;

    for (let i = this.straightHorizontalMatches.length - 1; i >= 0; i--) {
        //column, row, length, horizontal
        var match = this.straightHorizontalMatches[i];
        var cOffset = 0;
        var rOffset = 0;
        for (let j = match.length - 1; j >= 0; j--) {
            this.at(match.column + cOffset, match.row + rOffset).deleteTile();
            if (match.horizontal) {
                cOffset++;
            } else if (!match.horizontal) {
                rOffset++;
            }
        }
    }

    for (let i = this.straightVerticalMatches.length - 1; i >= 0; i--) {
        //column, row, length, horizontal
        var match = this.straightVerticalMatches[i];
        var cOffset = 0;
        var rOffset = 0;
        for (let j = match.length - 1; j >= 0; j--) {
            this.at(match.column + cOffset, match.row + rOffset).deleteTile();
            if (match.horizontal) {
                cOffset++;
            } else if (!match.horizontal) {
                rOffset++;
            }
        }
    }
    if (!initializing && this.special) {
        /*for (let i = this.squareMatches.length - 1; i >= 0; i--) {
            var square = this.squareMatches[i];
            this.at(square.col, square.row).deleteTile();
            this.at(square.col + 1, square.row).deleteTile();
            this.at(square.col + 1, square.row + 1).deleteTile();
            this.at(square.col, square.row + 1).deleteTile();
            var HR = new HomingRocket();
            this.addAt(HR, square.insertionCol, square.insertionRow);
        }*/ // getting rid of homing rockets

        //{columnHor, rowHor, lengthHor, columnVer, rowVer, lengthVer, intersetion{col, row}}
        for (let i = 0, t = this.intersectingMatches.length - 1; i <= t; i++) {
            var crossMatch = this.intersectingMatches[i];
            for (let j = 0, l = crossMatch.lengthHor - 1; j <= l; j++) {
                this.at(crossMatch.columnHor + j, crossMatch.rowHor).deleteTile();
            }
            for (let j = 0, l = crossMatch.lengthVert - 1; j <= l; j++) {
                this.at(crossMatch.columnVert, crossMatch.rowVert + j).deleteTile();
                if (crossMatch.rowVert + j === crossMatch.intersection.row) {
                    let VB = new VoidBomb();
                    this.addAt(VB, crossMatch.columnVert, crossMatch.rowVert + j)
                }
            }
        }
        for (let i = this.longMatches.length - 1; i >= 0; i--) {
            //column, row, length, horizontal, insertionPoint:{insertCol, insertRow}
            var match = this.longMatches[i];
            var cOffset = 0;
            var rOffset = 0;
            for (let j = match.length - 1; j >= 0; j--) {
                this.at(match.column + cOffset, match.row + rOffset).deleteTile();
                if (match.horizontal) {
                    cOffset++;
                } else if (!match.horizontal) {
                    rOffset++;
                }
            }
            if (match.horizontal) {
                let Z = new VerticalLazer();
                this.addAt(Z, match.insertionPoint.insertCol, match.insertionPoint.insertRow);
            } else {
                let Z = new HorizontalLazer();
                this.addAt(Z, match.insertionPoint.insertCol, match.insertionPoint.insertRow);
            }
        }


        for (let i = this.extraLongMatches.length - 1; i >= 0; i--) {
            //column, row, length, horizontal, insertionPoint:{insertCol, insertRow}
            var match = this.extraLongMatches[i];
            var cOffset = 0;
            var rOffset = 0;
            for (let j = match.length - 1; j >= 0; j--) {
                this.at(match.column + cOffset, match.row + rOffset).deleteTile();
                if (match.horizontal) {
                    cOffset++;
                } else if (!match.horizontal) {
                    rOffset++;
                }
            }
            let M = new MultiTarget();
            this.addAt(M, match.insertionPoint.insertCol, match.insertionPoint.insertRow);
        }
    }

};

TileField.prototype.checkValidSwap = function(tile) {
    if (tile.type === TileType.deleted || tile.type === TileType.background || this.selected === undefined || this.selected == null) {
        return false;
    } else {
        let x1 = tile.xCoordinate;
        let y1 = tile.yCoordinate;
        let x2 = this.selected.xCoordinate;
        let y2 = this.selected.yCoordinate;
        if ((Math.abs(x1 - x2) == 1 && y1 == y2) || (Math.abs(y1 - y2) == 1 && x1 == x2)) {
            return true;
        }
        return false;
    }
};

//swapping with no animation - for loading of TileFields, finding moves, and falling tiles
TileField.prototype.swap = function(x1, y1, x2, y2) {
    if (this.at(x1, y1) == null || this.at(x2, y2) == null) {
        return;
    }
    var swap = this.at(x1, y1);
    var swap2 = this.at(x2, y2);
    this.addAt(swap2, x1, y1);
    this.addAt(swap, x2, y2);
};

//this swaps tile and has transition animation for when the player actively switches tiles
//if it is a swapback no moves are looked for - swap back occurs when the initial swap was not a correct move and also when tiles are shifting down
TileField.prototype.swapTiles = function(tile1, tile2, swapBack) {
    var swapBack = typeof swapBack !== 'undefined' ? swapBack : false;
    this.dragging = false;
    if (tile1 == null || tile2 == null || !tile1.moveable || !tile2.moveable) {
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
    var timerset = (this.cellWidth / tile1.tileSpeed) * 1000;
    var swap = tile1;
    var swap2 = tile2;
    setTimeout(function(tiles) {
        tiles.addAt(swap2, x1, y1);
        tiles.addAt(swap, x2, y2);
        tiles.at(x1, y1).beStill();
        tiles.at(x2, y2).beStill();
        tiles.findMatches();
        if (tiles.straightVerticalMatches.length > 0 ||
            tiles.straightHorizontalMatches.length > 0 ||
            //tiles.squareMatches.length > 0 || //getting rid of homing rockets
            tiles.intersectingMatches.length > 0 ||
            tiles.longMatches.length > 0 ||
            tiles.extraLongMatches.length > 0 ||
            swap.type === TileType.special ||
            swap2.type === TileType.special) {
            tiles.resolveMatches();

            if (swap.type === TileType.special && swap2.type === TileType.special) {
                //find and perform combination
                tiles.findMixType(swap, swap2);
                //tiles.chainsLeft += 2; //temp
                //swap.activate(); //temp
                //swap2.activate(); //temp
            } else if (swap.type === TileType.special) {
                if (swap.specialTileID === 1) { //multi target
                    tiles.chainsLeft += 1;
                    swap.activate(swap2.basicTileID);
                } else {
                    tiles.chainsLeft += 1;
                    swap.activate();
                }
            } else if (swap2.type === TileType.special) {
                if (swap2.specialTileID === 1) {
                    tiles.chainsLeft += 1;
                    swap2.activate(swap.basicTileID);
                } else {
                    tiles.chainsLeft += 1;
                    swap2.activate();
                }
            }
            tiles.deselect();
            tiles.findMoves();
        } //handle special tile moves here in if swap1 or swap2 is special activate************************************************************** 
        else if (!swapBack) {
            tiles.swapTiles(swap, swap2, true); //this has timer, however nothing has to wait on this timer to run its course as it is just switching back if no valid match
        }
    }, timerset, (this)); //takes about a quarter sec (ish) for the tiles to take eachothers' places
};

TileField.prototype.selectTile = function(tile) {
    if (tile.type === TileType.background || tile === this.selected) { // do not select background tiles or the same tile, unless it is special tile already
        if (tile.type === TileType.special && tile === this.selected && (powerupjs.Mouse.containsMousePress(tile.boundingBox) || powerupjs.Touch.containsTouchPress(tile.boundingBox))) {
            //the contain toucha nd mouse press are to prevent activation on click/touch and hold
            this.chainsLeft += 1;
            tile.activate();
        }
        return;
    }
    var selectBorder = this.root.find(ID.select_border);
    this.deselect();
    this.selected = tile;
    this.selected.ID = ID.selected_tile;
    //console.log(this.selected);
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

//look at straightHorizontalMatches and straightVerticalMatches array, compare each match's involved tiles. 
//if two different matches share a tile, those matches intersect
//send approprite info to intersectingMatches array (horizontal first)
//delete the intersecting matches from the straightMatches array
TileField.prototype.findVoidBombs = function() { //{columnHor, rowHor, lengthHor, columnVer, rowVer, lengthVer}
    if ((this.straightHorizontalMatches.length > 0 && this.straightVerticalMatches.length > 0) || (this.longMatches.length > 0 && (this.straightHorizontalMatches.length > 0 || this.straightVerticalMatches.length > 0))) {
        var currHorizontalMatch = null;
        var currVerticalMatch = null;
        var currHorizontalTile = null;
        var currVerticalTile = null;
        for (let i = 0, l = this.straightHorizontalMatches.length; i < l; i++) { //look through all horizontal matches
            currHorizontalMatch = this.straightHorizontalMatches[i];
            for (let j = 0, z = this.straightVerticalMatches.length; j < z; j++) { //look through all vertical matches
                if (currHorizontalMatch == 'undefined') {
                    continue;
                }
                currVerticalMatch = this.straightVerticalMatches[j];
                for (let k = 0, m = currHorizontalMatch.length || 3; k < m; k++) { //look at each tile in the current horizontal match
                    if (currVerticalTile == 'undefined' || currVerticalMatch == 'undefined') {
                        continue;
                    }
                    currHorizontalTile = this.at(currHorizontalMatch.column + k, currHorizontalMatch.row);
                    for (let t = 0, v = currVerticalMatch.length || 3; t < v; t++) { //look at each tile in the current vertical match
                        currVerticalTile = this.at(currVerticalMatch.column, currVerticalMatch.row + t);
                        if (currHorizontalTile === currVerticalTile) { //compare each tile, if they are the same then it is an intersection
                            this.intersectingMatches.push({ //add intersection to the intersecting matches array
                                columnHor: currHorizontalMatch.column,
                                rowHor: currHorizontalMatch.row,
                                lengthHor: currHorizontalMatch.length,
                                columnVert: currVerticalMatch.column,
                                rowVert: currVerticalMatch.row,
                                lengthVert: currVerticalMatch.length,
                                intersection: { col: currHorizontalTile.xCoordinate, row: currHorizontalTile.yCoordinate }
                            });
                            this.straightHorizontalMatches.splice(i, 1); //remove the horizontal and vertical matches that intersect from their original arrays
                            this.straightVerticalMatches.splice(j, 1);
                        }
                    }
                }
            }
        }
        //to get the bomb to appear rather than the line IF a shape that creates both is made
        for (let i = 0, l = this.longMatches.length; i < l; i++) { //look through long matches array
            if (this.longMatches[i].horizontal === true) { //if the long match is horizontal, look at vertical matches
                currHorizontalMatch = this.longMatches[i];
                for (let j = 0, z = this.straightVerticalMatches.length; j < z; j++) { //looking at vertical matches
                    currVerticalMatch = this.straightVerticalMatches[j];
                    for (let k = 0, m = currHorizontalMatch.length || 4; k < m; k++) { //look thorugh each tile of the horizontal match
                        if (currVerticalTile == 'undefined' || currVerticalMatch == 'undefined') {
                            continue;
                        }
                        currHorizontalTile = this.at(currHorizontalMatch.column + k, currHorizontalMatch.row);
                        for (let t = 0, v = currVerticalMatch.length || 4; t < v; t++) { //look at each tile in vertical match
                            currVerticalTile = this.at(currVerticalMatch.column, currVerticalMatch.row + t);
                            if (currHorizontalTile === currVerticalTile) { // compare the tiles that are being looked at
                                this.intersectingMatches.push({ //add intersection to the intersecting matches array
                                    columnHor: currHorizontalMatch.column,
                                    rowHor: currHorizontalMatch.row,
                                    lengthHor: currHorizontalMatch.length,
                                    columnVert: currVerticalMatch.column,
                                    rowVert: currVerticalMatch.row,
                                    lengthVert: currVerticalMatch.length,
                                    intersection: { col: currHorizontalTile.xCoordinate, row: currHorizontalTile.yCoordinate }
                                });
                                this.longMatches.splice(i, 1);
                                this.straightVerticalMatches.splice(j, 1);
                            }
                        }
                    }
                }
            } else { //if the longMatch is vertical look at horizontal matches
                currVerticalMatch = this.longMatches[i];
                for (let j = 0, z = this.straightHorizontalMatches.length; j < z; j++) { //looking at vertical matches
                    currHorizontalMatch = this.straightHorizontalMatches[j];
                    for (let k = 0, m = currHorizontalMatch.length || 4; k < m; k++) { //look thorugh each tile of the horizontal match
                        if (currVerticalTile == 'undefined') {
                            continue;
                        }
                        currHorizontalTile = this.at(currHorizontalMatch.column + k, currHorizontalMatch.row);
                        for (let t = 0, v = currVerticalMatch.length || 4; t < v; t++) { //look at each tile in vertical match
                            currVerticalTile = this.at(currVerticalMatch.column, currVerticalMatch.row + t);
                            if (currHorizontalTile === currVerticalTile) { // compare the tiles that are being looked at
                                this.intersectingMatches.push({ //add intersection to the intersecting matches array
                                    columnHor: currHorizontalMatch.column,
                                    rowHor: currHorizontalMatch.row,
                                    lengthHor: currHorizontalMatch.length,
                                    columnVert: currVerticalMatch.column,
                                    rowVert: currVerticalMatch.row,
                                    lengthVert: currVerticalMatch.length,
                                    intersection: { col: currHorizontalTile.xCoordinate, row: currHorizontalTile.yCoordinate }
                                });
                                this.longMatches.splice(i, 1);
                                this.straightHorizontalMatches.splice(j, 1);
                            }
                        }
                    }
                }
            }
        }
    }
};

//looks at rows top to bottom , left to right. records first one of match and length and stores it
//if the tilefield is special also finds the long and extra long matches
TileField.prototype.findHorizontalMatches = function(initializing) {
    var initializing = typeof initializing != 'undefined' ? initializing : false;
    for (let i = 0, r = this.rows; i < r; i++) {
        //start with a single tile
        var matchlength = 1;
        for (let j = 0, c = this.columns; j < c; j++) {
            //console.log("horizontal: " + this.at(j, i).type);
            let checkMatch = false;
            //check if the next tile is a background tile
            if (j === (c - 1) || this.at(j, i).type !== TileType.basic) {
                //last tile or last tile before a background/special anyways
                checkMatch = true;
            } else {
                //check the type and basicID of next tile to see if it is in the match
                if (this.at(j, i).basicTileID === this.at(j + 1, i).basicTileID) {
                    matchlength += 1;
                } else {
                    //different type of tile
                    checkMatch = true;
                }
            }
            //if there was a match add it to the arary of matches starting with the first to the left and the matchlength and horizontal
            if (checkMatch) {
                if (matchlength >= 3) {
                    if (!initializing && this.special) {
                        var insertionPoint = { insertCol: null, insertRow: null, set: false };
                        if (matchlength >= 4) {
                            for (let k = 0; k <= matchlength - 1; k++) { //find where to insert sepcial tile
                                if (this.at(j + 1 - k, i) === this.selected || this.at(j + 1 - k, i) === this.prevSelected) {
                                    insertionPoint.insertCol = (j + 1 - k);
                                    insertionPoint.insertRow = i;
                                    insertionPoint.set = true;
                                } else if (!insertionPoint.set) {
                                    insertionPoint.insertCol = (j + 1 - matchlength);
                                    insertionPoint.insertRow = i;
                                }
                            }
                        }
                        if (matchlength === 4) {
                            this.longMatches.push({ column: j + 1 - matchlength, row: i, length: matchlength, horizontal: true, insertionPoint: insertionPoint });
                        } else if (matchlength >= 5) {
                            this.extraLongMatches.push({ column: j + 1 - matchlength, row: i, length: matchlength, horizontal: true, insertionPoint: insertionPoint });
                        } else {
                            this.straightHorizontalMatches.push({ column: j + 1 - matchlength, row: i, length: matchlength, horizontal: true });
                        }
                    } else {
                        this.straightHorizontalMatches.push({ column: j + 1 - matchlength, row: i, length: matchlength, horizontal: true });
                    }
                }
                matchlength = 1;
            }
        }
    }
};
//looks at columns top to bottom, and left to right. then stores the first of the match and the length into array
TileField.prototype.findVerticalMatches = function(initializing) {
    var initializing = typeof initializing != 'undefined' ? initializing : false;
    for (let i = 0, c = this.columns; i <= c - 1; i++) {
        //start with a single tile
        var matchlength = 1;
        for (let j = 0, r = this.rows; j <= r - 1; j++) {
            //console.log("vertical: " + this.at(i, j).type);
            let checkMatch = false;
            //check if the next tile is a background tile
            if (j == (r - 1) || this.at(i, j).type !== TileType.basic) {
                //last tile or last tile before a background/special anyways
                checkMatch = true;
            } else {
                //check the type and basicID of next tile to see if it is in the match
                if (this.at(i, j).basicTileID === this.at(i, j + 1).basicTileID) {
                    matchlength += 1;
                } else {
                    //different type of tile
                    checkMatch = true;
                }
            }
            //if there was a match add it to the arary of matches starting with the first to the left and the matchlength and horizontal
            if (checkMatch) {
                if (matchlength >= 3) {
                    if (!initializing && this.special) {
                        var insertionPoint = { insertCol: null, insertRow: null, set: false };
                        if (matchlength >= 4) {
                            for (let k = 0; k <= matchlength - 1; k++) { //find where t o insert sepcial tile
                                if ((this.at(i, j + 1 - k) === this.selected && this.selected !== null) || this.at(i, j + 1 - k) === this.prevSelected) {
                                    insertionPoint.insertCol = i;
                                    insertionPoint.insertRow = (j + 1 - k);
                                    break;
                                } else if (!insertionPoint.set) {
                                    insertionPoint.insertCol = i;
                                    insertionPoint.insertRow = (j + 1 - matchlength);
                                }
                            }
                        }
                        if (matchlength === 4) {
                            this.longMatches.push({ column: i, row: j + 1 - matchlength, length: matchlength, horizontal: false, insertionPoint: insertionPoint });
                        } else if (matchlength >= 5) {
                            this.extraLongMatches.push({ column: i, row: j + 1 - matchlength, length: matchlength, horizontal: false, insertionPoint: insertionPoint });
                        } else {
                            this.straightVerticalMatches.push({ column: i, row: j + 1 - matchlength, length: matchlength, horizontal: false });
                        }
                    } else {
                        this.straightVerticalMatches.push({ column: i, row: j + 1 - matchlength, length: matchlength, horizontal: false });
                    }
                }
                matchlength = 1;
            }
        }
    }
};
TileField.prototype.findHorizontalMoves = function(initializing) {
    var initializing = typeof initializing != 'undefined' ? initializing : false;
    for (let i = 0, r = this.rows; i < r; i++) {
        for (let j = this.columns; j >= 0; j--) {
            //swap, find clusters then swap back
            this.swap(j, i, j + 1, i);
            this.findMatches(initializing);
            this.swap(j, i, j + 1, i);
            if (this.straightHorizontalMatches.length > 0) {
                this.moves.push({ column1: j, row1: i, column2: j + 1, row2: i });
            }
        }
    }
};
TileField.prototype.findVerticalMoves = function(initializing) {
    var initializing = typeof initializing != 'undefined' ? initializing : false;
    for (let i = 0, r = this.columns; i < r; i++) {
        for (let j = this.rows; j >= 0; j--) {
            //swap, find clusters then swap back
            this.swap(j, i, j, i + 1);
            this.findMatches(initializing);
            this.swap(j, i, j, i + 1);
            if (this.straightVerticalMatches.length > 0) {
                this.moves.push({ column1: i, row1: j, column2: i, row2: j + 1 });
            }
        }
    }
};

//mixing special tile activations
//figure out which one was the selected one the activation should happen at the destination of the not selected one
//Figure out what the mix type is by looking at the special IDs, then call the appropriate method
TileField.prototype.findMixType = function(tile1, tile2) {
    var activatedLoc = undefined; //will have the tile that was moved assigned to it, to know where the start of activation will be
    var nonActivatedLoc = undefined; //these will keep them straight when calling for the activation functions
    var special1 = tile1.specialTileID; //options are 1=multitarget, 2=vertical zap, 3 = horizontal zap, 5 = void bomb 
    var special2 = tile2.specialTileID;
    if (tile1.ID === ID.selected_tile) {
        activatedLoc = tile2;
        nonActivatedLoc = tile1;
    } else { //may need else if here
        activatedLoc = tile1;
        nonActivatedLoc = tile2;
    }
    activatedLoc.type = TileType.basic; //so they don't activate when doubly
    nonActivatedLoc.type = TileType.basic;
    //find and activate appropriate activation type
    if (special1 === 1 && special2 === 1) { //multitarget and multitarget
        //call for the board wipe
        this.multiMultiActivation(activatedLoc, nonActivatedLoc);
    } else if ((special1 === 2 || special1 === 3) && (special2 === 2 || special2 === 3)) { //any zap mixed with any zap
        //activate horizonta l and vertical at activationLoc
        this.zapZapActivation(activatedLoc);
    } else if (special1 === 5 && special2 === 5) { //VoidBomb and VoidBomb
        //large explosion centered at activationLoc
        this.voidVoidActivation(activatedLoc);
    } else if ((special1 === 1 || special1 === 2 || special1 === 3) && (special2 === 1 || special2 === 2 || special2 === 3)) { //this is only multi mixed with a zap
        //turn all of a random color into a random direction zap
        this.multiZapActivation(activatedLoc, nonActivatedLoc);
    } else if ((special1 === 1 || special1 === 5) && (special2 === 1 || special2 === 5)) { //bomba nd multi
        //turn all of a random color into void bombs
        this.multiVoidActivation(activatedLoc, nonActivatedLoc);
    } else if ((special1 === 2 || special1 === 3 || special1 === 5) && (special2 === 2 || special2 === 3 || special2 === 5)) { //zap and voidbomb
        //centered at point of activation do 3 verticals and 3 horizontals destroyed 
        this.voidZapActivation(activatedLoc);
    }
};

//this destroyes all basic tiles, activates all special tiles and deals one damge to all non moveable tiles. 
//activates from one spot (eventually) and will have animation with it eventually
TileField.prototype.multiMultiActivation = function(source, nonsource) {
    var maxTimer = 0; //use to shiftTiles
    this.chainsLeft += 1;
    //cylcle through tiles and do appropriate thing
    for (let i = 0, r = this.rows; i < r; i++) {
        for (let j = 0, c = this.columns; j < c; j++) {
            let effected = this.at(i, j);
            let typeOfTile = effected.type;
            //set up a timer for destruction radially from source
            let distanceFromSource = Math.sqrt(Math.pow(effected.xCoordinate - source.xCoordinate, 2) + Math.pow(effected.yCoordinate - source.yCoordinate, 2));
            let damageTimer = distanceFromSource * 60; // dependant on distanceFromSource in ms
            if (damageTimer > maxTimer) {
                maxTimer = damageTimer;
                console.log(maxTimer);
            }
            //end of timer set up test
            if (typeOfTile === TileType.basic) {
                setTimeout(function(effected) {
                    effected.deleteTile();
                }, damageTimer, effected);
            } else if (typeOfTile === TileType.special) {
                this.chainsLeft += 1; //apply before timer
                setTimeout(function(effected) {
                    effected.activate();
                }, damageTimer, effected);
            } //else if the effected is damageable/unmoveable, whatever it gets damaged
        }
    }
    setTimeout(function(tiles) {
        tiles.chainsLeft -= 1;
        if (tiles.chainsLeft === 0) {
            tiles.shiftTiles();
        }
    }, maxTimer, this);
};
//multitarget and zap mixed - get random color, convert all of that color into a random direction zap, activate the zaps
//need to add animation
TileField.prototype.multiZapActivation = function(source, nonsource) {
    this.chainsLeft += 1;
    //get random color and targets
    var targetID = Math.floor(Math.random() * 6)
    var targets = this.getMultiTargets(targetID);
    //go through targets and convert to bombs
    for (let i = 0, l = targets.length - 1; i < l; i++) {
        this.chainsLeft += 1;
        let timer = Math.random() * 1000;
        let direction = Math.floor(Math.random() * 2); //returns a 0 or 1; 0 is vertical, 1 is horizontal
        let x = targets[i].xCoordinate,
            y = targets[i].yCoordinate;
        setTimeout(function(tiles, x, y, direction) {
            tiles.at(x, y).deleteTile(true);
            if (direction === 0) {
                tiles.addAt(new VerticalLazer(), x, y);
            } else {
                tiles.addAt(new HorizontalLazer(), x, y);
            }
            tiles.at(x, y).activate();
        }, timer, this, x, y, direction); //timer should be variable
    }
    //delete the mixed ones
    setTimeout(function(tiles, source, nonsource) {
        tiles.chainsLeft -= 1;
        source.deleteTile();
        nonsource.deleteTile();
        if (tiles.chainsLeft === 0) {
            tiles.shiftTiles();
        }
    }, 500, this, source, nonsource);
};
//multitarget and void omb mixed - get random color, convert all of that color into a void bomb, activate the void bombs
//need to add animation
TileField.prototype.multiVoidActivation = function(source, nonsource) {
    this.chainsLeft += 1;
    //get random color and targets
    var targetID = Math.floor(Math.random() * 6)
    var targets = this.getMultiTargets(targetID);
    //go through targets and convert to bombs
    for (let i = 0, l = targets.length - 1; i < l; i++) {
        this.chainsLeft += 1;
        let timer = Math.random() * 1000;
        let x = targets[i].xCoordinate,
            y = targets[i].yCoordinate;

        setTimeout(function(tiles, x, y) {
            tiles.at(x, y).deleteTile(true);
            tiles.addAt(new VoidBomb(), x, y);
            tiles.at(x, y).activate();
        }, timer, this, x, y); //timer should be variable
    }
    //delete the mixed ones
    setTimeout(function(tiles, source, nonsource) {
        tiles.chainsLeft -= 1;
        source.deleteTile();
        nonsource.deleteTile();
        if (tiles.chainsLeft === 0) {
            tiles.shiftTiles();
        }
    }, 500, this, source, nonsource);
};
//when 2 zaps are mixed
TileField.prototype.zapZapActivation = function(source) {
    //this lacks animation because they were converted to basictiles before call. animation overlay should be added to activation anyways
    let x = source.xCoordinate;
    let y = source.yCoordinate;
    this.chainsLeft += 2;
    this.activeHorZap(x, y);
    this.activeVerticalZap(x, y);
};
//when a zap and a void are mixed
TileField.prototype.voidZapActivation = function(source) {
    let x = source.xCoordinate;
    let y = source.yCoordinate;
    var leftGood = false,
        rightGood = false,
        upGood = false,
        downGood = false;
    this.chainsLeft += 2; //one for the column and one for row of source, because we knowthey exist
    //check for adjacent rows and columns and add chains depending
    if (x > 0) {
        leftGood = true;
        this.chainsLeft += 1;
    }
    if (x < this.rows - 1) {
        rightGood = true;
        this.chainsLeft += 1;
    }
    if (y > 0) {
        upGood = true;
        this.chainsLeft += 1;
    }
    if (y < this.columns - 1) {
        downGood = true;
        this.chainsLeft += 1;
    }
    //now activate zaps based on directions being good, do horizontal first then dlay vertical slightly
    this.activeHorZap(x, y);
    if (upGood) {
        this.activeHorZap(x, y - 1);
    }
    if (downGood) {
        this.activeHorZap(x, y + 1);
    }
    setTimeout(function(tiles, x, y, leftGood, rightGood) {
        tiles.activeVerticalZap(x, y);
        if (leftGood) {
            tiles.activeVerticalZap(x - 1, y);
        }
        if (rightGood) {
            tiles.activeVerticalZap(x + 1, y);
        }
    }, 120, this, x, y, leftGood, rightGood);
};
//when two bombs are mixed, they should clear a 5x5 square around the source by sucking them in - going to be LONG function
TileField.prototype.voidVoidActivation = function(source) {
    this.chainsLeft += 1;
    let x = source.xCoordinate,
        y = source.yCoordinate;
    var straightShiftTime = ((this.cellHeight / this.at(x, y).tileSpeed) * 1000) - 60;
    var diagonalShiftTime = straightShiftTime + 60;
    //inner ring
    if (this.checkTile(x + 1, y)) {
        let effected = this.at(x + 1, y);
        this.suckTile(effected, straightShiftTime, true, false, false, false);
    }
    if (this.checkTile(x - 1, y)) {
        let effected = this.at(x - 1, y);
        this.suckTile(effected, straightShiftTime, false, true, false, false);
    }
    if (this.checkTile(x, y - 1)) {
        let effected = this.at(x, y - 1);
        this.suckTile(effected, straightShiftTime, false, false, false, true);
    }
    if (this.checkTile(x, y + 1)) {
        let effected = this.at(x, y + 1);
        this.suckTile(effected, straightShiftTime, false, false, true, false);
    }
    if (this.checkTile(x + 1, y - 1)) {
        let effected = this.at(x + 1, y - 1);
        this.suckTile(effected, diagonalShiftTime, true, false, false, true);
    }
    if (this.checkTile(x - 1, y - 1)) {
        let effected = this.at(x - 1, y - 1);
        this.suckTile(effected, diagonalShiftTime, false, true, false, true);
    }
    if (this.checkTile(x + 1, y + 1)) {
        let effected = this.at(x + 1, y + 1);
        this.suckTile(effected, diagonalShiftTime, true, false, true, false);
    }
    if (this.checkTile(x - 1, y + 1)) {
        let effected = this.at(x - 1, y + 1);
        this.suckTile(effected, diagonalShiftTime, false, true, true, false);
    }
    //outer ring
    if (this.checkTile(x + 2, y)) {
        let effected = this.at(x + 2, y);
        this.suckTile(effected, straightShiftTime * 2, true, false, false, false);
    }
    if (this.checkTile(x - 2, y)) {
        let effected = this.at(x - 2, y);
        this.suckTile(effected, straightShiftTime * 2, false, true, false, false);
    }
    if (this.checkTile(x, y - 2)) {
        let effected = this.at(x, y - 2);
        this.suckTile(effected, straightShiftTime * 2, false, false, false, true);
    }
    if (this.checkTile(x, y + 2)) {
        let effected = this.at(x, y + 2);
        this.suckTile(effected, straightShiftTime * 2, false, false, true, false);
    }
    if (this.checkTile(x + 2, y - 2)) {
        let effected = this.at(x + 2, y - 2);
        this.suckTile(effected, diagonalShiftTime * 2, true, false, false, true);
    }
    if (this.checkTile(x - 2, y - 2)) {
        let effected = this.at(x - 2, y - 2);
        this.suckTile(effected, diagonalShiftTime * 2, false, true, false, true);
    }
    if (this.checkTile(x + 2, y + 2)) {
        let effected = this.at(x + 2, y + 2);
        this.suckTile(effected, diagonalShiftTime * 2, true, false, true, false);
    }
    if (this.checkTile(x - 2, y + 2)) {
        let effected = this.at(x - 2, y + 2);
        this.suckTile(effected, diagonalShiftTime * 2, false, true, true, false);
    }
    //oddballs
    if (this.checkTile(x - 1, y - 2)) {
        let effected = this.at(x - 1, y - 2);
        this.suckTile(effected, diagonalShiftTime * 1.6, false, true, false, true);
    }
    if (this.checkTile(x + 1, y - 2)) {
        let effected = this.at(x + 1, y - 2);
        this.suckTile(effected, diagonalShiftTime * 1.6, true, false, false, true);
    }
    if (this.checkTile(x + 2, y - 1)) {
        let effected = this.at(x + 2, y - 1);
        this.suckTile(effected, diagonalShiftTime * 1.6, true, false, false, true);
    }
    if (this.checkTile(x + 2, y + 1)) {
        let effected = this.at(x + 2, y + 1);
        this.suckTile(effected, diagonalShiftTime * 1.6, true, false, true, false);
    }
    if (this.checkTile(x + 1, y + 2)) {
        let effected = this.at(x + 1, y + 2);
        this.suckTile(effected, diagonalShiftTime * 1.6, true, false, true, false);
    }
    if (this.checkTile(x - 1, y + 2)) {
        let effected = this.at(x - 1, y + 2);
        this.suckTile(effected, diagonalShiftTime * 1.6, false, true, true, false);
    }
    if (this.checkTile(x - 2, y + 1)) {
        let effected = this.at(x - 2, y + 1);
        this.suckTile(effected, diagonalShiftTime * 1.6, false, true, true, false);
    }
    if (this.checkTile(x - 2, y - 1)) {
        let effected = this.at(x - 2, y - 1);
        this.suckTile(effected, diagonalShiftTime * 1.6, false, true, false, true);
    }

    setTimeout(function(tiles, x, y) {
        tiles.at(x, y).deleteTile();
        tiles.chainsLeft -= 1;
        console.log(tiles.chainsLeft);
        if (tiles.chainsLeft === 0) {
            tiles.shiftTiles();
        }
    }, 425, this, x, y);
};
//individual activations

//if the tile types around void bomb are moveable and not background are in the grid they will be sucked in
//if it is not moveable then it will deal damage to it (ie remove rust, ink, whatever)
TileField.prototype.activeVoidBomb = function(x, y) {
    var straightShiftTime = ((this.cellHeight / this.at(x, y).tileSpeed) * 1000) - 60;
    var diagonalShiftTime = straightShiftTime + 60;

    if (this.checkTile(x + 1, y)) {
        let effected = this.at(x + 1, y);
        this.suckTile(effected, straightShiftTime, true, false, false, false);
    }
    if (this.checkTile(x - 1, y)) {
        let effected = this.at(x - 1, y);
        this.suckTile(effected, straightShiftTime, false, true, false, false);
    }
    if (this.checkTile(x, y - 1)) {
        let effected = this.at(x, y - 1);
        this.suckTile(effected, straightShiftTime, false, false, false, true);
    }
    if (this.checkTile(x, y + 1)) {
        let effected = this.at(x, y + 1);
        this.suckTile(effected, straightShiftTime, false, false, true, false);
    }
    if (this.checkTile(x + 1, y - 1)) {
        let effected = this.at(x + 1, y - 1);
        this.suckTile(effected, diagonalShiftTime, true, false, false, true);
    }
    if (this.checkTile(x - 1, y - 1)) {
        let effected = this.at(x - 1, y - 1);
        this.suckTile(effected, diagonalShiftTime, false, true, false, true);
    }
    if (this.checkTile(x + 1, y + 1)) {
        let effected = this.at(x + 1, y + 1);
        this.suckTile(effected, diagonalShiftTime, true, false, true, false);
    }
    if (this.checkTile(x - 1, y + 1)) {
        let effected = this.at(x - 1, y + 1);
        this.suckTile(effected, diagonalShiftTime, false, true, true, false);
    }
    setTimeout(function(tiles, x, y) {
        tiles.at(x, y).deleteTile();
        tiles.chainsLeft -= 1;
        if (tiles.chainsLeft === 0) {
            tiles.shiftTiles();
        }
    }, 425, this, x, y);
};

//zaps should have aniumation overlay added here rather than in the actual hor and verticalzap classes
TileField.prototype.activeVerticalZap = function(x, y) {
    //deleting the proper tiles other than the zap tile
    setTimeout(function(tiles, x, y) {
        for (let i = tiles.columns - 1, j = 0; i > y || j < y; i--, j++) {
            if (i > y) {
                let effected = tiles.at(x, i);
                if (effected.type === TileType.basic) { //handle special tiles
                    effected.deleteTile();
                } else if (effected.type === TileType.special) {
                    effected.parent.chainsLeft += 1;
                    effected.activate();
                } else {
                    //unmoveable/tricky tiles
                }
            }
            if (j < y) {
                let effected = tiles.at(x, j);
                if (effected.type === TileType.basic) { //handle special tiles
                    effected.deleteTile();
                } else if (effected.type === TileType.special) {
                    effected.parent.chainsLeft += 1;
                    effected.activate();
                } else {
                    //unmoveable/tricky tiles
                }
            }
        }
        //deleting the zap tile and shifting tiles
        setTimeout(function(tiles, x, y) {
            tiles.at(x, y).deleteTile();
            tiles.chainsLeft -= 1;
            if (tiles.chainsLeft == 0) {
                tiles.shiftTiles();
            }
        }, 40, tiles, x, y);
    }, 335, this, x, y);

};

TileField.prototype.activeHorZap = function(x, y) {
    //deleting the proper tiles other than the zap tile
    setTimeout(function(tiles, x, y) {
        for (let i = tiles.rows - 1, j = 0; i > x || j < x; i--, j++) {
            if (i > x) { //also mush handle special tiles and tricky tiles differently
                let effected = tiles.at(i, y)
                if (effected.type === TileType.basic) { //handle special tiles
                    effected.deleteTile();
                } else if (effected.type === TileType.special) {
                    effected.parent.chainsLeft += 1;
                    effected.activate();
                } else {
                    //unmoveable/tricky tiles
                }
            }
            if (j < x) { //also mush handle special tiles and tricky tiles differently
                let effected = tiles.at(j, y)
                if (effected.type === TileType.basic) { //handle special tiles
                    effected.deleteTile();
                } else if (effected.type === TileType.special) {
                    effected.parent.chainsLeft += 1;
                    effected.activate();
                } else {
                    //unmoveable/tricky tiles
                }
            }
        }
        //deleting the zap tile and shifting tiles
        setTimeout(function(tiles, x, y) {
            tiles.at(x, y).deleteTile();
            tiles.chainsLeft -= 1;
            if (tiles.chainsLeft === 0) {
                tiles.shiftTiles();
            }
        }, 40, tiles, x, y);
    }, 300, this, x, y);
};

//will always be passed basicType from MultiTarget activate method
TileField.prototype.getMultiTargets = function(basicType) {
    console.log("getting targets");
    var targets = [];
    for (let i = this.rows - 1; i >= 0; i--) {
        for (let j = this.columns - 1; j >= 0; j--) {
            if (this.at(i, j).type === TileType.basic && this.at(i, j).basicTileID === basicType) {
                targets.push(this.at(i, j));
            }
        }
    }
    return targets;
};

//return bool: if the checked tile is in grid and not empty or background return true
TileField.prototype.checkTile = function(x, y) {
    return this.at(x, y) !== null && (y >= 0 && this.at(x, y).type !== TileType.background && this.at(x, y).type !== TileType.empty) && this.at(x, y).yCoordinate === y;
};

TileField.prototype.suckTile = function(effected, timer, left, right, up, down) {
    if (effected.type === TileType.basic) {
        setTimeout(function(tile) {
            tile.shiftingUp = up;
            tile.shiftingLeft = left;
            tile.shiftingDown = down;
            tile.shiftingRight = right;
            setTimeout(function(tile) {
                tile.deleteTile();
            }, timer, tile); //timer based on tilespeed and size of grid
        }, 140, effected); //timer based on animation speed of void bomb
    } else if (effected.type === TileType.special) {
        effected.parent.chainsLeft += 1;
        setTimeout(function(tile) {
            tile.activate();
        }, 200, effected); //timer based on animation speed of void bomb
    } else {
        //damage the tile or activate specialtile
    }
};

/* All things homing rocket - starting to think there shouldnt be one
 //however keep some of these funtions around as the homing rocket may be used as  apowerup for objective levels - so acquiring targets and such is still useful

//look for matches that have a square shape instead of straight line
TileField.prototype.findHomingRockets = function() {
    var insertionPoint = { x: null, y: null };
    for (let i = 0, c = this.columns - 1; i < c; i++) {
        for (let j = 0, r = this.rows - 1; j < r; j++) {
            if (this.at(i, j).basicTileID === this.at(i + 1, j).basicTileID &&
                this.at(i, j).basicTileID === this.at(i + 1, j + 1).basicTileID &&
                this.at(i, j).basicTileID === this.at(i, j + 1).basicTileID) {
                //check to see if one is selected and store it for insertion of homing rocket, add it to array and in loopMatches insert it
                if (this.at(i, j) == this.selected || this.at(i, j) == this.prevSelected) {
                    insertionPoint.x = i;
                    insertionPoint.y = j;
                } else if (this.at(i + 1, j) == this.selected || this.at(i + 1, j) == this.prevSelected) {
                    insertionPoint.x = i + 1;
                    insertionPoint.y = j;
                } else if (this.at(i + 1, j + 1) == this.selected || this.at(i + 1, j + 1) == this.prevSelected) {
                    insertionPoint.x = i + 1;
                    insertionPoint.y = j + 1;
                } else if (this.at(i, j + 1) == this.selected || this.at(i, j + 1) == this.prevSelected) {
                    insertionPoint.x = i;
                    insertionPoint.y = j + 1;
                } else {
                    insertionPoint.x = i + 1;
                    insertionPoint.y = j + 1;
                }
                this.squareMatches.push({ col: i, row: j, insertionCol: insertionPoint.x, insertionRow: insertionPoint.y }); //starting coords, insertion coords
            }
        }
    }
};

//upon launch it will destroy those up, down, left and right of rocket (if they exist) 
//need 125 millisecond delay
//there is an issue if two rockets are active simultaleously
TileField.prototype.launchHomingRocket = function(x, y) {
    let goodAbove = this.checkAboveTile(x, y);
    let goodRight = this.checkRightTile(x, y);
    let goodBelow = this.checkBelowTile(x, y);
    let goodLeft = this.checkLeftTile(x, y);
    if (goodRight) {
        let effected = this.at(x + 1, y);
        if (effected.type === TileType.basic) {
            setTimeout(function(tile) {
                tile.deleteTile();
            }, 125, effected); //timer (will be) based on animation of rockets starting
        } else if (effected.type === TileType.special) {
            setTimeout(function(tile) {
                tile.parent.chainsLeft += 1;
                tile.activate();
            }, 500, effected);
        } else {
            //damage the tile
        }
    }
    if (goodAbove) {
        let effected = this.at(x, y - 1);
        if (effected.type === TileType.basic) {
            setTimeout(function(tile) {
                tile.deleteTile();
            }, 125, effected); //timer (will be) based on animation of rockets starting
        } else if (effected.type === TileType.special) {
            setTimeout(function(tile) {
                tile.parent.chainsLeft += 1;
                tile.activate();
            }, 500, effected);
        } else {
            //damage the tile or activate specialtile
        }
    }
    if (goodLeft) {
        let effected = this.at(x - 1, y);
        if (effected.type === TileType.basic) {
            setTimeout(function(tile) {
                tile.deleteTile(); //timer based on tilespeed and size of grid
            }, 125, effected); //timer based on animation speed of void bomb
        } else if (effected.type === TileType.special) {
            setTimeout(function(tile) {
                tile.parent.chainsLeft += 1;
                tile.activate();
            }, 500, effected); //timer based on animation speed of void bomb
        } else {
            //damage the tile or activate specialtile
        }
    }
    if (goodBelow) {
        let effected = this.at(x, y + 1);
        if (effected.type === TileType.basic) {
            setTimeout(function(tile) {
                tile.deleteTile(); //timer based on tilespeed and size of grid
            }, 125, effected); //timer based on animation speed of void bomb
        } else if (effected.type === TileType.special) {
            setTimeout(function(tile) {
                tile.parent.chainsLeft += 1;
                tile.activate();
            }, 500, effected); //timer based on animation speed of void bomb
        } else {
            //damage the tile or activate specialtile
        }
    }
};

//Do the special tiles activations effects on the board here
TileField.prototype.activeHomingRocket = function(x, y, timer) {
    setTimeout(function(tiles, x, y) {
        tiles.chainsLeft -= 1;
        tiles.at(x, y).explode(); //may need to handkle shift tiles in the update of rHomingRocket.js 
        let target = tiles.at(x, y).target;
        if (target.type === TileType.basic) {
            tiles.at(x, y).target.deleteTile();
        } else if (target.type === TileType.special) {
            tiles.chainsLeft += 1;
            tiles.at(x, y).target.activate();
        } //else damageable *********************
        tiles.at(x, y).deleteTile();
        if (tiles.chainsLeft === 0) {
            tiles.shiftTiles();
        }
    }, timer + 50, this, x, y);
};

//returns a tile that fits target criteria of an objective tile, if not that then a tricky tile, if not that a random tile of any kind 
//and the targetted animation overlay **NEEDS IMPLEMENTED**
TileField.prototype.getRocketTarget = function() {
    console.log("assigning target");
    var potentialTargets = [];
    var objectiveData = this.parent.objectiveData; //undefined for now so no searching
    if (!objectiveData) {
        console.log('potentialTargets list expanded');
        for (let i = this.rows - 1; i >= 0; i--) {
            for (let j = this.columns - 1; j >= 0; j--) {
                potentialTargets.push(this.at(i, j));
            }
        }
    }
    var randomTargetIndex = Math.floor(Math.random() * potentialTargets.length);
    return potentialTargets[randomTargetIndex];
};*/