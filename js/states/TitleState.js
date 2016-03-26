/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan.AbstractState');

/**
 * ゲームタイトル画面クラス
 *
 * @constructor
 * @extends {AbstractState}
 */
SuperILtan.TitleState = function() {
	'use strict';
	SuperILtan.AbstractState.call(this);
}
Application.inherits(
	SuperILtan.TitleState,
	SuperILtan.AbstractState
);

/**
 * @override
 */
SuperILtan.TitleState.prototype.create = function() {
	'use strict';
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
SuperILtan.TitleState.prototype.update = function() {
	'use strict';
	this.game.physics.arcade.collide(this.player, this.layer);

	if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		this.state.start('SceneLoad');
	}
}
