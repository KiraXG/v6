/**
 * 
 */

//每一个仪表的每一路参量,都可以有一个特别的数据转换算法,用于显示客户的特别内容
var ExtUnitCalculate = {
	//ID号为30的仪表的第2号参量的特殊内容
	'55_0'			: function(kPa) {
		const rou = 426;		//426 kg/m3
		const g = 9.8;			//9.8 N/kg
		const hi = 0.325;		//罐体椭圆厚度
		const l = 12.48;		//罐体圆柱长
		const r = 1.2;			//罐体半径
		const v = 60;			//罐体总体积 m3
		//以上是罐体常数
		
		kPa = Math.max(kPa,0);	//负压力先变0,因为高度不可以算出来是负数
		
		let h = kPa * 1000 / rou / g;	//注意pIn 的单位是 kPa,所以要乘 1000
		h = Math.min(h,r*2);		
		
		const v1 = (v/2) + (2*hi*Math.PI*(h-r)) * (1-((h-r)*(h-r))/(3*r*r*r));
		const v2 = (h-r)*Math.sqrt(2*h*r-h*h);
		const v3 = r*r*Math.asin((h-r)/r);
		const vh = v1 + l*(v2 + v3);
		const tonne = vh * rou / 1000;
		
		return vh.toFixed(2) + '立方米  ' + tonne.toFixed(2) + '吨';
	},

	//云南氧气厂的计算公式
	'10_0'			: function(kPa) {
		const rou = 1140;
		const g = 9.8;
		const mmWG = kPa * 250 / 2.45;
		let v = 0;
		if( mmWG < 250 ) {
			v = 4.16 / 1000000 * mmWG * mmWG;			
		} else if ( mmWG < 500 ) {
			v = 3.2 / 1000000 * mmWG * mmWG + 0.06;
		} else if ( mmWG < 750) {
			v = 2.18 / 1000000 * mmWG * mmWG + 0.316
		} else if ( mmWG < 5500) {
			v = 2.76 / 1000 * mmWG - 0.53
		} else if ( mmWG < 5750) {
			v = 2.275 / 10000000 * mmWG * mmWG + 7.747;
		} else if ( mmWG < 6000) {
			v = 1.26 / 10000000 * mmWG * mmWG + 11.1;
		} else {
			v = 15.64;
		}
		const tonne = v * rou / 1000;
		return v.toFixed(2) + ' 立方米' + tonne.toFixed(2) + '吨';
	},
	
	'324_0'			: function(kPa) {
		const rou = 1101;		//液态 CO2 密度
		const g = 9.7913;		//成都的g值
		const H = kPa * 1000 / rou / g;	//罐内液位高度,以米为单位
		const DOT_POS = 3;		//输出小数点位数
		
		let v = 0;
		let hIndex = 0;
		
		//h是圆台下面的总高度，hl是本圆台的高度，r1是圆台下半径（短），r2是圆台上半径（长），v是圆台下面总体积
		const CT = [
			{h:0.000000,hl:0.008841,r1:0.000000,r2:0.176817,v:0.000000},
			{h:0.008841,hl:0.028291,r1:0.176817,r2:0.353635,v:0.000289},
			{h:0.037132,hl:0.049509,r1:0.353635,r2:0.530452,v:0.006773},
			{h:0.086641,hl:0.084872,r1:0.530452,r2:0.717269,v:0.037571},
			{h:0.171513,hl:0.060118,r1:0.717269,r2:0.789837,v:0.142121},
			{h:0.231631,hl:0.070727,r1:0.789837,r2:0.860491,v:0.249450},
			{h:0.302358,hl:0.074263,r1:0.860491,r2:0.887623,v:0.400834},
			{h:0.376621,hl:0.098400,r1:0.887623,r2:0.900000,v:0.579087},
		];
		
		//看看高度是落在哪个区间
		for(hIndex=0;hIndex <CT.length;++hIndex) {
			if(H < (CT[hIndex].h + CT[hIndex].hl) ) {
				break;
			}
		}
		
		//如果高度值没有超出下圆弧，使用上述圆弧计算表出结果
		if(hIndex < CT.length) {
			const T = CT[hIndex];	//T 是表格的某个元素
			const r1 = T.r1;		//r1 是圆台下面短半径
			const dh = H - T.h;		//dh 是超出圆台部分的高度
			const r2 = T.r2;		//r2 是圆台上面的长半径
			const Rtop = (dh / T.hl * (r2 - r1)) + r1;	//Rtop 是实时液位处的半径，通过圆台公式计出
			v = T.v + Math.PI * (Rtop*Rtop + r1*r1 + Rtop*r1) * dh / 3;
			
			const tonne = v * rou / 1000;
			return v.toFixed(DOT_POS) + ' 立方米 ' + tonne.toFixed(DOT_POS) + '吨';			
		}
		
		//如果高度值没有超出上圆弧，这是大部分的情况，使用下圆弧总值 + 圆柱体积计算公式出结果
		const H_BOTTOM = 0.475021;		//底下圆弧的高度
		const V_BOTTOM = 0.826057;		//底下圆弧的体积
		if(H < 3.5 + H_BOTTOM) {
			v = V_BOTTOM + Math.PI * 0.9 * 0.9 * (H - H_BOTTOM);
			
			const tonne = v * rou / 1000;
			return v.toFixed(DOT_POS) + ' 立方米 ' + tonne.toFixed(DOT_POS) + '吨';
		}
		
		//顶部封口计算表，注意下面的封口，圆锥是向下的，而上面的封口，圆锥是向上的。
		//h是圆台下面的总高度，hl是本圆台的高度，r1是圆台上半径（短），r2是圆台下半径（长），v是圆台下面总体积
		const CTT = [
			{h:0.000000,hl:0.098400,r1:0.887623,r2:0.900000,v:0.000000},
			{h:0.098400,hl:0.074263,r1:0.860491,r2:0.887623,v:0.246970},
			{h:0.172663,hl:0.070727,r1:0.789837,r2:0.860491,v:0.425223},
			{h:0.243390,hl:0.060118,r1:0.717269,r2:0.789837,v:0.576607},
			{h:0.303508,hl:0.084872,r1:0.530452,r2:0.717269,v:0.683936},
			{h:0.388380,hl:0.049509,r1:0.353635,r2:0.530452,v:0.788486},
			{h:0.437889,hl:0.028291,r1:0.176817,r2:0.353635,v:0.819284},
			{h:0.466180,hl:0.008841,r1:0.000000,r2:0.176817,v:0.825768},
		];
		
		const V_MIDDLE = Math.PI * 0.9 * 0.9 * 3.5;		//中间圆柱部分的体积
		
		const HT = H - 3.5 - H_BOTTOM;	//计出顶部超了多少米
		
		//看看超出的高度是落在哪个区间
		for(hIndex=0;hIndex <CTT.length;++hIndex) {
			if(HT < (CTT[hIndex].h + CTT[hIndex].hl) ) {
				break;
			}
		}
		
		//如果是正常情况
		if(hIndex < CTT.length) {
			const T = CTT[hIndex];	//T 是表格的某个元素
			const r1 = T.r1;		//r1 是圆台下面短半径
			const dh = HT - T.h;		//dh 是超出圆台部分的高度
			const r2 = T.r2;		//r2 是圆台上面的长半径
			const Rtop = r2 - (dh / T.hl * (r2 - r1));	//Rtop 是实时液位处的半径，通过圆台公式计出
			v = V_BOTTOM + V_MIDDLE + T.v + Math.PI * (Rtop*Rtop + r2*r2 + Rtop*r2) * dh / 3;
			
			const tonne = v * rou / 1000;
			return v.toFixed(DOT_POS) + ' 立方米 ' + tonne.toFixed(DOT_POS) + '吨';
		}
		
		//到达最后，最极端的情况，压力值超出范围，直接返回最大值。
		v = 10.56;
		const tonne = v * rou / 1000;
		return v.toFixed(DOT_POS) + ' 立方米 ' + tonne.toFixed(DOT_POS) + '吨';
	},
	
	'325_0' : function(kPa) {
		const rou = 1410;		//液态 CO2 密度
		const g = 9.7913;		//成都的g值
		const H = kPa * 1000 / rou / g;	//罐内液位高度,以米为单位
		const DOT_POS = 3;		//输出小数点位数
		const R = 1.9 / 2;
		const H_MIDDLE = 6.75;
		
		let v = 0;
		let hIndex = 0;
		
		//h是圆台下面的总高度，hl是本圆台的高度，r1是圆台下半径（短），r2是圆台上半径（长），v是圆台下面总体积
		const CT = [
			{h:0.000000,hl:0.010468,r1:0.000000,r2:0.197590,v:0.000000},
			{h:0.010468,hl:0.043182,r1:0.197590,r2:0.434435,v:0.000428},
			{h:0.053650,hl:0.066736,r1:0.434435,r2:0.632025,v:0.014610},
			{h:0.120386,hl:0.075895,r1:0.632025,r2:0.769421,v:0.074904},
			{h:0.196281,hl:0.079821,r1:0.769421,r2:0.864945,v:0.192352},
			{h:0.276102,hl:0.069353,r1:0.864945,r2:0.915978,v:0.360001},
			{h:0.345455,hl:0.073278,r1:0.915978,r2:0.946074,v:0.532808},
			{h:0.418733,hl:0.081129,r1:0.946074,r2:0.950000,v:0.732374},
		];
		
		//看看高度是落在哪个区间
		for(hIndex=0;hIndex <CT.length;++hIndex) {
			if(H < (CT[hIndex].h + CT[hIndex].hl) ) {
				break;
			}
		}
		
		//如果高度值没有超出下圆弧，使用上述圆弧计算表出结果
		if(hIndex < CT.length) {
			const T = CT[hIndex];	//T 是表格的某个元素
			const r1 = T.r1;		//r1 是圆台下面短半径
			const dh = H - T.h;		//dh 是超出圆台部分的高度
			const r2 = T.r2;		//r2 是圆台上面的长半径
			const Rtop = (dh / T.hl * (r2 - r1)) + r1;	//Rtop 是实时液位处的半径，通过圆台公式计出
			v = T.v + Math.PI * (Rtop*Rtop + r1*r1 + Rtop*r1) * dh / 3;
			
			const tonne = v * rou / 1000;
			return v.toFixed(DOT_POS) + ' 立方米 ' + tonne.toFixed(DOT_POS) + '吨';			
		}
		
		//如果高度值没有超出上圆弧，这是大部分的情况，使用下圆弧总值 + 圆柱体积计算公式出结果
		const H_BOTTOM = 0.499862;		//底下圆弧的高度
		const V_BOTTOM = 0.961450;		//底下圆弧的体积
		if(H < H_MIDDLE + H_BOTTOM) {
			v = V_BOTTOM + Math.PI * R * R * (H - H_BOTTOM);
			
			const tonne = v * rou / 1000;
			return v.toFixed(DOT_POS) + ' 立方米 ' + tonne.toFixed(DOT_POS) + '吨';
		}
		
		//顶部封口计算表，注意下面的封口，圆锥是向下的，而上面的封口，圆锥是向上的。
		//h是圆台下面的总高度，hl是本圆台的高度，r1是圆台上半径（短），r2是圆台下半径（长），v是圆台下面总体积
		const CTT = [
			{h:0.000000,hl:0.081129,r1:0.946074,r2:0.950000,v:0.000000},
			{h:0.081129,hl:0.073278,r1:0.915978,r2:0.946074,v:0.229076},
			{h:0.154408,hl:0.069353,r1:0.864945,r2:0.915978,v:0.428642},
			{h:0.223760,hl:0.079821,r1:0.769421,r2:0.864945,v:0.601449},
			{h:0.303581,hl:0.075895,r1:0.632025,r2:0.769421,v:0.769098},
			{h:0.379477,hl:0.066736,r1:0.434435,r2:0.632025,v:0.886546},
			{h:0.446212,hl:0.043182,r1:0.197590,r2:0.434435,v:0.946841},
			{h:0.489394,hl:0.010468,r1:0.000000,r2:0.197590,v:0.961022},
		];
		
		const V_MIDDLE = Math.PI * R * R * H_MIDDLE;		//中间圆柱部分的体积
		
		const HT = H - H_MIDDLE - H_BOTTOM;	//计出顶部超了多少米
		
		//看看超出的高度是落在哪个区间
		for(hIndex=0;hIndex <CTT.length;++hIndex) {
			if(HT < (CTT[hIndex].h + CTT[hIndex].hl) ) {
				break;
			}
		}
		
		//如果是正常情况
		if(hIndex < CTT.length) {
			const T = CTT[hIndex];	//T 是表格的某个元素
			const r1 = T.r1;		//r1 是圆台下面短半径
			const dh = HT - T.h;		//dh 是超出圆台部分的高度
			const r2 = T.r2;		//r2 是圆台上面的长半径
			const Rtop = r2 - (dh / T.hl * (r2 - r1));	//Rtop 是实时液位处的半径，通过圆台公式计出
			v = V_BOTTOM + V_MIDDLE + T.v + Math.PI * (Rtop*Rtop + r2*r2 + Rtop*r2) * dh / 3;
			
			const tonne = v * rou / 1000;
			return v.toFixed(DOT_POS) + ' 立方米 ' + tonne.toFixed(DOT_POS) + '吨';
		}
		
		//到达最后，最极端的情况，压力值超出范围，直接返回最大值。
		v = 21.055;
		const tonne = v * rou / 1000;
		return v.toFixed(DOT_POS) + ' 立方米 ' + tonne.toFixed(DOT_POS) + '吨';
	},

};

