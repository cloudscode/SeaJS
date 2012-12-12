<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%
	// 要求客户端不缓存该页
	if (request.getProtocol().equals("HTTP/1.1")) {
		response.setHeader("Cache-Control", "no-cache");
	} else {
		response.setHeader("Pragma", "no-cache");
	}

	String itype ="ui/UserDetail";// helper.getRequestParameter("itype");
	//if (StringUtils.isEmpty(itype)) {
	//itype="com.homolo.organization.ui.page.organization.Manage";
	//}
	String iconfig = "";// helper.getRequestParameter("iconfig", "{}");*/
%><html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" type="text/css"
			href="./Ext/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="./Ext/shared/example.css" />
		<script>
var $itype = "<%=itype%>";
var $iconfig = "<%=iconfig%>";
</script>
	</head>
	<body>
		<div id="loading-mask"
			style="width: 100%; height: 100%; position: absolute; z-index: 20000; left: 0; top: 0;">
			&#160;
		</div>
		<div id="loading">
			<div class="loading-indicator">
				系统加载中 ...
				<noscript>
					<div style="padding: 3px; color: red; font-size: 11px">
						错误：当前浏览器不支持JavaScript，系统无法正常运行！
					</div>
				</noscript>
			</div>
		</div>
		<script type="text/javascript">
window.URLID = 'workbench@hi';</script>		

		<script src="./SeaJS/sea.js"></script>
		<script src="./Ext/ext-all.js">
</script><!--
<script src="./ajaxframework/IPagePanel.js">
</script>
<script src="./ajaxframework/IPage.js">
</script>
		--><script>
seajs.config({
  alias: {
    'Ext' : '/SeaJS/Ext/', 
    //'CloudCode': '/SeaJS/',   
    'icloudframe': '/SeaJS/icloudframe/',   
    'webapps': '/SeaJS/webapps/',
    'ui': '/SeaJS/ui/',
    'page':'/SeaJS/page',
    'cloudcode':'/SeaJS/com/cloudcode/' 
  }
});
/*seajs.config({
	preload: 'Ext',
	preload: 'ajaxframework',
	preload: 'CloudCode',
	preload:'webapps',
	preload:'ui',
	preload:'page'  	
});*/
seajs.use('../SeaJS/ipage.js');
/*/seajs.use('./Grid/form-grid.js');
define(function(require, exports, module) {
//seajs.use('/SeaJS/webapps/AbstractBeanDetail');
debugger;
var AbstractBeanDetail = require('webapps/AbstractBeanDetail');
debugger; 
require.async('webapps/AbstractBeanDetail', function(b) {
    b.doSomething();
  });
});*/
</script>
<!--<script type="text/javascript" src="./ipage.js"></script>
	-->
</body>
</html>