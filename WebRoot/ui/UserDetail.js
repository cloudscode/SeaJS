define(function(require, exports, module) {//debugger;
 var AbstractBeanDetail = require('webapps/AbstractBeanDetail');
  var FormUtils = require('icloudframe/ext4/FormUtils');
// debugger;
module.exports=Ext.define('UserDetail', {

	extend :AbstractBeanDetail,// 'webapps.AbstractBeanDetail',

	title: '联系人信息',
	entityName: 'hello.User',
	entityAction:'create',
	width: 530,
	height: 430,
	
	componentConfig : {
		'saves' : function() {
			return {
				iconCls : 'save',
				text : '保存s',
				tooltip : '保存对象s',
				handler : Ext.bind(this.doSave, this)
			};
		},
		'cancels' : function() {
			return {
				iconCls : 'cancel',
				text : '取消s',
				tooltip : '取消并关闭s',
				handler : Ext.bind(this.doCancel, this)
			};
		}
	},
	createDockedItems : function() {
			return [ {
				xtype : 'toolbar',
				items : [ '-', this.getComponentEntity('save', true),
						this.getComponentEntity('cancel', true)/*,
						this.getComponentEntity('saves', true),
						this.getComponentEntity('cancels', true)*/]
			} ];
	},

	onOpenInCreate : function() {
		//this.callParent(arguments);
	},

	onDataLoad : function(data) {
		this.callParent(arguments);
	},
	getFormData : function() {
		return Ext.apply({
			id:this.entityId,
			entityName:this.entityName
		}, FormUtils.FormUtils.getDataObject(this.getForm()));
	},
	doCreate : function() {alert('create');debugger;
	var UUID = require('icloudframe/util/UUID');debugger;
	UUID.randomUUID();
	console.log(UUID.randomUUID());
		/*if (this.validateForm() !== true) {
			return;
		}*/
//		//var obj = this.getFormData();
//		//this.getRestClient('collection').request('create', Ext.encode(obj), Ext.bind(this.onCreated, this));
	},
//	onCreated : function(r) {
//		alert('this.UserDetail');
//	},
	createForm: function () {
		
		return Ext.create('Ext.form.Panel', {
	        bodyStyle:'padding:5px 5px 0',
	        border: false,
	        fieldDefaults: {
	            labelAlign: 'left',
	            labelWidth: 60,
	            msgTarget: 'side'
	        },
	        items: [{
	            xtype: 'container',
	            anchor: '100%',
	            border: false,
	            layout:'column',
	            items:[{
	                xtype: 'container',
	                columnWidth:.5,
	                layout: 'anchor',
	                items: [{
	                    xtype:'textfield',
	                    fieldLabel: ' 姓名',
	                    name: 'userName',
	                    allowBlank:false,
	                    anchor:'96%'
	                }, {
	                    xtype:'textfield',
	                    fieldLabel: '昵称',
	                    allowBlank:false,
	                    name: 'nickName',
	                    anchor:'96%'
	                }, {
	                    xtype:'textfield',
	                    fieldLabel: '国籍',
	                    name: 'nationality',
	                    anchor:'95%'
	                }]
	            },{
	                xtype: 'container',
	                columnWidth:.5,
	                layout: 'anchor',
	                items: [
	                {	xtype:'textfield',
	                    fieldLabel: '电话',
	                    name: 'mobile',
	                    anchor:'96%'
	                }, {
	                    xtype:'textfield',
	                    fieldLabel: '邮编',
	                    name: 'zipCode',
	                    anchor:'96%'
	                }, {
	                    xtype:'textfield',
	                    fieldLabel: 'email',
	                    name: 'email',
	                    anchor:'96%'
	                }]
	            }]
	        }]
	    });
	}	
});
});