//JS File
"use strict";

//Help state is a list of game objects therefore it inherits from poerupjs.GameObjectList
//holds the overlay and an exit play button.

function HelpState(layer) {
    powerupjs.GameObjectList.call(this, layer);

    // the background
    this.background = new powerupjs.SpriteGameObject(sprites.temp_settings_bg);
    this.background.position = this.background.screenCenter;
    this.add(this.background);

    // add a back button
    this.exitButton = new powerupjs.Button(sprites.temp_exit_button, 100);
    this.exitButton.position = new powerupjs.Vector2(650, 600);
    this.add(this.exitButton);
}

HelpState.prototype = Object.create(powerupjs.GameObjectList.prototype);

HelpState.prototype.update = function(delta) {
    powerupjs.GameObjectList.prototype.update.call(this, delta);
    if (this.exitButton.pressed) {
        console.log("button only");
        powerupjs.GameStateManager.switchTo(ID.game_state_basiclevel_test);
    } else if (powerupjs.Mouse.containsMousePress(this.background.boundingBox) || powerupjs.Touch.containsTouchPress(this.background.boundingBox)) {
        powerupjs.GameStateManager.switchTo(ID.game_state_basiclevel_test);
    }
};