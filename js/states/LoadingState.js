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
Application.inherits(SuperILtan.LoadingState, SuperILtan.AbstractState);

/**
 * @override
 */
SuperILtan.LoadingState.prototype.preload = function() {
	'use strict';
	this.game.stage.backgroundColor = Phaser.Color.getColor(0, 0, 0);

	// game
	this.load.spritesheet('player', 'assets/objects/player.png', 16, 16);
	this.load.spritesheet('enemies1', 'assets/objects/enemies1.png', 16, 16);
	this.load.spritesheet('enemies2', 'assets/objects/enemies2.png', 16, 16);
	this.load.spritesheet('items', 'assets/objects/items.png', 16, 16);
	this.load.spritesheet('goal-symbol', 'assets/objects/goal-symbol.png', 32, 32);
	this.load.image('bg', 'assets/tilemaps/tiles/bg.png');
	this.load.image('terrain', 'assets/tilemaps/tiles/terrain.png');
	this.load.tilemap('map', 'assets/tilemaps/json/level1.json', null, Phaser.Tilemap.TILED_JSON);
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
