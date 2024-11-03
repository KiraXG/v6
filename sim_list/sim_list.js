/**
 * 
 */


var Main = {
	data: function(){
		let d = {
			filterSimText:'',
			tabCellStyle:{},
			simData:null,
			searchData:null,
			up_iccid:null,
			searchText:'',
		}
		return d;
	},
	
	created:function(){
		this.getSIM();
	},

	methods:{
		outPutList(){
			let listData = [];
			let now = new Date();
			console.log(now);
			this.simData.forEach((item=>{
				let iccid = item.iccid;
				let imei = item.imei;
				let project_name = item.project_name;
				let company_name = item.company_name;
				let activate_time = item.activate_time;
				let expiry_date = item.expiry_date;
				let status = item.status;
				let residue_flow = item.residue_flow;
				let network_type = item.network_type;	
				let last_date = item.last_date;			
				listData.push({
					iccid:iccid,
					imei:imei,
					project:project_name,
					cpmpany:company_name,
					activate_time:activate_time,
					expiry_date:expiry_date,
					status:status,
					residue_flow:residue_flow,
					network_type:network_type,
					last_date:last_date,
				})
			}));
			let str = `iccid,imei,项目名称,所属公司,激活时间,到期时间,状态,本月剩余流量,网络类型,上传时间\n`;
                // 增加  为了不让表格显示科学计数法或者其他格式
                for (let i = 0; i < listData.length; i++) {
                    for (const key in listData[i]) {
                        str += `${listData[i][key] + '\t'},`;
                    }
                    str += '\n';
                }
                // encodeURIComponent解决中文乱码
                const uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(str);
                // 通过创建a标签实现
                const link = document.createElement("a");
                link.href = uri;
                // 对下载的文件命名
                link.download = "sim卡信息.csv";
                link.click();
		},

		async getSIM(){
			let company_id = parsenCookie.loadCompanyId();
			if(company_id == 1){
				await axios({
					methods:'get',
					url:Consts.HTTP_PREFIX + 'GetSimInfo',
				}).then((res)=>{
					console.log(res);
					if(res.data.result){
						this.simData = res.data.result;
						this.searchData = res.data.result;
					}
				}).catch((err)=>{
					console.log(err);
				})
			}else{
				await axios({
					methods:'get',
					url:Consts.HTTP_PREFIX + 'CompanySim',
					params:{
						company_id:company_id
					}
				}).then((res)=>{
					console.log(res);
					if(res.data.result==1&&res.data.sim_data.length!=0){
						this.simData = res.data.sim_data;
						this.searchData = res.data.sim_data;
					}
				}).catch((err)=>{
					console.log(err);
				})
			}
		},

		allUp(){
			axios({
				type:'get',
				url:Consts.HTTP_PREFIX + 'allSimUpdate'
			}).then((res)=>{
				if(res.data.result==1){
					this.$message("全部更新完成");
				}
			}).catch((err)=>console.log(err))
		},
		
		search(){
			if(this.check(this.searchText)){
				this.$message({
					type:'error',
					message:'输入不能为空',
					duration:1000,
					offset:200,
				})
				this.getSIM();
			}else{
				let temp = [];
				for(let x of this.searchData){
					if((x.imei.search(this.searchText)!=-1)||(x.iccid.search(this.searchText)!=-1)
					||(x.company_name.search(this.searchText)!=-1)||(x.project_name.search(this.searchText)!=-1)){
						temp.push(x);
					}
				}
				this.simData = temp;
			}
		},

		check(string){
		    // 检查字符串是否为空
		    var content = string
		    // 将字符串赋值给变量content
		    if(content.replace(/(^\s*)|(\s*$)/g, "") == '')
		    // 使用正则表达式去掉字符串的首尾空白字符，并判断是否为空
		    // 如果为空，则返回true
		    return true
		}
	}
}


var Ctor = Vue.extend(Main)
new Ctor().$mount('#sim_list')