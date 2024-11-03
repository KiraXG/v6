/**
 * 
 */


var Main = {
	
	data:function(){
		return {
			form:{
				account:'',
				password:'',
			},
			access_token:'',			
			autoLogin:false,
		};
	},
	
	//created:function(){
	beforeCreate:function(){
		var a_t = parsenCookie.loadAccessToken();//jQuery.cookie('ps_access_token');
		console.log('at= ' + a_t);
		//alert('at= ' + a_t);
		if(null == a_t) {
			a_t = 'no access_token';
		}
		else {
			//window.navigate('main.jsp');
			window.location.href = "main_window.jsp";
			this.autoLogin = true;
			//this.access_token = a_t;
		}
		this.access_token = a_t;
		//this.at2 = a_t;
		//this.at2 = 'a??t';  
		
	},
	
	created:function(){
		const account = jQuery.cookie('ps_account');
		this.form.account = account;
	},
	
	mounted()
	{	
		//收到回车键就执行登录按钮
		document.onkeydown = event => {
			//console.log(event);
			//const key = window.event.keyCode;			    
			if(13 == window.event.keyCode){
				this.clickLogin();
			}
		}
	},
	
	methods:{
		
		clickLogin : function() {
			//this.$message({message:this.form.account + ' and ' + this.form.password});
			const url = Consts.HTTP_PREFIX + 'CompanyLogin';
			const data = {account:this.form.account,password:this.form.password,};
			
	    	jQuery.ajax({
//	    		beforeSend:function(xhr){
//	    			xhr.setRequestHeader('Access-Control-Allow-Origin','*');
//	    			xhr.setRequestHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS,DELETE');
//	    			xhr.setRequestHeader('Access-Control-Allow-Headers','x-requested-with,content-type');
//	    		},
	    		type:'POST',	    		
	    		url:url,
	    		data:JSON.stringify(data),
	    		context:this,
	    		success:function(res) {
	    			//this.$message({message:res});
	    			if(res.result != '1') {
	    				this.$message({message:'账号或密码错误'});
	    			}
	    			else {
	    				
	    				//jQuery.cookie('ps_access_token',res.ACCESS_TOKEN);
	    				//jQuery.cookie('ps_account',this.form.account,{expires:30,path:'/',});
	    				//jQuery.cookie('ps_company_id',res.ACCOUNT_INFO.ID,{expires:30,path:'/',});
	    				parsenCookie.saveAccessToken(res.access_token);
	    				parsenCookie.saveAccount(this.form.account);
						parsenCookie.saveCompanyId(res.company.company_id);
						parsenCookie.saveCompanyName(res.company.company_full_name);
						parsenCookie.saveCompanyManageNode(res.company.manage_node);
						parsenCookie.saveCompanyManageCompany(res.company.manage_company);
	    				window.location.href = "main_window.jsp";
	    				//localStorage.setItem('at_' + this.form.account);
	    				
	    				
	    			}
	    		},
	    		error:function(res) {	    			
	    			console.log({err:'request 返回 err',res:res});
	    		},
	    		complete:function(res) {
	    			//this.$message({message:res});
	    		},
	    	});
		},
		
		clickDebugCheckToken : function() {
			this.$message({message:'read at'});
			const a_t = jQuery.cookie('ps_access_token');
			this.$message({message:'at=' + a_t});

		},
	},	
};


var Ctor = Vue.extend(Main)
new Ctor().$mount('#login')







