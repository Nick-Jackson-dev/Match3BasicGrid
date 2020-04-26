//JS File
"use strict";


//SpecialTile has 4 subclasses: MultiTarget, VerticalZap, Horizontal Zap, and VoidBomb, specialID's 1,2,3,and 5 respectively
//inherits from Tile.js 
//initialized to moveable, type = TileType.special
//they cannot permanently switch, but rather will switch with a tile then activate
//they can also be activated without moving by selecting them then tapping/clicking them again.
//eventually will be able to be combined for special actions.

function SpecialTile(specialID) {
    Tile.call(this, TileType.special, ID.layer_tiles_1);
    this.specialTileID = specialID;
}
SpecialTile.prototype = Object.create(Tile.prototype);

SpecialTile.prototype.activate = function() {
    // this is handled differently by each type of special tile
};

SpecialTile.prototype.update = function(delta) {
    Tile.prototype.update.call(this, delta);
};

//handle combination actions with functions here eventually