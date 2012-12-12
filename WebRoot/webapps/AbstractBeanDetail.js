define(function(require, exports, module) {
 var AbstractPage = require('page/AbstractPage');
var RestClient	= require('cloudcode/framework/service/rest/RestClient');

module.exports=
Ext.define('AbstractBeanDetail', {

	extend :AbstractPage,// 'page.AbstractPage',

	entityName : null,
	bodyBorder : false,
	bodyFrame : false,

	componentConfig : {
		'save' : function() {
			return {
				iconCls : 'save',
				text : '保存',
				tooltip : '保存对象',
				handler : Ext.bind(this.doSave, this)
			};
		},
		'cancel' : function() {
			return {
				iconCls : 'cancel',
				text : '取消',
				tooltip : '取消并关闭',
				handler : Ext.bind(this.doCancel, this)
			};
		}
	},

	config : null,

	entityId : null,
	entityObject : null,
	entityAction : null,
	closeAfterCreated: true,
	closeAfterUpdated: true,

	opener : null,
	callback : null,

	constructor : function(config) {
		this.callParent(arguments);
		this.config = config || {};
	},

	onOpen: function () {
		this.callParent(arguments);
		if (this.entityAction == 'create') {
			this.onOpenInCreate();
		} else if (this.entityAction == 'edit') {
			this.onOpenInEdit();
		}
	},

	onOpenInCreate : function() {
		this.entityId = Class.forName('org.ajaxframework.util.UUID')
				.randomUUID();
	},

	onOpenInEdit : function() {
		this.entityId = this.config.entityId;
		this.doLoadData();
	},

	doLoadData : function() {
		this.getRestClient().request('retrieve', null, Ext.bind(this.onDataLoad, this));
	},

	onDataLoad : function(data) {
		org.ajaxframework.ext4.FormUtils.updateForm(this.getForm(), data);
	},

	getRestClient : function(resource) {
		return RestClient.RestClient.getResource(
				this.entityName, resource || this.entityId);
	},

	doSave : function() {
		if (this.entityAction == 'create') {
			return this.doCreate();
		} else if (this.entityAction == 'edit') {
			return this.doUpdate();
		} else {
			alert("unknow action:" + this.entityAction);
		}
	},
	
	validateForm : function() {
		return this.getForm().getForm().isValid();
	},

	doCreate : function() {
		if (this.validateForm() !== true) {
			return;
		}
		var obj = this.getFormData();
		var UUID = require('icloudframe/util/UUID');debugger;
	UUID.randomUUID();
	console.log(UUID.randomUUID());
		//obj.id = this.entityId;
		//obj.entityName = this.entityName;
		console.log('========this.onClick("doCreate")==========');
		console.log(obj.userName+'=========userName=========');
		this.getRestClient('collection').request('create', Ext.encode(obj), Ext.bind(this.onCreated, this));
	},

	onCreated : function(r) {
		if (r.code == 1) {
			this.changed = true;
			if (this.closeAfterCreated) {
				this.close();
			}
		} else {
			alert("create failure! result:" + Ext.encode(r));
		}
	},

	doUpdate : function() {
		if (this.validateForm() !== true) {
			return;
		}
		this.getRestClient().request('update', Ext.encode(this.getFormData()), Ext.bind(this.onUpdated, this));
	},

	onUpdated : function(r) {
		if (r.code == 1) {
			this.changed = true;
			if (this.closeAfterUpdated) {
				this.close();
			}
		} else {
			alert("create failure! result:" + Ext.encode(r));
		}
	},

	doCancel : function() {
		this.close();
	},

	form : null,
	createForm : function() {
		return {};
	},

	getForm : function() {
		if (this.form == null) {
			this.form = this.createForm();
		}
		return this.form;
	},

	createDockedItems : function() {
		return [ {
			xtype : 'toolbar',
			items : [ '-', this.getComponentEntity('save', true),
					this.getComponentEntity('cancel', true) ]
		} ];
	},

	getDockedItems : function() {
		return this.createDockedItems();
	},

	getFormData : function() {
		return Ext.apply({
			id:this.entityId,
			entityName:this.entityName
		}, org.ajaxframework.ext4.FormUtils.getDataObject(this.getForm()));
	},

	createBody : function() {
		return new Ext.Panel({
			layout : 'fit',
			border : this.bodyBorder,
			frame : this.bodyFrame,
			autoScroll: true,
			dockedItems : this.getDockedItems(),
			items : this.getForm()
		});
	},

	onClose : function() {
		var cb = this.callback;
		if (cb != null) {
			cb(this.changed);
		} else if (this.opener != null) {
			if (this.changed === true) {
				this.opener.refresh();
			}
		}
	}

});
});