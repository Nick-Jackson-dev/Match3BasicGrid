// JavaScript Document
"use strict";


var TileType = {
    background: 0,
    basic: 1,
    special: 2,
    empty: 4,
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
//inherits from powerupjs.AnimatedGameObject
//this class entangles its member's behaviours

function Tile(layer, id) {
    powerupjs.AnimatedGameObject.call(this, layer, id);
    this.position = powerupjs.Vector2.zero;
}

Tile.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

Tile.prototype.update = function(delta) {
    powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
};

Tile.prototype.draw = function() {
    powerupjs.AnimatedGameObject.prototype.draw.call(this);
};