define(function(require, exports, module) {
	var IPage = require('icloudframe/IPage');
//	debugger;
module.exports=	
Ext.define('AbstractPage', {

	extend: IPage,//'ajaxframework.IPage',
	title : 'Abstract Page',
	baseTarget: null,

	componentConfig: {},
	initComponentConfig:function () {
		var type = this.$class;
		var componentConfig = type.prototype.componentConfig || {};
		while (type != org.ajaxframework.ext4.IPage && type.superclass != null && type.superclass.$class != null) {
			type = type.superclass.$class;
			componentConfig = Ext.apply(Ext.apply({},type.prototype.componentConfig), componentConfig);
		}
		this.componentConfig = componentConfig;
	},

	componentEntits: {},
	getComponentEntity: function (name, autoCreate) {
		var comp = this.__proto__.componentEntits[name];
		if (comp == null && autoCreate === true) {
			var cfg = this.__proto__.componentConfig[name];
			if (cfg != null) {
				if (cfg instanceof Ext.Component) {
					comp = cfg;
				} else if (cfg instanceof IPage) {
					comp = cfg;
				} else if (cfg instanceof Function) {
					comp = cfg.call(this);
					if (!(comp instanceof Ext.Component) && !(comp instanceof IPage)) {
						comp = Ext.ComponentManager.create(comp, 'button');
					}
				} else if (cfg instanceof Object) {
					comp = Ext.ComponentManager.create(cfg, 'button');
				}
			} else {
				alert('Not found component entity for \'' + name + '\'.');
				return null;
			}
			this.__proto__.componentEntits[name] = comp;
		}
		return comp;
	},

	refreshComponentStates: function () {},
	onOpen : function () {
		this.callParent(arguments);
		this.registerGlobalVariable();
		this.refreshComponentStates();
	},

	onClose : function () {
		this.callParent(arguments);
		this.unregisterGlobalVariable();
	},

	globalVariable: null,
	getGlobalVariable: function () {
		if (this.globalVariable == null) {
			this.globalVariable ="CloudCode"; //"__ipage_" + Class.forName('org.ajaxframework.util.UUID').randomUUID();
		}
		return this.globalVariable;
	},
	
	registerGlobalVariable: function () {
		var varName = this.getGlobalVariable();
		window[varName] = this;
	},
	
	unregisterGlobalVariable: function () {
		var varName = this.getGlobalVariable();
		try {
			delete window[varName];
		} catch (e) {
			window[varName] = undefined;	
		}
	},

	constructor: function() {
		this.callParent(arguments);
		this.initComponentConfig();
		this.componentEntits = {};
    },

    body: null,
    createBody: function () {
    	return {};
    },

    getBody: function () {
		if (this.body == null) {
			this.body = this.createBody();
		}
		return this.body;
	}

});
});