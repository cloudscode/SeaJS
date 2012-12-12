
$package("org.ajaxframework.net");

$import("js.lang.System");
$import("js.lang.RuntimeException");

$import("org.ajaxframework.util.UUID");
$import("org.ajaxframework.net.Request");
$import("org.ajaxframework.net.Response");
$import("org.ajaxframework.net.Callback");
define(function(require, exports, module) {
	var Request = require('icloudframe/net/Request');
	var Response = require('icloudframe/net/Response');
	var Callback = require('icloudframe/net/Callback');
/**
 * @class Session
 * @version	2.01, 10/23/05
 * @extends js.lang.JObject
 */
exports.Session = function (conn, autoclose) {

	this.conn = conn;
	// create a session id (uuid)
	this.sessionId = org.ajaxframework.util.UUID.randomUUID();
	this.autoclose = autoclose == true;
	this.request = null;
	this.response = null;
	this.callback = null;
	this.state = 0;

	this.watchTimer = 0;
	this.watchInterval = 100;
	this.abortTimer = 0;

	var session = this;
	js.lang.System.addVMDestroyListener(function (){
		session.close();
	});

}

var Session = exports.Session;
var p = Session.prototype;

p.getSessionId = function () {
	return this.sessionId;
}

p.setRequest = function (request) {
	request.setSession(this);
	this.request = request;
}

p.getRequest = function () {
	return this.request;
}

p.setResponse = function (response) {
	this.response = response;
}

p.getResponse = function () {
	return this.response;
}

p.setCallback = function (callback) {
	this.callback = callback;
}

p.getCallback = function () {
	return this.callback;
}

p.getConnection = function () {
	return this.conn;
}

/**
 * open the current session
 * @type void
 */
p.open = function () {
	this.getConnection().open();
	this.reset();
}

/**
 * close the current session
 * @type void
 */
p.close = function () {
	this.getConnection().close();
	this.reset();
}

p.isInProgress = function () {
	return this.getConnection().isInProgress();
}

p.isClosed = function () {
	return this.getConnection().isClosed();
}

p.isAutoClose = function () {
	return this.autoclose;
}

/**
 * reset the current session
 * @type void
 */
p.reset = function () {
	this.request = this.response = this.callback = null;
	this.stopWatchThread();
	this.stopAbortThread();
}

/**
 * abort the current request
 * @type void
 */
p.abort = function () {
	this.stopAbortThread();
	this.stopWatchThread();
	this.respondError(-9, "doRequest transaction aborted");
	this.getConnection().abort();
	this.doCallback();
}

/**
 * do a request
 * @param request
 * @callback request
 */
p.doRequest = function (request, callback) {

	if (this.isInProgress()) {
		throw new js.lang.RuntimeException(Session.getName() + " doRequest is in progress.");
	} else if (this.isClosed()) {
		this.open();
	}

	this.setRequest(request);
	this.setCallback(callback);

	var ex, xmlHttp;
	try {
		this.startWatchThread();
		xmlHttp = this.getConnection().getComponent();
		xmlHttp.open(request.method, request.getURL(), request.async);
		for (var name in request.header) {
			xmlHttp.setRequestHeader(name, request.header[name]);
		}
		this.startAbortThread();
		xmlHttp.send(request.getData());
		if (!request.async) {
			return this.respondResult();
		}
	} catch (ex) {
		this.stopAbortThread();
		this.stopWatchThread();
		if (!request.async) {
			return this.respondError(-1, "doRequest failed: " + ex.message);
		}
	} finally {
		xmlHttp = null;
	}
}

/**
 * execute a request
 * @type void
 */
p.execute = function (method, url, async, callback, params) {
	var req = new org.ajaxframework.net.Request({
			"method" : method,
			"url" : url,
			"async" : async,
			"params" : params
		});
	var cb = new org.ajaxframework.net.Callback(callback || {});
	return this.doRequest(req, cb);
}

/**
 * do get
 * @type void
 */
p.get = function (url, async, callback, params) {
	return this.execute("GET", url, async, callback, params);
}

/**
 * do post
 * @type void
 */
p.post = function (url, async, callback, params) {
	return this.execute("POST", url, async, callback, params);
}


/**
 * do get by async
 * @type void
 */
p.asyncGet = function (url, callback, params) {
	return this.get(url, true, callback, params);
}

/**
 * do post by async
 * @type void
 */
p.asyncPost = function (url, callback, params) {
	return this.post(url, true, callback, params);
}

/**
 * do get by sync
 * @type void
 */
p.syncGet = function (url, callback, params) {
	return this.get(url, false, callback, params);
}

/**
 * do post by sync
 * @type void
 */
p.syncPost = function (url, callback, params) {
	return this.post(url, false, callback, params);
}



/**
 * respond a result
 * @type void
 */
p.respondResult = function (data) {
	var response = this.getResponse();
	if (response == null) {
		var dto = {}, http = this.getConnection().getComponent();
		dto.session = this;
		dto.responseText = http.responseText;
		dto.responseXML = http.responseXML;
		dto.status = http.status;
		for (var p in (data || {})) {
			dto[p] = data[p];
		}
		response = new org.ajaxframework.net.Response(dto);
		this.setResponse(response);
	}
	return response;
}

/**
 * respond a error
 * @type void
 */
p.respondError = function (errCode, errMsg) {
	var response = this.getResponse();
	if (response == null) {
		response = new org.ajaxframework.net.Response({
			"session" : this,
			"errorMsg" : errMsg,
			"status" : errCode
		})
		this.setResponse(response);
	}
	return response;
}

/**
 * do callback.
 * @type void
 */
p.doCallback = function () {
	var callback = this.getCallback();
	if (callback != null) {
		callback.doCall(this.getResponse());
	}
}

/**
 * start a thread for watch readystate.
 * @type void
 */
p.startWatchThread = function () {
	
	var session = this;
	this.watchTimer = window.setInterval(function () {
			var state = session.getConnection().getState();
			if (state == 4) {
				session.stopWatchThread();
				session.stopAbortThread();
				session.respondResult();
				session.doCallback();
				if (session.isAutoClose()) {
					session.close();
				}
			}
		}, this.watchInterval);

}

/**
 * stop a thread for watch readystate.
 * @type void
 */
p.stopWatchThread = function () {
	if (this.watchTimer > 0) {
		window.clearInterval(this.watchTimer);
		this.watchTimer = 0;
	}
}

/**
 * start a thread who do abort when time is out.
 * @type void
 */
p.startAbortThread = function () {
	var timeout = this.getRequest().timeout;
	if (timeout > 0 && this.abortTimer == 0) {
		this.abortTimer = window.setTimeout(
			function () {
				session.abort();
			}, timeout);
	}
}

/**
 * stop a thread who do abort when time is out.
 * @type void
 */
p.stopAbortThread = function () {
	if (this.abortTimer > 0) {
		window.clearTimeout(this.abortTimer);
		this.abortTimer = 0;
	}
}
});
