/**
 *
 */
const CHART_COLOR = {
	COMPANY_COLOR : 'rgb(102,169,201)',
	ITEM_COLOR : 'rgb(138,188,209)',
	NODE_COLOR : 'rgb(147,213,220)',
	ALARM_COLOR : 'rgb(238,121,89)',
	NORMAL_COLOR : 'rgb(176,213,223)',
	OFFLINE_COLOR : 'rgb(238,121,89)',
	ONLINE_COLOR : 'rgb(198,230,232)',
	TIP_COLOR : 'rgb(30,39,50)',
	SHADOW_COLOR : '#cdcccc'
};

var Main = {
	data: function(){
		let myData={
			
			//==========================图表各段颜色
			companyColor:CHART_COLOR.COMPANY_COLOR,
			itemColor:CHART_COLOR.ITEM_COLOR,
			nodeColor:CHART_COLOR.NODE_COLOR,
			alarmColor:CHART_COLOR.ALARM_COLOR,
			normalColor:CHART_COLOR.NORMAL_COLOR,
			offlineColor:CHART_COLOR.OFFLINE_COLOR,
			onlineColor:CHART_COLOR.ONLINE_COLOR,		
			tipColor:CHART_COLOR.TIP_COLOR,
			shadowColor:CHART_COLOR.SHADOW_COLOR,
			//--------------------------
			
			companyCount:0,
			itemCount:0,
			
			
			domName:["公司总数","项目总数"],
			domDetil:["仪表总数","报警总数","仪表状态"],
			
			//==========================独立每个图表
			chartsName:['company','item','node','alarm','state'],
			chart:[],
			chartsDom:[],
			//-----------------------------
			
			domDetilData:{},
			domData:{},
			companyData:[],
			itemData:[],
			echartsInstance:[],
			echartsInstanceCom:null,
			echartsInstanceItem:null,
			
			companyTreeData : [],
			projects:[],
			
			
			//==========================项目细分工作台
			nodeCount:0,
			nodeAlarmCount:0,
			offlineCount:0,


			
			//==========================websocket
			nodeList:[],
			webSocketReflashNodeDataListener:null,
		};
		return myData;
	}
	,
	
	beforeMount: function () {
			jQuery.ajax({
			type:'POST',
			url:Consts.HTTP_PREFIX + `GetCompanyTree`,
			data:{
				access_token:parsenCookie.loadAccessToken(),//jQuery.cookie('ps_access_token'),
				company_id:parsenCookie.loadCompanyId(),//jQuery.cookie('ps_company_id'),
			},
			context:this,
			success:function(res){			
				//console.log(["company_tree"],res.company_tree);
				//console.log(["all companys",arr]);
				
				//======================递归对所有树节点进行操作
				var that = this;
				TreeTraverse.handleAllNodes(res.company_tree,function(node){
					node['type'] = 'c';
					that.companyCount+=1;
					that.addProjectsToCompany(node,null);
				});
				
				this.domData["公司总数"] = this.companyCount;
				//服务器返回的公司树数据结构,放到树的数据源中
				this.companyTreeData = [res.company_tree];
			},
			error:function(res){
				
			},
		});
    },
    
	created:function(){
		this.webSocketReflashNodeDataListenerInit();
		

	},
	

	
	mounted:function(){	
		setTimeout(()=>{
			this.draw();
		},1000);

	},
	
	beforeDestory:function(){
		window.removeEventListener('resize',this.chartResize);
	},
	
	methods:{
		webSocketReflashNodeDataListenerInit(){
				if("WebSocket" in window){
				console.log("您的浏览器支持WebSocket");
				
				const url = Consts.WS_PREFIX + "ReflashNodeDataListener";

				if(null != this.webSocketReflashNodeDataListener) {
					this.webSocketReflashNodeDataListener.close();
				}
				
				this.webSocketReflashNodeDataListener = new WebSocket(url); //创建WebSocket连接
				if(null == this.webSocketReflashNodeDataListener) {
					console.log("新建 websocket 失败");
					return;
				}
				
				var that = this;
				
				//console.log(this.webSocket);
				this.webSocketReflashNodeDataListener.onopen = function(event) {
					console.log("刷新仪表列表监听器打开成功");
					console.log(event);
				};

				this.webSocketReflashNodeDataListener.onmessage = function(event) {
					console.log("刷新仪表列表 websocket 收到内容");
					//console.log(event.data);
										
					let data = null;
					try { 
						data = JSON.parse(event.data);
					} catch (e) {
						console.log(e);
					}
					
					//console.log(data);
					
					if("1" == data.result) {
						
						that.setupNodeListData(data.node_update_list);
						
						//遍历更新仪表数据
						for(nodeUpdate of data.node_update_list) {
							for(nodeIndex in that.nodeList) {
								if(that.nodeList[nodeIndex].node_id == nodeUpdate.node_id) {									
									nodeUpdate.project_name = that.nodeList[nodeIndex].project_name;
									nodeUpdate.company_name = that.nodeList[nodeIndex].company_name;
									that.nodeList[nodeIndex] = nodeUpdate;
									
									that.lastSelectedNode = that.nodeList[nodeIndex];
									//console.log("update one node");
								}
							}
						}
						
					
					}
									
				};

			}else{
				console.log("您的浏览器不支持WebSocket");
			}
		},
		
		webSocketGetProjectsNodesInitAndRun(projects)
		{
			if(false == "WebSocket" in window) {
				console.log("浏览器不支持websocket");
			}
			
			const url = Consts.WS_PREFIX + "GetProjectsNodes";
			
			if(null != this.webSocketGetProjectsNodes) {
				this.webSocketGetProjectsNodes.close();
			}
			
			this.webSocketGetProjectsNodes = new WebSocket(url);
			
			if(null == this.webSocketGetProjectsNodes) {
				console.log("创建 websocket 失败");
				return;
			}
			
			var that = this;
		
			this.webSocketGetProjectsNodes.onopen = function(event) {
				//console.log("websocket getProjectsNodes 打开成功");
				//console.log(event);
				
				//请求数据前，先把旧数据删掉
				that.nodeList = [];
				
				const param = {
					access_token:parsenCookie.loadAccessToken(),
					project_list:projects,
					page_count:8,
				};
									
				that.webSocketGetProjectsNodes.send(JSON.stringify(param));
			};

			this.webSocketGetProjectsNodes.onmessage = function(event) {
				console.log("websocket getProjectsNode 收到内容");
				//console.log(event.data);
				
				let res = null;
                try {
                    res = JSON.parse(event.data);
                    /*console.log("this is event.data");
                    console.log(data);*/
                } catch (e) {
                    console.log(e);
                    //生成提示窗，提示读取数据失败
                    return;
                }
                
                //如果返回结果不对，就退出
                if ("0" == res.result) {
					return;
				}
				
				
				//处理好的内容推入列表
				that.nodeList.push(...res.node_list);
				
				//console.log("仪表数量=" + that.nodeList.length);
				
				
				
				//如果是最后一次，刷新监听列表
				if("end_node" == res.command) {
					//console.log("数据结束了");
					
					//this.webSocketReflashNodeDataListenerInit();
					that.webSocketReflashNodeDataListenerSendNodeList();
				}
				
				if("add_node" == res.command) {
					//console.log("数据传输中。。。");
				}
				
				
				that.draw();
			}
		},
		
		webSocketReflashNodeDataListenerSendNodeList(){
			let nodeIdArr = [];
			for(node of this.nodeList) {
				nodeIdArr.push(node.node_id);
			}	
	
			const jSend = {
				company_id:parsenCookie.loadCompanyId(),
				access_token:parsenCookie.loadAccessToken(),
				node_id_list:nodeIdArr,
			};
			if(null != this.webSocketReflashNodeDataListener) {
				this.webSocketReflashNodeDataListener.send(JSON.stringify(jSend));
				//console.log('web socket regist: ' + JSON.stringify(jSend));
			}
		},
		
		setupNodeListData(nodeListReadFromServer)
		{			
			
		},		
		
		addProjectsToCompany(node,successCallback) {			
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + `GetCompanyProjects`,
				data:{					
					access_token:parsenCookie.loadAccessToken(),//jQuery.cookie('ps_access_token'),
					company_id:node.company_id,
				},
				context:this,
				success:function(res){
					//console.log(res);
					if("1" === res.result) {
						//  console.log(res);
						for(let project of res.project_list) {	
							let projectNode = {
								id:'c_' + node.company_id + '_p_' + project.project_id,	//为了工程ID与公司ID不重复,工程ID加上 p_ 前缀
								project_id:project.project_id,			//pid 为工程ID
								project_name:project.project_name,
								company_name:node.company_name,
								type:'p',
							}		
							node.children.push(projectNode);
							this.projects.push(projectNode);
							this.itemCount+=1;
							this.domData["项目总数"] = this.itemCount;
						}												
					}
					if(null != successCallback){
						successCallback();
					}
				},
				error:function(res){
					
				},
			});
		}
		,
		
		handleData(){
			console.log('处理环状图数据')
			let now = new Date();
			let company = [{value:this.companyCount,name:'公司总数'}];
			let item = [{value:this.itemCount,name:'项目总数'}];
			let node = [{value:this.nodeList.length,name:'仪表总数'}];
			let alarm = [{value:(this.nodeList.length-this.getAlarmCount()),name:'正常'},{value:this.getAlarmCount(),name:'异常'}];
			let state = [{value:(this.nodeList.length-this.getOffline(now)),name:'在线'},{value:this.getOffline(now),name:'离线'}];

			
			let companyOption={
				title:{
					text:"公司总数",
					top:'5%',
					left:'10%',
					textStyle:{
						fontSize:this.fontSize(20),
					}
				},
				tooltip:{
					trigger:'item',
					formatter:`{b}:{c}`,
					backgroundColor:this.tipColor,
					textStyle:{
						fontSize:this.fontSize(20),
						color:'white',
					}
				},
				legend:{
					bottom:'5%',
					left:'center',
					textStyle:{
						fontSize:this.fontSize(20),
					}
				},
				color:[this.companyColor],
				series:[{
					radius:['45%','75%'],
					type:'pie',
					data:company,
					avoidLabelOverlap:false,
					itemStyle:{
						borderRadius: 3,
        				borderColor: '#fff',
        				borderWidth: 1.5,
        				shadowBlur:5,
        				shadowOffsetX:5,
        				shadowOffsetY:5,
						shadowColor:this.shadowColor,
					},
					label:{
						formatter:`{d}%`,
						fontFamily:'Verdana',
						show:true,
						fontSize:this.fontSize(15),
						color:'white',
						position:"inside"
					},
					labelLine:{
						show:false,
					},
					emphasis:{
						scale:true,
						sizeScale:30
					}
					}
				],
			};
			
			let itemOption={
				title:{
					text:"项目总数",
					top:'5%',
					left:'10%',
					textStyle:{
						fontSize:this.fontSize(20),
					}
				},
				tooltip:{
					trigger:'item',
					formatter:`{b}:{c}`,
					backgroundColor:this.tipColor,
					textStyle:{
						fontSize:this.fontSize(20),
						color:'white',
					}
				},
				legend:{
					bottom:'5%',
					left:'center',
					textStyle:{
						fontSize:this.fontSize(20),
					}
				},
				color:[this.itemColor],
				series:[{
					radius:['45%','75%'],
					type:'pie',
					data:item,
					avoidLabelOverlap:false,
					itemStyle:{
						borderRadius: 3,
        				borderColor: '#fff',
        				borderWidth: 1.5,
        				shadowBlur:5,
        				shadowOffsetX:5,
        				shadowOffsetY:5,
						shadowColor:this.shadowColor,
					},
					label:{
						formatter:`{d}%`,
						fontFamily:'Verdana',
						show:true,
						fontSize:this.fontSize(15),
						color:'white',
						position:"inside"
					},
					labelLine:{
						show:false,
					},
					emphasis:{
						scale:true,
						sizeScale:30
					}
					}
				],
			};
			
			let nodeOption={
				title:{
					text:"仪表总数",
					top:'5%',
					left:'10%',
					textStyle:{
						fontSize:this.fontSize(20),
					}
				},
				tooltip:{
					trigger:'item',
					formatter:`{b}:{c}`,
					backgroundColor:this.tipColor,
					textStyle:{
						fontSize:this.fontSize(20),
						color:'white',
					}
				},
				legend:{
					bottom:'5%',
					left:'center',
					textStyle:{
						fontSize:this.fontSize(20),
					}
				},
				color:[this.nodeColor],
				series:[{
					radius:['45%','75%'],
					type:'pie',
					data:node,
					avoidLabelOverlap:false,
					itemStyle:{
						borderRadius: 3,
        				borderColor: '#fff',
        				borderWidth: 1.5,
        				shadowBlur:5,
        				shadowOffsetX:5,
        				shadowOffsetY:5,
						shadowColor:this.shadowColor,
					},
					label:{
						formatter:`{d}%`,
						fontFamily:'Verdana',
						show:true,
						fontSize:this.fontSize(15),
						color:'white',
						position:"inside"
					},
					labelLine:{
						show:false,
					},
					emphasis:{
						scale:true,
						sizeScale:30
					}
					}
				],
			};
			
			let alarmOption={
				title:{
					text:"仪表详情",
					top:'5%',
					left:'10%',
					textStyle:{
						fontSize:this.fontSize(20),
					}
				},
				tooltip:{
					trigger:'item',
					formatter:`{b}:{c}`,
					backgroundColor:this.tipColor,
					textStyle:{
						fontSize:this.fontSize(20),
						color:'white',
					}
				},
				legend:{
					bottom:'5%',
					left:'center',
					textStyle:{
						fontSize:this.fontSize(20),
					}
				},
				color:[this.normalColor,this.alarmColor],
				series:[{
					radius:['45%','75%'],
					type:'pie',
					data:alarm,
					avoidLabelOverlap:false,
					itemStyle:{
						borderRadius: 3,
        				borderColor: '#fff',
        				borderWidth: 1.5,
        				shadowBlur:5,
        				shadowOffsetX:5,
        				shadowOffsetY:5,
						shadowColor:this.shadowColor,
					},
					label:{
						formatter:function(param){
							return param.percent.toFixed(0)+'%';
						},
						fontFamily:'Verdana',
						show:true,
						fontSize:this.fontSize(15),
						color:'white',
						position:"inside"
					},
					labelLine:{
						show:false,
					},
					emphasis:{
						scale:true,
						sizeScale:30
					}
					}
				],
			};
			
			let stateOption={
				title:{
					text:"仪表状态",
					top:'5%',
					left:'10%',
					textStyle:{
						fontSize:this.fontSize(20),
					}
				},
				tooltip:{
					trigger:'item',
					formatter:`{b}:{c}`,
					backgroundColor:this.tipColor,
					textStyle:{
						fontSize:this.fontSize(20),
						color:'white',
					}
				},
				legend:{
					bottom:'5%',
					left:'center',
					textStyle:{
						fontSize:this.fontSize(20),
					}
				},
				color:[this.onlineColor,this.offlineColor],
				series:[{
					radius:['45%','75%'],
					type:'pie',
					data:state,
					avoidLabelOverlap:false,
					itemStyle:{
						borderRadius: 3,
        				borderColor: '#fff',
        				borderWidth: 1.5,
        				shadowBlur:5,
        				shadowOffsetX:5,
        				shadowOffsetY:5,
						shadowColor:this.shadowColor,
					},
					label:{
						formatter:function(param){
							return param.percent.toFixed(0)+'%';
						},
						fontFamily:'Verdana',
						show:true,
						fontSize:this.fontSize(15),
						color:'white',
						position:"inside"
					},
					labelLine:{
						show:false,
					},
					emphasis:{
						scale:true,
						sizeScale:30
					}
					}
				],
			};
			
			this.chart = [companyOption,itemOption,nodeOption,alarmOption,stateOption];
		},
		
		draw(){
			this.handleData();
			this.chartsDom = [];
			for(let index in this.chartsName){
				const domInstance = document.getElementById(this.chartsName[index]);
	        	let echartsInstance = echarts.init(domInstance);
				
				echartsInstance.setOption(this.chart[index]);
				this.chartsDom.push(echartsInstance);
				
			}
			//跟随窗口自适应
			const self = this;
			window.addEventListener('resize',self.chartResize);
		},
		
		chartResize(){
			this.handleOption();	//字体自适应
			for(let chart of this.chartsDom){
				chart.resize();
			}
			console.log('resize');
		},

		
		handleRenderContent : function(h,{ node, data, store }){
			//console.log([h,node,data,store]);			
			
			if('c' == data.type) {
				return h('span',[
					h('i', {attrs: {class: 'el-icon-house'}}),
					h('span',{style:{color:'rgb(20,110,0)'}},data.company_name),
				]);				
			}
			
			else {
				return h('span',{style:{color:'rgb(0, 125, 255)'},attrs: {class:'el-icon-s-grid'}},data.project_name); 
			}
		},
		
		filterCompanyTreeFunc : function(value,data) {
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
						
			let keysArr = this.$refs.companyTree.getCheckedKeys();
			let keysArrStr = '';
			try{
				keysArrStr = JSON.stringify(keysArr);
			} catch(err){
				
			}
			//jQuery.cookie('ps_real_data_list_tree_check',JSON.stringify(keysArr),{expires:30,path:'/',});
			parsenCookie.saveRealListCompanyTreeCheck(keysArrStr);
			
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
				console.log("companyTreeNodeClick in reflash");
				//this.reflashProjectsNodes(projects);
				this.webSocketGetProjectsNodesInitAndRun(projects);
			
				
			}
		},
		//--------------------------------------左边公司与工程树
		
			
		
		//========================================================右边仪表列表
		companyTreeNodeCheck : function(company,clickInfo) {
			//console.log([company,clickInfo]);

			//检查看动作是 check 还是  uncheck 
			if(company && ('p' === company.type) ) {
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
			
			let keysArrStr = '';
			try{
				keysArrStr = JSON.stringify(clickInfo.checkedKeys);
			} catch (e) {
				
			}
						
			parsenCookie.saveRealListCompanyTreeCheck(keysArrStr);
			
			console.log("companyTreeNodeCheck in reflash");
			
			this.pageIndex = parsenCookie.loadRealListPageIndex();
			if(isNaN(this.pageIndex)) {
				this.pageIndex = 1;
			}
			//this.pageIndex = 1;
			//parsenCookie.saveRealListPageIndex(this.pageIndex);
			
			//this.reflashProjectsNodes(projects);
			this.webSocketGetProjectsNodesInitAndRun(projects);
		
			
		},
		
		companyTreeExpand : function(nodeDate,nodeObject,VueNode) {
			setTimeout(this.onsize,700);
		},
		
		companyTreeCollapse : function(nodeDate,nodeObject,VueNode) {
			setTimeout(this.onsize,700);
		},
		
		
		setOption(){
			let areaOption = {
				title:{
					text:'在线趋势',
					left:'10%',
				},
				tooltip: {
    				trigger: 'axis',
    				axisPointer: {
      					type: 'cross',
      					label: {
        					backgroundColor: '#6a7985'
      					}
    				}
  				},
  				legend:{
					data:['在线'],
				},
				grid: {
			      left: '3%',
			      right: '4%',
			      bottom: '3%',
			      containLabel: true
			    },
			    xAxis:{
					type:'time',
					boundaryGap:false,
				},
				yAxis:{
					type:'value',
					max:this.nodeList.length,
					min:0,
				},
				series:[{
				      name: '在线',
				      type: 'line',
				      stack: 'Total',
				      areaStyle: {},
				      emphasis: {
				        focus: 'series'
				      },
				      data: [3, 1, 1, 2, 0, 3, 2],
				    },
				    ]
			};
			const onlineChart = document.getElementById('onlineChart');
			let echartInstance = echarts.init(onlieChart);
			echartInstance.setOption()
		},
		
			
		
		getAlarmCount(){
				let number = 0;
				for(let node of this.nodeList){
					if('0' != node['alarm_pop'])number++;
				}
				return number;
		},
		
		getOffline(nowDate){
			let offlineCount = 0;
			for(let node of this.nodeList){
				if(this.isOffline(node['node_data']['date'],node['send_gap'],nowDate)){
					offlineCount++;
				}
			}
			return offlineCount;
		},
		
		isOffline(last_time,send_gap,now){
			let offline = true;
			last_time = mySqlDateToDate(last_time);
			let spanMinute = (now - last_time) / 1000 / 60;
			let offline_ = (spanMinute > (send_gap * 3));				
			return offline_?true:false;
		},
		
		handleOption(){
			this.handleData();
			for(let index in this.chartsDom){
				this.chartsDom[index].setOption(this.chart[index]);
			}
		},
		
		fontSize(res){
			const clientWidth = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
			if (!clientWidth) return;
			let fontSize = clientWidth / 1920;
			return res*fontSize;
		},
		
	
	}

}



var Ctor = Vue.extend(Main)
new Ctor().$mount('#excel_out')