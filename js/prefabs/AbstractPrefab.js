/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan');

/**
 * プレハブの抽象クラス
 *
 * @constructor
 */
SuperILtan.AbstractPrehab = function(gameState, x, y, tiledMapObject) {
	'use strict';
	var textureName = tiledMapObject.properties.textureName;
	Phaser.Sprite.call(this, gameState.game, x, y, textureName);

	var groupName = tiledMapObject.properties.group;
	this.gameState = gameState;
	this.gameState.groups[groupName].add(this);
}
Application.inherits(SuperILtan.AbstractPrehab, Phaser.Sprite);

/**
 * このプレハブを更新する
 */
SuperILtan.AbstractPrehab.prototype.update = function() {
	'use strict';
}
