// JavaScript Document
"use strict";

//basic tiles will always be random
//inherits from the Tile object


function BasicTile(tileType) {
    this.basicTileSprite = undefined;
    this.basicTileID = undefined;
    //this makes a blank spotr as [planned, but ti does fall like a normal tile - fix later
    if (tileType === TileType.background) {
        this.basicTileID = 10;
        this.basicTileSprite = sprites.basic_yellow;
    } else {
        this.basicTileID = Math.floor(Math.random() * 6);
        if (this.basicTileID === 1)
            this.basicTileSprite = sprites.basic_blue;
        else if (this.basicTileID === 2)
            this.basicTileSprite = sprites.basic_green;
        else if (this.basicTileID === 3)
            this.basicTileSprite = sprites.basic_orange;
        else if (this.basicTileID === 4)
            this.basicTileSprite = sprites.basic_red;
        else if (this.basicTileID === 5)
            this.basicTileSprite = sprites.basic_yellow;
        else
            this.basicTileSprite = sprites.lazer;
    }


    Tile.call(this, this.basicTileSprite, tileType, ID.layer_tiles);
}
BasicTile.prototype = Object.create(Tile.prototype);