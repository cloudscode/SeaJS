
define(function(require, exports, module) {
    var IPage = require('icloudframe/IPage');
    module.exports=Ext.define('IPagePanel', {
	extend: 'Ext.panel.Panel',
	requires: [
       IPage //'ajaxframework.IPage'
    ],
    
    alias: 'widget.ipage',

 	ipage: null,
	itype: null,
	iconfig: null,
	layout: 'fit',
	border: false,
//
//	openIPage: function () {
//		this.closeIPage();
//		var ipage = null;
//		var arg0 = arguments[0];
//		if (arg0 instanceof org.ajaxframework.ext4.IPage) {
//			ipage = arg0;
//		} else {
//			var arg1 = arguments[1];
//			ipage = Class.forName(arg0).newInstance(arg1 || {});	
//		}
//		this.ipage = ipage;
//    	var config = {layout:'fit',border:false,plugins:this.ipage};
//    	var body = this.ipage.getBody();
//    	if (typeof(body) == 'string') {
//    		config.html = body;
//		} else {
//			config.items = body;
//		}
//    	this.add(new Ext.Panel(config));
//    	this.doLayout();
//    	return ipage;
//	},
//	
//	closeIPage: function () {
//		if (this.ipage != null) {
//			this.ipage.close();
//		}
//	},

    // private
    initComponent : function(){

        if (this.ipage == null) {
	        if (typeof(this.itype) == 'string') {
	        	this.ipage = Class.forName(this.itype).newInstance(this.iconfig || {});	
	        } else {
	        	this.ipage = Class.forName('org.ajaxframework.ext4.BlankPage').newInstance(this.iconfig || {});
	        }
        }
        if (this.ipage != null) {
        	//alert(this.ipage.getTitle());
        	//this.setTitle(this.ipage.getTitle());
        	this.ipage.on('titlechange', function (target, title) {
        		this.setTitle(title);
        		}, this);
        	this.plugins = this.ipage;
        	var body = this.ipage.getBody();
        	if (typeof(body) == 'string') {
        		this.html = body;
    		} else {
    			this.items = body;
    		}
        }
        this.callParent(arguments);
    }
});
});