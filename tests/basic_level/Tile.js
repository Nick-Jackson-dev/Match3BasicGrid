// JavaScript Document
"use strict";

//NEEDS BIG REPORK IF IT IS EVEN NECESSARY

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
    powerupjs.SpriteGameObject.call(this, sprite, layer);
    this.type = tileTp;
    this._tileSpeed = 280; // pixels/sec
    this.shift = 0; //Not sure if this is needed
    this.stopped = true; //if it is resting on another tile it is stopped - not implemented in this way yet
    this.movable = true; // if not movable it doesn't fall even with nothing under it and can't be switched - not implemented yet
    //these next ones control the appropriate velocities for animation - they are implemetned in the update method but not working correctly
    this.shiftingRight = false;
    this.shiftingLeft = false;
    this.shiftingUp = false;
    this.shiftingDown = false;
}

Tile.prototype = Object.create(powerupjs.SpriteGameObject.prototype);

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

Tile.prototype.switchRight = function(otherTile) {
    console.log("shifting soemthing right and left");
    let otherTileCoordinate = otherTile.position.x;
    let thisTileCoordinate = this.position.x;
    while (this.position.x < otherTileCoordinate && otherTile.position.x > thisTileCoordinate) {
        this.velocity.x = this._tileSpeed;
        otherTile.velocity.x = -otherTile._tileSpeed;
    }
    this.beStill();
    otherTile.beStill();
    if (this.position.x < otherTileCoordinate) {
        this.position.x = otherTileCoordinate;
    }
    if (otherTile.position.x > thisTileCoordinate) {
        otherTile.position.x = thisTileCoordinate;
    }
    return;
};

Tile.prototype.switchUp = function(otherTile) {
    console.log("shifting soemthing up and down");
    let otherTileCoordinate = otherTile.position.y;
    let thisTileCoordinate = this.position.y;
    while (this.position.y > otherTileCoordinate && otherTile.position.y < thisTileCoordinate) {
        console.log(this.position.y);
        this.velocity.y = -this._tileSpeed;
        otherTile.velocity.y = otherTile.tileSpeed;
    }
    this.beStill();
    otherTile.beStill();
    if (this.position.y > otherTileCoordinate) {
        this.position.y = otherTileCoordinate;
    }
    if (otherTile.position.y < thisTileCoordinate) {
        otherTile.position.y = thisTileCoordinate;
    }
    return;
};

Tile.prototype.beStill = function() {
    this.velocity = powerupjs.Vector2.zero;
    this.stopped = true; //if it is resting on another tile it is stopped
    this.shiftingRight = false;
    this.shiftingLeft = false;
    this.shiftingUp = false;
    this.shiftingDown = false;
};

Tile.prototype.update = function(delta) {
    if (!this.movable) { // no updating position if not movable
        return;
    }
    //if (this.stopped) {
    //  return;
    //}
    if (this.shiftingLeft) {
        this.velocity.x = -this._tileSpeed;
    } else if (this.shiftingRight) {
        this.velocity.x = this._tileSpeed;
    } else if (this.shiftingUp) {
        this.velocity.y = -this._tileSpeed;
    } else if (this.shiftingDown) {
        this.velocity.y = this._tileSpeed;
    } else {
        this.velocity = powerupjs.Vector2.zero;
    }
    powerupjs.SpriteGameObject.prototype.update.call(this, delta);
};

Tile.prototype.draw = function() {
    if (this.type === TileType.background || this.type === TileType.deleted)
        return;
    powerupjs.SpriteGameObject.prototype.draw.call(this);
};