//JS File
"use strict";

//HorizontalLazer

function HorizontalLazer() {
    SpecialTile.call(this, 3);

    this.loadAnimation(sprites.lazer_horizontal, "idle", true);
    this.playAnimation("idle");
}
HorizontalLazer.prototype = Object.create(SpecialTile.prototype);