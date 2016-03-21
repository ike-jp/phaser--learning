/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('App.Scene');

/**
 * ゲームタイトル画面クラス
 *
 * @param {Phaser.Game} game
 * @constructor
 * @extends {Scene}
 */
App.Scene.TitleScene = function(game)
{
	App.Scene.AbstractScene.call(this, game);
}
Application.inherits(App.Scene.TitleScene, App.Scene.AbstractScene);

/**
 * @override
 */
App.Scene.TitleScene.prototype.create = function()
{
	this.game.stage.backgroundColor = Phaser.Color.getColor(80, 128, 255);

	var title = this.add.sprite(this.world.centerX, this.world.centerY, 'title');
	title.smoothed = false;
	title.pivot.x = title.width * 0.5;
	title.pivot.y = title.height * 1.2;

	this.cursors = this.game.input.keyboard.createCursorKeys();

	var fontStyle = {
		font: "10px famaniaregular",
		fill: "#FFFFFF",
		align: "center"
	};
	var textPlayGame = this.game.add.text(
		this.game.width/2,
		this.game.height * 3/5,
		'PRESS SPACE KEY',
		fontStyle
	);
	textPlayGame.anchor.set(0.5);
	textPlayGame.smoothed = false;
}

/**
 * @override
 */
App.Scene.TitleScene.prototype.update = function()
{
	this.game.physics.arcade.collide(this.player, this.layer);

	if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		this.state.start('SceneLoad');
	}
}
