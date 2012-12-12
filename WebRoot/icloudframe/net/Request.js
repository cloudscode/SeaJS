define(function(require, exports, module) {

exports.Request = function (config) {

	this.url = config.url;
	this.method = (config.method || METHOD_GET).toUpperCase();
	this.async = (config.async == true);
	this.header = config.header || {};
	this.params = config.params || {};
	this.userName = config.userName || "";
	this.password = config.password || "";
	this.timeout = config.timeout || 0;
	this.session = config.session;

}


var Request = exports.Request;
var p = Request.prototype;

// constants
var METHOD_GET = "GET", METHOD_POST = "POST";

/**
 * @return url
 */
p.getURL = function () {
	if (this.method == METHOD_GET) {
		var query = this.getQueryString();			
		return (query == "") ? this.url : (this.url + "?" + query);
	} else {
		return this.url;
	}
}

/**
 * Gets post data
 */
p.getData = function () {
	return (this.method != "POST") ? null : this.getQueryString();
}

/**
 * Gets query string.
 */
p.getQueryString = function () {
	var sb = [], params = this.params;
	if (typeof(params) == 'string') {
		return params;
	}
	for (var name in params) {
		if (sb.length > 0) {
			sb.push("&");
		}
		sb.push(encodeURIComponent(name));
		sb.push("=");
		sb.push(encodeURIComponent(params[name]));
	}
	return sb.join("");
}

/**
 * Returns current session
 */
p.setSession = function (session) {
	this.session = session;
}

/**
 * Gets current session
 * @param {Object} session
 */
p.getSession = function () {
	return this.session;
}
});
