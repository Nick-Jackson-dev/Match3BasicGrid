// JavaScript Document
"use strict";


var TileType = {
    background: 0,
    basic: 1,
    special: 2,
    empty: 3,
    deleted: 6
};

//Tile objects are initialized to normal 
//inherits from powerupjs.SpriteGameObject

function Tile(sprite, tileTp, layer, id) {
    powerupjs.SpriteGameObject.call(this, sprite, layer, id);
    this.type = tileTp;
    this._tileSpeed = 280; // pixels/sec
    this.shift = 0; //Not sure if this is needed
    this.falling = false;
    this.moveable = true; // if not movable it doesn't fall even with nothing under it and can't be switched - not implemented yet
    //these next ones control the appropriate velocities for animation - they are implemetned in the update method but not working correctly
    this.shiftingRight = false;
    this.shiftingLeft = false;
    this.shiftingUp = false;
    this.shiftingDown = false;
}

Tile.prototype = Object.create(powerupjs.SpriteGameObject.prototype);

Object.defineProperty(Tile.prototype, "tileSpeed", {
    get: function() {
        return this._tileSpeed;
    }
});

Object.defineProperty(Tile.prototype, "xCoordinate", {
    get: function() {
        return this.parent.getTileXCoordinate(this);
    }
});

Object.defineProperty(Tile.prototype, "yCoordinate", {
    get: function() {
        return this.parent.getTileYCoordinate(this);
    }
});

Tile.prototype.beStill = function() {
    this.position = this.parent.getAnchorPosition(this);
    this.falling = false;
    this.shiftingRight = false;
    this.shiftingLeft = false;
    this.shiftingUp = false;
    this.shiftingDown = false;
};

Tile.prototype.isSolid = function() {
    return this.type === TileType.basic || this.type === TileType.special || !this.moveable;
};

Tile.prototype.deleteTile = function() {
    this.type = TileType.deleted;
};

Tile.prototype.update = function(delta) {
    if (!this.moveable) { // no updating position if not movable
        return;
    } 
    if(this.velocity.y > this.tileSpeed) {
        this.velocity.y = this.tileSpeed;
    }
    powerupjs.SpriteGameObject.prototype.update.call(this, delta);
    if (this.shiftingLeft) {
        this.velocity.x = -this.tileSpeed;
        return;
    } else if (this.shiftingRight) {
        this.velocity.x = this.tileSpeed;
        return;
    } else if (this.shiftingUp) {
        this.velocity.y = -this.tileSpeed;
        return;
    } else if (this.shiftingDown) {
        this.velocity.y = this.tileSpeed;
        return;
    } 

     //need to find out when to stop the tile falling and then add that tile to the new coordinates on the grid so matches can be found
    if (this.collidesWith(this.nextTileDown()) && !this.nextTileDown().falling && this.falling) {
        this.falling = false;
        //need to add the tile to the grid at new position
        var newAnchor = this.findAppropriateAnchor();
    }
    if (this.falling) {
        this.velocity.y = this.tileSpeed;
    } else {
        this.velocity.y = 0;
        //this.beStill();
    }
};

Tile.prototype.draw = function() {
    if (this.type === TileType.background || this.type === TileType.deleted || this.type === TileType.empty)
        return;
    powerupjs.SpriteGameObject.prototype.draw.call(this);
};

Tile.prototype.nextTileDown = function() {
    var tiles = this.parent;
    var currentRow = this.yCoordinate;
    var column = this.xCoordinate;
    for (let i = currentRow; i < tiles.rows; i++) {
        if (tiles.at(column, i) !== null && tiles.at(column, i).isSolid()) {
            return tiles.at(column, i);
        }
    }
    return false;
};

Tile.prototype.getFallTime = function() {
    let distance = -(this.yCoordinate - this.nextTileDown().yCoordinate);
    console.log(distance);
    return distance / this.tileSpeed;
};

Tile.prototype.findAppropriateAnchor = function() {
    //let tiles = this.parent;
    let x = this.xCoordinate;
    let y = this.yCoordinate;
    return new powerupjs.Vector2(x, y);
};