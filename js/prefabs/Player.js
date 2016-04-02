/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan');
Application.namespace('util.Keyboard');

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

	this.body.maxVelocity.y = this.gameState.MAX_VELOCITY_Y;
	this.smoothed = false;
	this.checkWorldBounds = true;
	this.body.collideWorldBouns = true;

//	this.player.events.onOutOfBounds.add(this.playerOutOfBounds_, this);
	this.body.linearDamping = 1;

	this.maxHealth = 1;
//	this.health = this.player.maxHealth;
//	this.events.onKilled.add(this.killedPlayer_, this, this.player);

	this.keyboard = new util.Keyboard(this.game.input.keyboard);
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
	this.keyboard.update();
	var game = this.gameState.game;
	var layers = this.gameState.layers;
	var enemies = this.gameState.groups.enemies;

	this.game.physics.arcade.collide(this, layers['Tile Layer']);

	var is_pressed_dash_button = this.keyboard.isOn(Phaser.Keyboard.X);
	if (!is_pressed_dash_button) {
		this.body.maxVelocity.x = 60;
		this.body.drag.x = 200;
	} else {
		this.body.maxVelocity.x = 140;
		this.body.drag.x = 240;
	}
	this.body.acceleration.x = 0;
	if (this.keyboard.isOn(Phaser.Keyboard.LEFT)) {
		if (this.body.velocity.x > 0) {
			this.body.acceleration.x -= 200;
		} else {
			this.body.acceleration.x -= 100;
		}
	} else if (this.keyboard.isOn(Phaser.Keyboard.RIGHT)) {
		if (this.body.velocity.x < 0) {
			this.body.acceleration.x += 200;
		} else {
			this.body.acceleration.x += 100;
		}
	}

	// ジャンプ
	if (this.body.onFloor()) {
		this.player_can_jump = true;
	}
	// ジャンプ
	if (this.keyboard.isTriggered(Phaser.Keyboard.UP)
	||  this.keyboard.isTriggered(Phaser.Keyboard.Z)
	||  this.keyboard.isTriggered(Phaser.Keyboard.SPACEBAR)) {
		if (this.body.onFloor()) {
			this.body.velocity.y = -270;
		}
	}
	if (this.keyboard.isPressed(Phaser.Keyboard.UP)
	||  this.keyboard.isPressed(Phaser.Keyboard.Z)
	||  this.keyboard.isPressed(Phaser.Keyboard.SPACEBAR)) {
		if (this.player_can_jump) {
			this.body.velocity.y -= 17;
			if (this.body.velocity.y < -400) {
				this.player_can_jump = false;
			}
		}
	}

	// アニメーション制御
	if (this.body.velocity.y != 0) {
		this.play('jump');
	} else if (this.body.velocity.x < 0) {
		if (this.keyboard.isOn(Phaser.Keyboard.RIGHT)) {
			this.scale.x = 1;
			this.play('quickturn');
		} else {
			this.scale.x = -1;
			if (is_pressed_dash_button) {
				this.play('run');
			} else {
				this.play('walk');
			}
		}
	} else if (this.body.velocity.x > 0) {
		if (this.keyboard.isOn(Phaser.Keyboard.LEFT)) {
			this.scale.x = -1;
			this.play('quickturn');
		} else {
			this.scale.x = 1;
			if (is_pressed_dash_button) {
				this.play('run');
			} else {
				this.play('walk');
			}
		}
	} else {
		this.play('stand');
	}
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
