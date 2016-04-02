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
	this.body.linearDamping = 1;
	this.events.onOutOfBounds.add(this.onOutOfBoundsCallback_, this);

	this.maxHealth = 1;
	this.health = this.maxHealth;
	this.events.onKilled.add(this.onKilledCallback_, this, this);

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
	this.game.physics.arcade.overlap(this, enemies, this.onHitEnemyCallback_, null, this);

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
	if (player.body.touching.down) {
		player.body.velocity.y = -300;
		enemy.kill();
		//this.addEffectOfScore(enemy.position.x, enemy.position.y, score);
	} else {
		player.damage(1);
	}
}

/**
 * このプレイヤーのライフが０になった時に呼ばれるコールバック
 *
 * @private
 */
SuperILtan.Player.prototype.onKilledCallback_ = function() {
	'use strict';
	var gameState = this.gameState;

	console.log("called killedPlayser_");
	var dyingPlayer = this.game.add.sprite(
		this.body.position.x,
		this.body.position.y,
		'player_spritesheet'
	);
	dyingPlayer.animations.add('failed', [6], 10, false);
	dyingPlayer.play('failed');

	var duration = 500;
	var ease = Phaser.Easing.Back.In;
	var auto_start = true;
	var delay = 400;
	var repeat = 0;
	var yoyo = false;

	// Easingは良さそうなのが無いのでeaseInBackを指定。
	// TODO: 自身で定義することもできるが、重要ではないので後にする
	// easeに指定されたメソッドには、durationの現在の割合が0.0~1.0で渡されてくる
	// 詳しくはPhaser.Easingとhttp://easings.net/ja#を見る
	var tween = this.game.add.tween(dyingPlayer);
	tween.to(
		{y: this.game.physics.arcade.bounds.bottom },
		duration, ease, auto_start, delay, repeat, yoyo
	);
	tween.onComplete.add(function() {
			this.game.time.events.add(Phaser.Timer.SECOND * 3, this.die_, this);
		},
		this
	);
}

/**
 * プレイヤーが画面外に出た場合の処理
 *
 * @private
 * @param {Phaser.Sprite} player
 */
SuperILtan.Player.prototype.onOutOfBoundsCallback_ = function(player) {
	'use strict';
	console.log(this.position.y);
	console.log(this.game.physics.arcade.bounds.bottom);
	if (this.position.y > this.game.physics.arcade.bounds.bottom) {
		this.damage(1);
	}
}

/**
 * @private
 */
SuperILtan.Player.prototype.die_ = function() {
	'use strict';
	var gameState = this.gameState;
	// 残機チェック
	if (true) {
		gameState.restartLevel();
	} else {
		gameState.gameOver();
	}
}
