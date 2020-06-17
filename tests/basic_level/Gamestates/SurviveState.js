//JS File
"use strict";

//Lose state explains the player has lost and offers options to try again, or go to the other level type

function SurviveState(layer) {
    powerupjs.GameObjectList.call(this, layer);

    // the background
    this.background = new powerupjs.SpriteGameObject(sprites.temp_survive_overlay);
    this.background.position = this.background.screenCenter;
    this.add(this.background);

    // add buttons
    this.restartButton = new powerupjs.Button(sprites.temp_restart_button, 100);
    this.restartButton.position = new powerupjs.Vector2(560, 600);
    this.add(this.restartButton);
    this.tryNewTimeTrialButton = new powerupjs.Button(sprites.temp_time_trial_button_init);
    this.tryNewTimeTrialButton.position = new powerupjs.Vector2(50, 300);
    this.add(this.tryNewTimeTrialButton);
    this.tryNewTargetScoreButton = new powerupjs.Button(sprites.temp_target_score_button_init);
    this.tryNewTargetScoreButton.position = new powerupjs.Vector2(425, 300);
    this.add(this.tryNewTargetScoreButton);
    this.tryNewSpecialScoreButton = new powerupjs.Button(sprites.temp_special_score_button_init);
    this.tryNewSpecialScoreButton.position = new powerupjs.Vector2(800, 300);
    this.add(this.tryNewSpecialScoreButton);
}

SurviveState.prototype = Object.create(powerupjs.GameObjectList.prototype);

SurviveState.prototype.update = function(delta) {
    powerupjs.GameObjectList.prototype.update.call(this, delta);
    if (!this.tryNewTargetScoreButton.boundingBox.contains(powerupjs.Mouse.position)) {
        this.tryNewTargetScoreButton.sprite = sprites.temp_target_score_button_init;
    } else {
        this.tryNewTargetScoreButton.sprite = sprites.temp_target_score_button_hover;
    }
    if (!this.tryNewSpecialScoreButton.boundingBox.contains(powerupjs.Mouse.position)) {
        this.tryNewSpecialScoreButton.sprite = sprites.temp_special_score_button_init;
    } else {
        this.tryNewSpecialScoreButton.sprite = sprites.temp_special_score_button_hover;
    }
    if (!this.tryNewTimeTrialButton.boundingBox.contains(powerupjs.Mouse.position)) {
        this.tryNewTimeTrialButton.sprite = sprites.temp_time_trial_button_init;
    } else {
        this.tryNewTimeTrialButton.sprite = sprites.temp_time_trial_button_hover;
    }

    if (this.restartButton.pressed) {
        powerupjs.GameStateManager.switchTo(ID.game_state_basiclevel_test);
        powerupjs.GameStateManager.get(ID.game_state_basiclevel_test).currentLevel.reset();
    } else if (this.tryNewTimeTrialButton.pressed) {
        powerupjs.GameStateManager.get(ID.game_state_basiclevel_test).goToLevelIndex(0); //this is for testing purposes only
        powerupjs.GameStateManager.switchTo(ID.game_state_basiclevel_test);
    } else if (this.tryNewTargetScoreButton.pressed) {
        powerupjs.GameStateManager.get(ID.game_state_basiclevel_test).goToLevelIndex(1); //this is for testing purposes only
        powerupjs.GameStateManager.switchTo(ID.game_state_basiclevel_test);
    } else if (this.tryNewSpecialScoreButton.pressed) {
        powerupjs.GameStateManager.get(ID.game_state_basiclevel_test).goToLevelIndex(2); //this is for testing purposes only
        powerupjs.GameStateManager.switchTo(ID.game_state_basiclevel_test);
    }
};