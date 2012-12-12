/*$package("com.homolo.framework.service.rest");

$import("org.ajaxframework.net.Request");
$import("org.ajaxframework.net.Connection");
$import("org.ajaxframework.net.Callback");

$import("com.homolo.framework.service.rest.RestUtils");*/
define(function(require, exports, module) {
var RestUtils	= require('cloudcode/framework/service/rest/RestUtils');
/**
 * @class RestClient
 * @constructor
 */
RestClient = function (module, id) {
	this.module = module;
	this.id = id;
};


var RestClient = RestClient;
var p = RestClient.prototype;
exports.RestClient = RestClient;
RestClient.getResource = function (module, id) {
	return new RestClient(module, id);
};

RestClient.getCollection = function (module) {
	return new RestClient(module, 'collection');
};

/**
 * @param request xmlrpc request.
 */
p.request = function (action, params, callback) {

	try {
		debugger;
		var RestUtils = RestUtils;

		var url = RestUtils.getResourceURL(this.module, this.id, action);

		var async = (callback != null);
		// create a new http session.
		var session = org.ajaxframework.net.Connection.openSession();
		// create a new http request.
		// var contentType = "application/x-www-form-urlencoded";
		var httpMethod = RestUtils.getMethod(action);
		if (typeof(params) != 'string') {
			params = RestUtils.JSON.encode(params);
		}
		if (httpMethod.toLowerCase() == 'get') {
			params = {q:params};
		}
		var httpRequest = new org.ajaxframework.net.Request({
			url : url,
			header: {'content-type': "application/json"},
			params: params || {},
			async: async,
			method: httpMethod
		});
		// create http callback.
		var httpCallback = null;
		if (callback != null) {
			httpCallback = new org.ajaxframework.net.Callback({
				"doCall": function(response) {
					if (response.isOk()) {
						callback(eval("(" + response.getText() + ")"));
					} else {
						callback(new Error('rest request failed.'));
					}
				}
			});
		}

		var response = session.doRequest(httpRequest, httpCallback);
		if (async == false) {
			return eval("(" + response.getText() + ")");
		} else {
			return session;
		}
		
	} catch (ex) {
		throw new Exception(''//RestClient.getName() 
			+ ".request() failed: [action:" 
			+ action + "] ", ex);
	} finally {
		if (async == false) {
			session.close();
		}
	}
};
});