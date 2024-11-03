/**
 * SIM 卡 API 深圳中创物联网
 *  
 */

const D_NAME = "zy.zyllz.com";

//这个是我的
const APP_KEY = '4ddc30fd2b3a175e12661936d1652e08';
const APP_ID = 'zx20211020164427';

//这个是测试的
//const APP_KEY = 'a03a5f5d8fed0e6a650264b483a7efad';
//const APP_ID = 'zx20181129155010';


function setupJsonString(json)
{
	let keys = [];
	for(let key in json){
	    //console.log(key,json[key]);
	    keys.push(key);
	}
	keys.sort();
	let stringConcat = APP_KEY;
	for(key of keys) {
		stringConcat += key;
		stringConcat += json[key];
	}
	stringConcat += APP_KEY;
	//console.log(stringConcat);
	
	return hex_sha1(stringConcat);
}

//SimApiZC.queryCardStatus('89860433192070102989');

var SimApiZC = {
	queryCardStatus(iccid)
	{
		let timestamp = new Date().getTime();
		let dataSend = {
				appId:APP_ID,
				iccid:iccid,
				timestamp:timestamp,
				v:'2.0',			
			};
		let signString = setupJsonString(dataSend);
		dataSend['sign'] = signString;
		
		jQuery.ajax({
			type:'POST',
			url:`http://`+D_NAME+`:8898/iot/api/queryCardStatus`,
			data:dataSend,
			success:function(res) {
				console.log(res);
			},
			error:function(res) {
				console.log(res);
			}
		});
	},
}



