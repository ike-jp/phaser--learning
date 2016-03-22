/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('App.Scene');

/**
 * プリロード画面クラス
 *
 * @param {Phaser.Game} game
 * @constructor
 */
App.Scene.PreloadScene = function(game)
{
	App.Scene.AbstractScene.call(this, game);
	this.preloadBar = null;
}
Application.inherits(App.Scene.PreloadScene, App.Scene.AbstractScene);

/**
 * @override
 */
App.Scene.PreloadScene.prototype.preload = function()
{
	// title
	this.load.image('title', 'assets/title.png');

	// game
	this.load.spritesheet('player', 'assets/objects/player.png', 16, 16);
	this.load.spritesheet('enemies1', 'assets/objects/enemies1.png', 16, 16);
	this.load.spritesheet('enemies2', 'assets/objects/enemies2.png', 16, 16);
	this.load.spritesheet('items', 'assets/objects/items.png', 16, 16);
	this.load.spritesheet('goal-symbol', 'assets/objects/goal-symbol.png', 32, 32);
	this.load.image('bg', 'assets/tilemaps/tiles/bg.png');
	this.load.image('terrain', 'assets/tilemaps/tiles/terrain.png');
	this.load.tilemap('map', 'assets/tilemaps/json/level1.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('myfont', 'assets/fonts/myfont.png');
	this.load.image('myfont-num-s', 'assets/fonts/myfont-num-s.png');
}

/**
 * @override
 */
App.Scene.PreloadScene.prototype.create = function()
{
	//this.state.start('SceneTitle');
	this.state.start('ScenePlay');
}
