/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('App.Model');

/**
 * 敵モデルクラス
 *
 * @constructor
 */
App.Model.Enemy = function(game)
{
	this.max_running_speed;
	this.max_walking_speed;
	this.min_jump_speed;
}
