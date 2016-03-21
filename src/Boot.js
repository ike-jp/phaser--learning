/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

BasicGame = {
	/* Check BasicGame.orientated in internal loops to know if the
	 * game should pause or not. */
	orientated: false,
	fullscreen: false,
};

BasicGame.toggleFullscreen = function() {
	if (this.scale.isFullScreen) {
		this.scale.stopFullScreen(false);
	} else {
		this.scale.startFullScreen(false);
	}
}

/**
 * 起動クラス
 *
 * TODO: この辺はまだ仕組みがよく分かっていないので後で整理する
 *
 * @param {Phaser.Game} game
 * @constructor
 */
BasicGame.Boot = function(game)
{
	// have nothing to do
}

/**
 * {@inheritdoc}
 */
BasicGame.Boot.prototype.init = function()
{
	this.input.maxPointers = 1;
	this.stage.disableVisibilityChange = true;
	this.stage.backgroundColor = '#000000';

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

	if (this.game.device.desktop) {
		// None
	} else {
		this.scale.forceOrientation(true, false);
		this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
		this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
	}
	this.scale.refresh();
}

/**
 * {@inheritdoc}
 */
BasicGame.Boot.prototype.preload = function()
{
	this.load.image('preloader-bar', 'assets/ui/preloader-bar.png');
}

/**
 * {@inheritdoc}
 */
BasicGame.Boot.prototype.create = function()
{
	this.state.start('ScenePreload');
}

/**
 * 未調査
 */
BasicGame.Boot.prototype.enterIncorrectOrientation = function()
{
	BasicGame.orientated = false;
	document.getElementById('orientation').style.display = 'block';
}

/**
 * 未調査
 */
BasicGame.Boot.prototype.leaveIncorrectOrientation = function()
{
	BasicGame.orientated = true;
	document.getElementById('orientation').style.display = 'none';
}
