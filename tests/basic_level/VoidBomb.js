//JS File
"use strict";

//VoidBomb

function VoidBomb () {
    SpecialTile.call(this, 5);
}
VoidBomb.prototype = Object.create(SpecialTile.prototype);