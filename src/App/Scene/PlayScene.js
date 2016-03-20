
Application.namespace('App.Scene');

/**
 * プレイ画面クラス
 *
 * @param {Phaser.Game} game
 * @constructor
 * @extends {AbstractScene}
 */
App.Scene.PlayScene = function(game)
{
	App.Scene.AbstractScene.call(this, game);

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

	// ゲーム情報
	this.time_limit;
	this.time_counter;

	this.text_level;
	this.text_time;
	this.text_score;

	// プレイヤー
	this.player;
	this.player_move_vx;
	this.player_move_vy;
	this.player_can_jump;
	this.player_is_dashed;

	// 敵
	this.enemies;

	// アイテム
	this.goal_symbol;

	this.is_failed;
	this.cursors;

	this.ready = false;
};
Application.inherits(App.Scene.PlayScene, App.Scene.AbstractScene);

/**
 * @override
 */
App.Scene.PlayScene.prototype.preload = function()
{
	console.log("game.preload");
};

/**
 * @override
 */
App.Scene.PlayScene.prototype.create = function()
{
	// 開始前の残機数表示
	// ゲームの開始呼び出し
	// ポーズ、レジューム対応
	// ゲーム終了の受け取り
	// クリア後の結果表示
	// クリア後、ミス後の遷移制御
	//   のみを行うようにする

	this.game.stage.backgroundColor = Phaser.Color.getColor(80, 128, 255);

	// マップ設定
	this.map = this.game.add.tilemap('map');
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
	this.game.physics.arcade.checkCollision.up = false; // ワールドの上判定を行わない
	this.game.physics.arcade.checkCollision.down = false; // ワールドの下判定を行わない
	this.game.physics.arcade.gravity.y = 1500;

	// プレイヤー設定
	this.player = this.game.add.sprite(
		16*5, // this.game.world.centerX,
		16*13,// this.game.world.centerY,
		'player'
	);
	this.player.anchor.setTo(0.5, 0.5); // for flip
	this.game.physics.enable(this.player);
	this.player.body.collideWorldBounds = true;
	this.player.checkWorldBounds = true;
	this.player.events.onOutOfBounds.add(this.playerOutOfBounds_, this);
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
	this.map.createFromObjects('Enemies Layer', "yukibo-s", 'enemies1', 0, true, false, this.enemies);
	this.map.createFromObjects('Enemies Layer', "yukibo-e", 'enemies2', 0, true, false, this.enemies);
	this.enemies.callAll('animations.add', 'animations', 'walk', [0, 1], 6, true);
	this.enemies.callAll('animations.play', 'animations', 'walk');
	this.enemies.setAll('body.velocity.x', -20);
	this.enemies.setAll('smoothed', false);

	this.enemies.setAll('checkWorldBounds', true);
//		this.enemies.callAll('events.onOutOfBounds.add', function() {}, this);
	this.enemies.setAll('body.collideWorldBouns', true);
	this.enemies.setAll('body.bounce.x', 1);
	this.enemies.setAll('body.bounce.y', 0);

	// ゴールシンボル
	// TODO: 本来アイテムと一緒にすべきだが、
	// 16x16のタイルセットから32x32のオブジェクトを生成する方法が分からないので暫定対応
	this.goal_symbol = this.game.add.group();
	this.goal_symbol.enableBody = true;
	this.map.createFromObjects('Items Layer', "goal-symbol", 'goal-symbol', 0, true, false, this.goal_symbol);
	this.goal_symbol.setAll('smoothed', false);
	this.goal_symbol.setAll('body.allowGravity', false);

	// タイマー
	this.time_limit = 120;
	this.time_counter = this.time_limit;
	this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTimeCounter_, this);

	// テキスト
	this.text_level = this.game.add.retroFont('myfont', 8, 10, Phaser.RetroFont.TEXT_SET3 + 'x-:', 10);
	var t = this.game.add.image(0, 0, this.text_level);
	t.smoothed = false;
	t.fixedToCamera = true;
	t.cameraOffset.setTo(10, 6);
	this.text_level.text = "WORLD1-1";

	this.text_time = this.game.add.retroFont('myfont', 8, 10, Phaser.RetroFont.TEXT_SET3 + 'x-:', 10);
	t = this.game.add.image(90, 6, this.text_time);
	t.smoothed = false;
	t.fixedToCamera = true;
	t.cameraOffset.setTo(90, 6)
	this.text_time.text = 'TIME:' + ('00'+this.time_counter).slice(-3);

	this.text_score = this.game.add.retroFont('myfont', 8, 10, Phaser.RetroFont.TEXT_SET3 + 'x-:', 10);
	t = this.game.add.image(190, 6, this.text_score);
	t.smoothed = false;
	t.fixedToCamera = true;
	t.cameraOffset.setTo(180, 6)
	this.text_score.text = "999999";

	// ゲーム設定
	this.game.camera.follow(this.player);
	this.game.camera.deadzone = new Phaser.Rectangle(16*6, 16*6, 16*2, 16*4);

	this.cursors = this.game.input.keyboard.createCursorKeys();
	this.player.revive();
	this.player_move_vx = 0;
	this.player_move_vy = 0;
	this.player_is_dashed = false;
	this.is_failed = false;
};

