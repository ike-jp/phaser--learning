/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan');

/**
 * コインクラス
 *
 * @constructor
 */
SuperILtan.Coin = function(gameState, x, y, tiledMapObject) {
	'use strict';
	SuperILtan.AbstractPrehab.call(this, gameState, x, y, tiledMapObject);
	this.gameState.game.physics.arcade.enable(this);
	this.anchor.setTo(0.5);

	this.animations.add('idle', [0, 0, 1, 2, 1], 4, true);
	this.animations.play('idle');
	this.body.allowGravity = false;
	this.smoothed = false;

}
Application.inherits(
	SuperILtan.Coin,
	SuperILtan.AbstractPrehab
);

/**
 * @override
 */
SuperILtan.Coin.prototype.update = function() {
	'use strict';
	var game = this.gameState.game;
	var layers = this.gameState.layers;
	var enemies = this.gameState.groups.enemies;

//	this.game.physics.arcade.collide(this, layers['Tile Layer']);
}

/**
 * この敵のライフが０になった時に呼ばれるコールバック
 *
 * @private
 */
SuperILtan.Coin.prototype.onDieCallback_ = function() {
	'use strict';
}
