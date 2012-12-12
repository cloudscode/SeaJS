define(function(require, exports, module) {
var IPage =module.exports=
Ext.define('IPage', {

	extend : 'Ext.util.Observable',
	
	constructor : function() {
		this.callParent(arguments);
		this.addEvents('iconclschange', 'titlechange', 'open', 'close',
				'activate', 'deactivate');
	},

	config : null,
	getConfig : function(name) {
		return this.config;
	},

	title : 'IPage',
	getTitle : function() {
		return this.title;
	},

	setTitle : function(title) {
		this.title = title;
		this.fireEvent('titlechange', this, title);
	},
	


	iconCls : '',
	getIconCls : function() {
		return this.iconCls;
	},

	setIconClass : function(iconCls) {
		this.iconCls = iconCls;
		this.fireEvent('iconclschange', this, iconCls);
	},

	layout : 'fit',
	getLayout : function() {
		return this.layout;
	},

	body : null,
	getBody : function() {
		return this.body;
	},

	header: null,
	getHeader: function () {
		return this.header;
	},

	footer: null,
	getFooter: function () {
		return this.footer;
	},

	container : null,
	getContainer : function() {
		return this.container;
	},

	bodyStyle : null,
	getBodyStyle : function() {
		return this.bodyStyle;
	},

	width : 0,
	getWidth : function() {
		return this.width;
	},

	height : 0,
	getHeight : function() {
		return this.height;
	},

	/**
	 * Initialize IPage instance.
	 */
	init : function(container) {
		this.container = container;
		container.on('beforerender', this.onBeforeopen, this);
		container.on('render', this.onRender, this);
		container.on('beforeshow', this.onBeforeshow, this);
		container.on('show', this.onShow, this);
		container.on('activate', this.onActivate, this);
		container.on('deactivate', this.onDeactivate, this);
		container.on('beforeclose', this.onBeforeclose, this);
		container.on('destroy', this.onDestroy, this);
	},

	open : function() {
		var c = this.getContainer();
		if (c != null) {
			c.show();
		}
	},

	close : function() {
		var c = this.getContainer();
		if (c != null) {
			if (c.tab && c.tab instanceof Ext.tab.Tab) {
				try {
					c.tab.tabBar.closeTab(c.tab);
					return;
				} catch(e) {
					alert('close tab error:' + e.message);
				}
			}
			if (c instanceof Ext.panel.Panel) {
				c.close();
			}
		}
	},

	/**
	 * Destroy IPage instance
	 */
	destroy : function() {

	},

	refresh : function() {

	},

	// Event Handlers

	onBeforeopen : Ext.emptyFn,

	onBeforeshow : Ext.emptyFn,

	onShow : Ext.emptyFn,

	onActivate : function() {
		this.fireEvent('activate', this);
	},

	onDeactivate : function() {
		this.fireEvent('deactivate', this);
	},

	onBeforeclose : Ext.emptyFn,

	closed : true,

	onRender : function() {
		this.closed = false;
		Ext.defer(this.onOpen, 1, this);
		this.fireEvent('open', this);
	},

	onDestroy : function() {
		this.closed = true;
		Ext.defer(this.onClose, 1, this);
		this.fireEvent('close', this);
	},

	onOpen : function() {
	},

	onClose : function() {
	}

});

//var IPage = IPage;
IPage.baseTarget = null;

IPage.defaultWidth = 560;
IPage.defaultHeight = 420;
/**
 * Opens an IPage instance in target
 */
IPage.open = function(page, target, params) {
	params = params || {};
	var config = params.config || {};
	delete params.config;
	if (typeof (page) == 'string') {
		//page=this;
		//page=require('CloudCode'+page);
		// var page = require.resolve('CloudCode/ui/UserDetail');
		//debugger;
		page =require('ui/UserDetail').prototype;
		//page = require('webapps/AbstractBeanDetail').prototype;
//		debugger;
		//var AbstractBeanDetail = require('page/AbstractPage.js');
		//var IPage = require('IPage').IPage;
		//page=IPage;
//		page=a.UserDetail;//.prototype;
  			//a.doSomething();
		//page=seajs.use('/SeaJS/'+page);
		//page = Class.forName(page).newInstance(config);
	}
	var body = page.getBody();
	//debugger;
	target = target || IPage.baseTarget;
	if (target == null || target == 'window' || body instanceof Ext.window.Window) {
		var win = null;
		if (body instanceof Ext.window.Window) {
			page.init(win = body);
		} else {
			var windowConfig = Ext.apply( {
				title : page.getTitle(),
				iconCls : page.getIconCls(),
				width : page.getWidth() || IPage.defaultWidth,
				height : page.getHeight() || IPage.defaultHeight,
				modal : false,
				resizable : true,
				border: false,
				plain : true,
				 buttonAlign:'right',
				 closeAction:'close',
				 maximizable:true,
				 minimizable:false,
				autoScroll : true,
				layout : page.getLayout(),
				plugins : page
			}, params);
			if (typeof(body) == 'string') {
				windowConfig.html = body;
			} else {
				windowConfig.items = body;
			}
			
			win = new Ext.window.Window(windowConfig);
		}
		page.on('titlechange', function(target, title) {
			win.setTitle(title);
		});
		page.on('iconclschange', function(target, iconcls) {
			win.setIconClass(iconcls);
		});

		win.show();
		return page;

	} else if (false && target instanceof Class.forName('org.ajaxframework.ext4.IPagePanel')) {
		return target.openIPage(page);
	} else if (target instanceof Ext.tab.Panel) {
		var panelConfig = Ext.apply({
			title : page.getTitle(),
			iconCls : page.getIconCls(),
			closable : true,
			autoScroll : true,
			border: false,
			bodyStyle : page.getBodyStyle(),
			layout : page.getLayout(),
			plugins : page
		}, params);
		if (typeof(body) == 'string') {
			panelConfig.html = body;
		} else {
			panelConfig.items = body;
		}
		var panel = Ext.create('Ext.panel.Panel', panelConfig);
		target.add(panel);
		//target.layoutOnTabChange = true;
		page.on('titlechange', function(target, title) {
			panel.setTitle(title);
		});
		page.on('iconclschange', function(target, iconcls) {
			panel.setIconClass(iconcls);
		});
		//page.on('activate', function() {
			//target.setActiveTab(panel);
		//});
		target.setActiveTab(panel);
		//panel.show();
		//alert(l1-l);
		return page;
	} else if (target instanceof Ext.container.Container) {
		var panel = null;
		if (body instanceof Ext.panel.Panel) {
			page.init(panel = body);
		} else {
			var panelConfig = Ext.apply({
				iconCls : page.getIconCls(),
				border: false,
				closable : false,
				autoScroll : true,
				bodyStyle : page.getBodyStyle(),
				layout :page.getLayout(),
				plugins : page
			}, params);
			if (typeof(body) == 'string') {
				panelConfig.html = body;
			} else {
				panelConfig.items = body;
			}
			panel = new Ext.panel.Panel(panelConfig);
		}
		if (target.getLayout() instanceof Ext.layout.container.Card) {
			target.add(panel);
			target.getLayout().setActiveItem(panel);
		} else {
			target.removeAll(true);
			target.add(panel);
		}
		target.layoutOnTabChange = true;
		/*page.on('titlechange', function(target, title) {
			panel.setTitle(title);
		});*/
		/*page.on('iconclschange', function(target, iconcls) {
			panel.setIconClass(iconcls);
		});*/
		return page;
	}

}
});
