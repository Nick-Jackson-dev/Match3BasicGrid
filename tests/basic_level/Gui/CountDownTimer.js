//JS File
"use strict";

//CountDown should not be affected by switching browsers/closing game it should continue going
//it will pause upon pausing the game by whatever means
//takes a parameter that indicates where to start
//inherit from powerupjs.Label

function CountDownTimer(seconds) {
    powerupjs.Label.call(this, "Arial", "26pt", ID.layer_overlays_2, ID.timer);
    this._initialTime = seconds;
    this.position = new powerupjs.Vector2(10, 10);
}
CountDownTimer.prototype = Object.create(powerupjs.Label.prototype);

Object.defineProperty(CountDownTimer.prototype, "gameOver", {
    get: function() {
        return this._timeLeft <= 0;
    }
});

CountDownTimer.prototype.update = function(delta) {
    if (!this.running)
        return;
    this._timeLeft -= delta * this.multiplier;
    var minutes = Math.floor(this._timeLeft / 60);
    var seconds = Math.ceil(this._timeLeft - (minutes * 60));
    if (this._timeLeft <= 0) {
        this.running = false;
        minutes = seconds = 0;
    }
    this.text = this.text = minutes + ":" + seconds;
    if (seconds < 10) {
        this.text = minutes + ":0" + seconds; //would write 8:09 instead of 8:9
    }
    this.color = powerupjs.Color.yellow;
    //make it flash
    if (this._timeLeft < 10 && seconds % 2 === 0)
        this.color = powerupjs.Color.red;
};

CountDownTimer.prototype.reset = function() {
    powerupjs.Label.prototype.reset.call(this);
    this.running = true;
    this._timeLeft = this._initialTime;
    this.multiplier = 1;
};