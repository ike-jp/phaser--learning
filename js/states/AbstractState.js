/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan');

/**
 * シーンの抽象クラス
 *
 * @constructor
 */
SuperILtan.AbstractState = function() {
	'use strict';
	Phaser.State.call(this);
}
Application.inherits(SuperILtan.AbstractState, Phaser.State);

/**
 * このシーン開始前に必要なリソースをロードする処理
 */
SuperILtan.AbstractState.prototype.preload = function() {
	'use strict';
	// have nothing to do
}

/**
 * このシーンの初期化処理
 */
SuperILtan.AbstractState.prototype.create = function() {
	'use strict';
	// have nothing to do
}

/**
 * このシーンの更新処理
 */
SuperILtan.AbstractState.prototype.update = function() {
	'use strict';
	// have nothing to do
}

/**
 * このシーンの描画処理
 */
SuperILtan.AbstractState.prototype.render = function() {
	'use strict';
	// have nothing to do
}

