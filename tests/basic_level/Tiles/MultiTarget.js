//JS File
"use strict";

//MultiTarget

function MultiTarget() {
    Tile.call(this);

    this.loadAnimation(sprites.multi_target, "idle", true);
    this.playAnimation("idle");

    this.targets = [];
}
MultiTarget.prototype = Object.create(Tile.prototype);

MultiTarget.prototype.activate = function(basicType) {
    var randomBasic = Math.floor(Math.random() * 6);
    var basicType = typeof basicType != 'undefined' ? basicType : randomBasic;
    var tiles = this.root.find(ID.actual_tiles);
    this.targets = tiles.getMultiTargets(basicType);
    console.log(this.targets);
    setTimeout(function(tilePair) {
        for (let i = 0, l = tilePair.tile.targets.length - 1; i <= l; i++) {
            //add a retical overlay on each target
            let timer = Math.random() * 1000;
            setTimeout(function(tilePair, index, final) {
                tilePair.tile.targets[index].deleteTile(); // need to have retical firing animation
                if (index === final) {
                    setTimeout(function(tilePair) {
                        tilePair.deleteTile();
                        tilePair.parent.chainsLeft -= 1;
                        if (tilePair.parent.chainsLeft === 0) {
                            tilePair.parent.shiftTiles();
                        }
                    }, 1001, tilePair);
                }
            }, timer, tilePair, i, l);
        }
    }, 200, this.parent);
};