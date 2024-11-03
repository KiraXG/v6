/**
 * 
 */


const MENU_NAME = {
	COMPANY_RELATION : '公司归属关系',
	COMPANY_ZSGC : '公司增删改查',
	NODE_ZSGC : '仪表增删改查',
	MENU_SIM_LIST : 'SIM卡列表',
	MENU_SIM_ACTIVE_LIST : '已激活',
	MENU_SIM_NODE_LIST : '仪表内',
	MENU_SIM_EXPIRED_LIST : '准备到期',
};

const MENU_ITEM_LIST = [
	{name:'工程列表',idForSelect:'PROJECT_LIST',url:'./project_list/project_list.jsp',},
	
    {name:"实时数据",idForSelect:"REAL_DATA_LIST",url:"./real_data_list/real_data_list.jsp",},
    
    {name:'公司归属关系',idForSelect:"GROUP_TREE",url:'./group_tree/group_tree.jsp',},
    
    {name:'公司增删改查', idForSelect:"COMPANY_LIST", url:'./company_list/company_list.jsp', },
    
    {name:'仪表增删改查',      idForSelect:"NODE_LIST",        url:'./node_list/node_list.jsp',    },
    
    {name:'SIM卡列表',   idForSelect:"SIM_LIST",     url:'./sim_list/sim_list.jsp',   },
    
    {name:'已激活', idForSelect:"SIM_ACTIVE_LIST",     url:'./sim_active_list/sim_active_list.jsp',    },
    
    {name:'仪表内',   idForSelect:"SIM_NODE_LIST",     url:'./sim_node_list/sim_node_list.jsp',    },
    
    {name:'准备到期', idForSelect:"SIM_EXPIRED_LIST",  url:'./sim_expired_list/sim_expired_list.jsp',  },
    
    {name:"工作台", idForSelect:"DATA_VIEW_LIST", url:'./data_view_list/data_view_list.jsp',}
];



