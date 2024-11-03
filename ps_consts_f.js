/**
 * 
 */

//const PS_GREEN	= '#409EFF';
//const PS_BLUE	= '#67C23A'; 
//const PS_YELLOW	= '#E6A23C';
//const PS_PIN	= '#F56C6C';	

const PsColor = {
	
	PS_BLUE		:'#409EFF',			//派晟蓝
	PS_GREEN	:'#67C23A',
	PS_YELLOW	:'#E6A23C',
	PS_PIN		:'#F56C6C',
	PS_GREY		:'#DCDFE6',
	
	
	PS_GANGHUA_LINE_1		: '#4353d2',			//港华燃气通道1的颜色
	PS_GANGHUA_LINE_2		: '#a7a304',			//港华燃气通道2的颜色
	PS_GANGHUA_LINE_3		: '#a7a304',			//
	PS_GANGHUA_LINE_4		: '#3a9404',
	PS_GANGHUA_LINES		: function(line) {			//港华燃气通道颜色数组
		line = parseInt(line);
		const colorArr = [this.PS_GANGHUA_LINE_1,this.PS_GANGHUA_LINE_2,this.PS_GANGHUA_LINE_3]; 
		if(line < 0)	{line = 0;}
		if(line >= colorArr.length)	{line = colorArr.length - 1};
		return colorArr[line];
	},
	
	
	PS_PROJECT_ICON			: 'rgb(20,110,0)',		//工程绿,树菜单处工程图标的颜色
	PS_YIBIAO_ICON			: 'rgb(0, 125, 255)',	//仪表蓝,树菜单处仪表图标的颜色
	
	PS_LOPOWER_GREY			: '#909399',			//缺电灰
	PS_SUCCESS_GREEN		: '#4daf1c',			//成功绿
	PS_WARNING_YELLOW		: '#fb9f16',			//警告黄
	PS_ALARM_RED			: '#f10606',			//警告红

	paramColors	: function() {		
		return [this.PS_BLUE,this.PS_GREEN,this.PS_YELLOW,this.PS_PIN];
	},

};


const ConfigConsts = {
	OFFLINE_JUDGE_COUNT		: 3,	
};


const YiBiaoStatus = {
	OFF_LINE		: "off_line",
	OVER_HH			: "over_hh",
	OVER_H			: "over_h",
	OVER_L			: "over_l",
	OVER_LL			: "over_ll",
	LOW_POWER		: 'low_power',
	NORMAL			: 'normal',
};




















