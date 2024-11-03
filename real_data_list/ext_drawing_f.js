/**
 * 
 */





const DRAW_DATA_OBJECT = {
	drawDataWoGuan:	//卧罐
	{
		imgSrc		: 'wo_guan.png',
		rect		: {
			l:105,r:285,t:308,b:442,
		},
	},

	drawDataLiGuan:	//立罐
	{
		imgSrc		: 'li_guan.png',
		rect		: {
			l:44,r:196,t:166,b:353,
		},
	}
};

var DrawFunc = {
	kPaToMeter(kPa,rou,g) {
		return kPa * 1000 / rou / g;
	},

	kPaToMmh2o : function(kPa) {
		return kPa * 101.971621;	//101.9716 是 kPa 与 mmH2O 的转换系数
	},

	//立方米转吨
	m3ToTonne(vh,rou) {			
		const tonne = vh * rou / 1000;
		return tonne;
	},


	hToVolumeQueShanLNG(h) {
		const hi = 0.325;		//罐体椭圆厚度
		const l = 12.48;		//罐体圆柱长
		const r = 1.2;			//罐体半径
		const v = 60;			//罐体总体积 m3

		const v1 = (v/2) + (2*hi*Math.PI*(h-r)) * (1-((h-r)*(h-r))/(3*r*r*r));
		const v2 = (h-r)*Math.sqrt(2*h*r-h*h);
		const v3 = r*r*Math.asin((h-r)/r);
		const vh = v1 + l*(v2 + v3);

		return vh;
	},

	hToVolumeWenShanO2(h) {		 
		const rou = 1140;
		const g = 9.8;
		const kPa = rou * g * h / 1000;
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
		return v;
	},

	drawYunNanLiGuan : function(drawObj,kPa,MPa,tempe,rou,g) {
		//console.log('drawCanvas dataInfos = ...');
		//console.log(dataInfos);
		let domCanvas = document.getElementById("cav_guan");			
		let ctx = domCanvas.getContext("2d");
		let img = new Image();
		img.src = drawObj.imgSrc;//"wo_guan.png";
		const rect = drawObj.rect;

		var that = this; 

		img.onload = function(){
			ctx.drawImage(img,0,0,domCanvas.width,domCanvas.height);

			let points = [
				{x:rect.l,y:rect.t},
				{x:rect.r,y:rect.t},
				{x:rect.r,y:rect.b},
				{x:rect.l,y:rect.b},
			];

			for(let point of points) {
				point.x = point.x * domCanvas.width / img.width;
				point.y = point.y * domCanvas.height / img.height;
			}

			let lg=ctx.createLinearGradient(
				(points[0].x+points[1].x)/2,
				(points[0].y+points[1].y)/2,
				(points[2].x+points[3].x)/2,
				(points[2].y+points[3].y)/2);

			lg.addColorStop(0,'red');
			lg.addColorStop(0.5,PsColor.PS_PIN);    
			lg.addColorStop(1,PsColor.PS_GREEN);

			const dY = points[3].y - points[0].y;

			//const h = drawObj.getHeight(that.lastSelectedNode.D1);

			//const newY = points[3].y - (dY * h / drawObj.maxH);

			let gaodu = DrawFunc.kPaToMeter(kPa,rou,g);
			gaodu = Math.max(gaodu,0);
			gaodu = Math.min(gaodu,5.263);

			const newY = points[3].y - (dY * gaodu / 5.263);
			
			points[0].y = newY;
			points[1].y = newY;

			//ctx.fillStyle = 'grey';
			//ctx.fillRect(rect.l,rect.t,rect.r-rect.l,rect.b-rect.t);
			//ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(points[3].x,points[3].y);
			for(let point of points) {
				ctx.lineTo(point.x,point.y);
			}
			ctx.closePath();
			//ctx.fillStyle = '#FF0000';
			ctx.fillStyle = lg;
			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = 'black';
			ctx.font = '24px Times New Roman';
			// const mmH2O = DrawFunc.kPaToMmh2o(kPa).toFixed(2);
			// ctx.fillText(mmH2O + ' mmH2O',30,30);
			
			// ctx.fillText(gaodu.toFixed(2) + ' 米',30,100);

			const textX = 230;

			ctx.fillText(kPa + 'kPa',textX,30);

			//const ap = (MPa / 1000).toFixed(2);
			//ctx.fillText(ap + ' MPa',textX,100);
			ctx.fillText(MPa + ' MPa',textX,100);
			
			const volume = DrawFunc.hToVolumeWenShanO2(gaodu).toFixed(2);
			ctx.fillText(volume + ' m³',textX,170);

			ctx.fillText(tempe + ' ℃',textX,240);
		};
	},

	drawCanvas : function(drawObj,kPa,MPa,tempe,rou,g) {
		//console.log('drawCanvas dataInfos = ...');
		//console.log(dataInfos);
		let domCanvas = document.getElementById("cav_guan");			
		let ctx = domCanvas.getContext("2d");
		let img = new Image();
		img.src = drawObj.imgSrc;//"wo_guan.png";
		const rect = drawObj.rect;

		var that = this; 

		img.onload = function(){
			ctx.drawImage(img,0,0,domCanvas.width,domCanvas.height);

			let points = [
				{x:rect.l,y:rect.t},
				{x:rect.r,y:rect.t},
				{x:rect.r,y:rect.b},
				{x:rect.l,y:rect.b},
			];

			for(let point of points) {
				point.x = point.x * domCanvas.width / img.width;
				point.y = point.y * domCanvas.height / img.height;
			}

			let lg=ctx.createLinearGradient(
				(points[0].x+points[1].x)/2,
				(points[0].y+points[1].y)/2,
				(points[2].x+points[3].x)/2,
				(points[2].y+points[3].y)/2);

			lg.addColorStop(0,'red');
			lg.addColorStop(0.5,PsColor.PS_PIN);    
			lg.addColorStop(1,PsColor.PS_GREEN);

			const dY = points[3].y - points[0].y;

			//const h = drawObj.getHeight(that.lastSelectedNode.D1);

			//const newY = points[3].y - (dY * h / drawObj.maxH);

			let gaodu = DrawFunc.kPaToMeter(kPa,rou,g);
			gaodu = Math.max(gaodu,0);
			gaodu = Math.min(gaodu,2.4);

			const newY = points[3].y - (dY * gaodu / 2.4);
			
			points[0].y = newY;
			points[1].y = newY;

			//ctx.fillStyle = 'grey';
			//ctx.fillRect(rect.l,rect.t,rect.r-rect.l,rect.b-rect.t);
			//ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(points[3].x,points[3].y);
			for(let point of points) {
				ctx.lineTo(point.x,point.y);
			}
			ctx.closePath();
			//ctx.fillStyle = '#FF0000';
			ctx.fillStyle = lg;
			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = 'black';
			ctx.font = '24px Times New Roman';
			const mmH2O = DrawFunc.kPaToMmh2o(kPa).toFixed(2);
			ctx.fillText(mmH2O + ' mmH2O',30,30);
			
			ctx.fillText(gaodu.toFixed(2) + ' 米',30,100);

			const ap = (MPa / 1000).toFixed(2);
			ctx.fillText(ap + ' MPa',30,170);
			
			const volume = DrawFunc.hToVolumeQueShanLNG(gaodu).toFixed(2);
			ctx.fillText(volume + ' m³',200,30);

			const weight = DrawFunc.m3ToTonne(volume,rou).toFixed(2);
			ctx.fillText(weight + ' 吨',200,100);

			ctx.fillText(tempe + ' ℃',200,170);
		};
	},//end of drawCanvas
}

 //每个仪表有一个总开关,是否需要画图
