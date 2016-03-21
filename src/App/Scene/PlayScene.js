/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('App.Scene');
Application.namespace('App.Util.Input.Keyboard');

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
	this.MAX_VELOCITY_Y = 250;
	this.TEXT_SET = Phaser.RetroFont.TEXT_SET3 + 'x-:!'

	this.text_level;
	this.text_time;
	this.text_score;
	this.text_level_complete;

	// プレイヤー
	this.player;
	this.player_move_vy;
	this.player_can_jump;
	this.player_is_dashed;

	// 敵
	this.enemies;

	// アイテム
	this.items;
	this.goal_symbol;

	this.ready = false;

	// テスト
	this.keyboard;
}
Application.inherits(App.Scene.PlayScene, App.Scene.AbstractScene);

/**
 * @override
 */
App.Scene.PlayScene.prototype.preload = function()
{
	console.log("game.preload");
}

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

	// item group
	this.items = this.game.add.group();
	this.items.enableBody = true;
	this.map.createFromObjects('Items Layer', "yuni-", 'items', 0, true, false, this.items);
	this.items.callAll('animations.add', 'animations', 'idle', [0, 0, 1, 2, 1], 4, true);
	this.items.callAll('animations.play', 'animations', 'idle');
	this.items.setAll('body.allowGravity', false);
	this.items.setAll('body.maxVelocity.y', this.MAX_VELOCITY_Y);
	this.items.setAll('smoothed', false);

	// enemy group
	this.enemies = this.game.add.group();
	this.enemies.enableBody = true;
	//this.physicsBodyType = Phaser.Physics.ARCADE;
	this.map.createFromObjects('Enemies Layer', "yukibo-s", 'enemies1', 0, true, false, this.enemies);
	this.map.createFromObjects('Enemies Layer', "yukibo-e", 'enemies2', 0, true, false, this.enemies);
	this.enemies.setAll('anchor.x', 0.5);
	this.enemies.setAll('anchor.y', 0.5);
	this.enemies.callAll('animations.add', 'animations', 'walk', [0, 1], 6, true);
	this.enemies.callAll('animations.play', 'animations', 'walk');
	this.enemies.setAll('body.velocity.x', -20);
	this.enemies.setAll('body.maxVelocity.y', this.MAX_VELOCITY_Y);
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
	this.goal_symbol.setAll('body.allowGravity', false);
	this.goal_symbol.setAll('smoothed', false);

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
	this.player.body.maxVelocity.y = this.MAX_VELOCITY_Y;
	this.player.body.linearDamping = 1;
	this.player.smoothed = false;

	this.player.maxHealth = 1;
	this.player.health = this.player.maxHealth;
	this.player.events.onKilled.add(this.killedPlayer_, this, this.player);

	// プレイヤーアニメーション設定
	this.player.animations.add('stand', [0], 10, false);
	this.player.animations.add('walk', [1, 2], 8, true);
	this.player.animations.add('run', [2, 3], 15, true);
	this.player.animations.add('quickturn', [4], 10, false);
	this.player.animations.add('jump', [5], 10, false);
	this.player.animations.add('failed', [6], 10, false);
	this.player.play('stand');

	// タイマー
	this.time_limit = 120;
	this.time_counter = this.time_limit;
	this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTimeCounter_, this);

	// テキスト
	this.text_level = this.game.add.retroFont('myfont', 8, 10, this.TEXT_SET, 10);
	var t = this.game.add.image(0, 0, this.text_level);
	t.smoothed = false;
	t.fixedToCamera = true;
	t.cameraOffset.setTo(10, 6);
	this.text_level.text = "WORLD1-1";

	this.text_time = this.game.add.retroFont('myfont', 8, 10, this.TEXT_SET, 10);
	t = this.game.add.image(90, 6, this.text_time);
	t.smoothed = false;
	t.fixedToCamera = true;
	t.cameraOffset.setTo(90, 6)
	this.text_time.text = 'TIME:' + ('00'+this.time_counter).slice(-3);

	this.text_score = this.game.add.retroFont('myfont', 8, 10, this.TEXT_SET, 10);
	t = this.game.add.image(190, 6, this.text_score);
	t.smoothed = false;
	t.fixedToCamera = true;
	t.cameraOffset.setTo(180, 6)
	this.text_score.text = "999999";

	// ゲーム設定
	this.game.camera.follow(this.player);
	this.game.camera.deadzone = new Phaser.Rectangle(16*6, 16*6, 16*2, 16*4);

	this.player.revive();
	this.player_move_vy = 0;
	this.player_is_dashed = false;

	// テスト
	this.keyboard = new App.Util.Input.Keyboard(this.game.input.keyboard);
}