/**
 * @override
 */
App.Scene.PlayScene.prototype.update = function()
{
	this.game.physics.arcade.collide(this.enemies, this.layer);
	this.game.physics.arcade.collide(this.enemies);

	if (this.is_failed) {
		return;
	}

	this.game.physics.arcade.collide(this.player, this.layer);
	this.game.physics.arcade.overlap(this.player, this.goal_symbol, this.levelComplete_, null, this);
	this.game.physics.arcade.overlap(this.player, this.enemies, this.collideEnemy_, null, this);
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
		this.failedGame_();
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
};

/**
 * @override
 */
App.Scene.PlayScene.prototype.render = function()
{
	//this.game.debug.bodyInfo(this.player, 0, 0);
	//this.game.debug.body(this.player);
	this.game.debug.body(this.enemies);

	// これを表示するにはindex.htmlのPhaser.gameをnewしているところで、
	// Phaser.AUTOが指定されている部分をPhaser.CANVASに変更する必要がある。
	// WebGLではgame.contextが使えないらしい
	//var zone = this.game.camera.deadzone;
	//this.game.context.fillStyle = 'rgba(255,0,0,0.6)';
	//this.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
};

/**
 * このゲームを終了してタイトルに戻る
 *
 * @private
 */
App.Scene.PlayScene.prototype.quitGameToTitle_ = function(pointer)
{
	this.state.start('SceneTitle');
};

/**
 * このゲームをやり直す
 *
 * @private
 */
App.Scene.PlayScene.prototype.retryGame_ = function()
{
	this.state.start('SceneLoad');
};

/**
 * ゲーム失敗処理
 *
 * @private
 */
App.Scene.PlayScene.prototype.failedGame_ = function()
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
		this.game.time.events.add(Phaser.Timer.SECOND * 3, this.retryGame_, this);
	} else {
		this.quitGameToTitle_();
	}
};

/**
 * ゲームクリア処理
 *
 * @private
 */
App.Scene.PlayScene.prototype.levelComplete_ = function(player, symbol)
{
	console.log('LEVEL COMPLETE!');
	symbol.kill();

	player.body.velocity.x = 0;
	var t = this.game.add.tween(player.scale);
	t.to({x:2, y:2}, 1000, Phaser.Easing.Linear.None);
	t.start();
};

/**
 * ゲームタイマー更新
 *
 * @private
 */
App.Scene.PlayScene.prototype.updateTimeCounter_ = function()
{
	this.time_counter -= 1;
	if (this.time_counter >= 0) {
		this.text_time.text = 'TIME:' + ('00'+this.time_counter).slice(-3);
	} else if (this.time_counter == -1) {
		this.failedGame_();
	}
};

/**
 * ゴールシンボル取得
 *
 * @private
 * @param {Phaser.Sprite} player
 * @param {Phaser.Sprite} symbol
 */
App.Scene.PlayScene.prototype.levelComplete_ = function(player, symbol)
{
	console.log('LEVEL COMPLETE!');
	symbol.kill();

	player.body.velocity.x = 0;
	var t = this.game.add.tween(player.scale);
	t.to({x:2, y:2}, 1000, Phaser.Easing.Linear.None);
	t.start();
};

/**
 * プレイヤーx敵衝突コールバック
 *
 * @private
 * @param {Phaser.Sprite} player
 * @param {Phaser.Sprite} symbol
 */
App.Scene.PlayScene.prototype.collideEnemy_ = function(player, enemy)
{
	if (player.body.touching.down) {
		player.body.velocity.y = -300;
		enemy.kill();
	} else {
		this.failedGame_();
	}
};

/**
 * プレイヤーが画面外に出た場合の処理
 *
 * @private
 * @param {Phaser.Sprite} player
 */
App.Scene.PlayScene.prototype.playerOutOfBounds_ = function(player)
{
	console.log(player.position.y);
	console.log(this.game.physics.arcade.bounds.bottom);
	if (player.position.y > this.game.physics.arcade.bounds.bottom) {
		this.failedGame_();
	}
};
