/*
 * @(#)JSONRpcConvertor.class.js 0.1 Oct 14, 2007
 * Copyright 2004-2007 Homolo Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at 
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */


$package("org.ajaxframework.jsonrpc");

$import("org.ajaxframework.jsonrpc.JSONObject");

org.ajaxframework.jsonrpc.JSONRpcConvertor = function () {};

var JSONRpcConvertor = org.ajaxframework.jsonrpc.JSONRpcConvertor; 
var p = JSONRpcConvertor.prototype;

JSONRpcConvertor.CONVERTOR_TYPE = null;

/* 
 * single instance
 */
var singleton = null;

/**
 * Get an instance of JSONRpcConvertor
 * @type JSONRpcConvertor
 */
JSONRpcConvertor.getInstance = function () {

	/*
	 * singleton pattern.
	 */
	if (singleton == null) {
		singleton = JSONRpcConvertor.CONVERTOR_TYPE ? Class.forName(JSONRpcConvertor.CONVERTOR_TYPE).newInstance() : new DefaultConvertor();
	}
	return singleton;

}


var DefaultConvertor = function () {
	
}

var p1 = DefaultConvertor.prototype;


/**
 * Marshall a JSON format string to a js object.
 */
p1.json2Js = function (obj) {
	if (obj == null) {
		return null;
	}
	var type = typeof(obj);
	if (type != "object" || obj instanceof Error || obj instanceof String
		|| obj instanceof Number || obj instanceof Date || obj instanceof Boolean) {
		return obj;
	} else if (obj instanceof Array) {
		var arrs = [];
		for (var i = 0; i < obj.length; i++) {
			arrs[i] = this.json2Js(obj[i]);
		}
		return arrs;	
	} else if (obj.javaClass) {
		if (obj.javaClass == "java.math.BigDecimal") {
			return obj.value;
		} else if (obj.javaClass == "java.util.Date" || obj.javaClass == "java.sql.Timestamp") {
			return new Date(obj.time);
		} else if (obj.javaClass == "java.util.Map" || obj.javaClass == "java.util.HashMap" || obj.javaClass == "java.util.Properties") {
			return this.json2Js(obj.map);
		} else if (obj.javaClass == "java.util.List" || obj.javaClass == "java.util.ArrayList") {
			return this.json2Js(obj.list);
		} else {
			delete obj.javaClass;
			return this.json2Js(obj);
		}
	} else {
		var obj0 = {};
		for (var p in obj) {
			obj0[p] = this.json2Js(obj[p]);
		}
		return obj0;
	}

};

/**
 * Converts js object to json
 * @param {Object} obj
 */
p1.js2Json = function (obj) {

	if (obj == null || typeof(obj) != "object") {
		return obj;
	} else if (obj.javaClass == "java.util.Date") {
		return new Date(obj.time);
	} else {
		var obj0 = {};
		for (var p in obj) {
			obj0[p] = this.js2Json(obj[p]);
		}
		return obj0;
	}

}

