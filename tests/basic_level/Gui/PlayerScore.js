//JS File
"use strict";

//PlayerScore will inherit from powerupjs.Label
//will be able to increase the number it displays
//Will know if it has gone over the target score and the game will be oer at that point (win)
//losing is handled in EnduranceLeel.js (if timer runs out)

function PlayerScore(target) {
    powerupjs.Label.call(this, "Arial", "26pt", ID.layer_overlays_2);

    this.target = target;
    this.position = new powerupjs.Vector2(1100, 400);
    this.reset();
    //this.score = 0;
    //this.text = '0'; //remove once update is put in
    //this.scoreCounter = 0;
}
PlayerScore.prototype = Object.create(powerupjs.Label.prototype);

Object.defineProperty(PlayerScore.prototype, "gameOver", {
    get: function() {
        return this.score >= this.target;
    }
});

PlayerScore.prototype.reset = function() {
    powerupjs.Label.prototype.reset.call(this);
    this.score = 0;
    this.text = '0'; //remove once update is put in
    this.scoreCounter = 0;
};

PlayerScore.prototype.increase = function() {
    this.scoreCounter += 10;
};

PlayerScore.prototype.update = function(delta) {
    if (this.scoreCounter > 0) {
        this.score += 1
        this.scoreCounter -= 1;
    }
    this.text = this.score;

    powerupjs.Label.prototype.update.call(this, delta);
};