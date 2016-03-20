
Application.namespace('App.Scene');

/**
 * ゲーム前のロード画面クラス
 *
 * @param {Phaser.Game} game
 * @constructor
 * @extends {Scene}
 */
App.Scene.LoadScene = function(game)
{
	App.Scene.AbstractScene.call(this, game);
};
Application.inherits(App.Scene.LoadScene, App.Scene.AbstractScene);

/**
 * @override
 */
App.Scene.LoadScene.prototype.preload = function()
{
	this.game.stage.backgroundColor = Phaser.Color.getColor(0, 0, 0);
};

/**
 * @override
 */
App.Scene.LoadScene.prototype.create = function()
{
	this.game.time.events.add(
		Phaser.Timer.SECOND * 1.5,
		function() {
			this.state.start('ScenePlay');
		},
		this
	);
};
