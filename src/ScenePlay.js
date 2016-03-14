
BasicGame.ScenePlay = function(game) {

	// When a State is added to Phaser it automatically has the
	// following properties set on it, even if they already exist:
	//
	this.game;		//  a reference to the currently running game
	this.add;		//  used to add this.playerites, text, groups, etc
	this.camera;	//  a reference to the game camera
	this.cache;		//  the game cache
	this.input;		//  the global input manager (you can access
					//  this.input.keyboard, this.input.mouse, as well
					//  from it)
	this.load;		//  for preloading assets
	this.math;		//  lots of useful common math operations
	this.sound;		//  the sound manager - add a sound, play one,
					//  set-up markers, etc
	this.stage;		//  the game stage
	this.time;		//  the clock
	this.tweens;	//  the tween manager
	this.world;		//  the game world
	this.particles;	//  the particle manager
	this.physics;	//  the physics manager
	this.rnd;		//  the repeatable random number generator

	//  You can use any of these from any function within this State.
	//  But do consider them as being 'reserved words', i.e. don't create
	//  a property for your own game called "world" or you'll over-write
	//  the world reference.
	//
	this.map;
	this.layer;
	this.player;
	this.player_move_vx;
	this.player_move_vy;
	this.can_jump;
	this.is_dashed;
	this.is_failed;
	this.cursors;

	this.ready = false;
};

BasicGame.ScenePlay.prototype = {

	preload: function () {
		console.log("game.preload");
	},

	create: function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.stage.backgroundColor = Phaser.Color.getColor(80, 128, 255);

		// マップ設定
		this.map = this.game.add.tilemap('map', 16, 16);
		this.map.addTilesetImage('tiles');
		this.map.setCollision(1);
		this.map.setCollisionBetween(2, 4);
		this.map.smoothed = false;

		this.layer = this.map.createLayer(0); //('World1')
		//this.layer.debug = true;
		this.layer.resizeWorld();

		// プレイヤー設定
		this.player = this.game.add.sprite(
			16*5, // this.game.world.centerX,
			16*13,// this.game.world.centerY,
			'iltan'
		);
		this.player.anchor.setTo(0.5, 0.5); // for flip
		this.player.smoothed = false;
		this.game.physics.enable(this.player);
		this.game.physics.arcade.gravity.y = 1500;
		this.player.body.linearDamping = 1;
		this.player.body.collideWorldBouns = true;

		// プレイヤーアニメーション設定
		this.player.animations.add('stand', [0], 10, false);
		this.player.animations.add('walk', [1, 2], 8, true);
		this.player.animations.add('run', [2, 3], 15, true);
		this.player.animations.add('quickturn', [4], 10, false);
		this.player.animations.add('jump', [5], 10, false);
		this.player.animations.add('failed', [6], 10, false);
		this.player.play('stand');

		// ゲーム設定
		this.game.camera.follow(this.player);
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.player.revive();
		this.player_move_vx = 0;
		this.player_move_vy = 0;
		this.is_dashed = false;
		this.is_failed = false;
/*
		var fullscreen = this.add.button(
			this.game.width-8,
			this.game.height-8,
			'fullscreen',
			BasicGame.toggleFullscreen,
			this,
			'over', 'up', 'down'
		);
		fullscreen.pivot.x = fullscreen.width;
		fullscreen.pivot.y = fullscreen.height;
*/
	},

	update: function() {
		if (this.is_failed) {
			return;
		}

		this.game.physics.arcade.collide(this.player, this.layer);
		var is_pressed_dash_button = this.input.keyboard.isDown(Phaser.Keyboard.X);

		// ダッシュボタン押下状態とその反対では、
		// 加速値に若干の差がある
		if (this.cursors.left.isDown) {
			if (is_pressed_dash_button) {
				this.player_move_vx -= 6;
				// ダッシュ中にダッシュボタンを放した際に、
				// 歩き速度用のクランプをされる問題を回避するためのフラグ
				if (!this.is_dashed && this.player_move_vx < -80) {
					this.is_dashed = true;
				}
				if (this.player_move_vx <= -140) {
					this.player_move_vx = -140;
				}
			} else {
				if (!this.is_dashed) {
					this.player_move_vx -= 5;
					if (this.player_move_vx <= -80) {
						this.player_move_vx = -80;
					}
				}
			}
		} else if (this.cursors.right.isDown) {
			if (is_pressed_dash_button) {
				// ダッシュ中にダッシュボタンを放した際に、
				// 歩き速度用のクランプをされる問題を回避するためのフラグ
				if (!this.is_dashed && this.player_move_vx > 80) {
					this.is_dashed = true;
				}
				this.player_move_vx += 6;
				if (this.player_move_vx >= 140) {
					this.player_move_vx = 140;
				}
			} else {
				if (!this.is_dashed) {
					this.player_move_vx += 5;
					if (this.player_move_vx >= 80) {
						this.player_move_vx = 80;
					}
				}
			}
		}

		// すべり処理
		if (this.player_move_vx < 0) {
			this.player_move_vx = Phaser.Math.maxAdd(this.player_move_vx, 2, 0);
			if (this.is_dashed && !is_pressed_dash_button && this.player_move_vx >= -80) {
				this.is_dashed = false;
			}
		} else if (this.player_move_vx > 0) {
			this.player_move_vx = Phaser.Math.minSub(this.player_move_vx, 2, 0);
			if (this.is_dashed && !is_pressed_dash_button && this.player_move_vx <= 80) {
				this.is_dashed = false;
			}
		}
		this.player.body.velocity.x = this.player_move_vx;

		// ジャンプ
		if (this.player.body.onFloor()) {
			this.can_jump = true;
		}
		// ジャンプ
		if (this.cursors.up.isDown
		||  this.input.keyboard.isDown(Phaser.Keyboard.Z)
		||  this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			if (this.player.body.onFloor()) {
				this.player.body.velocity.y = -270;
			} else if (this.can_jump) {
				this.player.body.velocity.y -= 17;
				if (this.player.body.velocity.y < -400) {
					this.can_jump = false;
				}
			}
		}

		// テスト用
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
			this.failedGame();
			return;
		}

		// アニメーション制御
		if (this.player.body.velocity.y != 0) {
			this.player.play('jump');
		} else if (this.player.body.velocity.x < 0) {
			if (this.cursors.right.isDown) {
				this.player.scale.x = 1;
				this.player.play('quickturn');
			} else {
				this.player.scale.x = -1;
				if (is_pressed_dash_button) {
					this.player.play('run');
				} else {
					this.player.play('walk');
				}
			}
		} else if (this.player.body.velocity.x > 0) {
			if (this.cursors.left.isDown) {
				this.player.scale.x = -1;
				this.player.play('quickturn');
			} else {
				this.player.scale.x = 1;
				if (is_pressed_dash_button) {
					this.player.play('run');
				} else {
					this.player.play('walk');
				}
			}
		} else {
			this.player.play('stand');
		}
	},

	render: function() {
		//this.game.debug.bodyInfo(this.player, 0, 0);
	},

	quitGame: function(pointer) {
		this.state.start('SceneTitle');
	},

	continueGame: function() {
		this.state.start('SceneLoad');
	},

	failedGame: function() {
		this.is_failed = true;
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = -100;
		this.player.play("failed");

		// 残機チェック
		if (true) {
			this.game.time.events.add(Phaser.Timer.SECOND * 3, this.continueGame, this);
		} else {
			this.quitGame();
		}
	},
};
