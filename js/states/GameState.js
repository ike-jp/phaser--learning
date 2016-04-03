/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan.AbstractState');
Application.namespace('util.Keyboard');

/**
 * プレイ画面クラス
 *
 * @constructor
 * @extends {AbstractState}
 */
SuperILtan.GameState = function() {
	'use strict';
	SuperILtan.AbstractState.call(this);

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

	// アイテム
	this.items;
	this.goal_symbol;

	this.ready = false;

	// テスト
	this.keyboard;
}
Application.inherits(
	SuperILtan.GameState,
	SuperILtan.AbstractState
);

/**
 * @override
 */
SuperILtan.GameState.prototype.init = function() {
	'use strict';
	// 非アクティブモードでも更新する
	this.stage.disableVisibilityChange = true;

	// 画面全体に表示する
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	// 余白のアライン
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;

	// start physics system
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.gravity.y = 1500;
	this.game.physics.setBoundsToWorld();
	this.game.physics.arcade.checkCollision.up = false; // ワールドの上判定を行わない
	this.game.physics.arcade.checkCollision.down = false; // ワールドの下判定を行わない
}

/**
 * @override
 */
SuperILtan.GameState.prototype.create = function() {
	'use strict';
	this.game.stage.backgroundColor = Phaser.Color.getColor(80, 128, 255);

	// マップデータの生成と、タイルセットの登録
	var levelData = this.game.cache.getJSON('level');
	this.map = this.game.add.tilemap(levelData.map.KEY);
	levelData.map.tilesetImages.forEach(function(image) {
		this.map.addTilesetImage(image);
	}, this);

	// マップデータからマップレイヤーを生成し、
	// 1以上のインデックスを持つタイルを探して当たり判定を設定する
	this.layers = {};
	this.map.layers.forEach(function (layer) {
		this.layers[layer.name] = this.map.createLayer(layer.name);
		// 当たり判定が必要なレイヤにはカスタムプロパティ(collision)を設定しておく
		if (layer.properties.collision) {
			var collision_tiles = [];
			// マップのdataはタイル100個ずつのデータ配列になっているので取り出す
			layer.data.forEach(function (data_row) {
				data_row.forEach(function (tile) {
					// タイルのインデックスが０より大きく、
					// まだ抽出していないインデックスならcollision_tilesに入れる
					if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
						collision_tiles.push(tile.index);
					}
				}, this);
			}, this);
			// 抽出した1以上のインデックスをまとめてcollision設定
			this.map.setCollision(collision_tiles, true, layer.name);
		}
	}, this);
	// 現在のレイヤーにワールドのサイズを合わせる
	// 大きさは全部同じなのでどれか１つに合わせれば良い
	this.layers[this.map.layer.name].resizeWorld();
	//this.layer.debug = true;
	//this.map.smoothed = false;

	// オブジェクト生成処理の一般化
	this.createObjects_();
	this.createObjectsTemp_();

	this.game.camera.follow(this.prefabs['あいえるたん']);
	this.game.camera.deadzone = new Phaser.Rectangle(16*6, 16*6, 16*2, 16*4);
}

/**
 * オブジェクトを生成する
 *
 * @private
 */
SuperILtan.GameState.prototype.createObjects_ = function() {
	'use strict';
	// レベルデータに書かれたgroupを元にグループ生成
	this.groups = {};
	var levelData = this.game.cache.getJSON('level');
	levelData.groups.forEach(function (groupName) {
		this.groups[groupName] = this.game.add.group();
	}, this);

	this.prefabs = {};
	var classMap = SuperILtan.PrefabsClassMap;
	for (var objectLayer in this.map.objects) {
		if (this.map.objects.hasOwnProperty(objectLayer)) {
			// オブジェクト生成
			this.map.objects[objectLayer].forEach(function (tiledObject) {
				if (classMap.hasOwnProperty(tiledObject.type)) {
					var prefab = new classMap[tiledObject.type](
						this,
						// Tiledは左下座標が基準となっている
						// オブジェクトの場合は左上が基準となっている
						tiledObject.x + (tiledObject.width /2),
						tiledObject.y + (tiledObject.height /2),
						tiledObject
					);
					// uniqueカスタムプロパティがtrueの場合は名前をキーにして保持
					if (tiledObject.properties.unique) {
						this.prefabs[tiledObject.name] = prefab;
					}
				}
			}, this);
		}
	}
}

