// JavaScript Document
"use strict";

//TileField will inhert from powerupjsGameObjectGrid and hold tiles in a grid determined by the parameters passed

function TileField(rows, columns, special, layer, id) {
    powerupjs.GameObjectGrid.call(this, rows, columns, layer, id);
    this.special = special;
    this.straightVerticalMatches = []; //{column, row, length, horizontal}
    this.straightHorizontalMatches = []; //{column, row, length, horizontal}
    this.squareMatches = []; //{column, row}
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

TileField.prototype.update = function(delta) {
    powerupjs.GameObjectGrid.prototype.update.call(this, delta);
};

TileField.prototype.getTileXCoordinate = function(tile) {
    return Math.floor(tile.position.x / this.cellWidth);
};

TileField.prototype.getTileYCoordinate = function(tile) {
    return Math.floor(tile.position.y / this.cellHeight);
};

//checks for clusters, adds them to an array and then removes the clusters and shifts cells until no clusters are left
TileField.prototype.resolveMatches = function() {
    this.findMatches();

    while (this.straightVerticalMatches.length > 0 ||
        this.straightHorizontalMatches.length > 0 ||
        this.squareMatches.length > 0 ||
        this.intersectingMatches.length > 0 ||
        this.longMatches.length > 0 ||
        this.extraLongMatches.length > 0) {
        this.removeMatches();
        this.shiftTiles();
        this.findMatches();
    }
};

TileField.prototype.findMatches = function() {
    //matches array should be empty upon start
    this.straightHorizontalMatches = [];
    this.straightVerticalMatches = [];
    this.longMatches = [];
    this.extraLongMatches = [];
    this.findHorizontalMatches();
    this.findVerticalMatches();
    if (this.special) { //finds long, extra long, T, L and Square matches and handles the insertion of the appropriate special tile
        this.intersectingMatches = [];
        this.squareMatches = [];
        this.findVoidBombs();
        this.findHomingRockets();
    }
};

//tries all avalable swaps the types of adjacent tiles to identify if there are moves
TileField.prototype.findMoves = function() {
    this.moves = []; //reset moves
    this.findHorizontalMoves();
    this.findVerticalMoves();
    //console.log("there are " + this.moves.length + " moves you can make");
    if (this.moves.length === 0) {
        console.log("no moves");
        //this.shuffle();
        //this.findMoves();
    }
    this.straightHorizontalMatches = [];
    this.straightVerticalMatches = [];
};

TileField.prototype.removeMatches = function() {
    this.loopMatches(); //looks at matches and deletes tiles

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
    //see what needs a shift
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

    var intervalShifter = undefined;
    var intervalClear = function() {
        return clearInterval(intervalShifter)
    }
    this.shifting = false;
    for (let i = this.columns - 1; i >= 0; i--) {
        for (let j = this.rows - 1; j >= 0; j--) { //loop bottom to top
            if (this.at(i, j).type === TileType.deleted) {
                //var t = new BasicTile(TileType.basic);
                //this.addAt(t, i, 0);
            } else {
                var shift = this.at(i, j).shift;
                if (shift > 0) { //swap tile to shift it
                    this.shifting = true;
                    //a set interval here may work if the remove matches is called at a different time and tiles are generated from top

                    var intervalTimer = this.at(i, j).tileSpeed / shift;
                    this.at(i, j).falling = true;
                    setTimeout(function(tiles, col, row) {
                        tiles.at(col, row).shift -= 1;
                        tiles.swap(col, row, col, row + 1);
                        if (tiles.at(col, row + 1).shift <= 0) {
                            tiles.at(col, row + 1).falling = false;
                            tiles.at(col, row + 1).shift = 0;
                        }
                    }, intervalTimer, this, i, j);
                    /*intervalShifter = setInterval(function(tiles, col, row) {
                        tiles.at(col, row).falling = true;
                        tiles.at(col, row).shift -= 1;
                        tiles.swap(col, row, col, row + 1);
                        if (tiles.at(col, row + 1).shift <= 0) {
                            console.log("should end");
                            tiles.at(col, row + 1).falling = false;
                            tiles.at(col, row + 1).shift = 0;
                        }
                    }, intervalTimer, this, i, j);*/
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
                tiles.squareMatches.length > 0 ||
                tiles.intersectingMatches.length > 0 ||
                tiles.longMatches.length > 0 ||
                tiles.extraLongMatches.length > 0) {
                tiles.loopMatches();
                tiles.shiftTiles();
            } else {
                return;
            }
        }
    }, intervalTimer + 1, this);

};

//handles deleting tiles in matches and inserting special tiles if applicable
TileField.prototype.loopMatches = function() {
    for (let i = this.squareMatches.length - 1; i >= 0; i--) {
        var square = this.squareMatches[i];
        this.at(square.col, square.row).deleteTile();
        this.at(square.col + 1, square.row).deleteTile();
        this.at(square.col + 1, square.row + 1).deleteTile();
        this.at(square.col, square.row + 1).deleteTile();
        var HR = new HomingRocket();
        this.addAt(HR, square.insertionCol, square.insertionRow);
    }

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

//swaps the tiles, stops taking input for touch or hold, then checks for matches and resolves, if no matches it swaps them back and makes the newly clicked one the selected tile
TileField.prototype.handleSwap = function(tile) {
    this.dragging = false;
    this.swapTiles(tile, this.selected); //this has a timer for animation purposes
};

//swaps the type of 2 tiles - used for finding moves
TileField.prototype.typeSwap = function(x1, y1, x2, y2) {
    if (this.at(x1, y1) == null || this.at(x2, y2) == null) {
        return;
    }
    var swap = this.at(x1, y1);
    var swap2 = this.at(x2, y2);
    this.addAt(swap2, x1, y1);
    this.addAt(swap, x2, y2);
};
//swapping with no animation - for loading of TileFields
TileField.prototype.swap = function(x1, y1, x2, y2) {
    if (this.at(x1, y1) == null || this.at(x2, y2) == null) {
        return;
    }
    var swap = this.at(x1, y1);
    var swap2 = this.at(x2, y2);
    this.addAt(swap2, x1, y1);
    this.addAt(swap, x2, y2);
};

//this swaps tile and has transition animation
TileField.prototype.swapTiles = function(tile1, tile2, swapBack) {
    var swapBack = typeof swapBack !== 'undefined' ? swapBack : false;
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
            tiles.squareMatches.length > 0 ||
            tiles.intersectingMatches.length > 0 ||
            tiles.longMatches.length > 0 ||
            tiles.extraLongMatches.length > 0) {
            tiles.resolveMatches();
            tiles.deselect();
            tiles.findMoves();
        } else if (!swapBack) {
            tiles.swapTiles(swap, swap2, true); //this has timer, however nothing has to wait on this timer to run its course as it is just switching back if no valid match
        }
    }, 250, (this)); //takes about a quarter sec (ish) for the tiles to take eachothers' places
};

