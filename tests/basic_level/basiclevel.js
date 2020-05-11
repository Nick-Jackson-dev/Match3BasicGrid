"use strict";

var ID = {};
var sprites = {};
var sounds = {};

var GameSettings = {
    hints: true
};

powerupjs.Game.loadAssets = function() {
    var loadSprite = function(sprite) {
        return new powerupjs.SpriteSheet("../../assets/sprites/" + sprite);
    };
    var loadBackgroundSprite = function(sprite) { // assumes a .jpg file
        return new powerupjs.SpriteSheet("../../assets/sprites/backgrounds/" + sprite + ".jpg");
    };

    var loadSound = function(sound, looping) {
        return new powerupjs.Sound("../../assets/sounds/" + sound, looping);
    };

    //background sprites
    // sprites.background_title = loadSprite("backgrounds/spr_title.jpg");
    sprites.background_charybdo_treasure_cave = loadBackgroundSprite("charybdo/spr_treasure_cave");

    sprites.background_standard_tile_field = loadSprite("levels/standardTileBoard.png");

    //object sprites
    //basic tiles
    sprites.basic_blue = loadSprite("tiles/basic_blue.png");
    sprites.basic_red = loadSprite("tiles/basic_red.png");
    sprites.basic_orange = loadSprite("tiles/basic_orange.png");
    sprites.basic_green = loadSprite("tiles/basic_green.png");
    sprites.basic_yellow = loadSprite("tiles/basic_yellow.png");
    sprites.basic_pink = loadSprite("tiles/basic_pink.png");
    //special tiles
    sprites.lazer_horizontal = loadSprite("tiles/lazer_horizontal.png");
    sprites.lazer_vertical = loadSprite("tiles/lazer_vertical.png");
    //sprites.homing_rocket = loadSprite("tiles/homing_rocket.png"); //homing rocket is gone for now
    sprites.void_bomb = loadSprite("tiles/void_bomb.png");
    sprites.multi_target = loadSprite("tiles/multi_target.png");
    //special tile animations
    sprites.horizontal_zap = loadSprite("tiles/animations/hor_zap@17.png");
    sprites.vertical_zap = loadSprite("tiles/animations/vert_zap@1x17.png");
    sprites.void_implosion = loadSprite("tiles/animations/implosion@21.png");
    //tricky tile overlays
    sprites.rust_init = loadSprite("tiles/static_overlays/rust.png");
    sprites.ink_init = loadSprite("tiles/static_overlays/ink.png");
    //tricky tile animations
    sprites.overlay_none = loadSprite("tiles/static_overlays/rust.png");
    sprites.rust_bust = loadSprite("tiles/animations/rust_break@14.png");
    sprites.ink_squirt = loadSprite("tiles/animations/ink_squirt@21.png");

    sprites.selected_tile_overlay = loadSprite("levels/selected_tile_overlay.png");

    //playable characters for player
    sprites.merman_left = loadSprite("characters/playable_characters/merman_left.png");

    //mirrored characters
    sprites.merman_right = loadSprite("characters/playable_characters/merman_right.png");

    //temporary sprites, just for tests
    sprites.temp_win_overlay = loadSprite("temp_sprites/excellent_win_overlay.png");
    sprites.temp_lose_overlay = loadSprite("temp_sprites/you_lose_overlay.png");
    sprites.temp_survive_overlay = loadSprite("temp_sprites/you_survived_overlay.png");
    sprites.temp_pardon_dust_overlay = loadSprite("temp_sprites/pardon_dust_overlay.png");
    sprites.temp_restart_button = loadSprite("temp_sprites/restart_button.png");
    sprites.temp_settings_button = loadSprite("temp_sprites/settings_button.png");
    sprites.temp_help_button = loadSprite("temp_sprites/help_button.png");
    sprites.temp_exit_button = loadSprite("temp_sprites/exit_button.png");
    sprites.temp_time_trial_button = loadSprite("temp_sprites/try_timetrial_level_button.png");
    sprites.temp_target_score_button = loadSprite("temp_sprites/try_target_score_button.png");

    //player sounds

    //other sounds

    //levels - *works
    ID.standardTestLevel = standardlevels;

    console.log("all assets loaded");
};

powerupjs.Game.initialize = function() {
    // play the music
    //sounds.music.volume = 0.3;
    //sounds.music.play();
    console.log("initializing");
    // define the layers
    ID.layer_background = 1;
    ID.layer_background_1 = 2;
    ID.layer_background_2 = 3;
    ID.layer_background_3 = 4;
    ID.layer_tiles = 10;
    ID.layer_tiles_1 = 11;
    ID.layer_tile_overlays = 12;
    ID.layer_objects = 20;
    ID.layer_objects_1 = 21;
    ID.layer_objects_2 = 22;
    ID.layer_overlays = 30;
    ID.layer_overlays_1 = 31;
    ID.layer_overlays_2 = 32;

    // define object IDs
    ID.player = 1;
    ID.actual_tiles = 2;
    ID.selected_tile = 3;
    ID.select_border = 4;
    ID.tile_field_holder = 5;
    ID.progress_bar = 6;
    ID.timer = 7;
    // create the different game states
    //ID.game_state_title = powerupjs.GameStateManager.add(new TitleMenuState());
    ID.game_state_win = powerupjs.GameStateManager.add(new WinState());
    ID.game_state_lose = powerupjs.GameStateManager.add(new LoseState());
    ID.game_state_survive = powerupjs.GameStateManager.add(new SurviveState());
    ID.game_state_help = powerupjs.GameStateManager.add(new HelpState());
    ID.game_state_settings = powerupjs.GameStateManager.add(new SettingsState());
    //ID.game_state_playing = powerupjs.GameStateManager.add(new PlayingState());

    ID.game_state_basiclevel_test = powerupjs.GameStateManager.add(new TestingBasicLevelState());
    console.log("initialized");
    // set the current game mode
    powerupjs.GameStateManager.switchTo(ID.game_state_settings);

};