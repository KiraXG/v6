/**
 * 
 */

//const PAGE_ITEM_MAX = 8;

var Main = {
	data : function(){
        var data1 = {
	
			iKnowValueAbnormalChecked:false,
	
            mainWindowStyle:{},
            nodeInfoReady:false,
            
           startTimePickerOptions:{
		    	shortcuts: [
		    		{
		    			text: '昨天',
		    			onClick(picker) {
		    				const date = new Date();
		    				date.setTime(date.getTime() - 3600 * 1000 * 24);
		    				picker.$emit('pick', date);
		    			},
		            }
		    		,
		    		{
		    			text: '三天前',
		    			onClick(picker) {
		    				const date = new Date();
		    				date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
		    				picker.$emit('pick', date);
		    			},
		    		}
		    		,
		    		{
		    			text: '七天前',
		    			onClick(picker) {
		    				const date = new Date();
		    				date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
		    				picker.$emit('pick', date);
		    			},
		    		}
		    	],		        
		    },
		    startTime:null,
		    endTime:null,
		    
		    endTimePickerOptions:{
		    	shortcuts: [
		    		{
		    			text:'今天',
		    			onClick(picker) {
		    				const date = new Date();
		    				//date.setTime(date.getTime() - 3600 * 1000 * 24);
		    				picker.$emit('pick', date);
		    			}
		    		},
		    	],
		    },
		    
		    
		    pageLineCount:8,
		    dataList:[],				//读取到的仪表数据总表
		    dataFilteredList:[],		//刷选后的仪表数据表,是 dataList 的子集
		    dataPageList:[],	//数据列表当前页的数据源,是 dataFilteredList 的分页集	
		    
		    tabCellStyle:{},
		    pageCount:0,
		    currentPage:0,
		    pageIndex:0,
		    
		    nodeInfoReady:false,
		    
		    lastSelectedNode:null,
        };
        
        return data1;
	},
	
	
	beforeMount : function() {
		const urlEncodeParams = window.location.search;
                const uo = new URLSearchParams(urlEncodeParams);
                console.log(uo.get('node_id'));
                console.log(uo.get('group'));
                
                var node = JSON.parse(localStorage.getItem("real_data_selected_node_" + uo.get('node_id')));
                this.lastSelectedNode = node;	
	},
	
	mounted : function() {
		const urlEncodeParams = window.location.search;
                const uo = new URLSearchParams(urlEncodeParams);
                console.log(uo.get('node_id'));
                console.log(uo.get('group'));
                
        const node_id = uo.get('node_id');
               
        console.log('alarm_record mounted node_id = ' + node_id);
        
        let that = this;
        
		jQuery.ajax({
    		url:Consts.HTTP_PREFIX + 'GetNodeLastInfo',
    		data:{
	    		access_token : parsenCookie.loadAccessToken(),
	    		node_id:node_id,	    		
	    	},
    		context:this,
    		success:function(res) {
    			if("1" === res.result) {    				
    				//alert("新建公司成功!");
    				console.log(res);
    				this.lastSelectedNode = res.node;
    				this.nodeInfoReady = true;
    				this.lastSelectedNode.project_name = uo.get('project_name');
    				this.lastSelectedNode.nodeInfos = this.createNodeInfos(this.lastSelectedNode);
    				
    				
    			}
    			else {
    				//alert("新建公司失败,请联系厂家");
    				console.log(res);
    			}
    		},
    		error:function(res){
    			
    		},
    	});
	},


	created(){		
		window.addEventListener("resize", this.onsize);
		setTimeout(this.onsize,1000);
		
		//初始化时间选择器
		this.endTime = new Date();
		let ms = this.endTime.getTime();
		ms -= (1000 * 60 * 60 * 24);
		this.startTime = new Date(ms);
	},
	
	
	methods : {
		onsize(event){	
			//console.log(document.documentElement);
			//先求出整个网页的宽与高
			const width = document.documentElement.offsetWidth;
			const height = document.documentElement.offsetHeight;
			
			
			//let tableMarginLeft = this.$refs.mainWindow.style.marginLeft;			
			
			//this.$refs.tableWindow.style.width = width - asideWidth - tableMarginLeft + 'px';
			//this.$refs.projectList.width = width - asideWidth - 20 + 'px';			
			//let marginStr = window.getComputedStyle(this.$refs.mainWindow,null).marginLeft;			
			//let marginNumber = marginStr.slice(0,marginStr.indexOf('px'));
			//console.log('margin left = ' + marginNumber);
			
			
			//this.mainWindowStyle.width = width - treeWidth - marginNumber + 'px';
			this.mainWindowStyle.width = width + 'px';
			console.log('mainWindowWidth=' + this.mainWindowStyle.width);
			this.mainWindowStyle.height = height - 10;
			//this.mainWindowStyle.height = '100%' ;
			//this.mainWindowStyle.height = '600px' ;
						
			//this.canvasWidth = width - 60;			
			
			this.$forceUpdate();
		},
		
		
		btnCleanNodeAlarmNotice()
		{
			let node = this.lastSelectedNode;
			
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + `CleanNodeAlarmFlag`,
				data:{
					access_token:parsenCookie.loadAccessToken(),
					node_id:node.node_id,
					//clean_alarm_pop:'1',
					clean_alarm_notice:'1',
				},
				context:this,
				success:function(res){					
					if('1' == res.result) {
						node.alarm_notice = '0';
						MessageBox.info('撤销报警提示成功了!');
						
						//通知父窗口，清除报警提示
						const params = {
							command:'clean_node_alarm_notice',
							node_id:node.node_id,							
						};									            
			            window.parent.postMessage(JSON.stringify(params),'*');			            
					}
				},
				error(res) {
					console.log(res);
				}
			});
		},
		
		
		createNodeInfos(node){			
			
			let infos = [];
			
			//注意处理一些没有数据的新仪表
			if( (!node.node_data) || (!node.node_data.line_datas) ) {
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
					h2_open:( (lp.alarm_switch & Consts.HI_ALARM_2_MASK) != 0) ? true : false,
					h1_open:( (lp.alarm_switch & Consts.HI_ALARM_1_MASK) != 0) ? true : false,
					l1_open:( (lp.alarm_switch & Consts.LO_ALARM_1_MASK) != 0) ? true : false,
					l2_open:( (lp.alarm_switch & Consts.LO_ALARM_2_MASK) != 0) ? true : false,
					
					setMax:lp.set_disp_max,		//是否有自定义的
					max:lp.disp_max,
					setMin:lp.set_disp_min,
					min:lp.disp_min,
				};
				
				infos.push(dataInfo);
			}
			
			return infos;
		},
		
		btnReflashAlarms() {
			console.log('reflash alarms');
			
			this.startTime = dateDownTo00Hour(this.startTime);
			this.endTime = dateUpTo24Hour(this.endTime);
			
			
			this.getNodeAlarmsByWebsocket(this.lastSelectedNode.node_id,
					this.pageLineCount,this.startTime,this.endTime,function(res){
				console.log(res);
			});
			
		},
	    
	    pageChange(index){
			this.pageIndex = index;
	    	this.dataPageList = this.dataFilteredList.slice((this.pageIndex-1)*this.pageLineCount,(this.pageIndex)*this.pageLineCount);
	    	//jQuery.cookie('ps_real_data_list_page_index',this.pageIndex,{expires:30,path:'/',});
	    	parsenCookie.saveRealListPageIndex(this.pageIndex);
		},
		
		
		
		
				//使用 websocket 取某一通道的数据
		getNodeAlarmsByWebsocket(nodeId,pageCount,startTime,endTime,returnDataSourceCB) {
			let websocket = new WebSocket(Consts.WS_PREFIX + 'GetNodeAlarms'); //创建WebSocket连接
			if(null == websocket) {
				console.log("新建 websocket 失败");
				return false;
			}
			
			var that = this;
			
			//let dataSource = [];
			
			this.dataList = [];
			
			//上面 new WebSocket 成功后,就会执行下面的 onopen 回调,然后向服务器发送读数请求
			websocket.onopen = function(event) {
				const jSend = {
						access_token:parsenCookie.loadAccessToken(),
						node_id:nodeId,						
						page_count:pageCount,
						start_time:dateToMySqlDate(startTime),
						end_time:dateToMySqlDate(endTime),					
					};
					
				websocket.send(JSON.stringify(jSend));
			};
			
			websocket.onclose = function(event) {
				console.log(['ws on close',event]);
			}
			
			//上面发送读数请求后,就会在下面的回调收到数据
			websocket.onmessage = function(event) {
				//console.log('websocket get message');
				//console.log(event.data);
				let res = null;
				
				try {
					res = JSON.parse(event.data);
				    //console.log(data);
				}
				catch (e) {
					console.log('json parse error')
					console.log(e);
					return;
				}
				
				//整理数据
				for(let alarm of res.node_alarms) {
					
					alarm.date = alarm.date.substring(0,19);		//先处理一下收到数据的日期
					
					alarm.line_alarms = [];		//报警值以数组形式存放
					

					
					//alarm.line_desc = that.lastSelectedNode.node_data.line_datas[alarm.line].line_desc;						
					
					//alarm.line_color = ['#a7a304','#4353d2'][alarm.line];					
					
					if(0 == alarm.alarm_flag) {
						alarm.alarm_name = '恢复正常';
						alarm.alarm_color = PsColor.PS_SUCCESS_GREEN;
					}
					else if( (Consts.LO_ALARM_2_MASK & alarm.alarm_flag) != 0 ) {
						alarm.alarm_name = '下下限报警';
						alarm.alarm_color = PsColor.PS_ALARM_RED;
					}
					else if ( (Consts.HI_ALARM_2_MASK & alarm.alarm_flag) != 0 ) {
						alarm.alarm_name = '上上限报警';
						alarm.alarm_color = PsColor.PS_ALARM_RED;
					}
					else if ( (Consts.LO_ALARM_1_MASK & alarm.alarm_flag) != 0 ) {
						alarm.alarm_name = '下限报警';	
						alarm.alarm_color = PsColor.PS_WARNING_YELLOW;
					}
					else if ( (Consts.HI_ALARM_1_MASK & alarm.alarm_flag) != 0 ) {
						alarm.alarm_name = '上限报警';
						alarm.alarm_color = PsColor.PS_WARNING_YELLOW;
					}
					
					for(let i=0; i<that.lastSelectedNode.nodeInfos.length; ++i) {
						
						
						//报警线路是我这一路
						if( i == alarm.line ) {
							let alarmObject = {
								text:alarm.value + unitCodeToName(alarm.unit),
								color:alarm.alarm_color,								
							};
							alarm.line_alarms.push(alarmObject);
						}
						
						//报警线路不是我这路，填空
						else {
							let alarmObject = {
								text:"",
								color:alarm.alarm_color,								
							};
							alarm.line_alarms.push(alarmObject);
						}
					}
					
					that.dataList.push(alarm);
				}
				//console.log(that.lastSelectedNode);				
				//that.dataList.push(...res.node_alarms);
				
				//刷选出客户想要的,放到 nodeFilterList
				that.dataFilteredList = that.dataList.filter(function(node1){
//					if( (node1.node_name.toLowerCase().indexOf(this.filterNodeText.toLowerCase()) != -1)
//							||
//						(node1.imei.toLowerCase().indexOf(this.filterNodeText.toLowerCase()) != -1)
//							||
//						(node1.group.toLowerCase().indexOf(this.filterNodeText.toLowerCase()) != -1)	)
//					{
//						return true;
//					}
//					else {
//						return false;
//					}
					return true;
				},that);
				
				//this.nodeTableData = this.nodeFilteredList.slice(0,PAGE_ITEM_MAX);
				that.pageCount = (Math.ceil(that.dataFilteredList.length / that.pageLineCount))*10;
				that.pageIndex = Math.min(that.pageIndex,that.pageCount / 10);
				that.pageIndex = Math.max(that.pageIndex,1);
				that.dataPageList = that.dataFilteredList.slice((that.pageIndex-1)*that.pageLineCount,(that.pageIndex)*that.pageLineCount);
				that.currentPage = that.pageIndex;
				
				//最后一份数据到达
				if("end_data" == res.command) {
					//console.log('end');
					//that.dataList.push(...data.node_datas);
					websocket.close();
					
					if(null != returnDataSourceCB) {
						returnDataSourceCB(that.dataList);
					}
				}
			}
			
			return true;
		},
	 
	},
	

	

};

var Ctor = Vue.extend(Main)
new Ctor().$mount('#alarm_record')


