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
SuperILtan.LoadingState = function()
{
	SuperILtan.AbstractState.call(this);
}
Application.inherits(SuperILtan.LoadingState, SuperILtan.AbstractState);

/**
 * @override
 */
SuperILtan.LoadingState.prototype.preload = function()
{
	this.game.stage.backgroundColor = Phaser.Color.getColor(0, 0, 0);
}

/**
 * @override
 */
SuperILtan.LoadingState.prototype.create = function()
{
	this.game.time.events.add(
		Phaser.Timer.SECOND * 1.5,
		function() {
			this.state.start('ScenePlay');
		},
		this
	);
}
