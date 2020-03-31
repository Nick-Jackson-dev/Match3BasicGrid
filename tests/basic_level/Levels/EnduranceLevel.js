//JS file
"use strict"

//EnduranceLevel inherits from Level.
//goal is to score the target pooints in the time aloted
//in addition to what Level holds this: holds a target score and a player score that increases as matches are made
//holds a timer - if the timer runs out the player loses

function EnduranceLevel(levelData) {
    Level.call(this, levelData);

    this.targetScore = levelData.targetScore; //this is the number
    var targetScore = new powerupjs.Label("Arial", "26pt", ID.layer_overlays_2); //this is the object that shows the target score
    targetScore.text = this.targetScore;
    targetScore.position = new powerupjs.Vector2(1100, 200);
    this.add(targetScore);

    this.playerScore = new PlayerScore(this.targetScore); //(targetScore)
    this.add(this.playerScore);

    this.timer = new CountDownTimer(90); //(startTime)
    this.add(this.timer);
}
EnduranceLevel.prototype = Object.create(Level.prototype);

EnduranceLevel.prototype.handleInput = function(delta) {
    //buttons and stuff should still be clickable/tappable after level has ended
    if (powerupjs.Touch.isTouchDevice) {
        this.handleTouchInput(delta);
    } else {
        this.handleComputerInput(delta);
    }
    if (this.timer.gameOver && !this.playerScore.gameOver) {
        return;
    } else if (!this.timer.gameOver && this.playerScore.gameOver) { //game has ended
        return;
    }
    Level.prototype.handleInput.call(this, delta);
};

EnduranceLevel.prototype.handleComputerInput = function(delta) {

};

EnduranceLevel.prototype.handleTouchInput = function(dleta) {

};

EnduranceLevel.prototype.update = function(delta) {
    Level.prototype.update.call(this, delta);
    if (this.timer.gameOver && this.playerScore.scoreCounter === 0) {
        console.log("You Lose")
        powerupjs.GameStateManager.switchTo(ID.game_state_lose);
        return;
    } else if (this.playerScore.gameOver) { //game has ended
        this.timer.running = false;
        powerupjs.GameStateManager.switchTo(ID.game_state_win);
        console.log("You Win");
        if (this.playerScore.scoreCounter === 0) {
            return;
        }
    }
    if (this.tilesDestroyed > 0) {
        for (let i = 0, l = this.tilesDestroyed; i < l; i++) {
            this.playerScore.increase();
            this.tilesDestroyed--;
        }
    }
};

EnduranceLevel.prototype.reset = function() {
    Level.prototype.reset.call(this);
    this.tilesDestroyed = 0;
};