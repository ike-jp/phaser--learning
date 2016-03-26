/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan.AbstractState');

/**
 * ゲーム前のロード画面クラス
 *
 * @param {Phaser.Game} game
 * @constructor
 * @extends {Scene}
 */
SuperILtan.LoadingState = function() {
	'use strict';
	SuperILtan.AbstractState.call(this);
}
Application.inherits(
	SuperILtan.LoadingState,
	SuperILtan.AbstractState
);

/**
 * @override
 */
SuperILtan.LoadingState.prototype.preload = function() {
	'use strict';
	this.game.stage.backgroundColor = Phaser.Color.getColor(0, 0, 0);
	this.load.tilemap('level_map', 'assets/tilemaps/json/level1_map.json', null, Phaser.Tilemap.TILED_JSON);
/*
	this.load.text('level', 'assets/tilemaps/json/level.json');
	var levelText = this.game.cache.getText('level');
console.log(levelData);
	var levelData = JSON.parse(levelText);
*/
/*
	var assets = levelData.assets;
	for (asset_key in assets) {
		if (assets.hasOwnProperty(asset_kye)) {
			asset = assets[asset_key];
			switch (asset.type) {
				case 'image':
					this.load.image(asset_key, asset.source);
					break;
				case 'spritesheet':
					this.load.image(
						asset_key,
						asset.source,
						asset.frame_width,
						asset.frame_height,
						asset.frames,
						asset.margin,
						asset.spacing
					);
					break;
				case 'tilemap':
					this.load.tilemap(
						asset_key,
						asset.source,
						null,
						Phaser.Tilemap.TILED_JSON
					);
					break;
			}
		}
	}
*/
	// game
	this.load.spritesheet('player_spritesheet', 'assets/images/player_spritesheet.png', 16, 16);
	this.load.spritesheet('enemies_spritesheet', 'assets/images/enemies_spritesheet.png', 16, 16);
	this.load.spritesheet('items_spritesheet', 'assets/images/items_spritesheet.png', 16, 16);
	this.load.image('bg_spritesheet', 'assets/images/bg_spritesheet.png');
	this.load.image('terrain_spritesheet', 'assets/images/terrain_spritesheet.png');
	this.load.spritesheet('goalsymbol_image', 'assets/images/goalsymbol_image.png', 32, 32);
	this.load.spritesheet('enemies2', 'assets/images/enemies2.png', 16, 16);
}

/**
 * @override
 */
SuperILtan.LoadingState.prototype.create = function() {
	'use strict';
	this.game.time.events.add(
		Phaser.Timer.SECOND * 1.5,
		function() {
			this.state.start('ScenePlay');
		},
		this
	);
}
