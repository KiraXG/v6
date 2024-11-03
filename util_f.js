/**
 *
 */

//实现 format("%02d",n) 的功能
const formatNumber = (n) => {
    n = n.toString();
    return n[1] ? n : "0" + n;
};

// 把 js Date 放到数组中,后续其他函数要用这个小功能
const dateToArray = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day, hour, minute, second];
};

//时间变量以小时向后取整
//举例：23:05 -> 24:00
function dateUpToHour(date) {
    let dateUp = new Date(date.getTime());
    dateUp.setMinutes(0);
    dateUp.setSeconds(0);
    let ms = dateUp.getTime();
    ms += 1000 * 60 * 60;
    return new Date(ms);
}

function dateDownToHour(date) {
    let dateUp = new Date(date.getTime());
    dateUp.setMinutes(0);
    dateUp.setSeconds(0);
    return dateUp;
}

//时间变量以日为单位取整
//举例:22:03 -> 24:00
function dateUpTo24Hour(date) {
    //	let dateUp = new Date(date.getTime());
    //	dateUp.setHours(0);
    //	dateUp.setMinutes(0);
    //	dateUp.setSeconds(0);
    //	let ms = dateUp.getTime();
    //	ms += (1000 * 60 * 60 * 24);
    //	return new Date(ms);

    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    return date;
}

function dateDownTo00Hour(date) {
    //let dateUp = new Date(date.getTime());
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
}

// mysql 的字符日期格式转 js Date 日期数据格式
const mySqlDateToDate = (mySqlDate) => {
    var date = new Date();
    var year = mySqlDate.substring(0, 4);
    var month = mySqlDate.substring(5, 7);
    var day = mySqlDate.substring(8, 10);
    var hour = mySqlDate.substring(11, 13);
    var minute = mySqlDate.substring(14, 16);
    var second = mySqlDate.substring(17, 19);
    //console.log([mySqlDate,year,month,day,hour,minute,second]);
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);
    return date;
};

// js Date 日期转 mysql 日期字符串
const dateToMySqlDate = (dateJS) => {
    var dateArr = dateToArray(dateJS);
    return dateArr.slice(0, 3).map(formatNumber).join("-") + " " + dateArr.slice(3, 6).map(formatNumber).join(":");
};

//数值单位对照表
const UNIT_TABLE_ZHANG = [
    { type: "0", name: "kPa", desc: "压力", coef: 1.0 },
    { type: "1", name: "MPa", desc: "压力", coef: 0.001 },
    { type: "2", name: "Pa", desc: "压力", coef: 1000.0 },
    { type: "3", name: "mmH2O", desc: "压力", coef: 101.971621 },
    { type: "4", name: "mH2O", desc: "压力", coef: 0.101971621 },
    { type: "5", name: "mbar", desc: "压力", coef: 10.0 },
    { type: "6", name: "bar", desc: "压力", coef: 0.01 },
    { type: "7", name: "psi", desc: "压力", coef: 0.145038 },
    { type: "8", name: "atm", desc: "压力", coef: 0.009869 },
    { type: "9", name: "Torr", desc: "压力", coef: 7.500615 },

    { type: "10", name: "kg/cm2", desc: "压力", coef: 0.010197 },

    { type: "11", name: "mHg", desc: "压力", coef: 0.007500615 },
    { type: "12", name: "mmHg", desc: "压力", coef: 7.500615 },
    { type: "13", name: "inHg", desc: "压力", coef: 0.2953 },
    { type: "14", name: "inH2O", desc: "压力", coef: 4.014631 },
    { type: "15", name: "ftH2O", desc: "压力", coef: 1.0 },

    { type: "16", name: "mm", desc: "长度", coef: 1.0 },
    { type: "17", name: "cm", desc: "长度", coef: 1.0 },
    { type: "18", name: "m", desc: "长度", coef: 1.0 },

    { type: "19", name: "mA", desc: "电流", coef: 1.0 },
    { type: "20", name: "%", desc: "百分比", coef: 1.0 },
    { type: "21", name: "", desc: "自定义名称", coef: 1.0 },

    { type: "22", name: "℃", desc: "温度", coef: 1.0 },
];

