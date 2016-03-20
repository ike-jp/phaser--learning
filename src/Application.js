/**
 * @author ike-jp <ikejpcw@gmail.com>
 * @license Refer to the LICENSE file.
 */

/**
 * アプリケーション用の名前空間を表すグローバルオブジェクト
 * @type {Object}
 */
var Application = Application || {};

/**
 * Appディレクトリ以下の名前空間を表すグローバルオブジェクト
 * @type {Object}
 */
var App = App || {};

/**
 * 名前空間定義
 *
 * アプリケーションのグローバルオブジェクトの生成と
 * プロトタイプチェーンによるモジュールコンテナを自動生成する
 *
 * @param {string} ns_string 名前空間を表すドット区切りの文字列
 * @see http://qiita.com/KENJU/items/0d8f85df205ea4978508
 */
Application.namespace = function(ns_string)
{
	var parts = ns_string.split('.'), // . で区切った配列
		parent = App, // グローバルオブジェクトのアプリ名
		i;

	// 先頭のグローバルを取り除く
	if (parts[0] === "App") {
		parts = parts.slice(1); // 先頭を削除
	}

	for (i = 0; i < parts.length; i += 1) {
		// プロパティが存在しなければ作成する
		if ( typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {}; // モジュールのオブジェクト生成
		}
		parent = parent[parts[i]];
	}
};

/**
 * クラス継承
 *
 * オブジェクトのプロトタイプを上書きすることで継承を表現する
 * ※古いブラウザではsetPrototypeOfが使えないので動かない
 *
 * @param {ClassName} childCtor 子となるクラス
 * @param {ClassName} parentCtor 親となるクラス
 * @see http://www.yunabe.jp/docs/javascript_class_in_google.html
 */
Application.inherits = function(childCtor, parentCtor)
{
	Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
}
