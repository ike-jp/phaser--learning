/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */
Application.namespace('SuperILtan');

/**
 * 起動クラス
 *
 * @param {Phaser.Game} game
 * @constructor
 */
SuperILtan.BootState = function() {
	'use strict';
	// have nothing to do
}

/**
 * {@inheritdoc}
 */
SuperILtan.BootState.prototype.init = function() {
	'use strict';
}

/**
 * {@inheritdoc}
 */
SuperILtan.BootState.prototype.preload = function() {
	'use strict';
}

/**
 * {@inheritdoc}
 */
SuperILtan.BootState.prototype.create = function() {
	'use strict';
	this.state.start('ScenePreload');
}
