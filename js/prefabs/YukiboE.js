/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan');

/**
 * 敵２クラス
 *
 * @constructor
 */
SuperILtan.YukiboE = function(gameState, x, y, tiledMapObject) {
	'use strict';
	SuperILtan.AbstractPrehab.call(this, gameState, x, y, tiledMapObject);
	this.gameState.game.physics.arcade.enable(this);
	this.anchor.setTo(0.5);

	this.animations.add('walk', [0, 1], 6, true);
	this.animations.play('walk');
	this.body.velocity.x = -20;
	this.body.maxVelocity.y = this.gameState.MAX_VELOCITY_Y;
	this.smoothed = false;

	this.checkWorldBounds = true;
	this.body.collideWorldBouns = true;
	this.body.bounce.x = 1;
	this.body.bounce.y = 0;
}
Application.inherits(
	SuperILtan.YukiboE,
	SuperILtan.AbstractPrehab
);

/**
 * @override
 */
SuperILtan.YukiboE.prototype.update = function() {
	'use strict';
	var game = this.gameState.game;
	var layers = this.gameState.layers;
	var enemies = this.gameState.groups.enemies;

	this.game.physics.arcade.collide(this, layers['Tile Layer']);
}

/**
 * この敵のライフが０になった時に呼ばれるコールバック
 *
 * @private
 */
SuperILtan.YukiboE.prototype.onDieCallback_ = function() {
	'use strict';
}
