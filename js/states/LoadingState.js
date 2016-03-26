/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan.AbstractState');

/**
 * ゲーム前のプリロードクラス
 *
 * ステージのアセットマップを読み込む
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
	this.game.stage.backgroundColor = Phaser.Color.getColor(0, 0, 0);
	this.load.text('level', 'assets/tilemaps/json/level1.json');
}

/**
 * @override
 */
SuperILtan.LoadingState.prototype.create = function() {
	'use strict';
	this.state.start('ScenePlay');
}
