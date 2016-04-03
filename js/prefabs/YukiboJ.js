/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan');

/**
 * 敵３クラス
 *
 * @constructor
 */
SuperILtan.YukiboJ = function(gameState, x, y, tiledMapObject) {
	'use strict';
	SuperILtan.AbstractPrehab.call(this, gameState, x, y, tiledMapObject);
	this.gameState.game.physics.arcade.enable(this);
	this.anchor.setTo(0.5);

	this.animations.add('walk', [0, 1], 6, true);
	this.animations.frame = 1;
	this.body.velocity.x = -20;
	this.body.maxVelocity.y = this.gameState.MAX_VELOCITY_Y - 80;
	this.smoothed = false;

	this.checkWorldBounds = true;
	this.body.collideWorldBouns = true;
	this.body.bounce.x = 1;
	this.body.bounce.y = 0;

	this.canJump = false;
}
Application.inherits(
	SuperILtan.YukiboJ,
	SuperILtan.AbstractPrehab
);

/**
 * @override
 */
SuperILtan.YukiboJ.prototype.update = function() {
	'use strict';
	var game = this.gameState.game;
	var layers = this.gameState.layers;
	var enemies = this.gameState.groups.enemies;

	this.game.physics.arcade.collide(this, layers['Tile Layer']);

	if (this.body.onFloor()) {
		this.body.velocity.y = -180;
		this.animations.frame ^= 1;
	}
	this.body.velocity.y -= 20;
}

/**
 * この敵のライフが０になった時に呼ばれるコールバック
 *
 * @private
 */
SuperILtan.YukiboJ.prototype.onDieCallback_ = function() {
	'use strict';
}
