
// 导入所需的类

//$import("org.ajaxframework.ext4.IPagePanel");
//$import("org.ajaxframework.webapp.util.URLController");
//$import("org.w3c.dom.events.EventListener");

//$import("com.homolo.webapps.WebApplication");

define(function(require) {
    var IPagePanel = require('icloudframe/IPagePanel');
    // ----------------------------------------------------------------
	// 构建界面 UI Building
	// ----------------------------------------------------------------
    // 初始化布局
	var initLayout = function () {
		this.viewport = new Ext.Viewport({
		    layout:'card',
		    items: [{
			    border: false,
		    	padding: '10 10 10 10',
		    	html: '加载中 ...'
		    }]
		});
	};
// ----------------------------------------------------------------
// 定义应用程序对象并配置初始化 Application Definitions
// ----------------------------------------------------------------

var Application = function () {

	// 内部成员变量定义

	return {

		// 共有成员变量
		viewport : null,
		navigator: null,
		mainPanel: null,
		moduleInitializers: 1,//$initializers,

		// 共有方法

		// 应用初始化
		init : function () {

			// 设置调试开关
			//js.lang.System.setProperty("debug", $debug);

			// 设置状态保持方式 Cookie
			// Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

			// 设置Ext空白图片地址			
			//Ext.BLANK_IMAGE_URL = $blankimg;

			// TODO

		},

		// 应用退出
		destroy : function () {

		},

		// 构建界面
		paint : function () {

			Ext.QuickTips.init();

			initLayout.call(this);
			var loading = Ext.get('loading');
			var mask = Ext.get('loading-mask');
			mask.setOpacity(0.8);
			mask.shift({
				xy:loading.getXY(),
				width:loading.getWidth(),
				height:loading.getHeight(),
				remove:true,
				duration:0.2,
				opacity:0.3,
				easing:'bounceOut',
				callback : function(){
					loading.fadeOut({duration:0.2,remove:true});
				}
			});
		},

		// 开始运行
		run : function () {
			try {
				for (var i = 0, l = this.moduleInitializers.length; i < l; i++) {
					//Class.forName(this.moduleInitializers[i]).newInstance().init();
				}
				IPage.open($itype, this.viewport, {config:$iconfig});
			} catch (ex) {
				Application.showError(ex);
			}
		},

		// 显示异常
		showError : function (ex) {
			if (ex.printStackTrace) {
				ex.printStackTrace();
			} else {
				window.alert(ex.message);	
			}
		},

		// 获得当前 window 句柄
		getWindow : function () {
			return window;
		},

		// 获得 Bean 对象根据指定的名称
		getBean : function (name) {
			
		},
		
		open: function (name, target, params) {
			return IPage.open(name, target || this.mainPanel, params); 
		},
		
		openURL : function (url, target, params) {
			params = params || {};
			params.url = url;
			return IPage.open('org.ajaxframework.ext4.IFramePage', target || this.mainPanel, {config:params}); 
		},

		openModule : function (module, target, params) {
			return IPage.open(module, this.mainPanel, {config:params}); 
		}

	};

}();

// 设置当前应用程序
//WebApplication.setCurrentApplication(Application);

// 启动应用 Init & Run Application
Ext.onReady(

	function () {
		Ext.Loader.setConfig({enabled:true});  
		try {
		
			Application.init();
			Application.paint();
			setTimeout(function (){Application.run();});
		} catch (e) {Application.showError(e);
			if ($debug != 'on') {
				Application.showError(e);
			} else {
				throw e;
			}
		}
	});
});