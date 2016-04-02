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
	var gameState = this.gameState;
	var layers = this.gameState.layers;
	var players = this.gameState.groups.players;

	this.game.physics.arcade.overlap(this, players, this.onCollectCallback_, null, this);
}

/**
 * コイン取得
 *
 * @private
 */
SuperILtan.Coin.prototype.onCollectCallback_ = function(coin, player) {
	'use strict';
	coin.kill();
	// addScore
}