/**
 * オブジェクトを生成時に呼ばれるコールバック
 *
 * @private
 * @param {Object} TiledObject
 */
SuperILtan.GameState.prototype.onCreateObjectCallback_ = function(object) {
	var object_y;
	if (object.gid) {
		object_y = object.y - (this.map.tileHeight /2);
	} else {
		object_y = object.y + (object.height /2);
	}
	//var position = ['x': object.x + (this.map.tileHeight /2), 'y': object_y];
}

/**
 * オブジェクトを生成する(仮)
 *
 * @private
 */
SuperILtan.GameState.prototype.createObjectsTemp_ = function() {
	'use strict';

	// ゴールシンボル
	// TODO: 本来アイテムと一緒にすべきだが、
	// 16x16のタイルセットから32x32のオブジェクトを生成する方法が分からないので暫定対応
	this.goal_symbol = this.game.add.group();
	this.goal_symbol.enableBody = true;
	this.map.createFromObjects('Items Layer', "goal-symbol", 'goalsymbol_image', 0, true, false, this.goal_symbol);
	this.goal_symbol.setAll('body.allowGravity', false);
	this.goal_symbol.setAll('smoothed', false);
/*
	// プレイヤー設定
	this.player = this.game.add.sprite(
		16*5, // this.game.world.centerX,
		16*13,// this.game.world.centerY,
		'player_spritesheet'
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
*/
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
/*
	// ゲーム設定
	this.game.camera.follow(this.player);
	this.game.camera.deadzone = new Phaser.Rectangle(16*6, 16*6, 16*2, 16*4);

	this.player.revive();
	this.player_move_vy = 0;
	this.player_is_dashed = false;
*/
	// テスト
	this.keyboard = new util.Keyboard(this.game.input.keyboard);
}

/**
 * @override
 */
SuperILtan.GameState.prototype.update = function() {
	'use strict';
	this.keyboard.update();
	if (this.keyboard.isTriggered(Phaser.Keyboard.Q)) {
		this.prefabs['あいえるたん'].kill();
		return;
	}

	if (this.keyboard.isTriggered(Phaser.Keyboard.E)) {
		this.addEffectOfScore(100, 100, 50);
	}

//	this.game.physics.arcade.collide(this.enemies, this.layers['Tile Layer']);
//	this.game.physics.arcade.collide(this.enemies);
/*
	if (!this.player.alive) {
		return;
	}
	this.game.physics.arcade.collide(this.player, this.layers['Tile Layer']);
	this.game.physics.arcade.overlap(this.player, this.goal_symbol, this.levelComplete_, null, this);
//	this.game.physics.arcade.overlap(this.player, this.enemies, this.collideEnemy_, null, this);
//	this.game.physics.arcade.overlap(this.player, this.items, this.collideItem_, null, this);
*/
}

/**
 * @override
 */
SuperILtan.GameState.prototype.render = function() {
	'use strict';
	//this.game.debug.bodyInfo(this.player, 0, 0);
	//this.game.debug.body(this.player);
//	this.game.debug.body(this.enemies);

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
SuperILtan.GameState.prototype.updateTimeCounter_ = function() {
	'use strict';
	this.time_counter -= 1;
	if (this.time_counter >= 0) {
		this.text_time.text = 'TIME:' + ('00'+this.time_counter).slice(-3);
	} else if (this.time_counter == -1) {
		this.prefabs['あいえるたん'].kill();
	}
}

/**
 * このゲームを終了してタイトルに戻る
 *
 * @private
 */
SuperILtan.GameState.prototype.gameOver = function() {
	'use strict';
	this.game.state.start('SceneTitle');
//	localStorage.clear();
}

/**
 * このゲームをやり直す
 *
 * @private
 */
SuperILtan.GameState.prototype.restartLevel = function() {
	'use strict';
	this.game.state.start('SceneLoad');
}

/**
 * ゲームクリア処理
 *
 * @private
 */
SuperILtan.GameState.prototype.levelComplete_ = function(player, symbol) {
	'use strict';
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
SuperILtan.GameState.prototype.toNextLevel_ = function() {
	'use strict';
	console.log('NEXT LEVEL!');
	// レベル番号加算
	// ワールド番号加算

	this.state.start('SceneLoad');
}

/**
 * スコアエフェクト
 *
 * @private
 * @param {integer} x
 * @param {integer} y
 * @param {integer} value
 */
SuperILtan.GameState.prototype.addEffectOfScore = function(x, y, value) {
	'use strict';
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
