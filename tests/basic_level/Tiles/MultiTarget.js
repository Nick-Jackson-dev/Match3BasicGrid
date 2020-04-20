//JS File
"use strict";

//MultiTarget

function MultiTarget() {
    SpecialTile.call(this, 1);

    this.loadAnimation(sprites.multi_target, "idle", true);
    this.playAnimation("idle");

    this.targets = [];
}
MultiTarget.prototype = Object.create(SpecialTile.prototype);

MultiTarget.prototype.activate = function(basicType) {
    SpecialTile.prototype.activate.call(this);
    var randomBasic = Math.floor(Math.random() * 6);
    var basicType = typeof basicType != 'undefined' ? basicType : randomBasic;
    var tiles = this.root.find(ID.actual_tiles);
    this.targets = tiles.getMultiTargets(basicType);
    console.log(this.targets);
    setTimeout(function(tile) {
        for (let i = 0, l = tile.targets.length - 1; i <= l; i++) {
            //add a retical overlay on each target
            let timer = Math.random() * 1000;
            setTimeout(function(tile, index, final) {
                tile.targets[index].deleteTile(); // need to have retical firing animation
                if (index === final) {
                    setTimeout(function(tile) {
                        tile.deleteTile();
                        tile.parent.chainsLeft -= 1;
                        if (tile.parent.chainsLeft === 0) {
                            tile.parent.shiftTiles();
                        }
                    }, 1001, tile);
                }
            }, timer, tile, i, l);
        }
    }, 200, this);
};