/**
 * 
 */

//const PAGE_ITEM_MAX = 8;

var Main = {
	data : function(){
        var data1 = {
            tableData:[],		//列表控件数据源
            companyList:[],		//从网络处读来的数据
            companyFilterList:[],	//过滤后的公司列表
            pageCount:0,
            pageIndex:0,
            textfilterCompany:'',	//公司查找框
            
            
            //==============================修改公司资料对话框
            editShowHide: false,                        
            editCompanyInfoForm:{	//Form 的数据源
            	accountOld:'',
            	account:'',
            	password:'',
            	company_full_name:'',
            	company_name:'',
            	tel:'',
				manageNode:'0',
				manageCompany:'0',
            },
            editingCompany: null,	//目前正在修改的公司对象,用于在修改后更新列表内容
            companyInfoRules:	//公司信息的填写规则
            {
            	account:[
            		{required: true, message: '长度为3~15个字符', trigger: 'blur'},
            		{min:3,max:15, message: '长度为3~15个字符', trigger: 'blur'},
            	],
            	password:[
            		{required: true, message: '长度为6~15个字符', trigger: 'blur'},
            		{min:6,max:15, message:'长度为6~15个字符',trigger:'blur'},
            	],
            	company_full_name:[
            		{required: true, message: '长度为2~30个字符', trigger: 'blur'},
            		{min:2,max:30, message:'长度为2~30个字符',trigger:'blur'},
            	],
            	company_name:[
            		{required: true, message: '长度为2~30个字符', trigger: 'blur'},
            		{min:2,max:30, message:'长度为2~30个字符',trigger:'blur'},
            	],
            },
            
            
            
            //==============================新建公司对话框
            addCompanyDialogVisable: false,            
            
        };
        
        return data1;
	},
	
	
	beforeMount : function() {
		
		jQuery.ajax({
			type:'POST',
			url:Consts.HTTP_PREFIX + 'GetCompanyList',
			data:{
				access_token:jQuery.cookie('ps_access_token'),
				company_id:parsenCookie.loadCompanyId(),
			},
			context:this,
			success:function(res){
				if("0" == res.result) {
					alert('读取公司列表失败');
				}

				if(!res.company_list) {
					return;
				}

				this.companyList = res.company_list;
				this.companyFilterList = this.companyList;
				
//				this.companyFilterList = this.companyList.filter(function(company){	
//					console.log(company);
//					if( (company.ACCOUNT.indexOf(this.textfilterCompany) != -1)
//							||
//						(company.NAME.indexOf(this.textfilterCompany) != -1)
//							||
//						(company.SNAME.indexOf(this.textfilterCompany) != -1)
//							||
//						(company.TEL.indexOf(this.textfilterCompany) != -1)    )
//					{
//						return true;
//					}
//					else {
//						return false;
//					}
//				},this);
				
				this.tableData = this.companyFilterList.slice(0,PAGE_ITEM_MAX);
				this.pageCount = (Math.ceil(this.companyFilterList.length / PAGE_ITEM_MAX))*10;
				
				
				
				//this.userList = res.COMPANY_LIST;
				//this.tableData = res.COMPANY_LIST.slice(0,PAGE_ITEM_MAX);
				//this.pageCount = (Math.floor(this.userList.length / PAGE_ITEM_MAX) + 1)*10;
								
				
				console.log(['filter text = ',this.textfilterCompany]);
			}, 
		});
	},


	watch:{
		editCompanyInfoForm:{
			deep:true,
			handler(val,oldVal) {
				//console.log([val,oldVal]);
				if("1" == val.manage_company) {
					val.manage_node = "1";
				}
			},
		}
	},
	
	
	methods : {
		reflashData : function() {
			console.log("reflash data")
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'GetCompanyList',
				data:{
					access_token:parsenCookie.loadAccessToken(),
					company_id:parsenCookie.loadCompanyId(),
				},
				context:this,
				success:function(res){					
					this.companyList = res.company_list;
					this.companyFilterList = this.companyList;
					
					this.tableData = this.companyFilterList.slice(this.pageIndex*PAGE_ITEM_MAX,(this.pageIndex+1)*PAGE_ITEM_MAX);					
					//this.tableData = this.companyFilterList.slice(0,PAGE_ITEM_MAX);
					this.pageCount = (Math.ceil(this.companyFilterList.length / PAGE_ITEM_MAX))*10;
					
				}, 
			});
		},
		
		btnFilterCompany : function () {
			this.companyFilterList = this.companyList.filter(function(company){	
				//console.log(company);
				if( (company.account.indexOf(this.textfilterCompany) != -1)
						||
					(company.company_full_name.indexOf(this.textfilterCompany) != -1)
						||
					(company.company_name.indexOf(this.textfilterCompany) != -1)
						||
					(company.tel.indexOf(this.textfilterCompany) != -1)    )
				{
					return true;
				}
				else {
					return false;
				}
			},this);
			
			this.tableData = this.companyFilterList.slice(0,PAGE_ITEM_MAX);
			this.pageCount = (Math.ceil(this.companyFilterList.length / PAGE_ITEM_MAX))*10;
			
			console.log('length=' + this.companyFilterList.length);
			console.log('pagecount=' + this.pageCount);
		},		

		
		clickEditUser(index, row) {
	        //this.$message({message:index + ' and2 ' + JSON.stringify(row)});
			console.log(row);
			//console.log(this.editCompanyInfoForm);
			
			this.editCompanyInfoForm = row;
			this.editCompanyInfoForm.accountOld = row.account;
			
	        this.editShowHide = true;
	        
	        this.editingCompany = row;
	    },
	    
	    clickDeleteUser(index, row) {
	    	//this.$message({message:index + 'and' + JSON.stringify(row)});
	    	console.log(row);
	    	
	    	jQuery.ajax({
	    		type:'POST',
	    		url:Consts.HTTP_PREFIX + 'RemoveCompany',
	    		data:{
	    			access_token:parsenCookie.loadAccessToken(),
	    			company_id:row.company_id,
	    		},
	    		context:this,
	    		success:function(res){
	    			//console.log(res);
	    			if("1" == res.result) {
	    				alert('删除公司成功');
	    				this.reflashData();
	    			}
	    			else {
	    				alert('删除失败 ' + res.err_msg);
	    				console.log(res);
	    			}
	    		},
	    		error:function(res){
	    		  
	    		},	    			  
	    	});
	    },
	    
	    clickUpdateCompanyInfo() {
	    	//console.log("update");
	    	this.$refs.companyInfoForm.validate((valid) => {
				if (valid) {	   
	    	
			    	jQuery.ajax({
			    		url:Consts.HTTP_PREFIX + 'SetCompanyInfo',
			    		data:{
				    		access_token : parsenCookie.loadAccessToken(),
				    		account_old : this.editCompanyInfoForm.accountOld,
				    		account : this.editCompanyInfoForm.account,
				    		// : this.editCompanyInfoForm.password,
				    		company_full_name : this.editCompanyInfoForm.company_full_name,
				    		company_name : this.editCompanyInfoForm.company_name,
				    		tel : this.editCompanyInfoForm.tel,
							manage_node : this.editCompanyInfoForm.manage_node,
							manage_company : this.editCompanyInfoForm.manage_company,
				    	},
			    		context:this,
			    		success:function(res) {
			    			if("1" === res.result) {
			    				
			    				this.editingCompany = this.editCompanyInfoForm;

			    				alert("修改成功!");	
			    				this.editShowHide = false;
			    			}
			    			else {
			    				alert("修改失败,请联系厂家");
			    			}
			    		},
			    		error:function(res){
			    			
			    		},
			    	});
				}
	    	});
	    		    		
	    },
	    
	    btnCloseEditInfoDialog(){
	    	//console.log("close edit dialog");
	    },
	    
	        
	    
	    btnAddCompany () {			
	    	console.log('btn add company');
	    	
			this.editCompanyInfoForm.account = '';
			this.editCompanyInfoForm.password = '';
			this.editCompanyInfoForm.company_full_name = '';
			this.editCompanyInfoForm.company_name = '';
			this.editCompanyInfoForm.tel = '';
	        this.addCompanyDialogVisable = true;
	    },
	    
	    
	    
	    btnAddCompanyComfirm(){	    	
	    	this.$refs.companyInfoForm.validate((valid) => {
				if (valid) {	    	
			    	jQuery.ajax({
			    		url:Consts.HTTP_PREFIX + 'InsertCompany',
			    		data:{
				    		access_token : parsenCookie.loadAccessToken(),
				    		company_id : parsenCookie.loadCompanyId(),
				    		account : this.editCompanyInfoForm.account,
				    		password : this.editCompanyInfoForm.password,				    		 
				    		company_full_name : this.editCompanyInfoForm.company_full_name,
				    		company_name : this.editCompanyInfoForm.company_name,
				    		tel : this.editCompanyInfoForm.tel
				    	},
			    		context:this,
			    		success:function(res) {
			    			if("1" === res.result) {
			    				this.reflashData();
			    				alert("新建公司成功!");	    				
			    				this.addCompanyDialogVisable = false;
			    			}
			    			else {
			    				alert("新建公司失败,请联系厂家");
			    				console.log(res);
			    			}
			    		},
			    		error:function(res){
			    			
			    		},
			    	});
				}
				else{
					
				}
	    	});
	    },//end of btnAddCompanyComfirm()
	    
	    beforeCloseAddCompanyDialog(){
	    	
	    },
	    
	    pageChange(index) {
	    	this.pageIndex = index - 1;
	    	this.tableData = this.companyFilterList.slice(this.pageIndex*PAGE_ITEM_MAX,(this.pageIndex+1)*PAGE_ITEM_MAX);
	    },
	},
	

	

};

var Ctor = Vue.extend(Main)
new Ctor().$mount('#company_list')


