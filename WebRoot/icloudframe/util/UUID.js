

$import("js.lang.StringBuffer");
$import("js.lang.NotSupportException");


define(function(require, exports, module) {
exports.UUID = function () {
	/* Don't let anyone instantiate this class 
	 */
	throw new js.lang.NotSupportException(UUID.getName()
		+ " cannot be instantiated.");
}

var UUID = exports.UUID;

/**
 * Returns a random uuid string
 * @param	withSepar	boolean.
 * @type string
 */
UUID.randomUUID = function(withSepar) {
	var sb = new js.lang.StringBuffer();
	sb.append((new Date().getTime().toString(16) + "0000000").substring(0, 8));
	sb.append(Math.round(Math.random() * 0xffffffff).toString(16));
	sb.append(Math.round(Math.random() * 0xffffffff).toString(16));
	sb.append(Math.round(Math.random() * 0xffffffff).toString(16));
	sb.append("000000000000000000000");
	var str = sb.toString();
	return [str.substring(0, 8), str.substring(8, 12), str.substring(12, 16)
		, str.substring(16, 20), str.substring(20, 32)]
			.join((withSepar != true) ? "" : "-");
}
});