var ExtGraphDrawing = {
	'10'	: {
		direction : 'v',		//立罐
		rou : 1140,
		g : 9.8,
		drawData : DRAW_DATA_OBJECT.drawDataLiGuan,
		drawFunc : DrawFunc.drawYunNanLiGuan,

	},

	'55'	: {
		direction : 'h',		//h 是卧罐, v是立罐

		minKpa : 0,
		maxKpa : 15,
		splitKpa : 5,		//刻度分隔
		colorKpa : PsColor.PS_BLUE,
		titleKpa : '液位差压',
		formatterKpa : function (value) {
			return value.toFixed(2) + ' kPa';
		},

		minH : 0,
		maxH : 2.4,				//单位是米
		splitH : 3,			//刻度分隔
		colorH : PsColor.PS_YELLOW,
		titleH : '液位高度',

		minV : 0,
		maxV : 60,
		splitV : 6,
		colorV : PsColor.PS_GREEN,
		titleV : '体积',
		formatterV : function (value) {
			return value.toFixed(2) + ' 立方米';
		},

		minT : 0,
		maxT : function() {
		 	return this.maxV * this.rou / 1000;
		},
		
		splitT : 6,
		colorT : PsColor.PS_PIN,
		titleT : '重量',
		formatterT : function(value) {
			return value.toFixed(2) + ' 吨';
		},

		rou : 426,
		g : 9.8,

		drawData : DRAW_DATA_OBJECT.drawDataWoGuan,
		drawFunc : DrawFunc.drawCanvas,

		maxKpaToMaxHeight : function(kPa) {
			return kPa * 1000 / this.rou / this.g;	//注意pIn 的单位是 kPa,所以要乘 1000			 
		},

		//高度转体积
		getVolume : function (h) {
			const hi = this.lAside;		//罐体椭圆厚度
			const l = this.length;		//罐体圆柱长
			const r = this.radius;			//罐体半径
			const v = this.maxV;			//罐体总体积 m3

			const v1 = (v/2) + (2*hi*Math.PI*(h-r)) * (1-((h-r)*(h-r))/(3*r*r*r));
			const v2 = (h-r)*Math.sqrt(2*h*r-h*h);
			const v3 = r*r*Math.asin((h-r)/r);
			const vh = v1 + l*(v2 + v3);

			return vh;
		},

		kPaToVolume : function(kPa) {
			const hi = 0.325;		//罐体椭圆厚度
			const l = 12.48;		//罐体圆柱长
			const r = 1.2;			//罐体半径
			const v = 60;			//罐体总体积 m3
			//以上是罐体常数
			
			kPa = Math.max(kPa,0);	//负压力先变0,因为高度不可以算出来是负数
			
			let h = kPa * 1000 / this.rou / this.g;	//注意pIn 的单位是 kPa,所以要乘 1000
			h = Math.min(h,r*2);
			
			
			const v1 = (v/2) + (2*hi*Math.PI*(h-r)) * (1-((h-r)*(h-r))/(3*r*r*r));
			const v2 = (h-r)*Math.sqrt(2*h*r-h*h);
			const v3 = r*r*Math.asin((h-r)/r);
			const vh = v1 + l*(v2 + v3);
			return vh;
		},

		getHeight : function (kPa) {			
			kPa = Math.max(kPa,0);	//负压力先变0,因为高度不可以算出来是负数
			let h = kPa * 1000 / this.rou / this.g;	//注意pIn 的单位是 kPa,所以要乘 1000
			h = Math.min(h,this.maxH);
			return h;
		},

		getVolume : function (h) {
			const hi = 0.325;		//罐体椭圆厚度
			const l = 12.48;		//罐体圆柱长
			const r = 1.2;			//罐体半径
			const v = 60;			//罐体总体积 m3

			const v1 = (v/2) + (2*hi*Math.PI*(h-r)) * (1-((h-r)*(h-r))/(3*r*r*r));
			const v2 = (h-r)*Math.sqrt(2*h*r-h*h);
			const v3 = r*r*Math.asin((h-r)/r);
			const vh = v1 + l*(v2 + v3);

			return vh;
		},

		getTonne : function(vh) {
			const rou = 426;
			const tonne = vh * rou / 1000;
			return tonne;
		}
	},






	'56': {
		direction : 'h',		//h 是卧罐, v是立罐

		minH		: 0,
		maxH		: 2.4,		//单位是米

		minV		: 0,
		maxV		: 60,

		radius		: 1.2,		//罐体半径	

		rou			: 426,		//质量密度
		g			: 9.8,		//当地重力加速度

		lAside		: 0.325,	//卧罐的椭圆厚度
		length		: 12.48,	//卧罐的长度

		drawData : DRAW_DATA_OBJECT.drawDataWoGuan,
		drawFunc : DrawFunc.drawCanvas,

		maxKpaToMaxHeight : function(kPa) {
			return kPa * 1000 / this.rou / this.g;	//注意pIn 的单位是 kPa,所以要乘 1000			 
		},

		// kPa 值转体积
		kPaToVolume : function(kPa) {
			const r = this.radius;
			const l = this.length;

			kPa = Math.max(kPa,0);	//负压力先变0,因为高度不可以算出来是负数
			
			let h = kPa * 1000 / this.rou / this.g;	//注意pIn 的单位是 kPa,所以要乘 1000
			h = Math.min(h,this.maxH);	//高度不可以大于最大高度			
			
			const v1 = (v/2) + (2*hi*Math.PI*(h-r)) * (1-((h-r)*(h-r))/(3*r*r*r));
			const v2 = (h-r)*Math.sqrt(2*h*r-h*h);
			const v3 = r*r*Math.asin((h-r)/r);
			const vh = v1 + l*(v2 + v3);
			return vh;
		},



		//立方米转吨
		m3ToTonne : function(vh) {			
			const tonne = vh * this.rou / 1000;
			return tonne;
		},


	},
}