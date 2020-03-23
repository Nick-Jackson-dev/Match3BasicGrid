//JS File
"use strict";

//VerticalLazer

function VerticalLazer() {
    SpecialTile.call(this, 2);

    this.loadAnimation(sprites.lazer_vertical, "idle", true);
    this.playAnimation("idle");
}
VerticalLazer.prototype = Object.create(SpecialTile.prototype);