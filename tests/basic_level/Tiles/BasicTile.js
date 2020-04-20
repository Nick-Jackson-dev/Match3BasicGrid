// JavaScript Document
"use strict";

//basic tiles will always be random
//inherits from the Tile object


function BasicTile(tileType, basicID) {
    Tile.call(this, tileType, ID.layer_tiles);
    basicID = typeof basicID != 'undefined' ? basicID : Math.floor(Math.random() * 6);

    //this makes a blank spotr as [planned, but ti does fall like a normal tile - fix later
    if (tileType === TileType.background) {
        this.basicTileID = 10;
        this.basicTileSprite = sprites.basic_yellow;
    } else {
        this.basicTileID = basicID;
        if (this.basicTileID === 1)
            this.loadAnimation(sprites.basic_blue, "idle", true);
        else if (this.basicTileID === 2)
            this.loadAnimation(sprites.basic_green, "idle", true);
        else if (this.basicTileID === 3)
            this.loadAnimation(sprites.basic_orange, "idle", true);
        else if (this.basicTileID === 4)
            this.loadAnimation(sprites.basic_red, "idle", true);
        else if (this.basicTileID === 5)
            this.loadAnimation(sprites.basic_yellow, "idle", true);
        else
            this.loadAnimation(sprites.basic_pink, "idle", true);
    }
    this.playAnimation("idle");
}
BasicTile.prototype = Object.create(Tile.prototype);