//JS File
"use strict";

//SpecialTile has 4 subclasses: MultiTarget, VerticalZap, Horizontal Zap, homingRocket, and VoidBomb, specialID's 1,2,3, 4,and 5 respectively
//inherits from Tile.js 
//initialized to moveable, type = TileType.special
//they cannot permanently switch, but rather will switch with a tile then activate
//they can also be activated without moving by selecting them then tapping/clicking them again.
//eventually will be able to be combined for special actions.

function SpecialTile (specialID) {
    this.specialTileID = specialID;
    this.specialTileSprite = undefined;
    if(this.specialTileID === 1) {
        this.specialTileSprite = sprites.multi_taget;
    } else if (this.specialTileID === 2)  {
        this.specialTileSprite = sprites.lazer_vertical;
    } else if (specialTileID === 3) {
        this.specialTileSprite = sprites.lazer_horizontal;
    } else if (this.specialTileID === 4) { 
        this.specialTileSprite = sprites.homing_rocket;
    } else if (this.specialTileID === 5) {
        this.specialTileSprite = sprites.void_bomb;
    }

    Tile.call(this, this.specialTileSprite, TileType.special, ID.layer_tiles_1);
}
SpecialTile.prototype = Object.create(Tile.prototype);

//handle combination actions with functions here eventually