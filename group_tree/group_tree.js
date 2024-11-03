/**
 * 
 */

//import mainEditableTabs from '../main_window.js'

var Main = {
		
		data() {
		    const data1 = [{"id":"1","label":"全部"}];
		       
		    return {	        
		    	
		    	tableData:[],
		    	addCompanyDialogVisible:false,
		    	  
		    	companyList : [	],
		    		  			
		    	companySelected : [],
		    	
		    	companyFatherId : "0",
		    	  
		      }
		    }// end of data
		,
		    
		beforeMount : function() {
			
			const url = Consts.HTTP_PREFIX + 'GetCompanyTree';
			
			jQuery.ajax({
				type:'POST',
				url:url,
				data:{
					access_token:parsenCookie.loadAccessToken(),
					company_id:parsenCookie.loadCompanyId(),
				},
				context:this,
				success:function(res){
					//console.log(res);
					
					//this.tree_data = [res.TREE];
					this.tableData = [res.company_tree];
					this.tableData[0].delete_button_absent = true;					
				},	
				error:function(res){
					//this.$message({message:res});
				},
				complete:function(res) {
					//this.$message({message:res});
				}
			});
		},
		
		
		methods : {
			reflashTableData : function() {				
				jQuery.ajax({
					type:'POST',
					url:Consts.HTTP_PREFIX + 'GetCompanyTree',
					data:{
						access_token:parsenCookie.loadAccessToken(),
						company_id:parsenCookie.loadCompanyId(),
					},
					context:this,
					success:function(res){
						if("0" == res.result) {
							this.$message({message:res.err_msg});
							return;
						}
						this.tableData = [res.company_tree];
						this.tableData[0].delete_button_absent = true;
						//this.$message({message:res.TREE});
						//this.tableData[0].delete_button = true;					
					},	
					error:function(res){
						//this.$message({message:res});
					},
					complete:function(res) {
						//this.$message({message:res});
					}
				});
			},
			
			handleAddCompany(index,row) {							
				//this.$message({message:JSON.stringify(mainEditableTabs)});							
				//mainEditableTabs.push({name:"test",});

				console.log([index,row]);

				this.addCompanyDialogVisible = true;
				
				this.companyFatherId = row.company_id;
				
				var tempList = null;
				
				const POST_DATA = {
					access_token:parsenCookie.loadAccessToken(),
					company_id:parsenCookie.loadCompanyId(),
				};
				
				jQuery.ajax({
					type:'POST',
					url:Consts.HTTP_PREFIX + 'GetCompanyPrepareSonList',
					//data:{ID:row.id},
					data:POST_DATA,
					context:this,
					success:function(res){
						//this.$message({message:res});
						this.companyList = res.prepare_son_list;
						this.companySelected = res.selected;
					},
					error:function(res){
						console.log(res);
					},					
				}
				);
			}// handleAddCompany 结束
			,
			
			quitAndNotSave() {
				this.addCompanyDialogVisible = false;
			}
			
			,
			
			handleDeleteSon(index,row) {
				
				const POST_DATA = {
					access_token:parsenCookie.loadAccessToken(),
					son_id:row.company_id,
				};
				
				jQuery.ajax({
					type:'POST',
					url:Consts.HTTP_PREFIX + 'RemoveOneSon',
					data:POST_DATA,
					context:this,
					success:function(res){
						this.$message({message:'删除下属子公司成功！'});
						this.reflashTableData();						
						//console.log(['RemoveOneSon success',res]);
					},
					error:function(res){
						//console.log(['RemoveOneSon error',res]);
					},
				});
			}
			
			,
			
			quitAndSave() {
				jQuery.ajax({
					type:'POST',
					url:Consts.HTTP_PREFIX + 'AddCompanySons',
					data:{
						access_token:parsenCookie.loadAccessToken(),
						father_id:this.companyFatherId,
						sons_id:JSON.stringify(this.companySelected),
					},
					context:this,
					success:function(res){
						//this.$message({message:res});
						this.reflashTableData();
						
					},
					error:function(res){						
					},
				});
				
				this.addCompanyDialogVisible = false;
			}
		},
		
		
      
};//end of Main


var Ctor = Vue.extend(Main)
new Ctor().$mount('#group_tree')