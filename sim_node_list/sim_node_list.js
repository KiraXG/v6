/**
 * 
 */

var Main = {
	data: function(){
		let d = {
			simTableData:[
				{ICCID:'13nnn2',IMEI:321,COMPANY:'parsen',PROJECT:'工程名',GROUP:'氧气组',EXPIRED:'2022-10-28'},
				{ICCID:'13nnn2',IMEI:321,COMPANY:'parsen',PROJECT:'工程名',GROUP:'氧气组',EXPIRED:'2022-10-28'},
				{ICCID:'13nnn2',IMEI:321,COMPANY:'parsen',PROJECT:'工程名',GROUP:'氧气组',EXPIRED:'2022-10-28'}
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
				filter:'NODE',
			},
			context:this,
			success:function(res){
				console.log(res);
				if(res.result == 1) {
					this.simTableData = res.sim_list;
					for(let d of this.simTableData)
					{
						d.used_flow += 'MB';
						d.total_flow += 'MB';
					}
				}				
			},
			error:function(res){
				
			},
		});
	},
		
	methods:{
		btnFilterSim(){
			
		},
	}
}


var Ctor = Vue.extend(Main)
new Ctor().$mount('#sim_node_list')













