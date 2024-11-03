/**
 * 
 */

//import Consts from `/common_f.js`

//var dateToMySqlDate = common_f.dateToMySqlDate;

//数值单位对照表


document.write('<script src="https://unpkg.com/axios/dist/axios.min.js"></script>');
const TEXT_ADD_BTN_DEFAULT = '请先点选一个工程来  添加仪表';

var Main = {
	
	data : function() {
		function NodeMainInfo(){
			return {
		    	checkSetName:false,
		    	textName:'',		    	
		    	checkEnableHiAlarm:false,
		    	hiAlarm:0,
		    	hiRecov:0,		    	
		    	checkEnableLoAlarm:false,
		    	loAlarm:0,
		    	loRecov:0,
			}
		};
		
		let myData = {
			//========================================左则工程树
			filterCompanyText:'',			
			companyTreeData:[			//树数据源
//				{id:1,label:'一1',icon:'el-icon-eleme',children:[
//					{id:11,label:'一11',icon:'el-icon-delete'},
//					{id:12,label:'一12',icon:'el-icon-eleme'},
//				]},
//				{id:2,label:'一2',},
			],
			    
		    defaultProps: {
		    	id:'node_id',
		    	//children: 'children',
		    	label:'name',
		    },
		    
		    
		    //=======================================右则仪表列表
		    filterNodeText:'',
		    nodeTableData:[	//仪表列表的数据源
//		    	{IMEI:123,PROJECT:"工程名1",DESC:"工位1",D1:"1.23",D2:"2.345",D3:"23.45",D1E:true,D2E:true,D3E:true},
//		    	{IMEI:123,PROJECT:"工程名1",DESC:"工位1",D2:"2.345",D3:"23.45",D2E:true,D3E:true},
//		    	{IMEI:123,PROJECT:"工程名1",DESC:"工位1",D3:"23.45",D_ENA:4},
		    ],
		    
		    nodeList:[],	//读取到的仪表数据总表
		    nodeFilterList:[],	//刷选后的仪表数据表
		    
		    pageCount:0,
		    pageIndex:0,
		    
		    
		    
		    
		    //=================================添加仪表对话框
		    textBtnAddNode:TEXT_ADD_BTN_DEFAULT,
			textBtnAddSim:"先选择项目后添加SIM卡",
		    projectSelected:null,
		    titleAddNode:'',
		    dialogAddNodeVisible:false,
			dialogAddSimVisible:false,
		    nodeInfoData:{
		    	node_id:'',
		    	node_name:'',
		    	imei:'',
		    	group:'',
		    	dataInfos:[],
		    },
			simInfo:{
				sim:'',
				imei:''
			},
		    nodeInfoRules:{
		    	node_name:[
		    		{required: true, message: '长度为3~15个字符', trigger: 'blur'},
            		{min:3,max:15, message: '长度为3~15个字符', trigger: 'blur'},
		    	],
		    	imei:[
		    		{required: true, message: '长度最少为15个字符', trigger: 'blur'},
            		{min:15, message: '长度最少为15个字符', trigger: 'blur'},
		    	],
		    	group:[
		    		{max:30,message:'长度不大于30个字符', trigger: 'blur'},
		    	],
//		    	node_desc:[
//		    		{min:1,max:20, message:'长度为1~20个字符', trigger:'blur'},
//		    	],
		    },
		    nodeSetting:{
				node_name:'',
				group:'',
				sample_minute:0,
				sample_second:0,
				send_hour:0,
				send_minute:0,
				tel:0,
				manual_lon:0,
				manual_lat:0,
				
			},
		    
		    
		    //======================================修改仪表对话框
		    titleEditNode:'',
		    dialogEditNodeVisible:false,
			lastEditingNode:{},
			displayUnitSelected:[0,0,0,0],
			displayUnits:[
			],
			editingNodeInfos:[],
		    
		    
		    //============================================修改主要信息对话框
		    titleEditMainInfo:'修改 xxxx 信息',
		    dialogEditMainInfoVisible:false,
		    nodeMainInfoData:{
		    	d1:new NodeMainInfo(),
		    	d2:new NodeMainInfo(),
		    	d3:new NodeMainInfo(),
		    	d4:new NodeMainInfo(),		    	
		    },
		    mainInfoRules:{
		    	textD1Name:[{max:20,message:'长度小于20个字符',trigger:'blur'}],
		    	textD2Name:[{max:20,message:'长度小于20个字符',trigger:'blur'}],
		    },
		    
		    
		    //===========================================修改仪表参数对话框
		    titleEditNodeParam:'修改仪表 xxx 参数',
		    dialogEditParamVisible:false,
		    nodeParamRules:{		    	
		    },
		    nodeParams:[
		    	{
		    		line_param:{
			    		line_desc:'参量名',
			    		dispValue:10.234,
			    		unitName:'压力',
			    		setLoAlarm:true,
			    		lo_alarm:1.234,
			    		setHiAlarm:false,
			    		hi_alarm:35.123,		    			
		    		}
		    	},
		    	{
		    		line_param:{
		    			line_desc:'出口压力名',
			    		dispValue:20.234,
			    		unitName:'差压',
			    		setLoAlarm:false,
			    		lo_alarm:2.234,
			    		setHiAlarm:true,
			    		hi_alarm:90.123,	
		    		}		    		
		    	}
		    ]
		    ,
		    
		    
		    //======================================仪表控制对话框
		    titleNodeControl:"ttt",
		    dialogNodeControlVisible:false,
		    nodeOffset:0,
		    lastControlNode:{},
		    
		    
		    
		    
		    testSwitch:true,
		    
		    
		    mainWindowStyle:{
		    	
		    },	
			
			new_imei:'',
			old_imei:null,
			dialogAlarmListVisible:false,
			row_imei:null,

		};
		
		return myData;
	}//end of data
	,
	beforeMount : function() {
		
		jQuery.ajax({
			type:'POST',
			url:Consts.HTTP_PREFIX + 'GetCompanyTree',
			data:{
				access_token:parsenCookie.loadAccessToken(),//jQuery.cookie('ps_access_token'),
				company_id:parsenCookie.loadCompanyId(),//jQuery.cookie('ps_company_id'),
			},
			context:this,
			success:function(res){
				//服务器返回的公司树数据结构,放到树的数据源中
				this.companyTreeData = [res.company_tree];
								
				//用递归方式遍历树,把所有节点的指针放到数组中
				var arr = [];
				arr = this.readNodeRecursion([res.company_tree],arr);
				//console.log(arr);
				
				
				for(let company of arr){
					//所有公司节点加上 c 类型与公司图标
					company['type'] = "c";
					company['icon'] = 'el-icon-s-custom',
					company['color'] = 'green';
					//所有公司节点挂入工程子数组,挂入的时候设置好 p 类型
					this.addProjectsToCompany(company);
				}
				
				//console.log(res);
			},
			error:function(res){
				
			},
		});
		
		for(let type of PRESSURE_UNITS) {
			let option = {
				value:type,
				label:UNIT_TABLE[type].name,
			};
			this.displayUnits.push(option);
		}

		// for(let name of this.displayUnitSelected) {
		// 	name = UNIT_TABLE[name].name;
		// }

		
		
		//this.$message({message:"tttt"});
	},
	
	created(){
		window.addEventListener("resize", this.onsize);		
		
	    setTimeout(this.onsize,100);
	},
	
	methods:{
		onsize(event){			
			const width = document.documentElement.offsetWidth;
			const height = document.documentElement.offsetHeight;
			let asideWidth = this.$refs.asideWindow.offsetWidth;
			
			let marginStr = window.getComputedStyle(this.$refs.mainWindow,null).marginLeft;			
			let marginNumber = marginStr.slice(0,marginStr.indexOf('px'));
			
			this.mainWindowStyle.width = width - asideWidth - marginNumber + 'px';
			this.mainWindowStyle.height = '100%';
			
			//console.log('仪表管理主窗宽 = ' + this.mainWindowStyle.width);
			
			this.$forceUpdate();
		},
		
		//=========================================公共函数		
		//仪表的单位代码转换成单位名称,用于显示
		unitCodeToName(code) {
			for (let elem of UNIT_TABLE) {
				//console.log(elem);
				//console.log([elem.type,code]);
				if(elem.type == code) {
					return elem.name; 
				}
			}
			return '';
		},
		
		//仪表的单位代码转换成单位描述,用于显示
		unitCodeToDesc(code) {
			for (let elem of UNIT_TABLE) {
				if(elem.type == code) {
					return elem.desc;
				}
			}
		},
		
		
		
		
				/*
		把读入的服务器数据设置好成为本地的数据格式
		*/
		setupNodeListData(nodeListReadFromServer)
		{			
			for(let node of nodeListReadFromServer) {
				
				if(null == node.node_data) {
					node.dataInfos = [];
					continue;
				}
				
				let enaFlag = node.line_ena_flag;		//取出线路使能字符串
				//遍历字符串,找出最多3路来处理
				let getLine = 0;				
				
				let lineDatas = node.node_data.line_datas?node.node_data.line_datas:{};
				
				node.dataInfos = [];

				for(let ld of lineDatas) {
					if((null == ld.line_param)||(ld.line_param.show == 0)) {
						continue;
					}

					const disp_unit = ld.line_param.disp_unit;
					const lp = ld.line_param;
					
					lineNodeMe.push(ld["node_line"]);
					
					let dataInfo = {
						canvas_id:'canvas_' + ld.node_line,
						line:ld.node_line,
						last_value:ld.value,
						unit:ld.unit,
						displayUnit:disp_unit,
						displayValue:UnitTransfer.transferToUnit(ld.value,ld.unit,disp_unit).toFixed(lp.dot_pos),
						isPressureUnit:UnitTransfer.isPressureUnit(ld.unit),
						unit_name:unitCodeToName(disp_unit),
						setDesc:lp.set_desc,
						line_desc:(lp.set_desc == "1") ? lp.line_desc : unitCodeToDesc(disp_unit),
						setMax:lp.set_disp_max,
						max:lp.disp_max,
						setMin:lp.set_disp_min,
						min:lp.disp_min,
					};
					
					node.dataInfos.push(dataInfo);					
					
					//看看是否有客户自定义的单位与额外的文字描述
					const funcName = node.node_id + '_' + ld.node_line;
					if(ExtUnitCalculate[funcName]) {
						dataInfo.extUnit = true;
						//第3个参数，代号0代表 kPa 的单位
						const kPaValue = UnitTransfer.transferToUnit(ld.value,ld.unit,0);
						dataInfo['extText'] = ExtUnitCalculate[funcName](kPaValue);
					}
					else {
						dataInfo.extUnit = false;
						dataInfo['extText'] = "";
					}
					
					++getLine;
					if(getLine >= 3) {
						break;
					}
				}

				//把 sql 时间后面的毫秒值去掉						
				if(node.node_data.date) {
					node.node_data.date = node.node_data.date.substring(0,19);
					//根据 sql 时间生成短日期字符串
					const lastTime = mySqlDateToDate(node.node_data.date);
					const timeStr = lastTime.getMonth()+1 + '月' + lastTime.getDate() + '日 ' + 
					formatNumber(lastTime.getHours()) + ':' + formatNumber(lastTime.getMinutes());
					node['shortTime'] = timeStr;
				}
				else{
					node['shortTime'] = '';
				}
											

				
				//更新数据后,把 lastSelectedNode 一起更新
				if(null != this.lastSelectedNode) {
					for(let node of this.nodeList) {
						if(node.node_id == this.lastSelectedNode.node_id) {
							this.lastSelectedNode = node;
						}
					}
				}

				// notifyInst.onClose = function(){
				// 	const msg = '关闭了' + node.ID;
				// 	alert(msg);						
				// }

	
			}//for(let node of res.NODES) 结束
		},
		
		
		
		createNodeInfos(node){	
			console.log(node);		
			
			let infos = [];
			
			//注意处理一些没有数据的新仪表
			if( (!node.node_data) || (!node.node_data.line_datas) ) {
				node.node_data = {line_datas:[]};
				return infos;
			}
			
			for(let ld of node.node_data.line_datas) {
				if(null == ld.line_param) {
					continue;
				}
				const disp_unit = ld.line_param.disp_unit;
				const lp = ld.line_param;
				const maxMin = '(' + lp.value_min + ' ~ ' + lp.value_max + ')' + unitCodeToName(disp_unit);
				
				let dataInfo = {
					line:ld.node_line,
					value:ld.value,							//当前值
					pointPos:ld.point,						//小数位数
					unit:ld.unit,							//匹配当前值的单位
					displayUnit:disp_unit,			//强制显示单位
					displayValue:UnitTransfer.transferToUnit(ld.value,ld.unit,disp_unit).toFixed(ld.point),	//换算后的显示值
					isPressureUnit:UnitTransfer.isPressureUnit(ld.unit),	//是否压力单位
					unitName:unitCodeToName(disp_unit),		//根据单位代码算出来的单位名称
					//valueMax:lp.value_max,					//满量程值
					//valueMin:lp.value_min,					//零量程值
					//maxMin:maxMin,							//量程
					//setDescBool:(lp.set_desc == "1"),
					setDesc:lp.set_desc == "1",					//是否有自定义的通道名称
					lineDesc:(lp.set_desc == "1") ? lp.line_desc : unitCodeToDesc(disp_unit),	//通道名称
					//time:node.node_data.date,		//数据时间
					
					value_max:lp.value_max,			//满量程值
					value_min:lp.value_min,			//零量程值
							
					hi_alarm_2:lp.hi_alarm_2,					
					hi_alarm_1:lp.hi_alarm_1,
					lo_alarm_1:lp.lo_alarm_1,
					lo_alarm_2:lp.lo_alarm_2,
					
					hi_recover_2:lp.hi_recover_2,
					hi_recover_1:lp.hi_recover_1,
					lo_recover_1:lp.lo_recover_1,
					lo_recover_2:lp.lo_recover_2,
					
					h2_open:( (lp.alarm_switch & Consts.HI_ALARM_2_MASK) != 0) ? true : false,
					h1_open:( (lp.alarm_switch & Consts.HI_ALARM_1_MASK) != 0) ? true : false,
					l1_open:( (lp.alarm_switch & Consts.LO_ALARM_1_MASK) != 0) ? true : false,
					l2_open:( (lp.alarm_switch & Consts.LO_ALARM_2_MASK) != 0) ? true : false,
					
					setMax:lp.set_disp_max,		//是否有自定义的
					max:lp.disp_max,
					setMin:lp.set_disp_min,
					min:lp.disp_min,
					is_cus_unit:lp.is_cus_unit==0?false:true,
					cus_unit:lp.cus_unit,
				};
				
				infos.push(dataInfo);
			}
			
			return infos;
		},
		
		reflashProjectsNodes(projects) {
			//把工程数组传给服务器,返回所有工程的仪表
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'GetProjectsNodes',
				data:{
					access_token:parsenCookie.loadAccessToken(),//jQuery.cookie('ps_access_token'),
					project_list:JSON.stringify(projects),
				},
				context:this,
				success:function(res){
					//console.log(res);
					this.nodeList = res.node_list;
					
					//把所有仪表的数据放在 nodeList
					for(let node of res.node_list) {
						
						node.nodeInfos = this.createNodeInfos(node);
						
/*						if(null != node.node_data) {
							for(let lineData of node.node_data.line_datas) {
								console.log(["lineParam=",lineData.line_param]);
								
								let lp = lineData.line_param;
								if(null != lp) {
									lp['dispValue'] = UnitTransfer.transferToUnit(lineData.value,lineData.unit,lp.disp_unit),
									lp.set_desc = (lp.set_desc == '1');
									lp.set_disp_max = (lp.set_disp_max == '1');
									lp.set_disp_min = (lp.set_disp_min == '1');
									lp['unitName'] = this.unitCodeToName(lp.disp_unit);
									lp['isPressureUnit'] = UnitTransfer.isPressureUnit(lp.last_unit);
									lp.line_desc = (lp.set_desc) ? lp.line_desc : this.unitCodeToDesc(lineData.unit);			
								}
							}
						}*/
					}
					
					//刷选出客户想要的,放到 nodeFilterList
					console.log(this.filterNodeText);
					this.nodeFilteredList = this.nodeList.filter(function(node1){
						
						if( /*(node1.node_name.indexOf(this.filterNodeText) != -1)
								||*/
							(node1.imei.indexOf(this.filterNodeText) != -1)
								||
							(node1.group.indexOf(this.filterNodeText) != -1)		)
						{
							return true;
						}
						else {
							//console.log(node1);
							return false;
						}
						
					},this);					
					
					this.nodeTableData = this.nodeFilteredList.slice(0,PAGE_ITEM_MAX);
					this.pageCount = (Math.ceil(this.nodeFilteredList.length / PAGE_ITEM_MAX))*10;
					
					//console.log('count= ' + this.nodeFilteredList.length);
				},
				error:function(res){
					
				},
			});
			//ajax url:'GetProjectsNodes', 结束
		},
		
		//=========================================左边公司与工程树
		addProjectsToCompany(node) {			
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + `GetCompanyProjects`,
				data:{					
					access_token:parsenCookie.loadAccessToken(),
					company_id:node.company_id,
				},
				context:this,
				success:function(res){
					//console.log(res);
					if("1" === res.result) {
						//  console.log(res);
						for(let project of res.project_list) {							
							var projectNode = {
								id:'p_' + project.project_id,	//为了工程ID与公司ID不重复,工程ID加上 p_ 前缀
								project_id:project.project_id,			//pid 为工程ID
								project_name:project.project_name,
								type:'p',				//p 类型,让代码可以识别这个工程
								icon:'el-icon-document'	//工程图标
							};							
							node.children.push(projectNode);
						}
						setTimeout(this.onsize,700);
					}					
				},
				error:function(res){
					
				},
			});
		},

		readNodeRecursion : function(nodes,arr) {
			for(var item of nodes) {				
				//arr.push({id:item.id,label:item.label});
				arr.push(item);
				if(item.children && item.children.length) {
					this.readNodeRecursion(item.children,arr);
				}
			}
			return arr;
		},		
		
		filterCompanyTreeFunc : function(value,data) {
			//this.$message({message:value});
			if (!value) return true;
			let t1 = false;
			if(data.company_name != null) {
				t1 = (data.company_name.indexOf(value) !== -1);
			}
			let t2 = false;
			if(data.project_name != null) {
				t2 = ( data.project_name.indexOf(value) !== -1 );
			}
	        return t1 || t2;
		},
		
		companyTreeNodeClick : function(company,node,tree){
			console.log([company,node,tree]);
			//this.textBtnAddNode = ;
			
			node.checked = !node.checked;
			
			if('c' === company.type) {
				this.projectSelected = null;
			}
			else {
				this.projectSelected = company;
				//this.$refs.companyTree.setChecked(company.id,true,false);
				let nodes = this.$refs.companyTree.getCheckedNodes();
				let projects = nodes.filter(function(node){
					return (node.type === 'p');
				},this);
				this.reflashProjectsNodes(projects);
			}
			
		},		
		
		/*
		 * 树节点重画
		 */
		handleRenderContent : function(h,{ node, data, store }){
			//console.log([h,node,data,store]);			
			
			if('c' == data.type) {
				return h('span',[
					h('i', {attrs: {class: 'el-icon-house'}}),
					h('span',{style:{color:'green'}},data.company_name),
				]);				
			}
			
			else {
				return h('span',{style:{color:'blue'},attrs: {class:'el-icon-s-grid'}},data.project_name); 
			}
		},
		//--------------------------------------左边公司与工程树
		
		
		
		
		
		//========================================================右边仪表列表
		companyTreeNodeCheck : function(company,clickInfo) {
			console.log([company,clickInfo]);
			
			//检查看动作是 check 还是  uncheck 
			if('p' === company.type) {
				if(clickInfo.checkedNodes.indexOf(company) != -1) {
					this.projectSelected = company;
				}
			}
			
			//选中的内容里,有公司与工程,把工程挑出来,放在数组中
			let projects = [];
			for(let project of clickInfo.checkedNodes) {
				if('p' === project.type) {
					projects.push(project);					
				}
			}
			//console.log(projects);
			
			this.reflashProjectsNodes(projects);

			// url:'GetProjectsNodes', 结束
		},//companyTreeNodeCheck结束
		
		companyTreeExpand : function(nodeDate,nodeObject,VueNode) {
			setTimeout(this.onsize,700);
		},
		
		companyTreeCollapse : function(nodeDate,nodeObject,VueNode) {
			setTimeout(this.onsize,700);
		},
		 

	    btnFilterNode(){
			this.nodeFilteredList = this.nodeList.filter(function(node1){
				
				if( (node1.node_name.toLowerCase().indexOf(this.filterNodeText) != -1)||
					(node1.node_name.indexOf(this.filterNodeText) != -1)||
					(node1.imei.indexOf(this.filterNodeText) != -1)||
					(node1.group.toLowerCase().indexOf(this.filterNodeText) != -1)||
					(node1.group.indexOf(this.filterNodeText) != -1) )
				{
					return true;
				}
				else {
					//console.log(node1);
					return false;
				}
				
			},this);
			
			this.nodeTableData = this.nodeFilteredList.slice(0,PAGE_ITEM_MAX);
			this.pageCount = (Math.ceil(this.nodeFilteredList.length / PAGE_ITEM_MAX))*10;
			
			console.log(this.nodeFilteredList.length);
	    },		
		
		pageChange(index){
			this.pageIndex = index - 1;
	    	this.nodeTableData = this.nodeFilteredList.slice(this.pageIndex*PAGE_ITEM_MAX,(this.pageIndex+1)*PAGE_ITEM_MAX);
		},
		
		
		
		
		
		//===============================================添加仪表
		btnAddNode(){
			//this.titleAddNode = this.$refs.companyTree.
			if(null == this.projectSelected) {
				this.$message({
				message: '请先选择工程',
				type: 'warning',
				duration: 1000
			})
			}
			else {
				this.titleAddNode = '在工程 ' + this.projectSelected.project_name + '里添加仪表';
				this.nodeInfoData.node_name = '';
				this.nodeInfoData.imei = '';
				this.nodeInfoData.group = '';
				this.dialogAddNodeVisible = true;
			}
		},

		btnAddSim(){
			if(null == this.projectSelected){
				this.$message({
					message: '请先选择工程',
					type: 'warning',
					duration:1000
				})
			}else{
				this.dialogAddSimVisible = true;
			}
		},
		
		btnSubmitAddNode(){
			console.log(this.nodeInfoData);
			//console.log(this.projectSelected);
			this.$refs.nodeInfoForm.validate((valid) => {
				if(false == valid) {
					return;
				}

				let imeis = this.nodeInfoData.imei;
				if(imeis.indexOf(',') != -1) {
					imeis = imeis.split(',');
				}else {
					imeis = [imeis];
				}

				for(let imei of imeis) {
					jQuery.ajax({
						type:'POST',
						url:Consts.HTTP_PREFIX + 'InsertNode',
						data:{
							access_token:parsenCookie.loadAccessToken(),//jQuery.cookie('ps_access_token'),
							project_id:this.projectSelected.project_id,
							node_name:this.nodeInfoData.node_name,
							imei:imei,
							group:this.nodeInfoData.group,
						},
						context:this,
						success:function(res){
							console.log(res);
							if("1" === res.result) {
								this.nodeList.push({
									project_name:this.projectSelected.project_name,
									node_name:this.nodeInfoData.node_name,
									imei:this.nodeInfoData.imei,
									group:this.nodeInfoData.group,
								});
								
								let checkeds = this.$refs.companyTree.getCheckedNodes();
								let projects = checkeds.filter(function(checked){
									return 'p' === checked.type;
								},this);
								
								this.reflashProjectsNodes(projects);
								
								
								this.dialogAddNodeVisible = false;
							}
							else {
								alert('仪表添加失败: ' + res.err_msg);
								//console.log(res);
							}
						},
						error:function(res){
							
						},				
					});
				}
				
				alert('仪表添加成功');
				
			});
			
		},
		
		btnSubmitAddSIM(){

			let sims = this.simInfo.sim;
			let imeis = this.simInfo.imei;
			
			if(sims.indexOf(',') != -1) {
				sims = sims.split(',');
			}else {
				sims = [sims];
			}
			let simLength = sims.length;

			if(imeis.indexOf(',') != -1) {
				imeis = imeis.split(',');
			}else {
				imeis = [imeis];
			}
			if(imeis.length != simLength){
				this.$message({message: 'sim与imei数量不符',type: 'error'})
				return;
			}

			for(let x in sims){
				axios({
					type:'get',
					url:Consts.HTTP_PREFIX + 'InsertSim',
					params:{
						project_id:this.projectSelected.project_id,
						sim:sims[x],
						imei:imeis[x],
					}
				}).then((res)=>{
					if(res.data.result == 1){--simLength;}
					else{
						this.$message({message: '添加失败',type: 'error'})
					}
				}).catch((err)=>{
					this.$message({message: '添加失败',type: 'error'})
				}).finally(()=>{
					if(simLength == 0){
						this.$message({
							message: '添加成功',
							type: 'success'
						})
						let checkeds = this.$refs.companyTree.getCheckedNodes();
								let projects = checkeds.filter(function(checked){
									return 'p' === checked.type;
								},this);
						this.reflashProjectsNodes(projects);
						this.dialogAddSimVisible = false;
					}
				})
			}
		},

		beforeCloseAddNodeDialog(){
			
		},
		//------------------------------------------------------添加仪表结束
		
		
		
		
		
		//======================================================编辑仪表主信息
		btnEditNode(index,row) {
			console.log([index,row]);
			
			this.titleEditNode = '修改仪表 ' + row.node_name + ' 的信息';
			
			this.nodeInfoData = row;
			
			this.lastEditingNode = row;
			this.dialogEditNodeVisible = true;
			
			this.editingNodeInfos = row.nodeInfos;
		},
		
		btnLoadParams() {
			console.log("load node params");
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'GetParam',
				context:this,
				data:{
					access_token:parsenCookie.loadAccessToken(),
					node_id:this.lastEditingNode.node_id,
				},
				success(res){
					console.log(res);
					//console.log(JSON.parse(res.line_params));
					if(1 == res.result) {
						MessageBox.info('请求发送了，请关注仪表表头信息，在仪表发送后更新页面。');						
					}
					else {
						MessageBox.info('请求仪表参数失败,请联系厂家!');
					}
				},
				error(res){
					
				},
			});
		},
		
		//提交修改主信息
		btnSubmitEditNode(){
			

				
				
				let lineParams = [];
			
				for(let info of this.lastEditingNode.nodeInfos) {
					
					
					
					const lp = {
						line:info.line,
						set_desc:info.setDesc ? "1" : "0",
						line_desc:info.lineDesc,
						dot_pos:info.pointPos,
						disp_unit:info.displayUnit,
						//value_max:info.value_max,
						//value_min:info.value_min,
						hi_alarm_2:info.hi_alarm_2,
						hi_alarm_1:info.hi_alarm_1,
						lo_alarm_1:info.lo_alarm_1,
						lo_alarm_2:info.lo_alarm_2,
						hi_recover_2:info.hi_recover_2,
						hi_recover_1:info.hi_recover_1,
						lo_recover_1:info.lo_recover_1,
						lo_recover_2:info.lo_recover_2,
						is_cus_unit:info.is_cus_unit?1:0,
						cus_unit:info.cus_unit,
						//alarm_switch:info.h2_open ,
					};
					
					lp.alarm_switch = 
						(info.h2_open ? Consts.HI_ALARM_2_MASK : 0) |
						(info.h1_open ? Consts.HI_ALARM_1_MASK : 0) |
						(info.l1_open ? Consts.LO_ALARM_1_MASK : 0) |
						(info.l2_open ? Consts.LO_ALARM_2_MASK : 0) ;
					
					lineParams.push(lp);
				}
				
				const s = this.lastEditingNode;
				
				const mainParam = {
					node_name:s.node_name,
					group:s.group,
					node_tel:s.node_tel,
					//manual_lbs:this.lastSelectedNode.manual_lbs,
					//manual_lon:s.manual_lon,
					//manual_lat:s.manual_lat,
					sample_gap:s.sample_gap,
					send_gap:s.send_gap,
				}
				
				
				
				jQuery.ajax({
					type:'POST',
					url:Consts.HTTP_PREFIX + 'UpdateNodeFullParams',
					context:this,						
					data:{
						access_token:parsenCookie.loadAccessToken(),
						node_id:s.node_id,
						main_param:JSON.stringify(mainParam),
						line_params:JSON.stringify(lineParams),
					},
					success(res){
						console.log(res);
						//console.log(JSON.parse(res.line_params));
						if(1 == res.result) {
							MessageBox.info('修改参数成功了!');
							//this.reflashProjectAndNode();						
						}
						else {
							MessageBox.info('修改参数失败,请联系厂家!');
						}
					},
					error(res){
						
					},
				});
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
/*				jQuery.ajax({
					type:'POST',
					url:Consts.HTTP_PREFIX + 'UpdateNode',
					data:{
						access_token:parsenCookie.loadAccessToken(),
						node_id:this.lastEditingNode.node_id,
						node_name:this.lastEditingNode.node_name,
						imei:this.lastEditingNode.imei,
						group:this.lastEditingNode.group,
					},
					context:this,
					success:function(res){
						
						//console.log(res.SQL);
						
						if("1" === res.result) {
							let infoData = this.nodeInfoData;
							let row = this.lastEditingNode;
							
							alert("修改仪表信息成功");
							this.dialogEditNodeVisible = false;
						}
						else {
							alert("修改失败:" + res.MSG);
						}
					},
					error:function(res){
						
					},
				});//end of jQuery.ajax*/
				
				
				
			
		},
		
		beforeCloseEditNodeDialog(){
			
		},
		
		//===========================================删除仪表
		btnDeleteNode(index,row) {
			//console.log(row);
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'DeleteNode',
				data:{
					access_token:parsenCookie.loadAccessToken(),
					node_id:row.node_id,
				},
				context:this,
				success:function(res){
					//console.log(res);
					if("1" === res.result) {
						this.nodeTableData.splice(index,1);
						alert("删除成功了!");
					}
					else {
						alert("删除失败了  " + res.err_msg);
					}
				},
				error:function(res){
					
				},
			});
		},
		
		
		
		//===================================================修改线路的网页显示设置
		btnEditParam(index,row){
			
			if( (null == row.node_data) || (null == row.node_data.line_datas) ) {
				alert('该仪表没有数据,请先把仪表上电,上传数据后再修改!');
				return;
			}
			
			this.nodeParams = row.node_data.line_datas;			
			
			this.titleEditNodeParam = "修改 " + row.node_name + " 的参数. " + " IMEI:" + row.imei + " 工位号: " + row.group;			
			this.lastEditingNode = row;			
			this.dialogEditParamVisible = true;
			console.log('edit param');
		},
		
		btnSubmitEditParam()
		{
			const lds = this.lastEditingNode.node_data.line_datas;
			
			
			let dispParamList = [];
			
			for(const lp of lds) {
				const dispParam = {
					line:lp.node_line,
					set_desc:lp.line_param.set_desc ? "1" : "0",					
					line_desc:lp.line_param.line_desc,
					set_disp_max: lp.line_param.set_disp_max ? "1" : "0",
					disp_max:lp.line_param.disp_max,
					set_disp_min: lp.line_param.set_disp_min ? "1" : "0",
					disp_min:lp.line_param.disp_min,
					disp_unit:lp.line_param.disp_unit,
				};
				dispParamList.push(dispParam);
			}
			
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'UpdateDispParam',
				data:{
					access_token:parsenCookie.loadAccessToken(),
					node_id:this.lastEditingNode.node_id,					
					disp_param:JSON.stringify(dispParamList),
				},
				context:this,
				success:function(res){
					console.log(res);
					if("1" == res.result) {
						alert('显示设置修改成功!');
					}
					else {
						alert('显示设置修改失败,请联系厂家');
					}
				},
				error:function(res){
					
				},
			}),
			
			console.log("submit edit param");
		},
		//-------------------------------------------------修改线路的网页显示设置
		
		
		
		
		//============================================================进入远程控制调零对话框
		btnHideNodeControl(){
			this.dialogNodeControlVisible = false;
		},
		
		btnOffsetAndZero(index,row){
			console.log([index,row]);
			this.lastEditingNode = row;
			this.titleNodeControl = "远程控制仪表: " + row.node_name + " IMEI:" + row.imei + " 工位号: " + row.group;
			this.dialogNodeControlVisible = true;
		},
		
		btnSubmitOffsetNode(){
			console.log(this.nodeOffset);
			console.log("offset");
			
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'SetOffset',
				data:{
					access_token:parsenCookie.loadAccessToken(),
					node_id:this.lastEditingNode.node_id,
					offset:this.nodeOffset,
				},
				context:this,
				success:function(res){
					console.log(res);
					if("1" == res.result) {
						alert('指令发送成功,请唤醒仪表并留意仪表面板提示信息');
					}
					else {
						alert('指令发送失败,请联系厂家');
					}
				},
				error:function(res){
					
				},
			});
		},
		
		btnSubmitZeroNode() {
			console.log("zero");
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'SetZero',
				data:{
					access_token:parsenCookie.loadAccessToken(),
					node_id:this.lastEditingNode.node_id,
				},
				context:this,
				success:function(res){
					console.log(res);
					if("1" == res.result) {
						alert('指令发送成功,请唤醒仪表并留意仪表面板提示信息');
					}
					else {
						alert('指令发送失败,请联系厂家');
					}
				},
				error:function(res){
					
				},
			});
		},
		//------------------------------------------------------进入远程控制调零对话框
		

		ttt(row){
			console.log(row);
			this.row_imei = row.imei;
			this.dialogAlarmListVisible=true;
			this.new_imei = '';
		},
		
		replace_imei(){
			if(this.new_imei.length<10){
				this.$message({
					type:'info',
					message:'请确认新imei',
					duration:500
				})
				return;
			}

			axios({
				methods:'post',
				url:Consts.HTTP_PREFIX+'DisplaceImei',
				params:{
					access_token:parsenCookie.loadAccessToken(),
					Oimei:this.row_imei,
					Nimei:this.new_imei,
				}
			}).then(res=>{
				if(res.data.returnCode == 1){
					this.$message({
						type:'success',
						message:'修改成功',
						duration:500
					})
				}else{
					console.log(res)
					this.$message({
						type:'info',
						message:'修改失败',
						duration:700
					})}
				}).catch(error=>{
					console.log(error);
					this.$message({
						type:'info',
						message:'修改异常'
					})
			})
		},
		
		
		
		
		
		//======================================================打开运行与报警参数设置对话框
		btnEditRunAndAlarmParam(index,row) {
			
		},
		
		btnSubmitEditRunAndAlarmParam() {
			
		},

		showControl(Id,Line,Show){
			// jQuery.ajax({
			// 	type:'POST',
			// 	URL:Consts.HTTP_PREFIX+'ShowControl',
			// 	data:{
			// 		access_token:parsenCookie.loadAccessToken(),
			// 		Id:Id,
			// 		Line:Line,
			// 		Show:Show
			// 	},
			// 	success:function(res){
			// 		if(res.result==1){
			// 			this.$message({
			// 				type:'success',
			// 				message:'修改成功',
			// 				duration:500
			// 			})
			// 		}else{
			// 			this.$message({
			// 				type:'info',
			// 				message:'修改失败',
			// 				duration:700
			// 			})
			// 		}
			// 	},
			// 	error:function(res){
			// 		this.message({
			// 			type:'info',
			// 			message:'修改异常,查看log'
			// 		})
			// 	}
			// })
			axios({
				methods:'post',
				url:Consts.HTTP_PREFIX+'ShowControl',
				params:{
					access_token:parsenCookie.loadAccessToken(),
					Id:Id,
					Line:Line,
					Show:Show
				}
			}).then(response=>{
				if(response.data.result==1){
					this.$message({
						type:'success',
						message:'修改成功',
						duration:500
					})
				}else {
					this.$message({
						type:'info',
						message:'修改失败'
					})
				}
			}).catch(error=>{
				console.log(error)
				this.$message({
					type:'info',
					message:'修改异常'
				})
			})
		},

		//-------------------------------------------------------打开运行与报警参数设置对话框
	},//------------------------------------------methods 结束
	

	
	watch:{
		projectSelected(value){
			if(null == value) {
				this.textBtnAddNode = TEXT_ADD_BTN_DEFAULT;
				this.textBtnAddSim = "先选择项目后添加SIM卡";
			}else {
				this.textBtnAddNode = '在工程 ' + value.project_name + ' 里添加仪表';
				this.textBtnAddSim = '在工程 ' + value.project_name + ' 里添加SIM卡';
			}			
		},
		
		filterCompanyText(value) {
			//this.$message({message:value});
			this.$refs.companyTree.filter(value);			
		},
	}
}

var Ctor = Vue.extend(Main)
new Ctor().$mount('#node_list')





















