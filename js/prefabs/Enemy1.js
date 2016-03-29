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
SuperILtan.Enemy1 = function(gameState, position, tiledMapObject) {
	'use strict';
	Phaser.AbstractPrehab.call(this, gameState, position, tiledMapObject);
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
	SuperILtan.Enemy1,
	SuperILtan.AbstractPrehab
);

/**
 * @override
 */
SuperILtan.Enemy1.prototype.update = function() {
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
SuperILtan.Enemy1.prototype.onDieCallback_ = function() {
	'use strict';
}
