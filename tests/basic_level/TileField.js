// JavaScript Document
"use strict";

//TileField will inhert from powerupjsGameObjectGrid and hold tiles in a grid determined by the parameters passed
//MAY NEED BIG REWORK

function TileField(rows, columns, layer, id) {
    powerupjs.GameObjectGrid.call(this, rows, columns, layer, id);
}
TileField.prototype = Object.create(powerupjs.GameObjectGrid.prototype);

TileField.prototype.getTileXCoordinate = function(tile) {
    let x = tile.position.x / this.cellWidth;
    //console.log(x);
    return x;
};

TileField.prototype.getTileYCoordinate = function(tile) {
    let y = tile.position.y / this.cellHeight;
    //console.log(y);
    return y;
};

//unsure whether this is needed actually
TileField.prototype.getTileType = function(x, y) {
    if (x < 0 || x >= this.columns)
        return TileType.normal;
    if (y < 0 || y >= this.rows)
        return TileType.background;
    return this.at(x, y).type;
};