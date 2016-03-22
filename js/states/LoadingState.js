/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan.AbstractState');
Application.namespace('App.Scene');

/**
 * ゲーム前のロード画面クラス
 *
 * @param {Phaser.Game} game
 * @constructor
 * @extends {Scene}
 */
App.Scene.LoadScene = function()
{
	SuperILtan.AbstractState.call(this);
}
Application.inherits(App.Scene.LoadScene, SuperILtan.AbstractState);

/**
 * @override
 */
App.Scene.LoadScene.prototype.preload = function()
{
	this.game.stage.backgroundColor = Phaser.Color.getColor(0, 0, 0);
}

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
}
