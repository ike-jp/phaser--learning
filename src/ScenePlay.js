
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

	// プレイヤー
	this.player;
	this.player_move_vx;
	this.player_move_vy;
	this.player_can_jump;
	this.player_is_dashed;

	// 敵
	this.enemies;

	this.is_failed;
	this.cursors;

	this.ready = false;
};

BasicGame.ScenePlay.prototype = {

	preload: function ()
	{
		console.log("game.preload");
	},

	create: function()
	{
		this.game.stage.backgroundColor = Phaser.Color.getColor(80, 128, 255);

		// マップ設定
		this.map = this.game.add.tilemap('map2');
		this.map.addTilesetImage('bg');
		this.map.addTilesetImage('terrain');

		var bgLayer = this.map.createLayer('BG Layer');
		bgLayer.resizeWorld();
		this.layer = this.map.createLayer('Tile Layer');
		this.layer.resizeWorld();
		//this.layer.debug = true;

		this.map.setCollisionBetween(1, 5, true, 'Tile Layer');
		this.map.smoothed = false;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.setBoundsToWorld();
		this.game.physics.arcade.checkCollision.down = false; // ワールドの下判定を行わない
		this.game.physics.arcade.gravity.y = 1500;

		// プレイヤー設定
		this.player = this.game.add.sprite(
			16*5, // this.game.world.centerX,
			16*13,// this.game.world.centerY,
			'iltan'
		);
		this.player.anchor.setTo(0.5, 0.5); // for flip
		this.game.physics.enable(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.checkWorldBounds = true;
		this.player.events.onOutOfBounds.add(this.playerOutOfBounds, this);
		this.player.body.linearDamping = 1;
		this.player.smoothed = false;

		// プレイヤーアニメーション設定
		this.player.animations.add('stand', [0], 10, false);
		this.player.animations.add('walk', [1, 2], 8, true);
		this.player.animations.add('run', [2, 3], 15, true);
		this.player.animations.add('quickturn', [4], 10, false);
		this.player.animations.add('jump', [5], 10, false);
		this.player.animations.add('failed', [6], 10, false);
		this.player.play('stand');

		// enemy group
		this.enemies = this.game.add.group();
		this.enemies.enableBody = true;
		//this.physicsBodyType = Phaser.Physics.ARCADE;
		this.map.createFromObjects('Enemies Layer', 41, 'enemy', 0, true, false, this.enemies);
		this.enemies.callAll('animations.add', 'animations', 'walk', [0, 1], 6, true);
		this.enemies.callAll('animations.play', 'animations', 'walk');
		this.enemies.setAll('body.velocity.x', -20);
		this.enemies.setAll('smoothed', false);

		this.enemies.setAll('checkWorldBounds', true);
//		this.enemies.callAll('events.onOutOfBounds.add', function() {}, this);
		this.enemies.setAll('body.collideWorldBouns', true);
		this.enemies.setAll('body.bounce.x', 1);
		this.enemies.setAll('body.bounce.y', 0);

		// ゲーム設定
		this.game.camera.follow(this.player);
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.player.revive();
		this.player_move_vx = 0;
		this.player_move_vy = 0;
		this.player_is_dashed = false;
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

	update: function()
	{
		this.game.physics.arcade.collide(this.enemies, this.layer);
		this.game.physics.arcade.collide(this.enemies);

		if (this.is_failed) {
			return;
		}

		this.game.physics.arcade.collide(this.player, this.layer);
		this.game.physics.arcade.overlap(this.player, this.enemies, this.collideEnemy, null, this);
		var is_pressed_dash_button = this.input.keyboard.isDown(Phaser.Keyboard.X);

		// 判定の後に1度実行されてしまうので、
		// failed時にリセットした速度が加算されてしまう
		if (this.is_failed) {
			return;
		}

		// ダッシュボタン押下状態とその反対では、
		// 加速値に若干の差がある
		if (this.cursors.left.isDown) {
			if (is_pressed_dash_button) {
				this.player_move_vx -= 6;
				// ダッシュ中にダッシュボタンを放した際に、
				// 歩き速度用のクランプをされる問題を回避するためのフラグ
				if (!this.player_is_dashed && this.player_move_vx < -80) {
					this.player_is_dashed = true;
				}
				if (this.player_move_vx <= -140) {
					this.player_move_vx = -140;
				}
			} else {
				if (!this.player_is_dashed) {
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
				if (!this.player_is_dashed && this.player_move_vx > 80) {
					this.player_is_dashed = true;
				}
				this.player_move_vx += 6;
				if (this.player_move_vx >= 140) {
					this.player_move_vx = 140;
				}
			} else {
				if (!this.player_is_dashed) {
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
			if (this.player_is_dashed && !is_pressed_dash_button && this.player_move_vx >= -80) {
				this.player_is_dashed = false;
			}
		} else if (this.player_move_vx > 0) {
			this.player_move_vx = Phaser.Math.minSub(this.player_move_vx, 2, 0);
			if (this.player_is_dashed && !is_pressed_dash_button && this.player_move_vx <= 80) {
				this.player_is_dashed = false;
			}
		}
		this.player.body.velocity.x = this.player_move_vx;

		// ジャンプ
		if (this.player.body.onFloor()) {
			this.player_can_jump = true;
		}
		// ジャンプ
		if (this.cursors.up.isDown
		||  this.input.keyboard.isDown(Phaser.Keyboard.Z)
		||  this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			if (this.player.body.onFloor()) {
				this.player.body.velocity.y = -270;
			} else if (this.player_can_jump) {
				this.player.body.velocity.y -= 17;
				if (this.player.body.velocity.y < -400) {
					this.player_can_jump = false;
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

	render: function()
	{
		//this.game.debug.bodyInfo(this.player, 0, 0);
		//this.game.debug.body(this.player);
		this.game.debug.body(this.enemies);
	},

	quitGame: function(pointer)
	{
		this.state.start('SceneTitle');
	},

	continueGame: function()
	{
		this.state.start('SceneLoad');
	},

	failedGame: function()
	{
		if (this.is_failed) {
			return;
		}
		this.is_failed = true;
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = -400;
		this.player.play("failed");
		console.log("called failedGame");

		// 残機チェック
		if (true) {
			this.game.time.events.add(Phaser.Timer.SECOND * 3, this.continueGame, this);
		} else {
			this.quitGame();
		}
	},

	collideEnemy: function(player, enemy)
	{
		if (player.body.touching.down) {
			player.body.velocity.y = -300;
			enemy.kill();
		} else {
			this.failedGame();
		}
	},

	collideEnemyOwn: function(dst, src)
	{
		//dst.body.velocity.x *= -1;
	},

	playerOutOfBounds: function(player)
	{
		console.log(player.body.x);
		this.failedGame();
	},
};
