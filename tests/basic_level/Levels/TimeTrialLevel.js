//JS file
"use strict"

//TimeTrialLevel inherits from Level.
//goal is to fill up the bar by making matches
//in addition to what Level holds this: holds a bar that depletes overtime and gets added to upon matching.
//holds a timer - if the timer runs out the player loses

function TimeTrialLevel(levelData) {
    Level.call(this, levelData, false);

    this.progressBar = new ProgressBar(); //(beginning position, start position, rate of depletion modifier, rate of increase modifier) - modifiers from playerData
    this.add(this.progressBar);

    this.timer = new CountDownTimer(90); //(startTime)
    this.add(this.timer);
}
TimeTrialLevel.prototype = Object.create(Level.prototype);

TimeTrialLevel.prototype.handleInput = function(delta) {
    //buttons and stuff should still be clickable/tappable after level has ended
    if (powerupjs.Touch.isTouchDevice) {
        this.handleTouchInput(delta);
    } else {
        this.handleComputerInput(delta);
    }
    if (this.timer.gameOver && !this.progressBar.gameOver) {
        return;
    } else if (!this.timer.gameOver && this.progressBar.gameOver) { //game has ended
        return;
    }
    Level.prototype.handleInput.call(this, delta);
};

TimeTrialLevel.prototype.handleComputerInput = function(delta) {

};

TimeTrialLevel.prototype.handleTouchInput = function(dleta) {

};

TimeTrialLevel.prototype.update = function(delta) {
    if (this.timer.gameOver && !this.progressBar.gameOver) {
        console.log("you survived this level!")
        powerupjs.GameStateManager.switchTo(ID.game_state_survive);
        return;
    } else if (!this.timer.gameOver && this.progressBar.gameOver) { //game has ended
        this.timer.running = false;
        if (this.progressBar.winLevel) {
            console.log('you Win!');
            powerupjs.GameStateManager.switchTo(ID.game_state_win);
        } else if (!this.progressBar.winLevel) {
            console.log('you Lose!');
            powerupjs.GameStateManager.switchTo(ID.game_state_lose);
        }
        return;
    }
    Level.prototype.update.call(this, delta);
    if (this.tilesDestroyed > 0) {
        for (let i = 0, l = this.tilesDestroyed; i < l; i++) {
            this.progressBar.fillUp();
            this.tilesDestroyed--;
        }
    }
};

TimeTrialLevel.prototype.reset = function() {
    Level.prototype.reset.call(this);
    this.tilesDestroyed = 0;
};