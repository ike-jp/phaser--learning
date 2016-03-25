/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan.AbstractState');

/**
 * プリロード画面クラス
 *
 * @param {Phaser.Game} game
 * @constructor
 */
SuperILtan.PreloadState = function()
{
	SuperILtan.AbstractState.call(this);
}
Application.inherits(SuperILtan.PreloadState, SuperILtan.AbstractState);

/**
 * @override
 */
SuperILtan.PreloadState.prototype.preload = function()
{
	// title
	this.load.image('title', 'assets/title.png');

	this.load.image('myfont', 'assets/fonts/myfont.png');
	this.load.image('myfont-num-s', 'assets/fonts/myfont-num-s.png');
}

/**
 * @override
 */
SuperILtan.PreloadState.prototype.create = function()
{
	//this.state.start('SceneTitle');
	this.state.start('SceneLoad');
}