/**
 * @override
 */
App.Scene.PlayScene.prototype.update = function()
{
	this.keyboard.update();
	this.game.physics.arcade.collide(this.enemies, this.layer);
	this.game.physics.arcade.collide(this.enemies);

	if (!this.player.alive) {
		return;
	}
	this.game.physics.arcade.collide(this.player, this.layer);
	this.game.physics.arcade.overlap(this.player, this.goal_symbol, this.levelComplete_, null, this);
	this.game.physics.arcade.overlap(this.player, this.enemies, this.collideEnemy_, null, this);
	this.game.physics.arcade.overlap(this.player, this.items, this.collideItem_, null, this);

	var is_pressed_dash_button = this.keyboard.isOn(Phaser.Keyboard.X);
	if (!is_pressed_dash_button) {
		this.player.body.maxVelocity.x = 60;
		this.player.body.drag.x = 200;
	} else {
		this.player.body.maxVelocity.x = 140;
		this.player.body.drag.x = 240;
	}
	this.player.body.acceleration.x = 0;
	if (this.keyboard.isOn(Phaser.Keyboard.LEFT)) {
		if (this.player.body.velocity.x > 0) {
			this.player.body.acceleration.x -= 200;
		} else {
			this.player.body.acceleration.x -= 100;
		}
	} else if (this.keyboard.isOn(Phaser.Keyboard.RIGHT)) {
		if (this.player.body.velocity.x < 0) {
			this.player.body.acceleration.x += 200;
		} else {
			this.player.body.acceleration.x += 100;
		}
	}

	// ジャンプ
	if (this.player.body.onFloor()) {
		this.player_can_jump = true;
	}
	// ジャンプ
	if (this.keyboard.isTriggered(Phaser.Keyboard.UP)
	||  this.keyboard.isTriggered(Phaser.Keyboard.Z)
	||  this.keyboard.isTriggered(Phaser.Keyboard.SPACEBAR)) {
		if (this.player.body.onFloor()) {
			this.player.body.velocity.y = -270;
		}
	}
	if (this.keyboard.isPressed(Phaser.Keyboard.UP)
	||  this.keyboard.isPressed(Phaser.Keyboard.Z)
	||  this.keyboard.isPressed(Phaser.Keyboard.SPACEBAR)) {
		if (this.player_can_jump) {
			this.player.body.velocity.y -= 17;
			if (this.player.body.velocity.y < -400) {
				this.player_can_jump = false;
			}
		}
	}

	// テスト用
	if (this.keyboard.isTriggered(Phaser.Keyboard.Q)) {
		this.player.kill();
		return;
	}

	if (this.keyboard.isTriggered(Phaser.Keyboard.E)) {
		this.addEffectOfScore(100, 100, 50);
	}

	// アニメーション制御
	if (this.player.body.velocity.y != 0) {
		this.player.play('jump');
	} else if (this.player.body.velocity.x < 0) {
		if (this.keyboard.isOn(Phaser.Keyboard.RIGHT)) {
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
		if (this.keyboard.isOn(Phaser.Keyboard.LEFT)) {
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
}

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
}

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
		this.player.kill();
	}
}

/**
 * プレイヤーがやられた
 *
 * @private
 * @param {Phaser.Sprite} player
 */
App.Scene.PlayScene.prototype.killedPlayer_ = function(player)
{
	console.log("called killedPlayser_");
	var dying_player = this.game.add.sprite(
		player.body.position.x,
		player.body.position.y,
		'player'
	);
	dying_player.animations.add('failed', [6], 10, false);
	dying_player.play('failed');

	var duration = 500;
	var ease = Phaser.Easing.Back.In;
	var auto_start = true;
	var delay = 400;
	var repeat = 0;
	var yoyo = false;

	// Easingは良さそうなのが無いのでeseInBackを指定。
	// TODO: 自身で定義することもできるが、重要ではないので後にする
	// easeに指定されたメソッドには、durationの現在の割合が0.0~1.0で渡されてくる
	// 詳しくはPhaser.Easingとhttp://easings.net/ja#を見る
	var tween = this.game.add.tween(dying_player);
	tween.to(
		{y: this.game.physics.arcade.bounds.bottom },
		duration, ease, auto_start, delay, repeat, yoyo
	);
	tween.onComplete.add(function() {
			this.game.time.events.add(Phaser.Timer.SECOND * 3, this.failed_, this);
		},
		this
	);
}

