
/*$package("org.ajaxframework.ext4");

$import("Ext.form.HtmlEditor");
$import("Ext.form.TriggerField");
$import("org.ajaxframework.util.DateFormat");
$import("Ext.form.Basic");*/

/**
 * @class org.ajaxframework.ext4.FormUtils
 * @constructor
 */
 define(function(require, exports, module) {
exports.FormUtils = function () {};

var FormUtils = exports.FormUtils;

var getBasicForm = function (form) {
	if (form instanceof Ext.form.Panel) {
		form = form.getForm();
	}
	return form;
}

FormUtils.updateForm = function (form, data) {

	form = getBasicForm(form);
	data ='';// Class.forName('org.ajaxframework.jsonrpc.JSONRpcConvertor').getInstance().json2Js(data);
	for (var p in data) {
		var v = data[p];
		var field = form.findField(p);
		if (field != null) {
			setFieldValue(field, v);
			if (v instanceof Date) {
				var tf = form.findField(p + '#time');
				if (tf != null) {
					setFieldValue(tf, v);
				}	
			}
		} else if (v != null /*&& Class.forName('org.ajaxframework.util.TypeUtils').isObject(v)*/) {
			for (var p1 in v) {
				var v1 = v[p1];
				var field = form.findField(p + '.' + p1);
				if (field != null) {
					setFieldValue(field, v1);
					if (v1 instanceof Date) {
						var tf = form.findField(p + '.' + p1 + '#time');
						if (tf != null) {
							setFieldValue(tf, v1);
						}	
					}
				}				
			}
		}
	}

}

FormUtils.updateFormFields = function (form, fields, data) {

	form = getBasicForm(form);
	//data = Class.forName('org.ajaxframework.jsonrpc.JSONRpcConvertor').getInstance().json2Js(data);
	for (var i = 0;  i < fields.length; i++) {
		var p = fields[i];
		var field = form.findField(p);
		if (field != null) {
			var v = data[p];
			setFieldValue(field, v);
			if (v instanceof Date) {
				var tf = form.findField(p + '#time');
				if (tf != null) {
					setFieldValue(tf, v);
				}	
			}
		}
	}
}

FormUtils.getDataObject = function (form, props, ignoreNull) {
	return FormUtils.getTypeInstance(null, form, props, ignoreNull);
}

FormUtils.getTypeInstance = function (type, form, props, ignoreNull) {
	
	if (ignoreNull == null) {
		ignoreNull = true;
	}

	form = getBasicForm(form);
	var o = type ? {javaClass:type} : {};
	if (props instanceof Array) {
		for (var i = 0; i < props.length; i++) {
			var prop = props[i];
			var p, f;
			if (prop.indexOf("->") != -1) {
				var a = prop.split("->");
				p = a[1];
				f = a[0];
			} else if (prop.indexOf("<-") != -1) {
				var a = prop.split("<-");
				p = a[0];
				f = a[1];
			} else {
				p = f = prop;
			}
			var field = form.findField(f);
			if (field != null) {
				var v = getFieldValue(field);
				if (v != null || !ignoreNull) {
					o[p] = v;
				}
			}
		}
	} else {
		var fields = form.getFields();
		var l = fields.length;
		for (var i = 0; i < l; i++) {
			var field = fields.getAt(i);
			if (!field.isFormField) {
				continue;
			}
			var p = field.getName();
			if (p == null || /^ext-/.test(p)) {
				continue;
			}
			var v = getFieldValue(field);
			if (v != null || !ignoreNull) {
				o[p] = v;
			}
		}
	}
	
	for (var p in o) {
		var v = o[p];
		var offset = p.indexOf('#');
		if (offset != -1) {
			var pn = p.substring(0, offset);
			var pv = o[pn];
			if (pv instanceof Date) {
				var tf = form.findField(p);
				if (tf != null && v != '' && v != null) {
					var td = tf.parseDate(v);
					pv.setHours(td.getHours());
					pv.setMinutes(td.getMinutes());
				}				
			}
			delete o[p];
			continue;
		}
		var offset = p.indexOf('.');
		if (offset != -1) {
			var pn = p.substring(0, offset);
			var pf = p.substring(offset + 1);
			var ps = o[pn];
			if (ps == null) {
				ps = o[pn] = {"map":{},"javaClass":"java.util.Map"};
			}
			ps.map[pf] = v;
			delete o[p];
			continue;
		}
	}
	return o;
}

var getFieldValue = function (field) {
	try {
		var t = field.getXType();
		if (t == 'htmleditor') {
			return field.getValue().replace(/^\u200B/, '');
		}
		if (t == 'radiofield' || t == 'checkboxfield') {
			if (field.ownerCt.xtype == 'radiogroup' || field.ownerCt.xtype == 'checkboxgroup') {
				return undefined;
			}
		}
		var v = field.getValue();
		if (v == null) {
			return null;
		}
		if (t == 'radiogroup') {
			return v['#option'];
		} else if (t == 'checkboxgroup') {
			v = v['#option'];
			if (v == null) {
				v = [];
			} else if (!Ext.isArray(v)) {
				v = [v];
			}
			return v;
		}
		if (v === '') {
			if (field instanceof Ext.form.DateField) {
				return null;
			} else if (field instanceof Ext.form.HtmlEditor || field instanceof Ext.form.TriggerField
				|| t == 'textfield' || t == 'textarea' || t == 'textareafield' || t == 'hidden') {
				return '';
			} else {
				return null;
			}	
		}
		return v;
	} catch (ex) {
		return undefined;
	}
}

var df =''; //Class.forName('org.ajaxframework.util.DateFormat').newInstance('yyyy-MM-ddTHH:mm:ss');

var setFieldValue = function (field, v) {
	var t = field.getXType();
	if (t == 'radiogroup' || t == 'checkboxgroup') {
		field.setValue({'#option':v});
	} else if (t == 'datefield') {
		if (Ext.isDate(v)) {
			field.setValue(v);	
		} if (Ext.isNumber(v)) {
			field.setValue(new Date(v));	
		} else if (Ext.isString(v)) {
			field.setValue(df.parse(v));	
		}
	} else {
		field.setValue(v);
	}
}


FormUtils.getMap = function (formArg, props) {
	var map = {};
	if (formArg instanceof Array) {
		for (var i = 0; i < formArg.length; i++) {
			Ext.apply(map, FormUtils.getDataObject(formArg[i], props));	
		}	
	} else {
		map = FormUtils.getDataObject(formArg, props);
	}	
	return {javaClass:'java.util.Map', map:map};
}

FormUtils.updateObject = function (obj, form, props) {
	var o = obj;
	if (obj.javaClass == 'java.util.Map') {
		o = o.map;
	}
	var uo = FormUtils.getDataObject(form, props);
	for (var p in uo) {
		o[p] = uo[p];
	}
};

FormUtils.resetForm = function (form) {

	form.reset();
	//var l = form.items.getCount();
	//for (var i = 0; i < l; i++) {
	//	var field = form.items.itemAt(i);
	//	field.setValue(null);
	//}

};

FormUtils.resetFormWithoutFields = function (form, fields) {

	form = getBasicForm(form);
	fields = fields || [];
	var inField = function (name) {
		for (var i = 0; i < fields.length; i++) {
			if (fields[i] == name) {
				return true;
			}
		}
		return false;
	}
	var l = form.items.getCount();
		for (var i = 0; i < l; i++) {
			var field = form.items.itemAt(i);
			if (!inField(field.getName())) {
				setFieldValue(field, null);
			}
		}

};


FormUtils.setReadOnly = function (field, readOnly) {
	field.getEl().dom.readOnly = readOnly;
};

FormUtils.setFieldsDisabled = function (form, fieldNames, disabled) {
	form = getBasicForm(form);
	for (var i = 0; i < fieldNames.length; i++) {
		var name = fieldNames[i];
		var field = form.findField(name);
		if (field != null) {
			field.setDisabled(disabled);
		}
	}
}


FormUtils.setAllFieldsDisabled = function (form, disabled) {
	form = getBasicForm(form);
	var fields = form.getFields();
	for (var i = 0; i < fields.length; i++) {
		var field = fields.get(i);
		field.setDisabled(disabled);
	}
}

FormUtils.setLabelHtml = function (label, html) {
	if (label.el && label.el.dom) {
		label.el.dom.innerHTML = html;
	} else {
		label.html = html;
	}
}
});