
/**
 * クラス継承
 *
 * @param ClassName childCtor 子となるクラス
 * @param ClassNAme parentCtor 親となるクラス
 */
var inherits = function(childCtor, parentCtor)
{
	Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
}
