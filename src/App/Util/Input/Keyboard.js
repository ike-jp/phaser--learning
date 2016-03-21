/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('App.Util.Input');

/**
 * キーボードユーティリティクラス
 *
 * @param {Phaser.Keyboard} keyboard
 * @constructor
 * @extends {AbstractScene}
 */
App.Util.Input.Keyboard = function(keyboard)
{
	this.keyboard_ = keyboard;
	this.state_ = [];
	this.dobule_buffer_idx_ = 0;
}

/**
 * このキーボードの状態を更新する
 */
App.Util.Input.Keyboard.prototype.update = function()
{
	this.dobule_buffer_idx_ ^= 1;
	this.state_.forEach(function(val, key_code) {
		val[this.dobule_buffer_idx_] = this.keyboard_.isDown(key_code);
	}, this);
}

/**
 * キーコードで指定されたキーの押された瞬間をチェックする
 *
 * @param {Phaser.KeyCode} key_code
 * @param {bool} キーが押され始めたフレームのみtrueを返す
 */
App.Util.Input.Keyboard.prototype.isTriggered = function(key_code)
{
	this.ensurePresenceOfKey_(key_code);
	var idx = this.dobule_buffer_idx_;
	return this.state_[key_code][idx]
		&& !this.state_[key_code][idx ^1];
}

/**
 * キーコードで指定されたキーの離された瞬間をチェックする
 *
 * @param {Phaser.KeyCode} key_code
 * @param {bool} キーが離されたフレームのみtrueを返す
 */
App.Util.Input.Keyboard.prototype.isReleased = function(key_code)
{
	this.ensurePresenceOfKey_(key_code);
	var idx = this.dobule_buffer_idx_;
	return !this.state_[key_code][idx]
		&& this.state_[key_code][idx ^1];
}

/**
 * キーコードで指定されたキーが押されている状態をチェックする
 *
 * @param {Phaser.KeyCode} key_code
 * @param {bool} 押された次のフレームから放される直前のフレームまでtrueを返す
 */
App.Util.Input.Keyboard.prototype.isPressed = function(key_code)
{
	this.ensurePresenceOfKey_(key_code);
	var idx = this.dobule_buffer_idx_;
	return this.state_[key_code][idx]
		&& this.state_[key_code][idx ^1];
}

/**
 * キーコードで指定されたキーが押されているかををチェックする
 *
 * @param {Phaser.KeyCode} key_code
 * @return {bool} 押されたフレームから放される直前のフレームまでtrueが返る
 */
App.Util.Input.Keyboard.prototype.isOn = function(key_code)
{
	this.ensurePresenceOfKey_(key_code);
	var idx = this.dobule_buffer_idx_;
	return this.state_[key_code][idx];
}

/**
 * キーコードで指定されたキーが押されているかををチェックする
 *
 * @param {Phaser.KeyCode} key_code
 */
App.Util.Input.Keyboard.prototype.ensurePresenceOfKey_ = function(key_code)
{
	if (typeof this.state_[key_code] === "undefined") {
		this.state_[key_code] = [false, false];
	}
}
