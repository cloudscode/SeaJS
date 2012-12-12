/*
 * @(#)Connection.class.js 0.1 Oct 14, 2007
 * Copyright 2004-2007 Homolo Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at 
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

$package("org.ajaxframework.net");

$import("js.net.XmlHttp");
define(function(require, exports, module) {
	var ConnectionManager = require('icloudframe/net/ConnectionManager');
	var Session = require('icloudframe/net/Session');
/**
 * @class Connection is http connection class
 * @version	2.01, 10/23/05
 * @extends js.lang.JObject
 */
exports.Connection = function () {
	this.xmlHttp = null;
}

var Connection = exports.Connection;
var p = Connection.prototype;

p.xmlHttp = null;

p.getComponent = function () {
	return this.xmlHttp;
}

p.getState = function () {
	return this.isClosed() ? -1 : this.getComponent().readyState;
}

p.open = function () {
	if (this.isClosed()) {
		this.xmlHttp = js.net.XmlHttp.create();
	}
}

p.abort = function () {
	if (this.isInProgress()) {
		this.xmlHttp.abort();
	}
}

p.close = function () {
	this.abort();
	this.xmlHttp = null;
}

p.isClosed = function () {
	return this.xmlHttp == null;
}

/**
 * 
 */
p.isInProgress = function () {
	var state = this.getState();
	return (state > 0 && state < 4);
}

/**
 * Creates an new session.
 * @param autoclose
 * @type Session
 */
Connection.openSession = function (autoclose) {

	var conn =ConnectionManager.getConnection();
	return Session(conn, autoclose != false);
}
});