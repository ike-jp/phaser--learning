
/**
 * ゲーム前のロード画面クラス
 *
 * @param {Phaser.Game} game
 * @constructor
 * @extends {Scene}
 */
BasicGame.SceneLoad = function(game)
{
	App.Scene.AbstractScene.call(this, game);
};
Application.inherits(BasicGame.SceneLoad, App.Scene.AbstractScene);

/**
 * {@inheritdoc}
 */
BasicGame.SceneLoad.prototype.preload = function()
{
	this.game.stage.backgroundColor = Phaser.Color.getColor(0, 0, 0);
};

/**
 * {@inheritdoc}
 */
BasicGame.SceneLoad.prototype.create = function()
{
	this.game.time.events.add(
		Phaser.Timer.SECOND * 1.5,
		function() {
			this.state.start('ScenePlay');
		},
		this
	);
};
