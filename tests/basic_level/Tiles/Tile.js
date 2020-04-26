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
//want to change inheritance to powerupjs.AnimatedGameObject once animations are made

function Tile(tileTp, layer, id) {
    powerupjs.AnimatedGameObject.call(this, layer, id);
    this.type = tileTp;
    this.moveable = true; // if not movable it doesn't fall even with nothing under it and can't be switched - not implemented yet
    this.initiate();
}

Tile.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

Tile.prototype.initiate = function() {
    this._tileSpeed = 400; // pixels/sec
    this.shift = 0;
    this.falling = false;
    //these next ones control the appropriate velocities for animation - they are implemetned in the update method but not working correctly
    this.shiftingRight = false;
    this.shiftingLeft = false;
    this.shiftingUp = false;
    this.shiftingDown = false;
    this.origin.x = 36;
    this.origin.y = 36;
}

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
    this.falling = false;
    this.shiftingRight = false;
    this.shiftingLeft = false;
    this.shiftingUp = false;
    this.shiftingDown = false;
    this.velocity = powerupjs.Vector2.zero;
    //this.position = this.parent.getAnchorPosition(this);
};

Tile.prototype.deleteTile = function(nullifyScore) {
    nullifyScore = typeof nullifyScore != 'undefined' ? nullifyScore : false;
    var tiles = this.root.find(ID.actual_tiles);
    this.type = TileType.deleted;
    if (!nullifyScore)
        this.parent.parent.tilesDestroyed += 1;
    tiles.deselect();
};

Tile.prototype.update = function(delta) {
    if (!this.moveable) { // no updating position if not movable
        return;
    }
    if (!this.shiftingUp && !this.shiftingDown && !this.shiftingLeft && !this.shiftingRight && !this.turning && !this.thrusting) {
        this.velocity = powerupjs.Vector2.zero;
    }
    if (this.shiftingLeft) {
        this.velocity.x = -this.tileSpeed;
    }
    if (this.shiftingRight) {
        this.velocity.x = this.tileSpeed;
    }
    if (this.shiftingUp) {
        this.velocity.y = -this.tileSpeed;
    }
    if (this.shiftingDown) {
        this.velocity.y = this.tileSpeed;
    }
    if (this.falling) {
        this.velocity.y = this.tileSpeed;
    }
    //some things from V1.2 deleted from this area and this method reorganized
    powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
};

Tile.prototype.draw = function() {
    if (this.type === TileType.background || this.type === TileType.deleted || this.type === TileType.empty)
        return;
    powerupjs.AnimatedGameObject.prototype.draw.call(this);
};