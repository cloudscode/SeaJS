/*
 * @(#)ConnectionManager.class.js 0.1 Oct 14, 2007
 * Copyright 2004-2007 Homolo Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at 
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */


$package("org.ajaxframework.net");

$import("js.lang.System");
$import("js.lang.NotSupportException");

/**
 * @class ConnectionManager is the connection manager class
 * @version	2.01, 10/23/05
 * @extends js.lang.JObject
 */
define(function(require, exports, module) {
	var Connection = require('icloudframe/net/connection');
exports.ConnectionManager = function () {

	if (ConnectionManager.caller != ConnectionManager.getInstance) {
		throw new js.lang.NotSupportException(this.getClass().getName()
			+ " cannot be instantiated out of class");
	}

	var connections = [];

	this.getConnection = function () {
		var conn = Connection;
		connections.push(conn);
		return conn;
	}

	// listen vm destroy.
	js.lang.System.addVMDestroyListener(function () {
		for (var i = 0 ; i < connections.length; i++) {
			try {
				connections[i].close();
			} catch (e) {
				//do nothing.
			}
		}
	});

}

var ConnectionManager = exports.ConnectionManager;

/**
 * @private static instance
 */
var instance = null;

ConnectionManager.getInstance = function () {
	return instance || (instance = new ConnectionManager());
}
});
