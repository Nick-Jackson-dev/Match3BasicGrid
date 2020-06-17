//JS File
"use strict";

//SettingsState is a list of game objects therefore it inherits from poerupjs.GameObjectList
//holds the overlay and an exit button, restart button, try other level buttons

function SettingsState(layer) {
    powerupjs.GameObjectList.call(this, layer);

    // the background
    this.background = new powerupjs.SpriteGameObject(sprites.temp_settings_bg);
    this.background.position = this.background.screenCenter;
    this.add(this.background);

    // add buttons
    this.exitButton = new powerupjs.Button(sprites.temp_exit_button, 100);
    this.exitButton.position = new powerupjs.Vector2(450, 620);
    this.add(this.exitButton);
    this.restartButton = new powerupjs.Button(sprites.temp_restart_button, 100);
    this.restartButton.position = new powerupjs.Vector2(500, 600);
    this.add(this.restartButton);
    this.tryNewTimeTrialButton = new powerupjs.Button(sprites.temp_time_trial_button_init);
    this.tryNewTimeTrialButton.position = new powerupjs.Vector2(200, 100);
    this.add(this.tryNewTimeTrialButton);
    this.tryNewTargetScoreButton = new powerupjs.Button(sprites.temp_target_score_button_init);
    this.tryNewTargetScoreButton.position = new powerupjs.Vector2(200, 250);
    this.add(this.tryNewTargetScoreButton);
    this.tryNewSpecialScoreButton = new powerupjs.Button(sprites.temp_special_score_button_init);
    this.tryNewSpecialScoreButton.position = new powerupjs.Vector2(200, 400);
    this.add(this.tryNewSpecialScoreButton);
    this.menuLogo = new powerupjs.Button(sprites.temp_menu_logo);
    this.menuLogo.position = new powerupjs.Vector2(650, 100);
    this.add(this.menuLogo);
}

SettingsState.prototype = Object.create(powerupjs.GameObjectList.prototype);

SettingsState.prototype.update = function(delta) {
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

    if (this.exitButton.pressed) {
        powerupjs.GameStateManager.switchTo(ID.game_state_basiclevel_test);
    } else if (this.restartButton.pressed) {
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
    } else if (this.menuLogo.pressed) {
        location.href = 'http://www.spaceygame.com';
    } else if (powerupjs.Mouse.containsMousePress(this.background.boundingBox) || powerupjs.Touch.containsTouchPress(this.background.boundingBox)) {
        powerupjs.GameStateManager.switchTo(ID.game_state_basiclevel_test);
    }
};