var Main = {
	data : function() {
        var val = {
        	MENU_COMPANY_RELATION : MENU_NAME.COMPANY_RELATION,
        	MENU_COMPANY_ZSGC : MENU_NAME.COMPANY_ZSGC,
        	MENU_NODE_ZSGC : MENU_NAME.NODE_ZSGC,
        	MENU_SIM_LIST : MENU_NAME.MENU_SIM_LIST,
        	MENU_SIM_ACTIVE_LIST : MENU_NAME.MENU_SIM_ACTIVE_LIST,
        	MENU_SIM_NODE_LIST : MENU_NAME.MENU_SIM_NODE_LIST,
        	MENU_SIM_EXPIRED_LIST : MENU_NAME.MENU_SIM_EXPIRED_LIST,
        	
        	visible: false ,			//用于debug弹窗
        	message: 'Runoob!',			//用于debug显示信息
        	
        	isCollapse: false ,			//左则边栏是否显示
        	textColor: "#303133",		//测试文字颜色
        	iconColor: "#fff",
        	asideOpenCloseIcon: 'el-icon-s-fold',	//控制边栏按钮的图示
        	        	
        	editableTabs:[],			//主窗 tab 页		
        	tabSelected:null,			//指示现在选中哪一页
        	
        	//frameList:[],
        	
        	topContainerStyle: {                
                display:'flex',
                'flex-direction':'column',
                margin:'0px',
                padding:'0px',
                //'background-color':'red',
            },
                        
            headWindowStyle:{
            	
            },
            
            asideWindowStyle:{
            	
            },
            
            mainWindowStyle:{
            	//'background-color':'green',
            },
            
            tabPaneStyle:{
            	
            },
            
            sizeRecord:{},
						
			companyName:'',
            showManager:false,
            showNodeList:false,
            showProjectList:false,
            
            openKeys:[],
            
            
            nodeAlarmCount:0,			//报警仪表数量
            nodeAlarmBadgeHidden:true,	//报警指示是否隐藏
            
            //==============================debug用
            
            testInt:1,
            
            debugText:'',
            updateIndex:0,
            
            menuCover:true,
       	};
        
        let id = parsenCookie.loadCompanyId();
		//let id = jQuery.cookie('ps_company_id');
		//ID=1 是最高管理员,有所有功能
        if("1" === id){
        	val.showManager = true;
        	val.showNodeList = true;
        	val.showProjectList = true;
		}
		
		val.companyName = parsenCookie.loadCompanyName();
		
		//有管理仪表功能
        let manageNode = parsenCookie.loadCompanyManageNode();
        if("1" == manageNode) {
        	val.showNodeList = true;
        	val.showProjectList = true;
		}
		
		//有管理公司功能
		let manageCompany = parsenCookie.loadCompanyManageCompany();
		if("1" == manageCompany) {
			val.showManager = true;
			val.showNodeList = true;
        	val.showProjectList = true;
		}
        
        return val;
	},
	
	
//	beforeCreate : function(){
//		 window.addEventListener("resize", this.onsize);
//	},
		
	created : function( param ) {		
		//页面创建时执行一次,绑定resize事件
	    window.addEventListener("resize", this.onsize);
	    
	    setTimeout(this.onsize,100); 
	    
	    window.addEventListener('mousemove',this.onMouseMove);

	    let that = this;
	    let cb = function() {
	    	//let jstrTabs = jQuery.cookie('ps_tab_list');
	    	let jstrTabs = parsenCookie.loadTabList();
	    	if(jstrTabs){
				that.editableTabs = JSON.parse(jstrTabs);
			}
	    		
	    	that.tabSelected = parsenCookie.loadTabSelected();//jQuery.cookie('ps_tab_selected');
	    	 
	    	
	    	//that.addTab('实时数据','./real_data_list/real_data_list.jsp');
			//that.tabSelected = '实时数据';	    	
	    };
	    //setTimeout(cb,500);
	    

	},
	
	beforeMount : function () {
		//this.editableTabs = [            ];		
		//mainEditableTabs = this.editableTabs;		
//		this.editableTabs = new Set();
//		this.editableTabs.add({name:'1'});
//		this.editableTabs.add({name:'2'});
	},
	
	mounted(){
		let that = this;
		
		let opensStr = parsenCookie.loadMainMenuOpens();//JSON.parse(jQuery.cookie('ps_main_menu'));
		if (null != opensStr) {
			this.openKeys = JSON.parse(opensStr);
		    if(null == this.openKeys) {
		    	this.openKeys = [];
		    }	    
		    console.log(this.openKeys);
		    
//		    for(key of this.openKeys) {
//				if("DATA_VIEW_LIST" != key){
//		    		this.$refs.mainMenuWindow.open(key);
//		    	}
//		    }
		    
		    let jstrTabs = parsenCookie.loadTabList();//jQuery.cookie('ps_tab_list');
	    	if(jstrTabs){
				this.editableTabs = JSON.parse(jstrTabs);
			}
	    		
	    	this.tabSelected = parsenCookie.loadTabSelected();//jQuery.cookie('ps_tab_selected');	
		}else{
			this.editableTabs.push(MENU_ITEM_LIST[MENU_ITEM_LIST.length-1]);
			this.tabSelected = "工作台";
		}
		
        
        window.addEventListener('message',function(e){
			//console.log('get event message');
			//console.log(e);
			
			let params = null;
			try {
				params = JSON.parse(e.data);
				//console.log(params);
			}
			catch (e) {
				console.log('parse postMessage param error1');
				console.log(e);
				return;
			}
			
			if('open_node_detal' == params.command) {
				const tableObject = {
					name:"仪表详情_" + params.group + "_" + params.index,
					idForSelect:"node_graph_" + params.node_id,
					url:"./detal_data_graph/detal_data_graph.jsp?node_id=" + params.node_id + "&" + "group=" + params.group,
				}
				
	/*			const index = params.index;
				const group = params.group;
				const DataGraphtargetName = "仪表详情_" + ;
				const DataGraphUrl = params.tableUrl;*/
				 
				
				//var idForSelect=index+group;
	            
	            that.addTab(tableObject);
	            that.tabSelected = tableObject.name;				
			}
			
			if ( 'open_node_alarm_record' == params.command ) {
				const tableObject = {
					name:"报警记录_" + params.node_id,
					idForSelect:"node_alarm_" + params.node_id,
					url:"./alarm_record/alarm_record.jsp?node_id=" + params.node_id + '&' + 'project_name=' + params.project_name,
				}
				
				that.addTab(tableObject);
	            that.tabSelected = tableObject.name;
			}
			
			if ( 'clean_node_alarm_notice' == params.command ) {
				const node_id = params.node_id;
				//console.log("node_id = " + node_id + "clean node alarm notice");
				
				for(tableItem of that.editableTabs)
				{
					//console.log('tableItem idForSelected =' + tableItem.idForSelect);
					
					if( ('REAL_DATA_LIST') == tableItem.idForSelect ) {
						for (frame of that.$refs.frameList) {					
		                    if (frame.attributes.src.nodeValue == tableItem.url) {
		                        //console.log("got iframe from frame list");
		                        console.log(frame);
		                        //console.log(tableItem);
		                        //frame.poseMessage(,'*');
		                        
		                        //通知父窗口，清除报警提示
								const params = {
									command:'clean_node_alarm_notice',
									node_id:node_id,
								};									            
					            frame.contentWindow.postMessage(JSON.stringify(params),'*');	
		                    }
		                    //console.log("frame url = " + frame.attributes.src.nodeValue);
		                }
					}
				}
				
				
			}
			

            
            
			
		},false);
	},
	
	updated : function () {
		//++this.updateIndex;
		//console.log('update ' + this.updateIndex);
	},
	

	methods: {
		onsize(event) {
			//return;
			//console.log('onsize');
			//console.log("document.body.clientHeight = " + document.body.clientHeight);
			
			
			//整个大容器的大小等于浏览器内窗大小			
			//手动设置了 html body 的 margin padding 都是 0,所以内窗大小就是我最外层容器大小			
	        this.topContainerStyle.height = window.innerHeight - 0 + 0 + "px";
	        this.topContainerStyle.width  = window.innerWidth  - 0 + 0 + "px";
			console.log('inner宽度='+window.innerWidth);
	        //this.topContainerStyle.backgroundColor = 'blue';
	        //console.log("innerWidth=" + window.innerWidth);
	        
	        //手动设置的,上窗对下有 10px 的 margin
	        let marginStr = window.getComputedStyle(this.$refs.winHeader,null).marginBottom;			
			let topWindowMarginBottom = marginStr.slice(0,marginStr.indexOf('px'));
			
	        //const topWindowMarginBottom = 10;
	        
	        
	        this.asideWindowStyle.width = 'auto';
	        this.asideWindowStyle.height = window.innerHeight - this.$refs.winHeader.offsetHeight - topWindowMarginBottom + 'px';
	        
	        //console.log(topWindowMarginBottom);
	        
	        //this.headWindowStyle.width = window.innerWidth + 'px';
	        //this.headWindowStyle.height = 40 + this.testInt + 'px';
	        //this.testInt++;
	        //console.log("head height = " + this.headWindowStyle.height);
	        
	        
	        //console.log(this.$refs.winHeader);
	        //主窗高度 = 内窗高 - 顶窗高
	        //主窗宽度 = 内窗宽 - 左窗宽
	        marginStr = window.getComputedStyle(this.$refs.asideWindow,null).marginRight;
	        const paddingRight = 0;		//右边的 padding 用于测试是否有超出使用
	        const asideWindowMarginRight = marginStr.slice(0,marginStr.indexOf('px'));
	        
	        
	        
	        this.mainWindowStyle.height = window.innerHeight - this.$refs.winHeader.offsetHeight - topWindowMarginBottom;// + "px";	//-5是用来看效果,前面的尺寸已经验证好了
	        this.mainWindowStyle.width = window.innerWidth - 65 - paddingRight ;// + 'px';
	        console.log('mainwindow.width= '+this.mainWindowStyle.width);
			this.mainWindowStyle.paddingRight = paddingRight;// + 'px';	    
	        
	        //console.log('main window with = ' + this.mainWindowStyle.width);
	        
	        let mainWindowStyle = window.getComputedStyle(this.$refs.winMain,null);
	        //console.log(mainWindowStyle.width);
	        //this.mainWindowStyle.backgroundColor = 'blue';
	        
	        //console.log('aside width = ' + this.$refs.winAside.offsetWidth);	        
	        //this.mainWindowStyle.width = window.innerWidth - 200 + "px";
	        //this.mainWindowStyle.width = '100%';
	        
	        
	        //console.log('u i = ' + this.updateIndex + 'm w = ' + this.$refs.winAside.offsetWidth);	        
	            
	        //主窗内的 tabs 页,有讲究,这个是 tabs 页下面的内容,而上面的 tabs 头占大约41px,但中间还有一个分隔区,具体 px 不明,暂时用减去 70
	        //暂时没去研究 tabs 控件的头部叫 scorller 的有多大,还有 tab pane 与 scroller 中间的空位有多少,先大概照 70 来减
	        this.tabPaneStyle.height = window.innerHeight - this.$refs.winHeader.offsetHeight - topWindowMarginBottom - 80 - 0;//+ "px";
	        this.tabPaneStyle.width = this.mainWindowStyle.width - 20 - 2 - 30;
	        
	        //window.getComputedStyle(this.$refs.winMain,null);
	        
	        //console.log("iframe size = " + this.tabPaneStyle.width + this.tabPaneStyle.height);
	        
	        //this.tabPaneStyle.height = '100%';
	         
	        
	        //this.sizeRecord.
//	        console.log('ref of winHeader is :');
//	        console.log(this.$refs.winHeader);
//	        
//	        console.log("innh = " + window.innerHeight);
//	        console.log("my h = " + this.topContainerStyle.height);
//	        console.log(event);
//	        console.log(document.body.style.margin);	        
//	        console.log("body.cw" + document.body.clientWidth);
//	        console.log("body.ch" + document.body.clientHeight);
//	        console.log("body.ow" + document.body.offsetWidth);
//	        console.log("body.oh" + document.body.offsetHeight);
	        
	        this.$forceUpdate();
	    },
	    
	    onMouseMove(event) {
	    	//console.log(event);
	    	
	    	//this.debugText = 'clientXY=' + event.clientX + ',' + event.clientY + '  ';
	    	//this.debugText += 'layerXY=' + event.layerX + ',' + event.layerY + '  ';
	    	//this.debugText += 'offsetXY=' + event.offsetX + ',' + event.offsetY + '  ';
	    	//this.debugText += 'pageXY=' + event.pageX + ',' + event.pageY + '  ';
	    	//this.debugText += 'screenXY=' + event.screenX + ',' + event.screenY + '  ';	//这个是屏幕尺寸
	    	//this.debugText += 'XY=' + event.x + ',' + event.y;
	    	
	    },
		
		
		/*
		 * 按钮,展开或收起边栏,由于状态栏宽度变化后,控件宽度未能刷新,所以需要等0.7秒后再刷新宽度.
		 */
		btnAsideOpenClose : function() {
			this.isCollapse = !this.isCollapse;
			this.asideOpenCloseIcon = !this.isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold';
			
			setTimeout(this.onsize,700);
		},
		
		/*
		 * 边栏的展开与收起回调
		 */
		handleOpen : function(key,keyPath) {
			//this.$message({message:'展开了' + key + keyPath});
			//console.log(this.$ref.winAside);
			//console.log("open");
			setTimeout(this.onsize,700);
			
			this.openKeys.push(key);
			parsenCookie.saveMainMenuOpens(JSON.stringify(this.openKeys));
			//jQuery.cookie('ps_main_menu',JSON.stringify(this.openKeys),{expires:30,path:'/',});
		},
		handleClose : function(key, keyPath) {
			//this.$message({message:'关闭了' + key + keyPath});
			setTimeout(this.onsize,700);
			
			this.openKeys = this.openKeys.filter(k => k !== key);
			parsenCookie.saveMainMenuOpens(JSON.stringify(this.openKeys));
			//jQuery.cookie('ps_main_menu',JSON.stringify(this.openKeys),{expires:30,path:'/',});
		},
		
		/*
		 * 边栏的点击回调
		 */
		asideMenuSelected : function(index) {
			
			let that = this;
			

			

			
			for(menuItem of MENU_ITEM_LIST) {
				if(menuItem.idForSelect == index) {
					that.addTab(menuItem);
					//that.tabSelected = index;
					that.tabSelected = menuItem.name;
				}
			}
			
			
			
			//jQuery.cookie('ps_tab_list',JSON.stringify(this.editableTabs),{expires:30,path:'/',});
			//jQuery.cookie('ps_tab_selected',this.tabSelected,{expires:30,path:'/',});
			
			parsenCookie.saveTabList(JSON.stringify(that.editableTabs));
			parsenCookie.saveTabSelected(that.tabSelected);
			
			console.log(index);
			
			//this.$message({message:'index=' + index});
		},
		
		/*
		 * 增加 tab 函数
		 */
		//addTab(targetName,url) {
		addTab(tabItem) {
			
            var hasName = false;
            const tabs = this.editableTabs;
            console.log(this.editableTabs)

            for (const tab of tabs) {
                if (tab.idForSelect === tabItem.idForSelect) {
                    hasName = true;
                    break;
                }
            }

            //如果是新页面,简单加入
            if (false === hasName) {
                console.log("加入新页面了")
                this.editableTabs.push(tabItem);
            }
            //如果是已经有的页面,进行刷新
            else {
                for (frame of this.$refs.frameList) {
                    if (frame.attributes.src.nodeValue == tabItem.url) {
                        frame.contentWindow.location.reload(true);
                    }
                }
            }
            
            
		},
	    //工作台保持固定
		removeTab(targetName) {
			if(targetName == '工作台'){
				return;
			}
			
			console.log('remove tab' + targetName);
			
	        let tabs = this.editableTabs;
	        let activeName = this.tabSelected;		//记录下目前正在激活的
	        
	        //如果要关的窗是目前正激活的窗,那么把激活窗切换到前一个或后一个
	        //否则是不需要切换的.
	        if (activeName === targetName) {
	          tabs.forEach((tab, index) => {
	            if (tab.name === targetName) {
	              let nextTab = tabs[index + 1] || tabs[index - 1];
	              if (nextTab) {
	                activeName = nextTab.name;
	              }
	            }
	          });
	        }
	        	        
	        this.tabSelected = activeName;
	        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
	        
	        //jQuery.cookie('ps_tab_list',JSON.stringify(this.editableTabs),{expires:30,path:'/',});
	        //jQuery.cookie('ps_tab_selected',this.tabSelected,{expires:30,path:'/',});
	        
	        parsenCookie.saveTabList(JSON.stringify(this.editableTabs));
	        parsenCookie.saveTabSelected(this.tabSelected);
			
		},
		
		handleTabClick(tab){
			//console.log([tab,this.tabSelected]);
			//jQuery.cookie('ps_tab_list',JSON.stringify(this.editableTabs),{expires:30,path:'/',});
			//jQuery.cookie('ps_tab_selected',this.tabSelected,{expires:30,path:'/',});
			
			parsenCookie.saveTabList(JSON.stringify(this.editableTabs));
			parsenCookie.saveTabSelected(this.tabSelected);
		},
		handleTabAdd(name){
			console.log(name);
		},

		
		clickDebugCheckToken : function() {
			//this.$message({message:'read at'});
			const a_t = jQuery.cookie('ps_access_token');
			this.$message({message:'at=' + a_t});
		},
		
		clickLogout : function() {
			
			const ok = parsenCookie.removeAccessToken();
			console.log('remove at = ' + ok);
			window.location.href = "login.jsp";
			
//			let sha1 = setupJsonString({
//				"appId":"zx20181129155010",
//				"v":"2.0",
//				"iccid":"8986111820803855290",
//				"timestamp":"1567151345843",
//			});
//			
//			console.log(sha1);			
			//SimApiZC.queryCardStatus('89860433192070102989');
			//console.log(hex_sha1('a03a5f5d8fed0e6a650264b483a7efadappIdzx20181129155010iccid8986111820803855290timestamp1567151345843v2.0a03a5f5d8fed0e6a650264b483a7efad'));
		},
		
		btnTestSize(){
//			console.log("屏幕分辨率为："+window.screen.width+"*"+window.screen.height);
//			console.log("body 的 width："+document.body.clientWidth + " * " + document.body.clientHeight + "  html - 2 * body的margin,注意padding 是不减的");
//			console.log("可用区:" + screen.availWidth + " * " + screen.availHeight);
//			console.log("网页可见区域宽(包括边线的宽)："+document.body.offsetWidth + " * " + document.body.offsetHeight);
//			console.log("网页正文全文尺寸："+document.body.scrollWidth + " * " + document.body.scrollHeight);
//			this.onsize(null);
		    for(key of this.openKeys) {
		    	this.$refs.mainMenuWindow.open(key);
		    }
		},
		
		menuShow(){
			this.menuCover = false;
			//setTimeout(this.onsize,700);
		},
		
		menuHide(){
			this.menuCover = true;
			//setTimeout(this.onsize,700);			
		},
		
		menuSwitch(){
			this.menuCover = !this.menuCover;
		}
	

	},
}
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')



