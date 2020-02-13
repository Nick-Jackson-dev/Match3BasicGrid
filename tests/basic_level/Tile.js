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
    this.velocity = powerupjs.Vector2.zero;
    this.falling = false;
    this.shiftingRight = false;
    this.shiftingLeft = false;
    this.shiftingUp = false;
    this.shiftingDown = false;
    //may need t make sure tile is not offset from where it should be in grid
};

Tile.prototype.isSolid = function () {
    return this.type === TileType.basic || this.type === TileType.special || !this.moveable;
};

Tile.prototype.deleteTile = function () {
    this.type = TileType.deleted;
};

Tile.prototype.update = function(delta) {
    if (!this.moveable) { // no updating position if not movable
        return;
    }
    if (this.shiftingLeft) {
        this.velocity.x = -this._tileSpeed;
    } else if (this.shiftingRight) {
        this.velocity.x = this._tileSpeed;
    } else if (this.shiftingUp) {
        this.velocity.y = -this._tileSpeed;
    } else if (this.shiftingDown) {
        this.velocity.y = this._tileSpeed;
    } else if (this.falling) {
        this.velocity.y = this._tileSpeed;
    } else {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    powerupjs.SpriteGameObject.prototype.update.call(this, delta);
};

Tile.prototype.draw = function() {
    if (this.type === TileType.background || this.type === TileType.deleted)
        return;
    powerupjs.SpriteGameObject.prototype.draw.call(this);
};