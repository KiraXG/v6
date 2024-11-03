/**
 * 
 */

//import { jQuery } from 'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js'

//const PAGE_ITEM_MAX = 8;

var Main = {		
	data : function() {
        return {
            tableData: [    ],
            editShowHide: false,
            form:{
            	accountOld:'',
            	account:'',
            	name:'',
            	sname:'',
            	tel:'',
            },
            pageCount:0,
            pageIndex:0,
            userList:[],
        };
	},
	
//	data:{
//		tableData: [    ],
//        editShowHide: false,
//        form:{
//        	accountOld:'',
//        	account:'',
//        	name:'',
//        	sname:'',
//        	tel:'',
//        },
//	},
	
	methods : {
		rowSelectClick : function(sel,row,test) {
			this.$message({message:JSON.stringify(sel) + 'and' + JSON.stringify(row)});
		},
		
		clickEditUser(index, row) {
	        //this.$message({message:index + ' and2 ' + JSON.stringify(row)});
			this.form.accountOld = row.ACCOUNT;
			this.form.account = row.ACCOUNT;
			this.form.name = row.NAME;
			this.form.sname = row.SNAME;
			this.form.tel = row.TEL;
	        this.editShowHide = true;
	    },
	    clickDeleteUser(index, row) {
	    	this.$message({message:index + 'and' + JSON.stringify(row)});	        
	    },
	    
	    clickUpdateCompanyInfo() {
	    	const url = 'https://app.parsen.com.cn/ParsenHttpApi/SetCompanyInfo';
	    	const data = {
	    		ACCESS_TOKEN : "123",
	    		ACCOUNT_OLD : this.form.accountOld,
	    		ACCOUNT : this.form.account,
	    		NAME : this.form.name,
	    		SNAME : this.form.sname,
	    		TEL : this.form.tel
	    	};
	    	
	    	jQuery.ajax({
	    		url:url,
	    		data:data,
	    		context:this,
	    		success:function(res) {
	    			this.$message({message:res});
	    		}
	    	});
	    	
	    	this.editShowHide = false;	    		
	    },
	    
	    pageChange(index) {
	    	this.pageIndex = index - 1;
	    	this.tableData = this.userList.slice(this.pageIndex*PAGE_ITEM_MAX,(this.pageIndex+1)*PAGE_ITEM_MAX);
	    }
	},
	
	beforeMount : function() {
		//var that = this;
		const url = 'https://app.parsen.com.cn/ParsenHttpApi/GetCompanyList';		
		const data = {
			ACCESS_TOKEN:'123',			
		};
		
		this.$message({message:JSON.stringify(data)});
		
		jQuery.ajax({
			type:'POST',
			url:url,
			data:data,
			context:this,
			success:function(res){
				//this.$message({message:res});				
				this.userList = res.COMPANY_LIST;
				this.tableData = res.COMPANY_LIST.slice(0,PAGE_ITEM_MAX);
				this.pageCount = (Math.floor(this.userList.length / PAGE_ITEM_MAX) + 1)*10;
				//this.$message({message:this.pageCount});
			},
		});
	},
	

};

var Ctor = Vue.extend(Main)
new Ctor().$mount('#user_list')




