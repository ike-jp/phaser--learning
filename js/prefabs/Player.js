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
SuperILtan.Player = function(gameState, x, y, tiledMapObject) {
	'use strict';
	SuperILtan.AbstractPrehab.call(this, gameState, x, y, tiledMapObject);
	this.gameState.game.physics.arcade.enable(this);

	this.anchor.setTo(0.5); // for flip

	this.animations.add('stand', [0], 10, false);
	this.animations.add('walk', [1, 2], 8, true);
	this.animations.add('run', [2, 3], 15, true);
	this.animations.add('quickturn', [4], 10, false);
	this.animations.add('jump', [5], 10, false);
	this.animations.add('failed', [6], 10, false);
	this.play('stand');

	this.body.maxVelocity.y = this.MAX_VELOCITY_Y;
	this.smoothed = false;
	this.checkWorldBounds = true;
	this.body.collideWorldBouns = true;

//	this.player.events.onOutOfBounds.add(this.playerOutOfBounds_, this);
	this.body.linearDamping = 1;

	this.maxHealth = 1;
//	this.health = this.player.maxHealth;
//	this.events.onKilled.add(this.killedPlayer_, this, this.player);
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
	var layers = this.gameState.layers;
	var enemies = this.gameState.groups.enemies;

	this.game.physics.arcade.collide(this, layers['Tile Layer']);
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