/**
 * ゲーム失敗後の処理
 *
 * @private
 */
App.Scene.PlayScene.prototype.failed_ = function()
{
	// 残機チェック
	if (true) {
		this.retry_();
	} else {
		this.quit_();
	}
}

/**
 * このゲームを終了してタイトルに戻る
 *
 * @private
 */
App.Scene.PlayScene.prototype.quit_ = function()
{
	this.state.start('SceneTitle');
}

/**
 * このゲームをやり直す
 *
 * @private
 */
App.Scene.PlayScene.prototype.retry_ = function()
{
	this.state.start('SceneLoad');
}

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

	// コースクリアメッセージ
	this.text_level_complete = this.game.add.retroFont('myfont', 8, 10, this.TEXT_SET, 10);
	this.text_level_complete.text = "LEVEL COMPLETE !";
	var t = this.game.add.image(0, 0, this.text_level_complete);
	t.anchor.setTo(0.5, 0.5);
	t.smoothed = false;
	t.fixedToCamera = true;
	t.cameraOffset.setTo(this.game.width/2, this.game.height*2/8);

	this.text_level_msg = this.game.add.retroFont('myfont', 8, 10, this.TEXT_SET, 10);
	this.text_level_msg.text = "YOU MADE IT ON TIME TO WORK";
	var t = this.game.add.image(0, 0, this.text_level_msg);
	t.anchor.setTo(0.5, 0.5);
	t.smoothed = false;
	t.fixedToCamera = true;
	t.cameraOffset.setTo(this.game.width/2, this.game.height*3/8);

	// 操作を無効にする
	// クリア後アニメーション
	// LEVEL COMPLETE文字とか表示するやつ実行
	// クリアスコア加算
	// toNextLevel_を呼び出す
	this.game.time.events.add(Phaser.Timer.SECOND * 6, this.toNextLevel_, this);
}

/**
 * このゲームを終了して次のレベルへ遷移する
 *
 * @private
 */
App.Scene.PlayScene.prototype.toNextLevel_ = function()
{
	console.log('NEXT LEVEL!');
	// レベル番号加算
	// ワールド番号加算

	this.state.start('SceneLoad');
}

/**
 * プレイヤーx敵衝突コールバック
 *
 * @private
 * @param {Phaser.Sprite} player
 * @param {Phaser.Sprite} enemy
 */
App.Scene.PlayScene.prototype.collideEnemy_ = function(player, enemy)
{
	if (player.body.touching.down) {
		player.body.velocity.y = -300;
		enemy.kill();
		var score = 100;
		this.addEffectOfScore(enemy.position.x, enemy.position.y, score);
	} else {
		player.damage(1);
	}
}

/**
 * スコアエフェクト
 *
 * @private
 * @param {integer} x
 * @param {integer} y
 * @param {integer} value
 */
App.Scene.PlayScene.prototype.addEffectOfScore = function(x, y, value)
{
	var font = this.game.add.retroFont('myfont-num-s', 4, 5, '0123456789', 10);
	var image = this.game.add.image(x, y, font);
	image.smoothed = false;
	image.anchor.setTo(0.5, 0.5);
	font.text = '' + value;
	var tween = this.game.add.tween(image);
	tween.to({ y: y -10 }, 500, Phaser.Easing.Linear.None, true);
	// TODO: もっと良い削除方法あるかも
	tween.onComplete.add(function() {
		image.kill();
	}, this);
}

/**
 * プレイヤーxアイテム衝突コールバック
 *
 * @private
 * @param {Phaser.Sprite} player
 * @param {Phaser.Sprite} item
 */
App.Scene.PlayScene.prototype.collideItem_ = function(player, item)
{
	item.kill();
	// スコア加算
}

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
		player.damage(1);
	}
}
