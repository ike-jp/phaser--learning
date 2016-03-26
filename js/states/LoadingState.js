/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan.AbstractState');

/**
 * ゲーム前のロードクラス
 *
 * レベルデータを読み込む
 *
 * @param {Phaser.Game} game
 * @constructor
 * @extends {Scene}
 */
SuperILtan.LoadingState = function() {
	'use strict';
	SuperILtan.AbstractState.call(this);
}
Application.inherits(
	SuperILtan.LoadingState,
	SuperILtan.AbstractState
);

/**
 * @override
 */
SuperILtan.LoadingState.prototype.preload = function() {
	'use strict';
	this.load.json('level', 'assets/tilemaps/json/level1.json');
}

/**
 * @override
 */
SuperILtan.LoadingState.prototype.create = function() {
	'use strict';
	this.game.stage.backgroundColor = Phaser.Color.getColor(0, 0, 0);

	var loader = this.load;
	loader.onLoadStart.add(this.onLoadStartCallback_, this);
	loader.onFileComplete.add(this.onFileCompleteCallback_, this);
	loader.onLoadComplete.add(this.onLoadCompleteCallback_, this);

	// 1/4秒後に実際のアセット読み込みを開始
	this.game.time.events.add(
		Phaser.Timer.QUARTER,
		this.onBeginUpdatingCallback_,
		this
	);
}

/**
 * リソースの読み込みを開始する
 *
 * Phaserではリソースの読み込みは基本的にpreloadの中で行う。
 * 動的に読み込みたい場合は、preload内で行うのと同様に
 * Loaer.imageのように呼び出して追加していくが、
 * この処理をStateのcraete中で行うと`Phaser.Loader - active loading canceled /reset`
 * のように出力されて正しくロードが出来ない。
 *
 * これはcreateがGameObjectの生成に使うことを意図して作られているためらしい。
 * 動的に読み込みを行いたい場合はcreateが終わった後に行う必要がある。
 * そこで回避策として、タイマーを使ってcreateが終わってから呼び出されるようにしている。
 *
 * @private
 */
SuperILtan.LoadingState.prototype.onBeginUpdatingCallback_ = function() {
	'use strict';
	var levelData = this.game.cache.getJSON('level');
	var assets = levelData.assets;
	var loader = this.load;
	for (var asset_key in assets) {
		if (assets.hasOwnProperty(asset_key)) {
			var asset = assets[asset_key];
			switch (asset.type) {
				case 'image':
					loader.image(asset_key, asset.source);
					break;
				case 'spritesheet':
					loader.spritesheet(
						asset_key,
						asset.source,
						asset.frame_width,
						asset.frame_height,
						asset.frames,
						asset.margin,
						asset.spacing
					);
					break;
				case 'tilemap':
					loader.tilemap(
						asset_key,
						asset.source,
						null,
						Phaser.Tilemap.TILED_JSON
					);
					break;
			}
		}
	}
	loader.start();
}

/**
 * @private
 */
SuperILtan.LoadingState.prototype.onLoadStartCallback_ = function() {
	'use strict';
	console.log('start loading');
}

/**
 * @private
 */
SuperILtan.LoadingState.prototype.onFileCompleteCallback_ = function(
	progress,
	cacheKey,
	success,
	totalLoaded,
	totalFiles
) {
	'use strict';
	console.log(
		'File complite: '
		+ progress + '% - '
		+ totalLoaded + ' out of ' + totalFiles
	);
}

/**
 * @private
 */
SuperILtan.LoadingState.prototype.onLoadCompleteCallback_ = function() {
	'use strict';
	var loader = this.load;
	console.log('load complite!');
	this.state.start('ScenePlay');
}