//黄熙使用的数值单位对照表,2022-02-24 确认过
const UNIT_TABLE = [
    { type: "0", name: "kPa", desc: "压力", coef: 1.0 },
    { type: "1", name: "MPa", desc: "压力", coef: 0.001 },
    { type: "2", name: "mA", desc: "电流", coef: 1.0 },
    { type: "3", name: "%", desc: "百分比", coef: 1.0 },
    { type: "4", name: "inH2O", desc: "压力", coef: 4.014631 },
    { type: "5", name: "ftH2O", desc: "压力", coef: 1.0 },
    { type: "6", name: "mmH2O", desc: "压力", coef: 101.971621 },
    { type: "7", name: "mmHg", desc: "压力", coef: 7.500615 },
    { type: "8", name: "psi", desc: "压力", coef: 0.145038 },
    { type: "9", name: "bar", desc: "压力", coef: 0.01 },
    { type: "10", name: "mbar", desc: "压力", coef: 10.0 },
    { type: "11", name: "kg/cm2", desc: "压力", coef: 0.010197 },
    { type: "12", name: "Pa", desc: "压力", coef: 1000.0 },
    { type: "13", name: "Torr", desc: "压力", coef: 7.500615 },
    { type: "14", name: "ATM", desc: "压力", coef: 0.009869 },
    { type: "15", name: "", desc: "没有", coef: 1.0 },
    { type: "16", name: "m", desc: "长度", coef: 1.0 },
    { type: "17", name: "cm", desc: "长度", coef: 1.0 },
    { type: "18", name: "mm", desc: "长度", coef: 1.0 },
    { type: "19", name: "inHg", desc: "压力", coef: 0.2953 },
    { type: "20", name: "mHg", desc: "压力", coef: 0.007500615 },
    { type: "21", name: "mH2O", desc: "压力", coef: 0.101971621 },
    { type: "22", name: "℃", desc: "温度", coef: 1.0 },
    { type: "23", name: "ppm", desc: "湿度", coef: 1.0 },
    { type: "24", name: "Nm3/h", desc: "流量", coef: 1.0 },
    { type: "25", name: "Nm3", desc: "流量", coef: 1.0 },
    { type: "26", name: "mg/m³", desc: "密度", coef: 1.0 },
    { type: "27", name: "t/h", desc: "流量", coef: 1.0 },
    { type: "28", name: "t", desc: "流量", coef: 1.0 },
    { type: "29", name: "m³/h", desc: "流量", coef: 1.0 },
    { type: "30", name: "m³", desc: "流量", coef: 1.0 },
    { type: "31", name: "L/g", desc: "密度", coef: 1.0 },
    { type: "32", name: "L", desc: "密度", coef: 1.0 },
    { type: "33", name: "", desc: "", coef: 1.0 },
    { type: "34", name: "g/m3", desc: "密度", coef: 1.0 },
    { type: "35", name: "g/kg", desc: "密度", coef: 1.0 },
    { type: "36", name: "kj/kg", desc: "热量", coef: 1.0 },
    { type: "37", name: "kg/m³", desc: "密度", coef: 1.0 },
];

//=========================================公共函数
//仪表的单位代码转换成单位名称,用于显示
function unitCodeToName(code) {
    for (let elem of UNIT_TABLE) {
        //console.log(elem);
        //console.log([elem.type,code]);
        if (elem.type == code) {
            return elem.name;
        }
    }
    return "";
}

//仪表的单位代码转换成单位描述,用于显示
function unitCodeToDesc(code) {
    for (let elem of UNIT_TABLE) {
        if (elem.type == code) {
            return elem.desc;
        }
    }
}

// 注意,腾讯的转换函数对于坐标字符串,只能处理1000个字符以内
// 对于超出1000字符的,需要截断成N个字符串数组.再写一个递归,逐次转换直到最终完成后再执行 xyHandler
// 该递归在出货后再补写,目前先使用旧方案,处理的点数不可以太多,太多则转换不了.
function tmapXYConvertor(lbsList, xyHandler) {
    let ptList = "";
    for (let lbs of lbsList) {
        ptList = ptList + lbs.lat + "," + lbs.lon + ";";
    }
    ptList = ptList.substr(0, ptList.length - 2);

    //console.log('坐标字符串是:' + ptList);
    //console.log('坐标字符串长度是' + ptList.length);

    //ptList = lbsList[0].lat + "," + lbsList[0].lon;

    jQuery.ajax({
        type: "GET",
        //url:'https://apis.map.qq.com/ws/coord/v1/translate?locations=39.12,116.83;30.21,115.43&type=3&key=' + Consts.TXAPI_KEY,
        url: "https://apis.map.qq.com/ws/coord/v1/translate",
        data: {
            locations: ptList,
            type: 1,
            key: Consts.TXAPI_KEY,
            output: "jsonp",
        },
        dataType: "jsonp",
        //    	beforeSend:function(xhr){
        //    		xhr.setRequestHeader('Access-Control-Allow-Origin','*');
        //    	},
        success(res) {
            //console.log(res);
            if (0 == res.status) {
                if (null != xyHandler) {
                    xyHandler(res.locations);
                }
            } else {
                console.log("tmap xy convert result failed,返回的对象是:");
                console.log(res);
                console.log("坐标字符串是:" + ptList);
            }
        },
        error(res) {
            console.log("tmap xy convert error!");
            console.log(res);
        },
    });
}

