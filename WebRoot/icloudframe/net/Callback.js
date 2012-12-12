define(function(require, exports, module) {
/**
 * @class Callback
 * @version	2.01, 10/23/05
 */
exports.Callback = function (config) {
	config = config || {};
	this.scope = config.scope;
	this.success = config.success || emptyFunc;
	this.failure = config.failure || emptyFunc;
	this.abort = config.abort || emptyFunc;
	if (config.doCall) {
		this.doCall = config.doCall;
	}
}

var Callback = exports.Callback;
var p = Callback.prototype;

var emptyFunc = function (){};

/**
 * do call
 * @param {Object} response
 */
p.doCall = function (response) {
	if (response.isOk()) {
		this.doSuccess(response);
	} else if (response.isAbort()) {
		this.doAbort(response);
	} else {
		this.doFailure(response);
	}
}

/**
 * do success
 */
p.doSuccess = function () {
	this.success.apply(this.scope || window, arguments);
}

/**
 * do failure
 */
p.doFailure = function () {
	return this.failure.apply(this.scope || window, arguments);
}

/**
 * do abort
 */
p.doAbort = function () {
	return this.abort.apply(this.scope || window, arguments);
}
});
