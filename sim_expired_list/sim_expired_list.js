/**
 * 
 */

/**
 * 
 */

var Main = {
	data: function(){
		let d = {
			simTableData:[
//				{ICCID:'132',IMEI:321,COMPANY:'parsen',PROJECT:'工程名',GROUP:'氧气组',EXPIRED:'2022-10-28'},
//				{ICCID:'132',IMEI:321,COMPANY:'parsen',PROJECT:'工程名',GROUP:'氧气组',EXPIRED:'2022-10-28'},
//				{ICCID:'132',IMEI:321,COMPANY:'parsen',PROJECT:'工程名',GROUP:'氧气组',EXPIRED:'2022-10-28'}
			],
			filterSimText:'',
			tabCellStyle:{},
		}
		return d;
	},
	
	beforeMount : function() {
		jQuery.ajax({
			type:'POST',
			url:`https://app.parsen.com.cn/ParsenHttpApi/GetSimList`,
			data:{
				ACCESS_TOKEN:parsenCookie.loadAccessToken(),
				filter:'EXPIRED',
				expired_days:'60',
			},
			context:this,
			success:function(res){
				console.log(res);
				if(res.result == 1) {
					this.simTableData = res.sim_list;
				}				
			},
			error:function(res){
				
			},
		});
	},
		
	methods:{
		btnFilterSim(){
			
		},
		
		btnRemindLater(){
			
		},
		
		btnDontRemind() {
			
		},
	}
}


var Ctor = Vue.extend(Main)
new Ctor().$mount('#sim_expired_list')













