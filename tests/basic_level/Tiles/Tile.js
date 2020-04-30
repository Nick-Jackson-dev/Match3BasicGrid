// JavaScript Document
"use strict";


var TileType = {
    background: 0,
    basic: 1,
    special: 2,
    empty: 3,
    deleted: 6
};
var BasicID = {
    pink: 0,
    blue: 1,
    green: 2,
    orange: 3,
    red: 4,
    yellow: 5,
    random: 10 //undefined works too
};
var SpecialID = {
    multi: 1,
    bomb: 2,
    vline: 3,
    hline: 4
};

//Tile objects are initialized to normal 
//inherits from powerupjs.GameObjectList and contains a tilebase and an overlay object.
//this class entangles its member's behaviours

function Tile(layer, id) {
    powerupjs.AnimatedGameObject.call(this, layer, id);
    this.position = powerupjs.Vector2.zero;
}

Tile.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

Tile.prototype.update = function(delta) {
    //this.velocity = this.parent.velocity;
    //if (this.velocity.x === 0 && this.velocity.y === 0) {
    //this.position = powerupjs.Vector2.zero;
    //}
    powerupjs.AnimatedGameObject.prototype.update.call(this, delta);

};

Tile.prototype.draw = function() {
    powerupjs.AnimatedGameObject.prototype.draw.call(this);
};
/*Tile.prototype.initiate = function() {
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
*/