TileField.prototype.selectTile = function(tile) {
    if (tile.type === TileType.background || tile === this.selected) { // do not select background tiles
        return;
    }
    var selectBorder = this.root.find(ID.select_border);
    this.deselect();
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

//look at straightHorizontalMatches and straightVerticalMatches array, compare each match's involved tiles. 
//if two different matches share a tile, those matches intersect
//send approprite info to intersectingMatches array (horizontal first)
//delete the intersecting matches from the straightMatches array
TileField.prototype.findVoidBombs = function() { //{columnHor, rowHor, lengthHor, columnVer, rowVer, lengthVer}
    var currHorizontalMatch = null;
    var currVerticalMatch = null;
    var currHorizontalTile = null;
    var currVerticalTile = null;
    if (this.straightHorizontalMatches.length > 0 && this.straightVerticalMatches.length > 0) {
        for (let i = 0, l = this.straightHorizontalMatches.length; i < l; i++) {
            currHorizontalMatch = this.straightHorizontalMatches[i];
            for (let j = 0, z = this.straightVerticalMatches.length; j < z; j++) {
                currVerticalMatch = this.straightVerticalMatches[j];
                for (let k = 0, m = currHorizontalMatch.length; k < m; k++) {
                    currHorizontalTile = this.at(currHorizontalMatch.column + k, currHorizontalMatch.row);
                    for (let t = 0, v = currVerticalMatch.length; t < v; t++) {
                        currVerticalTile = this.at(currVerticalMatch.column, currVerticalMatch.row + t);
                        if (currHorizontalTile === currVerticalTile) {
                            this.intersectingMatches.push({
                                columnHor: currHorizontalMatch.column,
                                rowHor: currHorizontalMatch.row,
                                lengthHor: currHorizontalMatch.length,
                                columnVert: currVerticalMatch.column,
                                rowVert: currVerticalMatch.row,
                                lengthVert: currVerticalMatch.length,
                                intersection: { col: currHorizontalTile.xCoordinate, row: currHorizontalTile.yCoordinate }
                            });
                            this.straightHorizontalMatches.splice(i, 1);
                            this.straightVerticalMatches.splice(j, 1);
                        }
                    }
                }
            }
        }
    }
};

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
//looks at rows top to bottom , left to right. records first one of match and length and stores it
//if the tilefield is special also finds the long and extra long matches
TileField.prototype.findHorizontalMatches = function() {
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
                    if (this.special) {
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
TileField.prototype.findVerticalMatches = function() {
    for (let i = 0, c = this.columns; i < c; i++) {
        //start with a single tile
        var matchlength = 1;
        for (let j = 0, r = this.rows; j < r; j++) {
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
                    if (this.special) {
                        var insertionPoint = { insertCol: null, insertRow: null, set: false };
                        if (matchlength >= 4) {
                            for (let k = 0; k <= matchlength - 1; k++) { //find where t o insert sepcial tile
                                if (this.at(i, j + 1 - k) === this.selected || this.at(i, j + 1 - k) === this.prevSelected) {
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

TileField.prototype.findHorizontalMoves = function() {
    for (let i = 0, r = this.rows; i < r; i++) {
        for (let j = this.columns; j >= 0; j--) {
            //swap, find clusters then swap back
            this.swap(j, i, j + 1, i);
            this.findMatches();
            this.typeSwap(j, i, j + 1, i);
            if (this.straightHorizontalMatches.length > 0) {
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
            if (this.straightVerticalMatches.length > 0) {
                this.moves.push({ column1: i, row1: j, column2: i, row2: j + 1 });
            }
        }
    }
};