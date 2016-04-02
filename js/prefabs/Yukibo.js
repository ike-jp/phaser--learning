/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan');

/**
 * 敵１クラス
 *
 * @constructor
 */
SuperILtan.Yukibo = function(gameState, x, y, tiledMapObject) {
	'use strict';
	SuperILtan.AbstractPrehab.call(this, gameState, x, y, tiledMapObject);
	this.gameState.game.physics.arcade.enable(this);

	this.anchor.setTo(0.5);
//	this.body.allowGravity = false;

	this.animations.add('walk', [0, 1], 6, true);
	this.animations.play('walk');
	this.body.velocity.x = -20;
	this.body.maxVelocity.y = this.gameState.MAX_VELOCITY_Y;
	this.smoothed = false;

	this.checkWorldBounds = true;
	this.body.collideWorldBouns = true;
	this.body.bounce.x = 1;
	this.body.bounce.y = 0;
/*
	this.direction = 'RIGHT';
	this.cursorKeys = game.input.keyboard.createCursorKeys();
*/
}
Application.inherits(
	SuperILtan.Yukibo,
	SuperILtan.AbstractPrehab
);

/**
 * @override
 */
SuperILtan.Yukibo.prototype.update = function() {
	'use strict';
	var game = this.gameState.game;
	var layers = this.gameState.layers;
	var enemies = this.gameState.groups.enemies;

	this.game.physics.arcade.collide(this, layers['Tile Layer']);
	//game.physics.arcade.override(this, enemies, this.onHitEnemy, null, this);

	// 足場がなくなったら反転する処理とか書く
}

/**
 * この敵のライフが０になった時に呼ばれるコールバック
 *
 * @private
 */
SuperILtan.Yukibo.prototype.onDieCallback_ = function() {
	'use strict';
}