//腾讯XY坐标转换的扩展函数，可以实现任意个数的坐标数组进行转换
function tmapXYConvertorEx(lbsList, xyHandler) {
    if (null == lbsList) {
        return;
    }
    if (0 == lbsList.length) {
        return;
    }

    //每一组数据大约不会超过20个字符，腾讯地图坐标转换有1000个字符的限制
    //所以需要每50个数据作为一组地处理，算出要分多少个组
    let sliceCount = Math.ceil(lbsList.length / 50);
    //console.log("lbslist slicecount =" + sliceCount);

    let convertorComplete = new Array(sliceCount); //每一组的转换成功标志
    let lbsSubList = new Array(sliceCount); //每50个数据为一个元素，放到lbsSubList中
    let locations = [];

    //初始化上述2个变量，注意最后一组的数量不一定是50，需要额外处理
    let i = 0;
    for (; i < sliceCount - 1; ++i) {
        convertorComplete[i] = 0;
        lbsSubList[i] = lbsList.slice(i * 50, (i + 1) * 50);
    }
    lbsSubList[i] = lbsList.slice(i * 50, i * 50 + (lbsList.length % 50));

    for (sIndex in lbsSubList) {
        let ptList = "";
        for (let lbs of lbsSubList[sIndex]) {
            ptList = ptList + lbs.lat + "," + lbs.lon + ";";
        }
        ptList = ptList.substr(0, ptList.length - 2);

        const cIndex = sIndex;

        jQuery.ajax({
            type: "GET",
            //url:'https://apis.map.qq.com/ws/coord/v1/translate?locations=39.12,116.83;30.21,115.43&type=3&key=' + Consts.TXAPI_KEY,
            url: "https://apis.map.qq.com/ws/coord/v1/translate",
            data: {
                locations: ptList,
                type: 1, //类型试过，1与2是一样的，3，4都偏离太多，6直接就去了非洲
                key: Consts.TXAPI_KEY,
                output: "jsonp",
            },
            dataType: "jsonp",
            //    	beforeSend:function(xhr){
            //    		xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            //    	},
            success(res) {
                //console.log(res);

                if (0 == res.status) {
                    locations.push(...res.locations);
                } else {
                    console.log("tmap xy convert result failed,返回的对象是:");
                    console.log(res);
                    console.log("坐标字符串是:" + ptList);
                }
            },
            error(res) {
                console.log("tmap xy convert error!");
                console.log(res);
            },
            complete(res) {
                convertorComplete[cIndex] = 1; //不管成功还是失败，结束后就登记下来
            },
        });
    }

    //let idTimer = 0;		//定时器的ID

    const idTimer = setInterval(function () {
        //console.log("timer check convert complete");
        for (complete of convertorComplete) {
            if (0 == complete) {
                return;
            }
        }
        //console.log("delete timer id=" + idTimer);
        clearInterval(idTimer);
        if (null != xyHandler) {
            xyHandler(locations);
        }
    }, 1000);
    //console.log("临时定时器，id=" + idTimer);
}

//包含了全部的压力单位
const PRESSURE_UNITS = ["0", "1", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "19", "20", "21"];
//常用的压力单位
const SIMPLE_PRESSURE_UNITS = ["0", "1", "6", "7", "8", "9", "10", "14"];

const TEMPE_UNITS = ["22"];

function getUnitType(type) {
    if (-1 != PRESSURE_UNITS.indexOf(type)) {
        return "press";
    }
    if (22 == type) {
        return "tempe";
    }
    return "";
}

var UnitTransfer = {
    isPressureUnit: function (type) {
        const index = PRESSURE_UNITS.indexOf(type);
        return -1 != index;
    },

    //把数据从 unit 转换到 displayUnit 值
    //举例:data = 1000 , unit = kPa , displayUnit = MPa
    //返回值就是 1 ,因为 1000kPa = 1MPa
    transferToUnit: function (data, unit, displayUnit) {
        if (unit > 22) {
            unit = 23;
        }
        if (displayUnit > 22) {
            displayUnit = 23;
        }
        const coef1 = UNIT_TABLE[unit].coef;
        const coef2 = UNIT_TABLE[displayUnit].coef;
        if (0 == coef1 || 0 == coef2) {
            return 0;
        }
        const value = parseFloat(data);
        return (value / coef1) * coef2;
    },
};

function parsenTabCellStyle() {
    //return  {background:'#85bffb',color:'#000000'};
    return { background: "#2E62CD", color: "#FFFF9E" };

    //return  {background:PsColor.PS_BLUE,color:'#EFE24A'};
}

var MessageBox = {
    info(message) {
        alert(message);
    },
    warning(message) {
        alert(message);
    },
    error(message) {
        alert(message);
    },
};

var TreeTraverse = {
    handleAllNodes(tree, handler) {
        if (null != handler) {
            handler(tree);
        }
        if (null != tree.children) {
            for (let child of tree.children) {
                this.handleAllNodes(child, handler);
            }
        }
    },
};

var ProjectTreeHandler = {
    handleRenderContent(h, { node, data, store }) {
        if ("p" == data.type) {
            return h("span", [
                h("i", { attrs: { class: "el-icon-house" } }),
                h("span", { style: { color: PsColor.PS_PROJECT_ICON } }, data.project_name),
            ]);
        }

        if ("n" == data.type) {
            return h(
                "span",
                {
                    style: { color: PsColor.PS_YIBIAO_ICON },
                    attrs: { class: "el-icon-s-grid" },
                },
                data.node_name
            );
        }
    },
};

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}
