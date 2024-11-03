/**
 * 
 */


var Main = {		
	data : function() {
        var myData = {
        	//=================================================左边公司树
    		filterCompanyText:'',	//用于过滤公司的文字      
            companyTreeData:[],		//公司树数据            
            defaultProps: {			//公司树数据项名称的重命名            	
  		        label: 'project_name'
  		    },
  		    companyTreeSelectIncludeSubCompany:false,	//checkbox 包含子公司
  		    companyTreeAllowMultiSelect:false,			//checkbox 允许多选
  		    companyTreeExpandOnClickNode:false,	//点击节点不展开,只有点checkbox或三角形才执行展开
      		    
  		    
  		    
  		    //=================================================右边工程列表  		    
        	projectList: [],			//全部工程列表
        	projectFilteredList: [],	//刷选后的工程列表
        	tableData:[],				//工程列表数据源
  		    filterProjectText:'',	//用于过滤工程的文字  		    
  		                
            pageCount:0,	//与翻页相关变量
            pageIndex:0,
            btnAddProjectDisable: false,
            tooltipAddProjectDisable: true,
            
                        
            //=================================================添加工程对话框
            dialogAddProjectShowHide : false,	//添加工程的对话框
            titleAddProject:'',				//对话框的 title
            addProjectCompanyId : 1,		//工程的父公司ID
            addProjectCompanyName : '',		//工程的父公司名称            
            projectInfoData : //添加时填写的工程信息
            {
            	project_id:'',
            	project_name:'',
            	project_desc:'',
            },
            addProjectDialogShowClose: false,
            addProjectDialogCloseOnPressEscape: false,
            projectInfoRules:	//工程信息的填写规则
            {
            	project_name:[
            		{required: true, message: '请大于2个字符', trigger: 'blur'},
            		{min:3,max:15, message: '请大于2个字符', trigger: 'blur'},
            	],
            	project_desc:[
            		{max:25, message:'请小于25个字符',trigger:'blur'},
            	],
            },
            
            
            
            //=================================================编辑工程对话框
            dialogEditProjectVisible: false,
            titleEditProject:'',
            lastEditingProject:null,

            
            
            
            //=================================================添加仪表对话框
            
            
            
            //==============================================尺寸相关
            mainWindowStyle:{
            	
            },
        };
        
        return myData;
	}//end of data
	//-----------------------------------------------end of data
	,

	
	
	beforeMount : function() {
		//var that = this;
		jQuery.ajax({
			type:'POST',
			url:Consts.HTTP_PREFIX + 'GetCompanyTree',
			data:{
				access_token:parsenCookie.loadAccessToken(),
				company_id:parsenCookie.loadCompanyId(),
			},
			context:this,
			success:function(res){
				console.log(res);
				
				this.companyTreeData = [res.company_tree];
				
				
				
//				//服务器返回的公司树数据结构,放到树的数据源中
//				this.companyTreeData = [res.TREE];
//								
//				//用递归方式遍历树,把所有节点的指针放到数组中
//				var arr = [];
//				arr = this.readNodeRecursion([res.TREE],arr);
//				//console.log(arr);
//								
//				for(let company of arr){
//					//所有公司节点加上 c 类型与公司图标
//					company['type'] = "c";
//					company['icon'] = 'el-icon-s-custom',
//					company['color'] = 'green';
//					//所有公司节点挂入工程子数组,挂入的时候设置好 p 类型
//					this.addProjectsToCompany(company);
//				}
//				
//				//console.log(res);
				
			},
			error:function(res){
				
			},
		});				
	},
	
	created(){
		window.addEventListener("resize", this.onsize);		
	    setTimeout(this.onsize,100);
	},
	
	
	watch : {
		filterCompanyText(value) {
			//this.$message({message:value});
			this.$refs.companyTree.filter(value);			
		},
		
	},
	
	
	
	methods:{
		onsize(event){
			const width = document.documentElement.offsetWidth;
			const height = document.documentElement.offsetHeight;
			let asideWidth = this.$refs.asideWindow.offsetWidth;
			
			let marginStr = window.getComputedStyle(this.$refs.asideWindow,null).marginRight;			
			let marginNumber = marginStr.slice(0,marginStr.indexOf('px'));
			
			this.mainWindowStyle.width = width - asideWidth - marginNumber + 'px';
			this.mainWindowStyle.height = '100%';
			
			//console.log('仪表管理主窗宽 = ' + this.mainWindowStyle.width);
			
			this.$forceUpdate();
		},
		
		
		getCompanyProjects(companyId,companyName) {
			//this.$message({message:"get"});
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'GetCompanysProjects',
				data:{
					//ACCOUNT:jQuery.cookie('ps_account'),
					access_token:parsenCookie.loadAccessToken(),
					company_list:JSON.stringify([companyId]),
				},
				context:this,
				success:function(res){
					if('0' === res.result) {
						this.$message({message:res.err_msg});
						//top.location.href = "../index.jsp";
						return;
					}
				
//					this.projectList = [];
//					
//					for (var index in res.PROJECTS) {
//						res.PROJECTS[index]['COMPANY_NAME'] = companyName; 
//						this.projectList.push(res.PROJECTS[index]);
//					}
//					//this.projectList.push(...res.PROJECTS);
//					
//					this.projectFilteredList = this.projectList;
//					
//					this.tableData = this.projectFilteredList.slice(0,PAGE_ITEM_MAX);
//					this.pageCount = (Math.ceil(this.projectFilteredList.length / PAGE_ITEM_MAX))*10;	
					
					
					this.projectList = res.project_list;
					
					this.projectFilteredList = this.projectList.filter(function(project){						
						if( (project.project_name.indexOf(this.filterProjectText) != -1)
								||
							(project.project_desc.indexOf(this.filterProjectText) != -1)   )
						{
							return true;
						}
						else {
							return false;
						}
					},this);
					
					this.tableData = this.projectFilteredList.slice(0,PAGE_ITEM_MAX);
					this.pageCount = (Math.ceil(this.projectFilteredList.length / PAGE_ITEM_MAX))*10;
					
					
				},	
				error:function(res){
					//this.$message({message:res});
				},
				complete:function(res) {
					//this.$message({message:res});
				},
			});	//end of jQuery.ajax
		}//end of getCompanyProjects
		,
		
		getCompanysProjects : function(companyList) {
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'GetCompanysProjects',
				data:{					
					access_token:parsenCookie.loadAccessToken(),
					company_list:JSON.stringify(companyList),
				},
				context:this,
				success:function(res){
					if('0' === res.result) {
						this.$message({message:res.err_msg});
						//top.location.href = "../index.jsp";
						return;
					}
					
					this.projectList.push(...res.project_list);
					
					this.projectFilteredList = this.projectList.filter(function(project){						
						if( (project.project_name.indexOf(this.filterProjectText) != -1)
								||
							(project.project_desc.indexOf(this.filterProjectText) != -1)   )
						{
							return true;
						}
						else {
							return false;
						}
					},this);
					
					this.tableData = this.projectFilteredList.slice(0,PAGE_ITEM_MAX);
					this.pageCount = (Math.ceil(this.projectFilteredList.length / PAGE_ITEM_MAX))*10;
				},
				error:function(res){
					
				},
			});
		},

		
		companyTreeNodeCheck (company,clickInfo) {
			//this.$message({message:JSON.stringify(clickInfo.checkedNodes)});
			//只有在多选的情况下,才会出
			this.projectList = [];
			//this.$message({message:clickInfo.checkedNodes.length});
			for(let c of clickInfo.checkedNodes) {
				console.log(c);
				this.getCompanysProjects([c.company_id],c.company_name);
			}
			
			if(clickInfo.checkedNodes.length == 0) {
				//this.$message({message:"no content"});
				this.tableData = [];
				this.pageCount = 1;
			}
		},
		
		
		readNodeRecursion : function(nodes,arr) {
			for(var item of nodes) {				
				arr.push({id:item.id,label:item.label});
				if(item.children && item.children.length) {
					this.readNodeRecursion(item.children,arr);
				}
			}
			return arr;
		},
		
		companyTreeNodeClick : function(company,node,tree) {
			//this.$message({message:JSON.stringify(company)});
			//多选与单选是完全2套不同的逻辑
			//多选的情况,靠点击 check box 来出工程列表
			if(this.companyTreeAllowMultiSelect) {
				
			}
			//单选的情况,靠点击节点本身来出工程列表
			else{
				//this.$message({message:"getCompanyProj"});				
				this.projectList = [];
				//最简单的情况,点哪个公司,就列出哪个公司的工程
				if(false == this.companyTreeSelectIncludeSubCompany) {
					this.getCompanysProjects([company]);	
				}
				//需要包含子公司的工程一起列出的情况
				else {
					//取出所有子公司
					var arr = [];
					this.readNodeRecursion([company],arr);
					
					//for(let company of arr) {
					//	this.getCompanyProjects(company.id,company.label);
					//}
					console.log(arr);
					this.getCompanysProjects(arr);
					
					//this.$message({message:arr==null?"null":"arr"});
				}
			}
			
		},
		

		
	    filterCompanyTreeFunc : function(value,data) {
			//this.$message({message:value});
			if (!value) return true;
	        return data.label.indexOf(value) !== -1;
		},
		
		
		/*
		 * 树节点重画
		 */
		handleRenderContent : function(h,{ node, data, store }){
			//console.log([h,node,data,store]);
			
			return h('span',[
				h('i', {attrs: {class: 'el-icon-house'}}),
				h('span',{style:{color:'green'}},data.company_name),
			]);
		},
		
		companyTreeExpand : function(nodeDate,nodeObject,VueNode) {
			setTimeout(this.onsize,700);
		},
		
		companyTreeCollapse : function(nodeDate,nodeObject,VueNode) {
			setTimeout(this.onsize,700);
		},
		
		
		
		
		
		clickFilterProject: function() {
			this.projectFilteredList = this.projectList.filter(function(project){						
				if( (project.NAME.indexOf(this.filterProjectText) != -1)
						||
					(project.DESC.indexOf(this.filterProjectText) != -1)   )
				{
					return true;
				}
				else {
					return false;
				}
			},this);
			
			this.tableData = this.projectFilteredList.slice(0,PAGE_ITEM_MAX);
			this.pageCount = (Math.ceil(this.projectFilteredList.length / PAGE_ITEM_MAX))*10;
		},
		
		pageChange(index) {
	    	this.pageIndex = index - 1;
	    	this.tableData = this.projectFilteredList.slice(this.pageIndex*PAGE_ITEM_MAX,(this.pageIndex+1)*PAGE_ITEM_MAX);
	    },
	    
	    
	    
		
		btnAddProject : function() {
			let node = this.$refs.companyTree.getCurrentNode();
			
			if(null == node) {
				//this.$alert('出错信息','请先选择一个公司',{type: 'warning'});
				alert('请先在右边选择一个公司');
				return;
			}
			
			//this.addProjectCompanyId = 1;
			//this.addProjectCompanyName = Consts.COMPANY_NAME_GENERAL_MANAGER;
			if(null != node) {
				this.addProjectCompanyId = node.company_id;
				this.addProjectCompanyName = node.company_full_name;
			}
			console.log(node);
			
			
			this.projectInfoData.project_name = '';
			this.projectInfoData.project_desc = '';
			this.titleAddProject = "准备在 " + this.addProjectCompanyName + " 里添加工程";
			this.dialogAddProjectShowHide = true;
		},
		
		btnSubmitAddProject: function() {
			//console.log("add");
						
			for(const project of this.projectList){
				//console.log(project);
				if(project.project_name === this.projectInfoData.project_name) {
					alert("工程名称与现有工程重复了!");
					return;					
				}
			}
			
			this.$refs.projectInfoForm.validate((valid) => {
				if (valid) {

					jQuery.ajax({
						type:'POST',
						url:Consts.HTTP_PREFIX + 'InsertProject',
						data:{
							//ACCOUNT:jQuery.cookie('ps_account'),
							access_token:parsenCookie.loadAccessToken(),
							company_id:this.addProjectCompanyId,
							project_name:this.projectInfoData.project_name,
							project_desc:this.projectInfoData.project_desc,
						},
						context:this,
						success:function(res){
							//console.log(res);
							if(res.result === '1') {
								alert("添加工程成功");
								this.dialogAddProjectShowHide = false;
								this.filterProjectText = '';
								this.projectList = [];
								this.getCompanysProjects([{company_id:this.addProjectCompanyId,company_name:this.addProjectCompanyName}]);
							}
							else {
								alert("添加工程失败: " + res.err_msg);
								console.log(res);
							}							
						},
						error:function(res){
							console.log(res);
						},
					});	
				} else {					
					return;
				}
			});
			

			
			//console.log(this.projectInfoData);
		
		},
		
		btnCancelAddProject: function() {
			console.log("cancel");
			this.dialogAddProjectShowHide = false;
		},
		
		beforeCloseAddProjectDialog(){
			//这个函数里面不执行内容,只是用来防止窗口被其他方式关闭
			//这样窗口只能通过我的按钮来进行关闭
			//console.log('before close add project dialog');
		},
		
		
		btnEditProject(index,row){
			console.log([index,row]);
			this.projectInfoData = row;
			this.lastEditingProject = row;
			
			this.titleEditProject = '修改工程  ' + row.project_name + '  的资料';
			this.dialogEditProjectVisible = true;
			
			console.log(this.projectInfoData);
		},
		
		beforeCloseEditProjectDialog(){
			
		},
		
		btnSubmitEditProject(){
			
			for(const project of this.projectList){
				//console.log(project);
				if(	(project.project_name === this.projectInfoData.project_name)
						&&
					(project.project_id != this.projectInfoData.project_id)			)
				{
					alert("工程名称与现有工程重复了!");
					return;
				}
			}
			
			this.$refs.projectInfoForm.validate((valid) => {
				if(false == valid) {
					return;
				}
				
				jQuery.ajax({
					type:'POST',
					url:Consts.HTTP_PREFIX + 'UpdateProject',
					data:{
						access_token:parsenCookie.loadAccessToken(),
						project_id:this.projectInfoData.project_id,
						project_name:this.projectInfoData.project_name,
						project_desc:this.projectInfoData.project_desc,
					},
					context:this,
					success:function(res){
						//console.log(res);
						if("1" === res.result) {
							alert("修改工程成功!");
							
							this.lastEditingProject = this.projectInfoData;
							this.dialogEditProjectVisible = false;
						}
					},
					error:function(res){
						console.log("修改工程失败");
						console.log(res);
					},
				});
			});			

		},
		
		btnCancelEditProject(){
			this.dialogEditProjectVisible = false;
		},
	    
	    clickDeleteProject(index, row) {
	    	console.log([index,row])
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'DeleteProject',
				data:{					
					access_token:parsenCookie.loadAccessToken(),
					project_id:row.project_id,
				},
				context:this,
				success:function(res){
					if(res.result === '1') {
						alert("删除工程成功");						
						
						let company = this.$refs.companyTree.getCurrentNode();
						this.filterProjectText = '';
						this.projectList = [];
						//console.log(['currentNode',company]);
						this.getCompanysProjects([company]);
					}
					else {
						alert("删除工程失败: " + res.err_msg);	
					}
				},
				error:function(res){
					
				},
			});
	    },
	    
	    
	},//end of methods
}


var Ctor = Vue.extend(Main)
new Ctor().$mount('#project_list')



