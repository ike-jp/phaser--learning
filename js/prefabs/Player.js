/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan');

/**
 * プレイヤークラス
 *
 * @constructor
 */
SuperILtan.Player = function(gameState, position, tiledMapObject) {
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
	SuperILtan.Player,
	SuperILtan.AbstractPrehab
);

/**
 * @override
 */
SuperILtan.Player.prototype.update = function() {
	'use strict';
	var game = this.gameState.game;
	var layer = this.gameState.layer;
	var enemies = this.gameState.groups.enemies;
	/*
	game.physics.arcade.collide(this, layer);
	game.physics.arcade.override(this, enemies, this.onHitEnemy, null, this);

	var cursorKeys = this.cursorKeys;
	if (cursorKeys.right.isDown) {
		this.direction = 'RIGHT';
		this.animations.play('walk');
		this.scale.setTo(-1, 1);
	} else if (cursorKeys.left.isDown) {
		this.direction = 'LEFT';
		this.animations.play('walk');
		this.scale.setTo(1, 1);
	} else {
		this.animations.play('stand');
	}
	*/
}

/**
 * このプレイヤーが敵と衝突した際に呼ばれるコールバック
 *
 * @private
 */
SuperILtan.Player.prototype.onHitEnemyCallback_ = function(player, enemy) {
	'use strict';
}

/**
 * このプレイヤーのライフが０になった時に呼ばれるコールバック
 *
 * @private
 */
SuperILtan.Player.prototype.onDieCallback_ = function() {
	'use strict';
	/*
	var gameState = this.gameState;
	if (this.lives > 0) {
		gameState.restartLevel();
	} else {
		gameState.gameOver();
	}
	*/
}
