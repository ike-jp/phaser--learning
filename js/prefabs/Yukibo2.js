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
SuperILtan.Yukibo2 = function(gameState, x, y, tiledMapObject) {
	'use strict';
	SuperILtan.AbstractPrehab.call(this, gameState, x, y, tiledMapObject);
	/*
	var game = this.gameState.game;
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;
	this.direction = 'RIGHT';
	this.anchor.setTo(0.5);
	this.cursorKeys = game.input.keyboard.createCursorKeys();
	*/
}
Application.inherits(
	SuperILtan.Yukibo2,
	SuperILtan.AbstractPrehab
);

/**
 * @override
 */
SuperILtan.Yukibo2.prototype.update = function() {
	'use strict';
	var game = this.gameState.game;
	var layer = this.gameState.layer;
	var enemies = this.gameState.groups.enemies;

	//game.physics.arcade.collide(this, layer);
	//game.physics.arcade.override(this, enemies, this.onHitEnemy, null, this);

	// 足場がなくなったら反転する処理とか書く
}

/**
 * この敵のライフが０になった時に呼ばれるコールバック
 *
 * @private
 */
SuperILtan.Yukibo2.prototype.onDieCallback_ = function() {
	'use strict';
}
