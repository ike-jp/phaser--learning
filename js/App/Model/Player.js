/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('App.Model');

/**
 * プレイヤーモデルクラス
 *
 * @constructor
 */
App.Model.Player = function(game)
{
	this.max_running_speed;
	this.max_walking_speed;
	this.min_jump_speed;
}
