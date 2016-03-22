/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */
Application.namespace('SuperILtan.AbstractState');

/**
 * 起動クラス
 *
 * @constructor
 */
SuperILtan.BootState = function() {
	'use strict';
	SuperILtan.AbstractState.call(this);
}
Application.inherits(SuperILtan.BootState, SuperILtan.AbstractState);

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
