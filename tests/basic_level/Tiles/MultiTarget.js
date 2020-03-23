//JS File
"use strict";

//MultiTarget

function MultiTarget() {
    SpecialTile.call(this, 1);

    this.loadAnimation(sprites.multi_target, "idle", true);

    this.playAnimation("idle");
}
MultiTarget.prototype = Object.create(SpecialTile.prototype);