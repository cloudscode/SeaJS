define(function(require, exports, module) {

exports.Response = function (dto) {

	this.session = dto.session;
	this.text = dto.responseText;
	this.xml = dto.responseXML;
	this.statusText = dto.statusText;
	this.errorMsg = dto.errorMsg;
	this.status = dto.status;

	this.headers = {};
	var headers = (dto.allResponseHeaders || '').split('\n');
	for (var i = 0; i < headers.length; i++) {
		var header = headers[i];
		var pos = header.indexOf(':');
		if (pos != -1) {
			this.headers[header.substring(0,pos)] = header.substring(pos + 2);
		}
	}

	dto = null;

}

var Response = exports.Response;
var p = Response.prototype;

p.getSession = function () {
	return this.session;
}

p.getText = function () {
	return this.text;
}

p.getXml = function () {
	return this.xml;
}

p.getStatusText = function () {
	return this.statusText;
}

p.getErrorMsg = function () {
	return this.errorMsg;
}

p.getStatus = function () {
	return this.status;
}

p.isOk = function () {
	return (this.status == 0 || this.status >= 200 && this.status < 400);
}

p.isAbort = function () {
	return this.status == -9;
}

p.isError = function () {
	return !this.isOk() && !this.isAbort();
}

p.getAllResponseHeaders = function () {
	return this.headers;
}

p.getResponseHeader = function (name) {
	return this.headers[name];
}

p.getAllResponseHeaderNames = function () {
	var ns = [];
	for (var name in this.headers) {
		ns.push(name);
	}
	return ns;
}
});
