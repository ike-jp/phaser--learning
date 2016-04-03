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
	'Player': SuperILtan.Player,
	'Yukibo': SuperILtan.Yukibo,
	'YukiboE': SuperILtan.YukiboE,
	'YukiboJ': SuperILtan.YukiboJ,
	'Coin': SuperILtan.Coin,
	'GoalSymbol': SuperILtan.GoalSymbol,
}
