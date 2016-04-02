/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

Application.namespace('SuperILtan');

/**
 * プレハブのクラスマップ
 *
 * Tiledのプロパティに持つ種類と
 * ソースコード側で対応するクラスのマップ
 *
 * @constructor
 */
SuperILtan.PrefabsClassMap = {
	'player': SuperILtan.Player,
	'yukibo-s': SuperILtan.Yukibo,
	'yukibo-e': SuperILtan.Yukibo2,
	'coin': SuperILtan.Coin,
}
