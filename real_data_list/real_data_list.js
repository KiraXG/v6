/**
 *
 */
const CHART_COLOR = {
    ALARMCOLOR: "rgb(238,121,89)",
    NORMALCOLOR: "rgb(176,213,223)",
    TIPCOLOR: "rgb(30,39,50)",
    SHADOWCOLOR: "#cdcccc",
};

var Main = {
    data: function () {
        let myData = {
            loading: true,

            //========================================左则工程树
            filterCompanyText: "",
            companyTreeData: [
                //树数据源
                //				{id:1,label:'一1',icon:'el-icon-eleme',children:[
                //					{id:11,label:'一11',icon:'el-icon-delete'},
                //					{id:12,label:'一12',icon:'el-icon-eleme'},
                //				]},
                //				{id:2,label:'一2',},
            ],

            //=======================================右则仪表列表
            manageCompany: false, //用户是否拥有管理公司的权限

            filterNodeText: "", //刷选公司与工程的文字
            nodeTableData: [
                //仪表列表的数据源
            ],

            nodeList: [], //读取到的仪表数据总表
            nodeFilteredList: [], //刷选后的仪表数据表

            pageItemCount: 8, //每页有多少个元素

            pageCount: 0, //总页数,数值是页数 * 10
            pageIndex: 0, //当前页
            //因为在读入当前页时整个表格还未出来,所以分2步,先读,处理完数据后再设置 currentPage 更新显示
            currentPage: 0, //与控件绑定的当前页变量

            tableStyle: {}, //仪表列表的 style

            webSocketGetProjectsNodes: null, //获取所有工程的仪表内容
            webSocketReflashNodeDataListener: null, //实时刷新仪表内容，由服务器主动向网页通讯

            sortColumn: null, //对仪表列表进行排序

            //=======================================数据详图
            bm: null, //百度地图
            tmap: null, //腾讯地图
            lastSelectedNodeIndex: -1, //记录正在处理的仪表的下标
            lastSelectedNode: {}, //记录正在处理的仪表
            dialogGraphVisible: false, //窗口是否显示
            //bdpoint:null,
            //lat:0,
            //lon:0,

            crConnecting: PsColor.PS_PIN, //连接状态的颜色，默认离线的红色
            textConnecting: "离线", //连接状态的文字，默认离线
            paramColors: [], //['#409EFF','#67C23A','#E6A23C','#F56C6C'],		//各个参量的不同颜色，准备删除

            selectStartEndTime: false, //是否已经选择好起止日期

            startTimePickerOptions: {
                //开始日期设置项
                shortcuts: [
                    {
                        text: "昨天",
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit("pick", date);
                        },
                    },
                    {
                        text: "三天前",
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
                            picker.$emit("pick", date);
                        },
                    },
                    {
                        text: "七天前",
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", date);
                        },
                    },
                ],
            },

            endTimePickerOptions: {
                //结束日期设置项
                shortcuts: [
                    {
                        text: "今天",
                        onClick(picker) {
                            const date = new Date();
                            //date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit("pick", date);
                        },
                    },
                ],
            },

            yibiaoDatas: [], //仪表数据列表
            startTime: null,
            endTime: null,

            isExtGraphDisplay: false,
            echartsInstance: [null, null, null, null],
            echartsInstanceVol: null,
            echartKpaInstance: null,
            echartVInstance: null,

            //===========================================报警相关
            dialogAlarmListVisible: false,
            nodeAlarmList: [
                { DATE: "2021-08-01 01:23:45", ha: ["1", "1", "1"], la: ["1", "1", "1"] },
                { DATE: "2021-08-02 23:23:45", ha: ["1", "1", "1"], la: ["1", "1", "1"] },
            ], //没分页前的总数据
            alarmListTableData: [], //分页后的当前页数据
            enaLoAlarm: [false, false, false, false],
            enaHiAlarm: [false, false, false, false],
            enaWnAlarm: [false, false, false, false],
            descLo: ["液位过低", "内压过低", "电量过低"],
            descHi: ["液位过高", "内压过高", "电量过高"],
            la: ["1", "1", "1"],
            ha: ["1", "1", "1"],
            alarmValue: ["", "", "", ""],

            alarmListPageCount: 0, //报警列表页总数
            alarmListPageIndex: 0,
            alarmListCurrentPage: 0,

            alarmNodeCount: 0,

            //=======================================尺寸相关
            mainWindowStyle: {},
            canvasWidth: 800,
            nodeAlarmListHeight: 400,

            bdmapStyle: {},

            scrollbarStyle: {},
            listStyle: {},
            gudgeStyle: {},
            alarmButton: {},

            alarmColor: CHART_COLOR.ALARMCOLOR,
            normalColor: CHART_COLOR.NORMALCOLOR,
            tipColor: CHART_COLOR.TIPCOLOR,
            shadowColor: CHART_COLOR.SHADOWCOLOR,

            //=======================================调试相关
            debugText: "",

            //=======================================弹窗相关
            dialogAlarmVisible: false,
            alarmList: [],
            alarmMsg: {},
            multipleSelect: [],
            buttonType: "",
            audioDom: null,
            h_d2: 10,
            h_2: 8,
            h_1: 2,
            l_d2: 5,
            l_2: 4,
            l_1: 1,
            project_: null,
            //========================================图片
            images: null,
            currentIndex: 0,
        };

        //有管理公司功能的话，记录下来，界面会有相应的不同。
        let manageCompany = parsenCookie.loadCompanyManageCompany();
        if ("1" == manageCompany) {
            myData.manageCompany = true;
        }

        //console.log("data init----------------------------");
        return myData;
        //return myData;
    }, //end of data
    created: function () {
        window.addEventListener("resize", this.onsize);

        //window.addEventListener('mousemove',this.onMouseMove);	//调试时才使用

        setTimeout(this.onsize, 100);

        this.webSocketReflashNodeDataListenerInit();

        this.alarmButton.backgroundColor = "#fff";
    },

    beforeMount: function () {
        jQuery.ajax({
            type: "POST",
            url: Consts.HTTP_PREFIX + `GetCompanyTree`,
            data: {
                access_token: parsenCookie.loadAccessToken(), //jQuery.cookie('ps_access_token'),
                company_id: parsenCookie.loadCompanyId(), //jQuery.cookie('ps_company_id'),
            },
            context: this,
            success: function (res) {
                //console.log(["company_tree"],res.company_tree);
                //console.log(["all companys",arr]);

                //======================递归对所有树节点进行操作
                var that = this;
                TreeTraverse.handleAllNodes(res.company_tree, function (node) {
                    node["type"] = "c";
                    that.addProjectsToCompany(node, null);
                });

                that.loading = false;

                //setTimeout(this.onsize,2000);		//之前为什么要在这里延时做尺寸匹配呢？？？
                setTimeout(this.loadTreeCheckAndReflash, 2200);

                //服务器返回的公司树数据结构,放到树的数据源中
                this.companyTreeData = [res.company_tree];
            },
            error: function (res) {},
        });
    },

    mounted() {
        this.images = document.querySelectorAll(".slideshow-image");
        setInterval(this.rotateImages, 5000);
        //打开页面后读入树的CHECK状况并刷新一次
        //setTimeout(this.loadTreeCheckAndReflash,2000);

        //之后每 n 秒自动刷新.
        //setInterval(this.loadTreeCheckAndReflash,60 * 1000);

        console.log("real data list ready to add eventlistener");

        let that = this;

        setTimeout(() => {
            this.setGudgeChart();
        }, 1000);

        window.addEventListener("message", function (e) {
            //console.log('real date list got message');
            //console.log(e);
            let params = null;
            try {
                params = JSON.parse(e.data);
                //console.log(params);
            } catch (e) {
                console.log("parse postMessage param error1");
                console.log(e);
                return;
            }

            if ("clean_node_alarm_notice" == params.command) {
                for (i in that.nodeList) {
                    if (that.nodeList[i].node_id == params.node_id) {
                        that.nodeList[i].alarm_notice = "0";
                        console.log("clean node alarm notice at id = " + params.node_id);
                    }
                }
            }
        });
    },

    updated() {
        //console.log('updated');
        //timeoutLoad();
        //this.updateCanvas();

        //在 onsize 里会 forceUpdate() ,在这里把 echarts resize.
        //已经试过,把 echarts.resize() 放在 onsize 中会导致最后一次的 resize 画不出来.
        for (let ei of this.echartsInstance) {
            if (ei) {
                ei.resize();
            }
        }

        if (this.echartsInstanceVol) {
            this.echartsInstanceVol.resize();
        }

        if (this.echartKpaInstance) {
            this.echartKpaInstance.resize();
        }

        if (this.echartVInstance) {
            this.echartVInstance.resize();
        }
    },

    //这个 watch 是一个对象,作用是实现树节点的刷选
    //需要监听的在 watch 内填写,当 filterText 值发生变化时,马上执行 函数内的动作
    watch: {
        //		pageIndex(value){
        //			console.log('pageIndex change' + value);
        //		},

        filterCompanyText(value) {
            this.$refs.companyTree.filter(value);
        },
    },

    methods: {
        onsize(event) {
            //console.log(document.documentElement);
            const width = document.documentElement.offsetWidth;
            console.log("offsetWidth= " + document.documentElement.offsetWidth);
            console.log("innerWidth= " + window.innerWidth);
            const height = document.documentElement.offsetHeight;
            let asideWidth = this.$refs.asideWindow.offsetWidth;

            //let tableMarginLeft = this.$refs.mainWindow.style.marginLeft;

            //this.$refs.tableWindow.style.width = width - asideWidth - tableMarginLeft + 'px';
            //this.$refs.projectList.width = width - asideWidth - 20 + 'px';
            let paddingStr = window.getComputedStyle(this.$refs.mainWindow, null).paddingLeft;
            let paddingNumber = paddingStr.slice(0, paddingStr.indexOf("px"));
            //console.log('margin left = ' + marginNumber);

            //this.mainWindowStyle.width = width - asideWidth - paddingNumber + 'px';	//2022-02-14
            this.mainWindowStyle.width = window.innerWidth; //2022-02-15 测试列表框全屏时使用
            //this.mainWindowStyle.height = height - 0 + 'px';
            //this.mainWindowStyle.width = '100%';
            this.mainWindowStyle.height = "100%";
            this.canvasWidth = width - 60;

            this.scrollbarStyle.height = (window.innerHeight - 140) / 2;
            this.scrollbarStyle.border = "1px solid rgba(0,0,0,0.1)";
            this.scrollbarStyle.borderRadius = "10px";
            this.scrollbarStyle.padding = "10 0 10 0";

            this.listStyle.height = window.innerHeight - 121;
            this.listStyle.width = "100%";

            this.gudgeStyle.height = (window.innerHeight - 140) / 2;

            //console.log('实时数据主窗宽 = ' + this.mainWindowStyle.width);
            //this.mainWindowStyle.backgroundColor = 'green';
            //this.tableStyle.width = '100%';
            //console.log(this.$refs.projectList.width);

            //this.$refs.topBar.offsetHeight

            //console.log('document offset size = ' + width + ',' + height);
            //console.log('main win offset size = ' + this.mainWindowStyle.width + ',' + this.mainWindowStyle.height);

            //console.log(this.$refs.asideWindow);
            //console.log(this.$refs.projectList);

            if (this.dialogGraphVisible) {
                //if(true) {
                const paramsWindowStyle = window.getComputedStyle(this.$refs.paramsWindow, null);
                const paramsWindowWidth = paramsWindowStyle.width;
                const widthNumber = paramsWindowWidth.slice(0, paramsWindowWidth.indexOf("px"));
                this.bdmapStyle.width = width - 40 - widthNumber - 20;
            }

            if (this.dialogAlarmListVisible) {
                this.nodeAlarmListHeight = height - 200;
            }

            this.$forceUpdate();
        },

        //======================================在测试界面尺寸时打印鼠标坐标
        onMouseMove(event) {
            //			this.debugText = 'clientXY=' + event.clientX + ',' + event.clientY + '  ';
            //	    	this.debugText += 'layerXY=' + event.layerX + ',' + event.layerY + '  ';
            //	    	this.debugText += 'offsetXY=' + event.offsetX + ',' + event.offsetY + '  ';
            //	    	this.debugText += 'pageXY=' + event.pageX + ',' + event.pageY + '  ';
            //	    	this.debugText += 'XY=' + event.x + ',' + event.y;
        },

        reflashNodeFilterList() {
            let that = this;

            that.nodeFilteredList = that.nodeList.filter(function (node1) {
                if (
                    node1.node_name.toLowerCase().indexOf(this.filterNodeText.toLowerCase()) != -1 ||
                    node1.imei.toLowerCase().indexOf(that.filterNodeText.toLowerCase()) != -1 ||
                    node1.group.toLowerCase().indexOf(that.filterNodeText.toLowerCase()) != -1
                ) {
                    return true;
                } else {
                    return false;
                }
            }, that);

            //根据分页数据，算出目前要显示哪一页。
            that.pageCount = Math.ceil(that.nodeFilteredList.length / that.pageItemCount) * 10;
            //======================================================================
            //这2句只是把 pageIndex 从旧的值（可能很大）设置成本数据内的页数
            //如果旧值本来就是在范围内，则 pageIndex 不作任何的变化
            that.pageIndex = Math.min(that.pageIndex, that.pageCount / 10);
            that.pageIndex = Math.max(that.pageIndex, 1);
            //----------------------------------------------------------------------
            //that.nodeTableData = that.nodeFilteredList.slice((that.pageIndex-1)*that.pageItemCount,(that.pageIndex)*that.pageItemCount);
            //that.nodeTableData = that.nodeFilteredList;
            that.currentPage = that.pageIndex;

            this.$nextTick(() => {
                this.$refs.projectList.doLayout();
            });
        },

        //读入树节点的CHECK状态并刷新仪表
        loadTreeCheckAndReflash() {
            let treeCheckedStr = parsenCookie.loadRealListCompanyTreeCheck();
            if (null == treeCheckedStr) {
                return;
            }
            let checkedArr = [];
            try {
                checkedArr = JSON.parse(treeCheckedStr);
            } catch (err) {
                return;
            }

            this.$refs.companyTree.setCheckedKeys(checkedArr);

            let checkKeys = this.$refs.companyTree.getCheckedKeys();
            let checkNodes = this.$refs.companyTree.getCheckedNodes();

            //			this.pageIndex = parsenCookie.loadRealListPageIndex();
            //			if(isNaN(this.pageIndex)) {
            //				this.pageIndex = 1;
            //			}

            console.log("exec this.companyTreeNodeCheck");
            this.companyTreeNodeCheck(null, { checkedKeys: checkKeys, checkedNodes: checkNodes });
        },

        //向web socket服务器发送注册命令.把目前正在显示的仪表列表告诉服务器
        webSocketReflashNodeDataListenerSendNodeList() {
            let nodeIdArr = [];
            for (node of this.nodeList) {
                nodeIdArr.push(node.node_id);
            }

            const jSend = {
                company_id: parsenCookie.loadCompanyId(),
                access_token: parsenCookie.loadAccessToken(),
                node_id_list: nodeIdArr,
            };
            if (null != this.webSocketReflashNodeDataListener) {
                this.webSocketReflashNodeDataListener.send(JSON.stringify(jSend));
                //console.log('web socket regist: ' + JSON.stringify(jSend));
            }
        },

        //初始化刷新仪表数据的 websocket
        webSocketReflashNodeDataListenerInit() {
            if ("WebSocket" in window) {
                console.log("您的浏览器支持WebSocket");

                const url = Consts.WS_PREFIX + "ReflashNodeDataListener";

                if (null != this.webSocketReflashNodeDataListener) {
                    this.webSocketReflashNodeDataListener.close();
                }

                this.webSocketReflashNodeDataListener = new WebSocket(url); //创建WebSocket连接
                if (null == this.webSocketReflashNodeDataListener) {
                    console.log("新建 websocket 失败");
                    return;
                }

                var that = this;

                //console.log(this.webSocket);
                this.webSocketReflashNodeDataListener.onopen = function (event) {
                    console.log("刷新仪表列表监听器打开成功");
                    console.log(event);
                };

                this.webSocketReflashNodeDataListener.onmessage = function (event) {
                    console.log("刷新仪表列表 websocket 收到内容");
                    //console.log(event.data);

                    let data = null;
                    try {
                        data = JSON.parse(event.data);
                    } catch (e) {
                        console.log(e);
                    }

                    //console.log(data);

                    if ("1" == data.result) {
                        that.setupNodeListData(data.node_update_list);

                        //遍历更新仪表数据
                        for (nodeUpdate of data.node_update_list) {
                            for (nodeIndex in that.nodeList) {
                                if (that.nodeList[nodeIndex].node_id == nodeUpdate.node_id) {
                                    nodeUpdate.project_name = that.nodeList[nodeIndex].project_name;
                                    nodeUpdate.company_name = that.nodeList[nodeIndex].company_name;
                                    that.nodeList[nodeIndex] = nodeUpdate;

                                    that.lastSelectedNode = that.nodeList[nodeIndex];
                                    //console.log("update one node");
                                }
                            }
                        }

                        //刷选列表更新
                        that.reflashNodeFilterList();
                        //显示列表更新

                        if (that.sortColumn) {
                            that.sortChangeHandler(that.sortColumn);
                        }
                    }
                };
            } else {
                console.log("您的浏览器不支持WebSocket");
            }
        },

        webSocketGetProjectsNodesInitAndRun(projects) {
            if (false == "WebSocket" in window) {
                console.log("浏览器不支持websocket");
            }

            const url = Consts.WS_PREFIX + "GetProjectsNodes";

            if (null != this.webSocketGetProjectsNodes) {
                this.webSocketGetProjectsNodes.close();
            }

            this.webSocketGetProjectsNodes = new WebSocket(url);

            if (null == this.webSocketGetProjectsNodes) {
                console.log("创建 websocket 失败");
                return;
            }

            var that = this;

            this.webSocketGetProjectsNodes.onopen = function (event) {
                //console.log("websocket getProjectsNodes 打开成功");
                //console.log(event);

                //请求数据前，先把旧数据删掉
                that.nodeList = [];
                that.nodeFilteredList = [];
                that.nodeTableData = [];
                that.alarmList = [];
                that.alarmData = [];

                that.alarmNodeCount = 0;
                that.pageCount = 0;
                that.pageIndex = 0;
                that.currentPage = 0;
                that.alarmButton.backgroundColor = "#fff";

                const param = {
                    access_token: parsenCookie.loadAccessToken(),
                    project_list: projects,
                    page_count: 8,
                };

                that.setGudgeChart();
                that.webSocketGetProjectsNodes.send(JSON.stringify(param));
            };

            this.webSocketGetProjectsNodes.onmessage = function (event) {
                //console.log("websocket getProjectsNode 收到内容");
                // console.log("onMessage："+event.data);

                let res = null;
                try {
                    res = JSON.parse(event.data);
                    /*console.log("this is event.data");
                    console.log(data);*/
                } catch (e) {
                    console.log(e);
                    //生成提示窗，提示读取数据失败
                    return;
                }

                //如果返回结果不对，就退出
                if ("0" == res.result) {
                    return;
                }

                //数据库返回值转成本地能处理的数据格式
                that.setupNodeListData(res.node_list);

                //处理好的内容推入列表
                that.nodeList.push(...res.node_list);

                //console.log("仪表数量=" + that.nodeList.length);

                that.reflashNodeFilterList();

                that.setGudgeChart();
                /*
				//处理筛选，把筛选列表拼好。
				that.nodeFilteredList = that.nodeList.filter(function(node1){						
					if( (node1.node_name.toLowerCase().indexOf(this.filterNodeText.toLowerCase()) != -1)
							||
						(node1.imei.toLowerCase().indexOf(that.filterNodeText.toLowerCase()) != -1)
							||
						(node1.group.toLowerCase().indexOf(that.filterNodeText.toLowerCase()) != -1)		)
					{
						return true;
					}
					else {						
						return false;
					}						
				},that);
				
				
				//根据分页数据，算出目前要显示哪一页。				
				that.pageCount = (Math.ceil(that.nodeFilteredList.length / that.pageItemCount))*10;
				//======================================================================
				//这2句只是把 pageIndex 从旧的值（可能很大）设置成本数据内的页数
				//如果旧值本来就是在范围内，则 pageIndex 不作任何的变化
				that.pageIndex = Math.min(that.pageIndex,that.pageCount / 10);
				that.pageIndex = Math.max(that.pageIndex,1);
				//----------------------------------------------------------------------
				//that.nodeTableData = that.nodeFilteredList.slice((that.pageIndex-1)*that.pageItemCount,(that.pageIndex)*that.pageItemCount);
				//that.nodeTableData = that.nodeFilteredList;
				that.currentPage = that.pageIndex;
				//console.log('count= ' + this.nodeFilteredList.length);

				*/

                //如果是最后一次，刷新监听列表
                if ("end_node" == res.command) {
                    //console.log("数据结束了");

                    //this.webSocketReflashNodeDataListenerInit();
                    that.webSocketReflashNodeDataListenerSendNodeList();
                }

                if ("add_node" == res.command) {
                    //console.log("数据传输中。。。");
                }
            };
        },

        sortChangeHandler(column) {
            var that = this;

            that.sortColumn = column;

            if (null == column.order) {
                return;
            }

            var desc = column.order == "descending" ? -1 : 1;

            if ("detal_info" == column.prop) {
                that.nodeFilteredList.sort((a, b) => {
                    //console.log(a.node_data.date);

                    let result = 0;

                    //如果 a 没数据，那就是 b 比 a 大
                    if (null == a.node_data) {
                        result = 1;
                    }
                    //如果 a 有数据,b 没数据,那就是 a 比 b 大
                    else if (null == b.node_data) {
                        result = -1;
                    }
                    //如果都有数据，就比较
                    else {
                        result = a.node_data.date < b.node_data.date ? 1 : -1;
                    }

                    return result * desc;
                });
            } else {
                that.nodeFilteredList.sort(function (a, b) {
                    const aa = a[column.prop]; // + "";
                    const bb = b[column.prop]; // + "";
                    //console.log(aa);
                    //console.log(bb);
                    //console.log(aa < bb);
                    //return aa.localeCompare(b);
                    return (aa < bb ? 1 : -1) * desc;
                });
            }
        },

        getState(alarmEx, alarm) {
            if (0 != alarm) {
                if (alarm == this.h_d2 || alarm == this.h_2) {
                    return "超出上限2报警";
                } else if (alarm == this.l_d2 || alarm == this.l_2) {
                    return "低于下限2报警";
                } else if (alarm == this.h_1) {
                    return "超出上限1报警";
                } else if (alarm == this.l_1) {
                    return "低于下限1报警";
                }
            } else {
                if (alarmEx != 0) {
                    return "恢复正常";
                }
            }
        },
        deleteRow(index) {
            this.alarmList.splice(index, 1);
        },

        tableRowClassName(row) {
            if (row["row"]["alarmType"] == "超出上限2报警") {
                return "H2-row";
            } else if (row["row"]["alarmType"] == "超出上限1报警") {
                return "H1-row";
            } else if (row["row"]["alarmType"] == "低于下限2报警") {
                return "L2-row";
            } else if (row["row"]["alarmType"] == "低于下限1报警") {
                return "L1-row";
            } else if (row["row"]["alarmType"] == "恢复正常") {
                return "reN-row";
            }
        },
        handleSelectionChange(selection) {
            this.multipleSelect = selection;
        },

        disVisableSelection() {
            if (this.multipleSelect.length == 0) {
                this.$message.warning("请选择数据");
                return true;
            }
            this.$confirm("确定清除选中显示", "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    //confirm
                    for (let i = this.alarmList.length; i > 0; i--) {
                        for (let j = 0; j < this.multipleSelect.length; j++) {
                            if (JSON.stringify(this.alarmList[i - 1]) == JSON.stringify(this.multipleSelect[j])) {
                                this.alarmList.splice(i - 1, 1);
                            }
                        }
                    }
                })
                .catch(() => {
                    //cancel
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        disAlarmSelection() {
            if (this.multipleSelect.length == 0) {
                this.$message.warning("请选择数据");
                return true;
            }

            this.$confirm("确认清除选中imei号设备报警？", "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    //confirm
                    for (let i of this.multipleSelect) {
                        let node = i["node"];

                        jQuery.ajax({
                            type: "POST",
                            url: Consts.HTTP_PREFIX + `CleanNodeAlarmFlag`,
                            data: {
                                access_token: parsenCookie.loadAccessToken(),
                                node_id: node.nodeId,
                                clean_alarm_pop: "1",
                                clean_alarm_notice: "1",
                            },
                            context: this,
                            success: function (res) {
                                if ("1" == res.result) {
                                    node.alarmNotice = "0";
                                    this.$message({
                                        type: "info",
                                        message: "报警清除",
                                    });
                                }
                            },
                            error(res) {
                                console.log(res);
                            },
                        });
                    }
                })
                .catch(() => {
                    //cancel
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        alarmShow(node) {
            for (let line_data of node["node_data"]["line_datas"]) {
                //数据读取
                let lineParam = line_data["line_param"];

                this.alarmMsg["imei"] = node["imei"];
                this.alarmMsg["date"] =
                    line_data["date"] == undefined ? node["node_data"]["date"].substring(0, 16) : line_data["date"].substring(0, 16);
                this.alarmMsg["group"] = node["group"];

                let alarmFlagEx = parseInt(line_data["alarm_flag_ex"]);
                let alarmFlag = parseInt(lineParam["alarm_flag"]);

                this.alarmMsg["alarmType"] = this.getState(alarmFlagEx, alarmFlag);
                this.alarmMsg["value"] = lineParam["last_value"] + " " + unitCodeToName(lineParam["last_unit"]);
                this.alarmMsg["paramType"] = unitCodeToDesc(lineParam["last_unit"]);
                this.alarmMsg["node"] = { nodeId: node["node_id"], alarmNotice: node["alarm_notice"] };
                this.alarmMsg["projectName"] = node["project_name"];
                this.alarmMsg["nodeName"] = node["node_name"];
                this.alarmMsg["companyName"] = node["company_name"];

                //特殊情况：异常->正常->正常
                let doubleNomal = 0 == alarmFlagEx && 0 == alarmFlag;
                if (doubleNomal) {
                    let index = this.alarmList.findIndex((alarm) => {
                        this.alarmMsg["imei"] == alarm["imei"] && this.alarmMsg["paramType"] == alarm["paramType"];
                    });
                    if (index == -1) {
                        continue;
                    }
                    this.alarmList.splice(index, 1);
                    continue;
                }

                //报警处理
                if ("1" == node.alarm_pop) {
                    this.alarmNodeCount++;
                    let isExist = false;
                    for (let alarmMsg_ of this.alarmList) {
                        if (JSON.stringify(alarmMsg_) == JSON.stringify(this.alarmMsg)) {
                            isExist = true;
                            console.log("same");
                            break;
                        } else if (alarmMsg_["imei"] == this.alarmMsg["imei"] && alarmMsg_["paramType"] == this.alarmMsg["paramType"]) {
                            this.alarmList.splice(this.alarmList.indexOf(alarmMsg_), 1);
                            console.log("update");
                        }
                    }
                    if (!isExist) {
                        this.alarmList.push(this.alarmMsg);
                    }
                    this.alarmMsg = {};
                    this.$refs.audio.currentTime = 0;
                    this.$refs.audio.play();
                    this.alarmButton.backgroundColor = "#FF6666";
                }
            }

            // if(this.alarmList.length>0){
            // 	this.alarmButton.backgroundColor = '#FF6666';
            // }else{
            // 	this.alarmButton.backgroundColor = '#fff';
            // }
        },

        getAlarmCount() {
            let number = 0;
            for (let node of this.nodeList) {
                if ("0" != node["alarm_pop"]) number++;
            }
            return number;
        },

        setGudgeChart() {
            //console.log('gudgeDrawing');
            let alarm = [
                { value: this.getAlarmCount(), name: "异常" },
                { value: this.nodeList.length - this.getAlarmCount(), name: "正常" },
            ];
            let optionGudge = {
                series: [
                    {
                        splitNumber: 2,
                        min: 0,
                        max: isNaN(this.nodeList.length) ? 0 : this.nodeList.length,
                        type: "gauge",
                        axisLine: {
                            lineStyle: {
                                //仪表线条设置
                                width: 20,
                                color: [
                                    //仪表线条颜色
                                    [0.3, "#67e0e3"],
                                    [0.7, "#37a2da"],
                                    [1, "#fd666d"],
                                ],
                            },
                        },
                        pointer: {
                            //指针设置
                            itemStyle: {
                                color: "inherit",
                            },
                        },

                        splitLine: {
                            //仪表盘数字设置
                            distance: -30,
                            length: 30,
                            lineStyle: {
                                color: "#fff",
                                width: 0,
                            },
                        },
                        axisLabel: {
                            //仪表盘数字标签
                            color: "inherit",
                            distance: 40,
                            fontSize: 15,
                            formatter: function (value) {
                                return value.toFixed(0);
                            },
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: "{value}",
                            color: "inherit",
                            fontSize: 25,
                        },
                        data: [
                            {
                                value: isNaN(this.alarmNodeCount) ? 0 : this.alarmNodeCount,
                            },
                        ],
                    },
                ],
            };

            let alarmOption = {
                title: {
                    text: "报警预览",
                    top: "5%",
                    left: "10%",
                    textStyle: {
                        fontSize: this.fontSize(20),
                    },
                },
                tooltip: {
                    trigger: "item",
                    formatter: `{b}:{c}`,
                    backgroundColor: this.tipColor,
                    textStyle: {
                        fontSize: this.fontSize(20),
                        color: "white",
                    },
                },
                legend: {
                    bottom: "5%",
                    left: "center",
                    textStyle: {
                        fontSize: this.fontSize(20),
                    },
                },
                color: [this.alarmColor, this.normalColor],
                series: [
                    {
                        radius: ["45%", "75%"],
                        type: "pie",
                        data: alarm,
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 3,
                            borderColor: "#fff",
                            borderWidth: 1.5,
                            shadowBlur: 5,
                            shadowOffsetX: 5,
                            shadowOffsetY: 5,
                            shadowColor: this.shadowColor,
                        },
                        // label:{
                        // 	formatter:function(param){
                        // 		return param.percent.toFixed(0)+'%';
                        // 	},
                        // 	fontFamily:'Verdana',
                        // 	show:true,
                        // 	fontSize:this.fontSize(15),
                        // 	color:'white',
                        // 	position:"inside"
                        // },
                        label: {
                            formatter: (params) => {
                                return "{r|" + params.name + "}" + "\n{r|" + params.value + "}";
                            },
                            fontFamily: "Verdana",
                            show: true,
                            position: "center",
                            backgroundColor: "white",
                            emphasis: {
                                scale: true,
                                sizeScale: 30,
                            },
                            rich: {
                                r: {
                                    fontSize: this.fontSize(25),
                                    //backgroundColor:'white',
                                },
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        emphasis: {
                            scale: true,
                            sizeScale: 30,
                        },
                    },
                ],
            };

            let gudgeDom = document.getElementById("gudge");
            let chartInstance = echarts.init(gudgeDom);
            chartInstance.setOption(alarmOption);

            window.addEventListener("resize", () => {
                console.log("gudgeresize");
                chartInstance.resize();
            });
        },

        checkNodeAlarmAndPop(node) {
            if ("1" == node.alarm_pop) {
                if (!node.alarm_poped) {
                    node.alarm_poped = true;
                }

                //				let notifyInst = this.$notify({
                //					title: node.node_name,
                //					message: node.node_data.date + '   参数_____值异常!',
                //					type: 'warning',
                //					duration: 0,
                //					onClose(){
                //						//const msg = '关闭了' + node.ID;
                //						//alert(msg);
                //						jQuery.ajax({
                //							type:'POST',
                //							url:Consts.HTTP_PREFIX + `CleanNodeAlarmFlag`,
                //							data:{
                //								access_token:parsenCookie.loadAccessToken(),
                //								node_id:node.node_id,
                //								clean_alarm_pop:'1',
                //								//clean_alarm_notice:'0',
                //							},
                //							context:this,
                //							success:function(res){
                //								console.log(res);
                //								if('1' == res.result) {
                //									node.alarm_pop = '0';
                //									node.alarm_poped = false;
                //								}
                //							},
                //							error(res) {
                //								console.log(res);
                //							}
                //						});
                //					},
                //				});	// end of notify pop up
            } // end of if ('1' == node.alarm_pop)
        },

        /*
		把读入的服务器数据设置好成为本地的数据格式
		*/
        setupNodeListData(nodeListReadFromServer) {
            for (let node of nodeListReadFromServer) {
                if (null == node.node_data) {
                    continue;
                }

                let enaFlag = node.line_ena_flag; //取出线路使能字符串
                //遍历字符串,找出最多3路来处理
                let getLine = 0;

                let lineDatas = node.node_data.line_datas;

                node.dataInfos = [];

                let lineIdMer = []; //处理通道重复

                for (let ld of lineDatas) {
                    if (null == ld.line_param || 0 == ld.line_param.show) {
                        //显示判断
                        continue;
                    }
                    if (lineIdMer.includes(ld.node_line)) {
                        let index = node.dataInfos.findIndex((item) => item.line == ld.line);
                        node.dataInfos.splice(index, 1);
                    }
                    lineIdMer.push(ld.node_line);
                    const disp_unit = ld.line_param.last_unit;
                    const lp = ld.line_param;

                    let dataInfo = {
                        canvas_id: "canvas_" + ld.node_line,
                        is_cus_unit: lp.is_cus_unit == 1 ? true : false,
                        cus_unit: lp.cus_unit,
                        line: ld.node_line,
                        last_value: ld.value,
                        unit: ld.unit,
                        displayUnit: disp_unit,
                        displayValue: UnitTransfer.transferToUnit(ld.value, ld.unit, disp_unit).toFixed(lp.dot_pos),
                        isPressureUnit: UnitTransfer.isPressureUnit(ld.unit),
                        unit_name: lp.is_cus_unit == 1 ? lp.cus_unit : unitCodeToName(ld.unit),
                        setDesc: lp.set_desc,
                        line_desc: lp.set_desc == "1" ? lp.line_desc : unitCodeToDesc(ld.unit),
                        setMax: lp.set_disp_max,
                        max: lp.disp_max,
                        setMin: lp.set_disp_min,
                        min: lp.disp_min,
                    };

                    node.dataInfos.push(dataInfo);

                    //看看是否有客户自定义的单位与额外的文字描述
                    const funcName = node.node_id + "_" + ld.node_line;
                    if (ExtUnitCalculate[funcName]) {
                        dataInfo.extUnit = true;
                        //第3个参数，代号0代表 kPa 的单位
                        const kPaValue = UnitTransfer.transferToUnit(ld.value, ld.unit, 0);
                        dataInfo["extText"] = ExtUnitCalculate[funcName](kPaValue);
                    } else {
                        dataInfo.extUnit = false;
                        dataInfo["extText"] = "";
                    }

                    ++getLine;
                    // if(getLine >= 3) {
                    // 	break;
                    // }
                }

                //把 sql 时间后面的毫秒值去掉
                if (node.node_data.date) {
                    node.node_data.date = node.node_data.date.substring(0, 19);
                    //根据 sql 时间生成短日期字符串
                    const lastTime = mySqlDateToDate(node.node_data.date);
                    const timeStr =
                        lastTime.getMonth() +
                        1 +
                        "月" +
                        lastTime.getDate() +
                        "日 " +
                        formatNumber(lastTime.getHours()) +
                        ":" +
                        formatNumber(lastTime.getMinutes());
                    node["shortTime"] = timeStr;
                } else {
                    node["shortTime"] = "";
                }
                this.checkNodeAlarmAndPop(node);
                this.alarmShow(node);
            } //for(let node of res.NODES) 结束
        },

        //=========================================左边公司与工程树
        //在公司下加入工程
        addProjectsToCompany(node, successCallback) {
            jQuery.ajax({
                type: "POST",
                url: Consts.HTTP_PREFIX + `GetCompanyProjects`,
                data: {
                    access_token: parsenCookie.loadAccessToken(), //jQuery.cookie('ps_access_token'),
                    company_id: node.company_id,
                },
                context: this,
                success: function (res) {
                    //console.log(res);
                    if ("1" === res.result) {
                        //  console.log(res);
                        for (let project of res.project_list) {
                            var projectNode = {
                                id: "c_" + node.company_id + "_p_" + project.project_id, //为了工程ID与公司ID不重复,工程ID加上 p_ 前缀
                                project_id: project.project_id, //pid 为工程ID
                                project_name: project.project_name,
                                company_name: node.company_name,
                                type: "p", //p 类型,让代码可以识别这个工程
                                //icon:'el-icon-document'	//工程图标
                            };
                            node.children.push(projectNode);
                        }

                        /*************************************
						下面的代码在 2022-05-18 之前使用，发现在每一次执行更新工程下面的仪表后都执行一次刷新仪表是不妥的
						会刷新很多次，导致加载速度超级慢，现在暂时改成在最外面，等2秒后再执行刷新仪表  
												
						//因为在这里添加好数据之后，其实控件未刷新，所以选延时，等控件刷新后，再匹配尺寸。
						setTimeout(this.onsize,100);		//之前为什么要在这里延时做尺寸匹配呢？？？
						//this.onsize(null);
						setTimeout(this.loadTreeCheckAndReflash,200);
						//this.loadTreeCheckAndReflash();		//读好了工程之后，就根据选择的工程内容去读仪表数据						
						*************************************/
                    }
                    if (null != successCallback) {
                        successCallback();
                    }
                },
                error: function (res) {},
            });
        },

        /*
         * 递归遍历树节点并把所有节点放到数组里,简单说就是树变数组
         */
        //		readNodeRecursion : function(nodes,arr) {
        //			for(var item of nodes) {
        //				//arr.push({id:item.id,label:item.label});
        //				arr.push(item);
        //				if(item.children && item.children.length) {
        //					this.readNodeRecursion(item.children,arr);
        //				}
        //			}
        //			return arr;
        //		},

        /*
         * 树节点重画
         */
        handleRenderContent: function (h, { node, data, store }) {
            //console.log([h,node,data,store]);

            if ("c" == data.type) {
                return h("span", [
                    h("i", { attrs: { class: "el-icon-house" } }),
                    h("span", { style: { color: "rgb(20,110,0)" } }, data.company_name),
                ]);
            } else {
                return h("span", { style: { color: "rgb(0, 125, 255)" }, attrs: { class: "el-icon-s-grid" } }, data.project_name);
            }
        },

        /*
         * 公司树刷选
         */
        filterCompanyTreeFunc: function (value, data) {
            if (!value) return true;
            let t1 = false;
            if (data.company_name != null) {
                t1 = data.company_name.indexOf(value) !== -1;
            }
            let t2 = false;
            if (data.project_name != null) {
                t2 = data.project_name.indexOf(value) !== -1;
            }
            return t1 || t2;
        },

        companyTreeNodeClick: function (company, node, tree) {
            console.log([company, node, tree]);
            //this.textBtnAddNode = ;

            node.checked = !node.checked;

            let keysArr = this.$refs.companyTree.getCheckedKeys();
            let keysArrStr = "";
            try {
                keysArrStr = JSON.stringify(keysArr);
            } catch (err) {}
            //jQuery.cookie('ps_real_data_list_tree_check',JSON.stringify(keysArr),{expires:30,path:'/',});
            parsenCookie.saveRealListCompanyTreeCheck(keysArrStr);

            if ("c" === company.type) {
                this.projectSelected = null;
            } else {
                this.projectSelected = company;
                //this.$refs.companyTree.setChecked(company.id,true,false);
                let nodes = this.$refs.companyTree.getCheckedNodes();
                let projects = nodes.filter(function (node) {
                    return node.type === "p";
                }, this);
                console.log("companyTreeNodeClick in reflash");
                //this.reflashProjectsNodes(projects);
                this.webSocketGetProjectsNodesInitAndRun(projects);
            }
        },
        //--------------------------------------左边公司与工程树

        //========================================================右边仪表列表
        companyTreeNodeCheck: function (company, clickInfo) {
            //console.log([company,clickInfo]);

            //检查看动作是 check 还是  uncheck
            if (company && "p" === company.type) {
                if (clickInfo.checkedNodes.indexOf(company) != -1) {
                    this.projectSelected = company;
                }
            }

            //选中的内容里,有公司与工程,把工程挑出来,放在数组中
            let projects = [];
            for (let project of clickInfo.checkedNodes) {
                if ("p" === project.type) {
                    projects.push(project);
                }
            }
            //console.log(projects);

            let keysArrStr = "";
            try {
                keysArrStr = JSON.stringify(clickInfo.checkedKeys);
            } catch (e) {}

            parsenCookie.saveRealListCompanyTreeCheck(keysArrStr);

            console.log("companyTreeNodeCheck in reflash");

            this.pageIndex = parsenCookie.loadRealListPageIndex();
            if (isNaN(this.pageIndex)) {
                this.pageIndex = 1;
            }
            //this.pageIndex = 1;
            //parsenCookie.saveRealListPageIndex(this.pageIndex);

            //this.reflashProjectsNodes(projects);
            this.webSocketGetProjectsNodesInitAndRun(projects);
        }, //companyTreeNodeCheck结束

        companyTreeExpand: function (nodeDate, nodeObject, VueNode) {
            setTimeout(this.onsize, 700);
        },

        companyTreeCollapse: function (nodeDate, nodeObject, VueNode) {
            setTimeout(this.onsize, 700);
        },

        //仪表查找按钮
        btnFilterNode() {
            this.reflashNodeFilterList();
            /*			this.nodeFilteredList = this.nodeList.filter(function(node1){
				
				if( (node1.node_name.toLowerCase().indexOf(this.filterNodeText.toLowerCase()) != -1)
						||
					(node1.imei.toLowerCase().indexOf(this.filterNodeText.toLowerCase()) != -1)
						||
					(node1.group.toLowerCase().indexOf(this.filterNodeText.toLowerCase()) != -1)		)
				{
					return true;
				}
				else {
					//console.log(node1);
					return false;
				}
				
			},this);
			
			this.nodeTableData = this.nodeFilteredList.slice(0,PAGE_ITEM_MAX);
			this.pageCount = (Math.ceil(this.nodeFilteredList.length / PAGE_ITEM_MAX))*10;
			this.pageIndex = 1;
			this.currentPage = this.pageIndex;
			
			console.log(this.nodeFilteredList.length);*/
        },

        //翻页处理
        pageChange(index) {
            this.pageIndex = index;
            this.nodeTableData = this.nodeFilteredList.slice((this.pageIndex - 1) * PAGE_ITEM_MAX, this.pageIndex * PAGE_ITEM_MAX);
            //处理固定表头错位
            this.$nextTick(() => {
                this.$refs.projectList.doLayout();
            });
            //jQuery.cookie('ps_real_data_list_page_index',this.pageIndex,{expires:30,path:'/',});
            parsenCookie.saveRealListPageIndex(this.pageIndex);
        },

        /*
         *	右边表格样式
         */
        setCellStyle({ row, column, rowIndex, columnIndex }, myParam) {
            /*
			if(0 == columnIndex) {
				return {color:PsColor.PS_PROJECT_ICON};
			}
			else if (1 == columnIndex){
				return {color:PsColor.PS_YIBIAO_ICON};
			}
			else if (2 == )
			*/

            //使用下面的数组来设置第0，1，2，3行的颜色
            const COLOR_ARR = [PsColor.PS_PROJECT_ICON, PsColor.PS_YIBIAO_ICON, "#428675", "#2F4988"];

            if (0 <= columnIndex && columnIndex < COLOR_ARR.length) {
                return { color: COLOR_ARR[columnIndex] };
            }

            //数据行如果有报警则把底色设成黄色
            if ("数据" == column.label) {
                if ("1" == row.ALARM_NOTICE) {
                    return { backgroundColor: PsColor.PS_YELLOW };
                }
            }
        },

        btnFullscreen() {
            let ele = this.$refs.mainWindow;
            if (null != ele.requestFullscreen) {
                console.log("requestFullscreen");
                ele.requestFullscreen();
                return;
            }
            if (null != ele.mozRequestFullScreen) {
                console.log("mozRequestFullScreen");
                ele.mozRequestFullScreen();
                return;
            }
            if (null != ele.webkitRequestFullscreen) {
                console.log("webkitRequestFullscreen");
                ele.webkitRequestFullscreen();
                return;
            }
            if (null != ele.msRequestFullscreen) {
                console.log("msRequestFullscreen");
                ele.msRequestFullscreen();
                return;
            }
        },

        alarmListPageChange(index) {
            this.alarmListPageIndex = index;
            this.alarmListTableData = this.nodeAlarmList.slice(
                (this.alarmListPageIndex - 1) * ALARM_LIST_PAGE_ITEM_MAX,
                this.alarmListPageIndex * ALARM_LIST_PAGE_ITEM_MAX
            );
        },

        //		timeoutLoad(x,y){
        //			if (!this.bdmap) {
        //				this.bdmap = new BMapGL.Map("bdmap_container");
        //			}
        //			console.log('lat=' + x);
        //			console.log('lon=' + y);
        //			//this.bdpoint = new BMapGL.Point(116.404, 39.915);
        //			this.bdpoint = new BMapGL.Point(x, y);
        //			this.bdmap.centerAndZoom(this.bdpoint, 15);
        //			this.bdmap.enableScrollWheelZoom(true);
        //			//this.bdmap.setMapType(BMAP_EARTH_MAP); //3D 地图
        //		},

        btnOpenDataGraphInNewTabs(index, row) {
            if (null == row.node_data) {
                alert("没有任何数据可以查看");
                return;
            }

            localStorage.setItem("real_data_selected_node_" + row.node_id, JSON.stringify(row));

            const params = {
                command: "open_node_detal",
                node_id: row.node_id,
                group: row.group,
                index: index + 1,
            };

            window.parent.postMessage(JSON.stringify(params), "*");
        },

        btnOpenAlarmRecordInNewTab(index, row) {
            if (null == row.node_data) {
                alert("没有任何数据可以查看");
                return;
            }

            //localStorage.setItem("real_data_selected_node_" + row.node_id,JSON.stringify(row));

            const params = {
                command: "open_node_alarm_record",
                node_id: row.node_id,
                project_name: row.project_name,
                //group:row.group,
                //index:index+1,
            };

            window.parent.postMessage(JSON.stringify(params), "*");
            //window.postMessage(JSON.stringify(params),'*');
        },

        btnOpenDataGraph(index, row) {
            //console.log(row);

            var that = this;

            if (null == row.node_data) {
                alert("没有任何数据可以查看");
                return;
            }

            const lastDate = mySqlDateToDate(row.node_data.date);
            const nowDate = new Date();
            const spanMinute = (nowDate - lastDate) / 1000 / 60;
            const offline = spanMinute > row.send_gap * ConfigConsts.OFFLINE_JUDGE_COUNT;
            this.crConnecting = offline ? PsColor.PS_PIN : PsColor.PS_GREEN;
            this.textConnecting = offline ? "离线" : "在线";

            //load地图函数,在定时器中调用
            var loadMap = function (lon, lat) {
                console.log(["bm value init= ", that.bm, that]);
                if (null == that.bm) {
                    that.bm = new BMapGL.Map("map_container");
                    that.bm.enableScrollWheelZoom(true); //允许鼠标缩放
                    console.log("init this.bm+++++++++++++++");
                } else {
                    console.log("no need to init^^^^^^^^^^^^^");
                }
                //坐标点生成,但这个坐标不是百度坐标,而是真正的经纬度
                that.bdpoint = new BMapGL.Point(lon, lat);

                //经纬度转换成百度坐标
                new BMapGL.Convertor().translate([that.bdpoint], 1, 5, function (data) {
                    if (data.status === 0) {
                        var marker = new BMapGL.Marker(data.points[0]); //生成图示
                        that.bm.addOverlay(marker); //放置图示
                        var label = new BMapGL.Label("仪表位置", { offset: new BMapGL.Size(-40, -60) }); //生成文字
                        marker.setLabel(label); //放置跟随图示的文字
                        that.bm.centerAndZoom(data.points[0], 15); //设置地图中心点与缩放
                    }
                });
            }; //load 地图函数结束

            //加载腾讯地图
            const loadTMap = function (lbsList) {
                if (null != that.tmap) {
                    that.tmap.destory();
                }
                //if (null == that.tmap) {
                //定义map变量，调用 TMap.Map() 构造函数创建地图
                that.tmap = new TMap.Map(document.getElementById("map_container"), {
                    //center: center,//设置地图中心点坐标
                    zoom: 15, //设置地图缩放级别
                    viewMode: "2D",
                });
                //}

                if (null == that.tmap) {
                    console.log("new tmap failed!");
                    return;
                }

                if (null == lbsList) {
                    console.log("lbsList = null");
                    return;
                }

                if (lbsList.length < 1) {
                    console.log("lbsList = 0");
                    return;
                }

                //var center=new TMap.LatLng(lbsList[0].lat,lbsList[0].lon);
                //that.tmap.setCenter(center);

                //坐标转换
                tmapXYConvertor(lbsList, function (list) {
                    //自己设置点作测试用
                    //		        	list = [];
                    //		        	list.push({lat:39,lng:117});
                    //		        	list.push({lat:39.2,lng:117.4});

                    console.log(list);
                    let maxLat = list[0].lat;
                    let minLat = maxLat;
                    let maxLon = list[0].lng;
                    let minLon = list[0].lng;

                    let geometryList = [];
                    let path = [];

                    let index = 1;
                    for (const lbs of list) {
                        maxLat = Math.max(maxLat, lbs.lat);
                        minLat = Math.min(minLat, lbs.lat);
                        maxLon = Math.max(maxLon, lbs.lng);
                        minLon = Math.min(minLon, lbs.lng);
                        tPoint = new TMap.LatLng(lbs.lat, lbs.lng);

                        let geo = {
                            id: "test",
                            //id:'car',
                            //"styleId":"myStyle",
                            //"styleId":"car-down",
                            styleId: "other_pos",
                            //"position":lbs,
                            position: tPoint,
                            properties: {
                                title: lbsList[index - 1].date.substr(5, 11),
                            },
                        };

                        if (index == list.length) {
                            geo.styleId = "last_pos";
                        }

                        geometryList.push(geo);
                        path.push(tPoint);
                        ++index;
                    }

                    //创建并初始化MultiMarker,画点
                    var markers = new TMap.MultiMarker({
                        map: that.tmap, //指定地图容器
                        //样式定义
                        styles: {
                            //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
                            //		        	        "myStyle": new TMap.MarkerStyle({
                            //		        	            "width": 25,  // 点标记样式宽度（像素）
                            //		        	            "height": 35, // 点标记样式高度（像素）
                            //		        	            //"src": '../img/marker.png',  //图片路径
                            //		        	            //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
                            //		        	            "anchor": { x: 16, y: 32 }
                            //		        	        })
                            //		        			,
                            //		        		    'car-down': new TMap.MarkerStyle({
                            //		        		    	width: 40,
                            //		        		    	height: 40,
                            //		        		    	anchor: {x: 20,y: 20,},
                            //		        		    	faceTo: 'map',
                            //		        		    	rotate: 180,
                            //		        		    	src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png',
                            //		        		        })
                            //		        			,

                            other_pos: new TMap.MarkerStyle({
                                width: 20,
                                height: 30,
                            }),

                            last_pos: new TMap.MarkerStyle({
                                width: 50,
                                height: 50,
                                //src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png',
                                src: "../image/truck.png",
                            }),
                        },
                        //点标记数据数组
                        geometries: geometryList,
                    });

                    var polylineLayer = new TMap.MultiPolyline({
                        id: "polyline-layer", //图层唯一标识
                        map: that.tmap, //设置折线图层显示到哪个地图实例中
                        //折线样式定义
                        styles: {
                            style_blue: new TMap.PolylineStyle({
                                color: "#3777FF", //线填充色
                                width: 6, //折线宽度
                                borderWidth: 5, //边线宽度
                                borderColor: "#FFF", //边线颜色
                                lineCap: "butt", //线端头方式
                                showArrow: true,
                                arrowOptions: {
                                    width: 10,
                                    height: 8,
                                },
                            }),
                        },
                        //折线数据定义
                        geometries: [
                            {
                                //第1条线
                                id: "test", //折线唯一标识，删除时使用
                                styleId: "style_blue", //绑定样式名
                                paths: path,
                            },
                        ],
                    });

                    const ptSW = new TMap.LatLng(minLat, minLon);
                    const ptNE = new TMap.LatLng(maxLat, maxLon);
                    const bounds = new TMap.LatLngBounds(ptSW, ptNE);
                    that.tmap.fitBounds(bounds, { padding: 100 });
                    console.log(bounds);

                    //		        	let multiLabel = new TMap.MultiLabel({
                    //						map:that.tmap,
                    //						styles:,
                    //						enableCollision:false,
                    //						geometries:[],
                    //					});

                    let infoWindow = null;

                    markers.on("mouseover", function (event) {
                        console.log("mouse over");
                        console.log(event.geometry.properties.title);

                        if (infoWindow) {
                            infoWindow.close();
                            infoWindow.destroy();
                        }

                        //使用 info window 不妥，打开后，不会自动关闭
                        infoWindow = new TMap.InfoWindow({
                            map: that.tmap,
                            position: event.latLng, //设置信息框位置
                            content: event.geometry.properties.title, //设置信息框内容
                        });
                    });

                    //that.tmap.setCenter(new TMap.LatLng(list[0].lat,list[0].lng));
                });
            };

            const loadMapV2 = function (lbsList) {
                console.log(["bm value init= ", that.bm, that]);
                if (null == that.bm) {
                    that.bm = new BMapGL.Map("bdmap_container");
                    that.bm.enableScrollWheelZoom(true); //允许鼠标缩放
                    console.log("init this.bm+++++++++++++++");
                } else {
                    console.log("no need to init^^^^^^^^^^^^^");
                }
                let gpsPointList = [];
                for (let lbs of lbsList) {
                    gpsPointList.push(new BMapGL.Point(lbs.lon, lbs.lat));
                }

                /**
                 * 坐标常量说明：
                 * COORDINATES_WGS84 = 1, WGS84坐标
                 * COORDINATES_WGS84_MC = 2, WGS84的平面墨卡托坐标
                 * COORDINATES_GCJ02 = 3，GCJ02坐标
                 * COORDINATES_GCJ02_MC = 4, GCJ02的平面墨卡托坐标
                 * COORDINATES_BD09 = 5, 百度bd09经纬度坐标
                 * COORDINATES_BD09_MC = 6，百度bd09墨卡托坐标
                 * COORDINATES_MAPBAR = 7，mapbar地图坐标
                 * COORDINATES_51 = 8，51地图坐标
                 * 以上是 translate 函数第2,3参数的含义
                 */

                let callbackFunction = function (data) {};

                let convertor = new BMapGL.Convertor();
                let bdPointList = [];

                let myTranslate = function (pointList, index) {
                    let len = pointList.length - index;
                    if (len > 10) {
                        len = 10;
                        convertor.translate(pointList.slice(index, index + len), 1, 5, function (data) {
                            bdPointList = bdPointList.concat(data.points);
                            myTranslate(pointList, index + len); //转换数量大于10时,在回调里面重新执行转换
                        });
                    } else {
                        //数量小于等于10时,执行最后一次,并拼接.结束
                        convertor.translate(pointList.slice(index, index + len), 1, 5, function (data) {
                            bdPointList = bdPointList.concat(data.points);
                            let latMax = bdPointList[0].lat;
                            let lonMax = bdPointList[0].lng;
                            let latMin = latMax;
                            let lonMin = lonMax;
                            for (const i in bdPointList) {
                                var marker = new BMapGL.Marker(bdPointList[i]); //生成图示
                                var label = new BMapGL.Label(lbsList[i].date.substr(5, 11), { offset: new BMapGL.Size(-40, -60) }); //生成文字
                                marker.setLabel(label); //放置跟随图示的文字
                                that.bm.addOverlay(marker); //放置图示
                                latMax = Math.max(bdPointList[i].lat, latMax);
                                latMin = Math.min(bdPointList[i].lat, latMin);
                                lonMax = Math.max(bdPointList[i].lng, lonMax);
                                lonMin = Math.min(bdPointList[i].lng, lonMin);
                            }
                            let pt1 = new BMapGL.Point(lonMin, latMin);
                            let pt2 = new BMapGL.Point(lonMax, latMax);
                            var bounds = new BMapGL.Bounds(pt1, pt2);

                            var polyline = new BMapGL.Polyline(bdPointList, {
                                strokeColor: "blue",
                                strokeWeight: 2,
                                strokeOpacity: 0.5,
                            });
                            that.bm.addOverlay(polyline);
                            that.bm.setBounds(bounds);
                            that.bm.centerAndZoom(bdPointList[bdPointList.length - 1], 15); //设置地图中心点与缩放
                        });
                    }
                };

                myTranslate(gpsPointList, 0);

                //				new BMapGL.Convertor().translate(bdPointList.slice(0,10),1,5,function(data){
                //					if(data.status === 0) {
                //						console.log(data);
                //						for(const i in data.points) {
                //							var marker = new BMapGL.Marker(data.points[i]);	//生成图示
                //							var label = new BMapGL.Label(lbsList[i].date,{offset:new BMapGL.Size(-40,-60)});	//生成文字
                //							marker.setLabel(label);	//放置跟随图示的文字
                //							that.bm.addOverlay(marker);	//放置图示
                //						}
                //						that.bm.centerAndZoom(data.points[0], 15);	//设置地图中心点与缩放
                //					}
                //				});
            };

            //读经纬度初始化地图
            /*
			jQuery.ajax({
				type:'POST',
				url:Consts.HTTP_PREFIX + 'GetLbs',
				data:{
					access_token:parsenCookie.loadAccessToken(),//jQuery.cookie('ps_access_token'),
					node_id: row.node_id,
				},
				context:this,
				success:function(res){
					//console.log(res);
					if("1" == res.result) {												
						//setTimeout(loadMap(res.lbs.lon,res.lbs.lat),500);
					}
					else {
						
					}
				},
				error:function(res){
					
				},
			});
			*/

            let ms = nowDate.getTime();
            ms -= 24 * 60 * 60 * 1000;
            let startTime = new Date(ms);

            let startms = Date.now();

            jQuery.ajax({
                type: "POST",
                url: Consts.HTTP_PREFIX + "GetLbsList",
                context: this,
                data: {
                    access_token: parsenCookie.loadAccessToken(),
                    node_id: row.node_id,
                    start_time: dateToMySqlDate(startTime),
                    end_time: dateToMySqlDate(nowDate),
                    count: -1,
                },
                success: function (res) {
                    console.log(res);
                    let getLbsListMs = Date.now() - startms;
                    console.log("GetLbsList servlet use ms =" + getLbsListMs);
                    if ("1" == res.result) {
                        console.log(["get lbs list ok", res]);
                        //this.lat = res.LBS.lat;
                        //this.lon = res.LBS.lon;
                        loadTMap(res.lbs_list);
                        //setTimeout(loadTMap(res.lbs_list),500);
                        //setTimeout(loadMapV2(res.lbs_list),500);
                        //setTimeout(loadMap(res.lbs_list),500);
                    } else {
                    }
                },
                error: function (res) {},
            });

            //this.lastSelectedNode = row;
            this.lastSelectedNode = this.nodeFilteredList[(this.pageIndex - 1) * PAGE_ITEM_MAX + index];
            this.lastSelectedNodeIndex = index;

            if (ExtGraphDrawing[this.lastSelectedNode.node_id]) {
                this.isExtGraphDisplay = true;
            } else {
                this.isExtGraphDisplay = false;
            }

            this.dialogGraphVisible = true;

            setTimeout(this.onsize, 500);

            this.reflashStartEndTimeData();
        },

        yibiaoDatasUnitTransfer(datas, node) {
            for (let data of datas) {
                for (let i in data.line_datas) {
                    let num = parseInt(i) + 1;
                    data["D" + num] = UnitTransfer.transferToUnit(data.line_datas[i].value, data.line_datas[i].unit, node.dataInfos[i].displayUnit);
                    data["D" + num + "U"] = node.dataInfos[i].displayUnit;

                    //data.displayValue = UnitTransfer.transferToUnit(data.line_datas[i].value,data.line_datas[i].unit,node.dataInfos[i].displayUnit);
                    //data.displayUnit = node.dataInfos[i].displayUnit;
                }
            }
        },

        //使用 websocket 取数据,在内部新建 websocket ,收齐数据后再把 ws close
        //pageCount 是每次返回多少个数据
        getNodeDatasByWebsocket(nodeId, pageCount, startTime, endTime, dataSource) {
            let websocket = new WebSocket(Consts.WS_PREFIX + "GetNodeDatas"); //创建WebSocket连接
            if (null == websocket) {
                console.log("新建 websocket 失败");
                return false;
            }

            var that = this;

            //上面 new WebSocket 成功后,就会执行下面的 onopen 回调,然后向服务器发送读数请求
            websocket.onopen = function (event) {
                const jSend = {
                    command: "get_node_datas",
                    access_token: parsenCookie.loadAccessToken(),
                    get_data_params: {
                        access_token: parsenCookie.loadAccessToken(),
                        node_id: nodeId,
                        count: -1,
                        page_count: pageCount,
                        start_time: dateToMySqlDate(startTime),
                        end_time: dateToMySqlDate(endTime),
                    },
                };

                websocket.send(JSON.stringify(jSend));
            };

            //上面发送读数请求后,就会在下面的回调收到数据
            websocket.onmessage = function (event) {
                //console.log('websocket get message');
                //console.log(event.data);
                let data = null;

                try {
                    data = JSON.parse(event.data);
                    //console.log(data);
                } catch (e) {
                    console.log("json parse error");
                    console.log(e);
                    return;
                }

                //先处理一下收到数据的日期
                for (let d of data.node_datas) {
                    d.date = d.date.substring(0, 19);
                }

                dataSource.push(...data.node_datas);

                //第一份数据到达
                if ("new_data" == data.command) {
                    //console.log('new');
                    //dataSource.push(...data.node_datas);
                }
                //后续数据增加
                else if ("add_data" == data.command) {
                    //console.log('add');
                    //that.dataList.push(...data.node_datas);
                }
                //最后一份数据到达
                else if ("end_data" == data.command) {
                    //console.log('end');
                    //that.dataList.push(...data.node_datas);
                    websocket.close();
                }
            };

            return true;
        },

        setupDataAtTotalCanvas() {
            //当使用默认最新24小时的时候
            if (false == this.selectStartEndTime) {
                //求出 js Date 时间
                //this.endTime = dateUpToHour(new Date());
                if (this.lastSelectedNode.node_data.date) {
                    this.endTime = dateUpToHour(mySqlDateToDate(this.lastSelectedNode.node_data.date));
                    let ms = this.endTime.getTime();
                    ms -= 24 * 60 * 60 * 1000;
                    this.startTime = new Date(ms);
                } else {
                    return; //当使用默认时间,但是又没有默认时间时,就返回
                }
            }
        },

        reflashStartEndTimeData() {
            //当使用默认最新24小时的时候
            if (false == this.selectStartEndTime) {
                //求出 js Date 时间
                //this.endTime = dateUpToHour(new Date());
                if (this.lastSelectedNode.node_data.date) {
                    this.endTime = dateUpToHour(mySqlDateToDate(this.lastSelectedNode.node_data.date));
                    let ms = this.endTime.getTime();
                    ms -= 24 * 60 * 60 * 1000;
                    this.startTime = new Date(ms);
                } else {
                    return; //当使用默认时间,但是又没有默认时间时,就返回
                }
            }

            jQuery.ajax({
                type: "POST",
                url: Consts.HTTP_PREFIX + `GetNodeDatas`,
                data: {
                    access_token: parsenCookie.loadAccessToken(),
                    node_id: this.lastSelectedNode.node_id,
                    count: -1,
                    start_time: dateToMySqlDate(this.startTime),
                    end_time: dateToMySqlDate(this.endTime),
                },
                context: this,
                success: function (res) {
                    if ("1" == res.result) {
                        console.log("get datas servlet ok");
                        this.yibiaoDatas = res.node_datas;
                        this.yibiaoDatasUnitTransfer(this.yibiaoDatas, this.lastSelectedNode);
                        console.log("transfer datas ok");
                        //this.onsize(null);
                        this.setupDataToEcharts();
                        let drawInfo = ExtGraphDrawing[this.lastSelectedNode.node_id];
                        if (drawInfo) {
                            //this.isExtGraphDisplay = true;
                            drawInfo.drawFunc(
                                drawInfo.drawData,
                                this.lastSelectedNode.dataInfos[0].displayValue,
                                this.lastSelectedNode.dataInfos[1].displayValue,
                                this.lastSelectedNode.dataInfos[2].displayValue,
                                drawInfo.rou,
                                drawInfo.g
                            );
                        } else {
                            //this.isExtGraphDisplay = false;
                        }
                        //this.drawCanvas();
                    }
                },
                error: function (res) {},
            });
        },

        onDataZoom(params) {
            console.log("onDataZoom triggered");
            //console.log(params);
            //console.log([params.batch[0].start,params.batch[0].end]);

            //如果是二次触发,不再处理
            if ("zhang" == params.customFlag) {
                return;
            }

            //=====================================如果是原始动作,进行处理
            if (undefined == params.start) {
                //inside 的 dataZoom 在动作
                console.log("inside data zoom");

                for (let ei of this.echartsInstance) {
                    if (!ei) {
                        continue;
                    }
                    ei.dispatchAction({
                        type: "dataZoom",
                        customFlag: "zhang",
                        // 开始位置的百分比，0 - 100
                        start: params.batch[0].start,
                        // 结束位置的百分比，0 - 100
                        end: params.batch[0].end,
                    });
                }

                if (this.echartsInstanceVol) {
                    this.echartsInstanceVol.dispatchAction({
                        type: "dataZoom",
                        customFlag: "zhang",
                        // 开始位置的百分比，0 - 100
                        start: params.batch[0].start,
                        // 结束位置的百分比，0 - 100
                        end: params.batch[0].end,
                    });
                }
            } else {
                //slider 的 dataZoom 在动作
                console.log("slider data zoom");
                for (let ei of this.echartsInstance) {
                    if (!ei) {
                        continue;
                    }
                    ei.dispatchAction({
                        type: "dataZoom",
                        customFlag: "zhang",
                        // 开始位置的百分比，0 - 100
                        start: params.start,
                        // 结束位置的百分比，0 - 100
                        end: params.end,
                    });
                }
                if (this.echartsInstanceVol) {
                    this.echartsInstanceVol.dispatchAction({
                        type: "dataZoom",
                        customFlag: "zhang",
                        // 开始位置的百分比，0 - 100
                        start: params.start,
                        // 结束位置的百分比，0 - 100
                        end: params.end,
                    });
                }
            }

            //			this.echartsInstance[0].dispatchAction({
            //			    type: 'dataZoom',
            //			    customFlag: 'zhang',
            //			    // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
            //			    //dataZoomIndex: number,
            //			    // 开始位置的百分比，0 - 100
            //			    start: params.batch[0].start,
            //			    // 结束位置的百分比，0 - 100
            //			    end: params.batch[0].end,
            //			    // 开始位置的数值
            //			    //startValue: params.batch[0].start,
            //			    // 结束位置的数值
            //			    //endValue: params.batch[0].end,
            //			});
        },

        drawCanvas() {
            var domCanvas = document.getElementById("cav_guan");
            var ctx = domCanvas.getContext("2d");
            var img = new Image();
            img.src = "wo_guan.png";

            var that = this;

            img.onload = function () {
                //var bg = ctx.createPattern(img, "no-repeat");//createPattern() 方法在指定的方向内重复指定的元素。
                //var bg = ctx.createPattern(img, "no-repeat");
                //ctx.fillStyle = bg;//fillStyle 属性设置或返回用于填充绘画的颜色、渐变或模式。
                //ctx.fillRect(0, 0, domCanvas.width, domCanvas.height);//绘制已填充矩形fillRect(左上角x坐标, 左上角y坐标, 宽, 高)
                //ctx.fillRect(0, 0, 400, 400);

                const drawObj = ExtGraphDrawing[that.lastSelectedNode.ID + ""];

                if (!drawObj) {
                    return;
                }

                ctx.drawImage(img, 0, 0, domCanvas.width, domCanvas.height);

                let points = [
                    { x: 76, y: 124 },
                    { x: 323, y: 124 },
                    { x: 323, y: 272 },
                    { x: 76, y: 272 },
                ];

                for (let point of points) {
                    point.x = (point.x * domCanvas.width) / img.width;
                    point.y = (point.y * domCanvas.height) / img.height;
                }

                var lg = ctx.createLinearGradient(
                    (points[0].x + points[1].x) / 2,
                    (points[0].y + points[1].y) / 2,
                    (points[2].x + points[3].x) / 2,
                    (points[2].y + points[3].y) / 2
                );

                lg.addColorStop(0, "red");
                lg.addColorStop(0.5, PsColor.PS_PIN);
                lg.addColorStop(1, PsColor.PS_GREEN);

                const dY = points[3].y - points[0].y;

                const h = drawObj.getHeight(that.lastSelectedNode.D1);

                const newY = points[3].y - (dY * h) / drawObj.maxH;

                points[0].y = newY;
                points[1].y = newY;

                ctx.beginPath();
                ctx.moveTo(points[3].x, points[3].y);
                for (let point of points) {
                    ctx.lineTo(point.x, point.y);
                }
                ctx.closePath();
                //ctx.fillStyle = '#FF0000';
                ctx.fillStyle = lg;
                ctx.fill();
                ctx.stroke();
            };
        },

        setupDataToEcharts() {
            const infos = this.lastSelectedNode.dataInfos;
            const dnames = ["D1", "D2", "D3", "D4"];
            const colors = PsColor.paramColors(); //['#409EFF','#67C23A','#E6A23C','#F56C6C'];

            var that = this;

            let dzSlider = {
                // 这个dataZoom组件，默认控制x轴。
                type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: 0, // 左边在 10% 的位置。
                end: 100, // 右边在 60% 的位置。
                showDetail: false,
            };

            let dzInside = {
                // 这个dataZoom组件，也控制x轴。
                type: "inside", // 这个 dataZoom 组件是 inside 型 dataZoom 组件
                start: 0, // 左边在 10% 的位置。
                end: 100, // 右边在 60% 的位置。
            };

            const volDomInstance = document.getElementById("canvas_vol");
            this.echartsInstanceVol = echarts.init(volDomInstance);
            this.echartsInstanceVol.on("dataZoom", this.onDataZoom);
            const volMax = 8;
            const volMin = 0;

            let volLabel = {
                formatter: function (param) {
                    const dt = new Date(param.value);
                    //const timeStr = dt.getMonth() + '月' + dt.getDay() + '日' + dt.getHours() + '时' + dt.getMinutes() + '分';
                    const timeStr = dt.getMonth() + 1 + "-" + dt.getDate() + " " + formatNumber(dt.getHours()) + ":" + formatNumber(dt.getMinutes());
                    return timeStr;
                },
            };

            let volOption = {
                title: {
                    text: "供电电压",
                    left: "center",
                },
                tooltip: {
                    trigger: "axis",

                    axisPointer: {
                        type: "shadow", //['line','shadow','cross','none'][i],
                        animation: false,
                        axis: "x",
                        //snap:false,
                        label: volLabel,
                    },
                    //formatter:'{a} {b} {c} {a0} {b0} {c0} {a1} {b1} {c1}',
                },
                xAxis: {
                    type: "time",
                    max: this.endTime,
                    min: this.startTime,
                },
                yAxis: {
                    type: "value",
                    name: "伏",
                    max: volMax, //'dataMax',
                    min: volMin, //'dataMin',
                },
                grid: {
                    bottom: 40,
                    containLabel: true,
                },
                dataZoom: [dzSlider, dzInside],
                color: "#000000",
                dataset: {
                    source: this.yibiaoDatas,
                },
                series: [
                    {
                        name: "电压",
                        type: "line",
                        symbolSize: 8,
                        encode: {
                            x: "date",
                            y: "vol",
                            //y:'displayValue',
                        },
                    },
                ],
            };
            this.echartsInstanceVol.setOption(volOption);

            for (var i in infos) {
                const domInstance = document.getElementById(infos[i].canvas_id);
                if (!domInstance) {
                    continue;
                }

                this.echartsInstance[i] = echarts.init(domInstance);
                if (!this.echartsInstance[i]) {
                    continue;
                }

                this.echartsInstance[i].on("dataZoom", this.onDataZoom);
                //				this.echartsInstance[i].on('dataZoom',function(params){
                //					console.log('onDataZoom triggered');
                //					console.log(params);
                //				});

                const yMax =
                    infos[i].setMax == "1"
                        ? infos[i].max
                        : function (value) {
                              return Math.ceil((value.max - value.min) * 0.1 + value.max);
                          };
                const yMin =
                    infos[i].setMin == "1"
                        ? infos[i].min
                        : function (value) {
                              return Math.floor(value.min - (value.max - value.min) * 0.1);
                          };
                //let yMax = infos[i].setMax ? infos[i].max : 'dataMax';
                //let yMin = infos[i].setMin ? infos[i].min : 'dataMin';

                let labelEx = {};

                const lineNumber = i;
                const funcName = that.lastSelectedNode.node_id + "_" + i;

                if (ExtUnitCalculate[funcName]) {
                    labelEx = {
                        formatter: function (param) {
                            //return '时间: ' + param.value + '\r\n' + infos[i].desc + ': ' + param.data[param.index] + infos[i].name;
                            //console.log(param);
                            if (!param.seriesData[0]) {
                                console.log("遇到 seriessData[0] 为  null");
                                return "";
                            }
                            if (!param.seriesData[0].data) {
                                console.log("遇到 data 为  null");
                                return "";
                            }

                            //const strTest = 'D' + (parseInt(i)+1);

                            const value = param.seriesData[0].data["D" + (parseInt(lineNumber) + 1)];
                            //const value = param.seriesData[0].data.displayValue;
                            //const value = param.data[param.index];
                            const dt = new Date(param.value);
                            //const timeStr = dt.getMonth() + '月' + dt.getDay() + '日' + dt.getHours() + '时' + dt.getMinutes() + '分';
                            const timeStr =
                                dt.getMonth() + 1 + "-" + dt.getDate() + " " + formatNumber(dt.getHours()) + ":" + formatNumber(dt.getMinutes());

                            const du = that.lastSelectedNode.dataInfos[lineNumber].displayUnit;

                            const displayValue = UnitTransfer.transferToUnit(value, that.lastSelectedNode.dataInfos[lineNumber].displayUnit, "0");
                            let vol = ExtUnitCalculate[funcName](displayValue);

                            return timeStr + "  " + vol;
                        },
                    };
                } else {
                    labelEx = {
                        formatter: function (param) {
                            const dt = new Date(param.value);
                            //const timeStr = dt.getMonth() + '月' + dt.getDay() + '日' + dt.getHours() + '时' + dt.getMinutes() + '分';
                            const timeStr =
                                dt.getMonth() + 1 + "-" + dt.getDate() + " " + formatNumber(dt.getHours()) + ":" + formatNumber(dt.getMinutes());
                            return timeStr;
                        },
                    };
                }

                let option = {
                    title: {
                        text: infos[i].line_desc,
                        left: "center",
                    },
                    tooltip: {
                        trigger: "axis",

                        axisPointer: {
                            type: "shadow", //['line','shadow','cross','none'][i],
                            animation: false,
                            axis: "x",
                            //snap:false,
                            label: labelEx,
                            //				        	{
                            //				        		formatter:function(param){
                            //				        			//return '时间: ' + param.value + '\r\n' + infos[i].desc + ': ' + param.data[param.index] + infos[i].name;
                            //				        			//console.log(param.seriesData[0].data);
                            //				        			return '132';
                            //				        		},
                            //				        	},
                        },
                        //formatter:'{a} {b} {c} {a0} {b0} {c0} {a1} {b1} {c1}',
                    },
                    xAxis: {
                        type: "time",
                        max: this.endTime,
                        min: this.startTime,
                    },
                    yAxis: {
                        type: "value",
                        name: "单位: " + infos[i].unit_name,
                        max: yMax, //'dataMax',
                        min: yMin, //'dataMin',
                    },
                    grid: {
                        bottom: 40,
                        containLabel: true,
                    },
                    dataZoom: [
                        dzSlider,
                        dzInside,
                        //				        {   // 这个dataZoom组件，默认控制x轴。
                        //				            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                        //				            start: 0,      // 左边在 10% 的位置。
                        //				            end: 100,         // 右边在 60% 的位置。
                        //				            showDetail: false,
                        //				        },
                        //				        {   // 这个dataZoom组件，也控制x轴。
                        //				            type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
                        //				            start: 0,      // 左边在 10% 的位置。
                        //				            end: 100,         // 右边在 60% 的位置。
                        //				        }
                    ],
                    color: colors[i],
                    dataset: {
                        source: this.yibiaoDatas,
                    },
                    series: [
                        {
                            name: infos[i].unit_desc,
                            type: "line",
                            symbolSize: 8,
                            encode: {
                                x: "date",
                                y: dnames[i],
                                //y:'displayValue',
                            },
                        },
                    ],
                };
                this.echartsInstance[i].setOption(option);
            } //for(int i=0 ~ 4)结束

            const drawObj = ExtGraphDrawing[that.lastSelectedNode.node_id + ""];

            if (drawObj) {
                const domKpa = document.getElementById("instrum_kpa");
                if (!domKpa) {
                    return;
                }

                this.echartKpaInstance = echarts.init(domKpa);
                if (!this.echartKpaInstance) {
                    return;
                }

                const h = drawObj.maxKpaToMaxHeight(drawObj.maxKpa);
                const deg = (drawObj.maxH * 270) / h;
                const endDeg = 225 - deg;

                const optionKpa = {
                    series: [
                        {
                            type: "gauge", //仪表盘类型
                            min: drawObj.minKpa,
                            max: drawObj.maxKpa,
                            splitNumber: drawObj.splitKpa,
                            radius: "80%",
                            axisLine: {
                                lineStyle: {
                                    color: [[1, drawObj.colorKpa]],
                                    width: 2,
                                },
                            },
                            splitLine: {
                                distance: 0,
                                length: 18,
                                lineStyle: {
                                    color: drawObj.colorKpa,
                                },
                            },
                            axisTick: {
                                distance: -32,
                                length: 10,
                                lineStyle: {
                                    color: drawObj.colorKpa,
                                },
                            },
                            axisLabel: {
                                distance: -42,
                                color: drawObj.colorKpa,
                                fontSize: 18,
                            },
                            anchor: {
                                show: true,
                                size: 20,
                                itemStyle: {
                                    borderColor: "#000",
                                    borderWidth: 2,
                                },
                            },
                            pointer: {
                                offsetCenter: [0, "5%"],
                                //icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                                length: "80%",
                                itemStyle: {
                                    color: "#000",
                                },
                            },
                            detail: {
                                valueAnimation: true,
                                precision: 2,
                                offsetCenter: [0, 90],
                                fontSize: 18,
                                formatter: drawObj.formatterKpa,
                            },
                            title: {
                                offsetCenter: [-50, 120],
                                color: drawObj.colorKpa,
                            },
                            data: [
                                {
                                    value: this.lastSelectedNode.D1,
                                    name: drawObj.titleKpa,
                                },
                            ],
                        },
                        {
                            type: "gauge",
                            min: drawObj.minH,
                            max: drawObj.maxH,
                            splitNumber: drawObj.splitH,
                            radius: "70%",
                            endAngle: endDeg,
                            axisLine: {
                                lineStyle: {
                                    color: [[1, drawObj.colorH]],
                                    width: 3,
                                },
                            },
                            splitLine: {
                                distance: -3,
                                length: 18,
                                lineStyle: {
                                    color: drawObj.colorH,
                                },
                            },
                            axisTick: {
                                distance: 0,
                                length: 10,
                                lineStyle: {
                                    color: drawObj.colorH,
                                },
                            },
                            axisLabel: {
                                distance: 10,
                                fontSize: 19,
                                color: drawObj.colorH,
                            },
                            pointer: {
                                show: false,
                            },
                            title: {
                                show: true,
                                offsetCenter: [20, 120],
                                color: drawObj.colorH,
                            },
                            anchor: {
                                show: true,
                                size: 14,
                                itemStyle: {
                                    color: "#000",
                                },
                            },
                            detail: {
                                show: false,
                            },
                            data: [{ value: "1", name: drawObj.titleH }],
                        },
                    ], //series 数组结束
                };

                //option.series[0].data[0].value = 10.123;
                //option.series[1].data[0].value = 1.234;
                this.echartKpaInstance.setOption(optionKpa, true);

                const domV = document.getElementById("instrum_volume");
                if (!domV) {
                    return;
                }

                this.echartVInstance = echarts.init(domV);
                if (!this.echartVInstance) {
                    return;
                }

                const volume = drawObj.kPaToVolume(this.lastSelectedNode.D1);

                const optionV = {
                    series: [
                        {
                            type: "gauge", //仪表盘类型
                            min: drawObj.minV,
                            max: drawObj.maxV,
                            splitNumber: drawObj.splitV,
                            radius: "80%",
                            axisLine: {
                                lineStyle: {
                                    color: [[1, drawObj.colorV]],
                                    width: 2,
                                },
                            },
                            splitLine: {
                                distance: 0,
                                length: 18,
                                lineStyle: {
                                    color: drawObj.colorV,
                                },
                            },
                            axisTick: {
                                distance: -32,
                                length: 10,
                                lineStyle: {
                                    color: drawObj.colorV,
                                },
                            },
                            axisLabel: {
                                distance: -42,
                                color: drawObj.colorV,
                                fontSize: 18,
                            },
                            anchor: {
                                show: true,
                                size: 20,
                                itemStyle: {
                                    borderColor: "#000",
                                    borderWidth: 2,
                                },
                            },
                            pointer: {
                                offsetCenter: [0, "5%"],
                                //icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                                length: "80%",
                                itemStyle: {
                                    color: "#000",
                                },
                            },
                            detail: {
                                valueAnimation: true,
                                precision: 2,
                                offsetCenter: [0, 90],
                                fontSize: 18,
                                formatter: drawObj.formatterV,
                            },
                            title: {
                                offsetCenter: [-50, 120],
                                color: drawObj.colorV,
                            },
                            data: [
                                {
                                    value: volume,
                                    name: drawObj.titleV,
                                },
                            ],
                        },
                        {
                            type: "gauge",
                            min: drawObj.minT,
                            max: 30, //drawObj.maxT(),
                            splitNumber: drawObj.splitT,
                            radius: "70%",
                            axisLine: {
                                lineStyle: {
                                    color: [[1, drawObj.colorT]],
                                    width: 3,
                                },
                            },
                            splitLine: {
                                distance: -3,
                                length: 18,
                                lineStyle: {
                                    color: drawObj.colorT,
                                },
                            },
                            axisTick: {
                                distance: 0,
                                length: 6,
                                lineStyle: {
                                    color: drawObj.colorT,
                                },
                            },
                            axisLabel: {
                                distance: 10,
                                fontSize: 19,
                                color: drawObj.colorT,
                            },
                            pointer: {
                                show: false,
                            },
                            title: {
                                show: true,
                                offsetCenter: [20, 120],
                                color: drawObj.colorT,
                            },
                            anchor: {
                                show: true,
                                size: 14,
                                itemStyle: {
                                    color: "#000",
                                },
                            },
                            detail: {
                                show: false,
                            },
                            data: [{ value: "1", name: drawObj.titleT }],
                        },
                    ], //series 数组结束
                };

                this.echartVInstance.setOption(optionV, true);
            }

            //this.echartKpaInstance.on('dataZoom',this.onDataZoom);
        },

        btnHideDataGraph() {
            //console.log(this.bdmap);
            //console.log(["1",this.bm]);
            //this.bm.clearOverlays();
            this.bm = null;

            if (null != this.tmap) {
                this.tmap.destroy();
                this.tmap = null;
            }
            this.dialogGraphVisible = false;
        },

        btnHideAlarmList() {
            this.dialogAlarmListVisible = false;
        },

        beforeCloseGraphDialog() {},

        beforeCloseAlarmListDialog() {},

        //		tabCellStyle(obj) {
        //			if("数据" == obj.column.label) {
        //				if("1" == obj.row.ALARM_NOTICE) {
        //					return {backgroundColor:PsColor.PS_YELLOW,};
        //				}
        //			}
        //			//console.log(obj);
        //		},

        alarmListCellStyle(obj) {
            if ("事件类型" == obj.column.label) {
                if ("报警" == obj.row.status) {
                    return { color: "red" };
                } else {
                    return { color: PsColor.PS_GREEN };
                }
            }
            for (let i = 0; i < 4; ++i) {
                if (this.descLo[i] == obj.column.label) {
                    if ("1" == obj.row.la[i]) {
                        return { color: "red" };
                    }
                }
                if (this.descHi[i] == obj.column.label) {
                    if ("1" == obj.row.ha[i]) {
                        return { color: "red" };
                    }
                }
            }
        },

        btnOpenAlarmList(index, row) {
            this.lastSelectedNode = row;

            for (let i = 0; i < 4; ++i) {
                this.enaLoAlarm[i] = (this.lastSelectedNode.ALARM_FLAG & (1 << (i * 2))) != 0;
                this.enaHiAlarm[i] = (this.lastSelectedNode.ALARM_FLAG & (1 << (i * 2 + 1))) != 0;
                this.enaWnAlarm[i] = (this.lastSelectedNode.ALARM_FLAG & (1 << (i + 8))) != 0;
            }

            jQuery.ajax({
                type: "POST",
                url: `https://app.parsen.com.cn/ParsenHttpApi/GetNodeAlarms`,
                data: {
                    ACCESS_TOKEN: parsenCookie.loadAccessToken(),
                    ID: row.ID,
                    COUNT: -1,
                    START_TIME: "2021-08-03",
                    END_TIME: dateToMySqlDate(new Date()),
                },
                context: this,
                success: function (res) {
                    //console.log(res);

                    for (alarm of res.NODE_ALARMS) {
                        let la = [alarm.D1L, alarm.D2L, alarm.D3L, alarm.D4L];
                        let ha = [alarm.D1H, alarm.D2H, alarm.D3H, alarm.D4H];
                        let wa = [alarm.D1W, alarm.D2W, alarm.D3W, alarm.D4W];
                        alarm["la"] = la;
                        alarm["ha"] = ha;
                        alarm["wa"] = wa;
                        let alarmValue = [
                            UnitTransfer.transferToUnit(alarm.D1, row.dataInfos[0].unit, row.dataInfos[0].displayUnit) + row.dataInfos[0].name,
                            UnitTransfer.transferToUnit(alarm.D2, row.dataInfos[1].unit, row.dataInfos[1].displayUnit) + row.dataInfos[1].name,
                            UnitTransfer.transferToUnit(alarm.D3, row.dataInfos[2].unit, row.dataInfos[2].displayUnit) + row.dataInfos[2].name,
                            UnitTransfer.transferToUnit(alarm.D4, row.dataInfos[3].unit, row.dataInfos[3].displayUnit) + row.dataInfos[3].name,
                        ];
                        alarm["alarmValue"] = alarmValue;

                        let anyAlarm = false;
                        for (let i = 0; i < 4; ++i) {
                            if ("1" == alarm.la[i]) {
                                anyAlarm = true;
                                break;
                            }
                            if ("1" == alarm.ha[i]) {
                                anyAlarm = true;
                                break;
                            }
                            if ("1" == alarm.wa[i]) {
                                anyAlarm = true;
                                break;
                            }
                        }
                        alarm["status"] = anyAlarm ? "报警" : "恢复正常";
                    }

                    this.nodeAlarmList = res.NODE_ALARMS;

                    this.alarmListPageCount = Math.ceil(this.nodeAlarmList.length / ALARM_LIST_PAGE_ITEM_MAX) * 10;
                    this.alarmListpageIndex = Math.min(this.alarmListPageIndex, this.alarmListPageCount / 10);
                    this.alarmListPageIndex = Math.max(this.pageIndex, 1);
                    this.alarmListTableData = this.nodeAlarmList.slice(
                        (this.alarmListPageIndex - 1) * ALARM_LIST_PAGE_ITEM_MAX,
                        this.alarmListPageIndex * ALARM_LIST_PAGE_ITEM_MAX
                    );
                    this.alarmListCurrentPage = this.alarmListPageIndex;

                    this.dialogAlarmListVisible = true;

                    this.onsize();
                },
            });
        },

        btnCleanAlarmNoticeFlag() {
            jQuery.ajax({
                type: "POST",
                url: `https://app.parsen.com.cn/ParsenHttpApi/CleanAlarmNoticeFlag`,
                data: {
                    ACCESS_TOKEN: parsenCookie.loadAccessToken(),
                    ID: this.lastSelectedNode.node_id,
                },
                context: this,
                success: function (res) {
                    //console.log(res);
                    if ("1" == res.result) {
                        this.lastSelectedNode.ALARM_POP = "0";
                        this.lastSelectedNode.ALARM_NOTICE = "0";
                    }
                },
            });
        },

        btnOpenDataList() {
            //this.lastSelectedNode.ALARM_POP = "0";
            //this.lastSelectedNode.ALARM_NOTICE = "0";
        },

        btnCalcTest() {},

        //================================弹窗
        //		saveAlarm(datas){
        //			for(data of datas){
        //				for(i of data.line_datas){
        //					if((0 != i.alarmFlag)&&(11 != i.alarmFlag)&&(20 != i.alarmFlag)&&(24 != i.alarmFlag)){
        //						this.alarmMsg[data] = i.time;
        //						this.alarmMsg[imei] = data.imei;
        //						this.alarmMsg[paramType] = i.type;
        //						this.alarmMsg[alarmType] = typeCon(i.alarmFlag);
        //						this.alarmList.push(this.alarmMsg);
        //					}
        //				}
        //			}
        //			if(null != alarmMsg){
        //				this.dialogAliarmVisible = true;
        //			}
        //		}
        //		,
        //
        //		typeChange(alarmFlag){
        //			if(1==alarmFlag){
        //				return "低于下限报警";
        //			}else if(2==alarmFlag){
        //				return "高于上限报警";
        //			}else if(3==alarmFlag){
        //				return "低于下限或高于上限报警";
        //			}else if(4==alarmFlag){
        //				return "高于下限报警";
        //			}else if(5==alarmFlag){
        //				return "低于上限报警";
        //			}else if(6==alarmFlag){
        //				return "高低区域内报警";
        //			}else if(7==alarmFlag){
        //				return "达到变化阈值报警";
        //			}else if(10==alarmFlag){
        //				return "预热";
        //			}else if(12==alarmFlag){
        //				return "预警";
        //			}else if(13==alarmFlag){
        //				return "一级报警";
        //			}else if(14==alarmFlag){
        //				return "二级报警";
        //			}else if(21==alarmFlag){
        //				return "有毒探测器故障";
        //			}else if(22==alarmFlag){
        //				return "有毒探测器报警";
        //			}else if(25==alarmFlag){
        //				return "可燃探测器故障";
        //			}else if(26==alarmFlag){
        //				return "可燃探测器报警";
        //			}
        //		}
        //		,

        isOffline(last_time, send_gap, now) {
            let offline = true;
            last_time = mySqlDateToDate(last_time);
            let spanMinute = (now - last_time) / 1000 / 60;
            let offline_ = spanMinute > send_gap * 3;
            return offline_ ? "离线" : "在线";
        },
        outPutList() {
            let listData = [];
            let now = new Date();
            console.log(now);
            this.nodeFilteredList.forEach((item) => {
                let companyName = item["company_name"] ? item["company_name"] : "";
                let projectName = item["project_name"] ? item["project_name"].replace(",", ":") : "";
                let nodeName = item["node_name"] ? item["node_name"] : "";
                let nodeData = item["node_data"] ? item["node_data"] : "";
                let date = nodeData["date"] ? nodeData["date"] : "";
                let sendGap = item["send_gap"] ? item["send_gap"] : "";
                let group = item["group"] ? item["group"] : "";
                let imei = item["imei"] ? item["imei"] : "";
                let iccid = item["iccid"] ? item["iccid"] : "";
                listData.push({
                    company: companyName,
                    project: projectName,
                    nodeName: nodeName,
                    imei: imei,
                    group: group,
                    iccid: iccid,
                    lastTime: date,
                    state: this.isOffline(date, sendGap, now),
                });
            });
            let str = `公司名称,项目名称,仪表名称,imei号,工位号,iccid,最后通信时间,仪表状态\n`;
            // 增加  为了不让表格显示科学计数法或者其他格式
            for (let i = 0; i < listData.length; i++) {
                for (const key in listData[i]) {
                    str += `${listData[i][key] + "\t"},`;
                }
                str += "\n";
            }
            // encodeURIComponent解决中文乱码
            const uri = "data:text/csv;charset=utf-8," + encodeURIComponent(str);
            // 通过创建a标签实现
            const link = document.createElement("a");
            link.href = uri;
            // 对下载的文件命名
            link.download = "json数据表.csv";
            link.click();
        },

        btnHideDialog() {
            this.dialogAlarmVisible = false;
            //alarMsg = {};
        },

        flexColumnWidth(str, tableData, flag = "max") {
            // str为该列的字段名(传字符串);tableData为该表格的数据源(传变量);
            // flag为可选值，可不传该参数,传参时可选'max'或'equal',默认为'max'
            // flag为'max'则设置列宽适配该列中最长的内容,flag为'equal'则设置列宽适配该列中第一行内容的长度。
            str = str + "";
            let columnContent = "";
            if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
                return;
            }
            if (!str || !str.length || str.length === 0 || str === undefined) {
                return;
            }
            if (flag === "equal") {
                // 获取该列中第一个不为空的数据(内容)
                for (let i = 0; i < tableData.length; i++) {
                    if (tableData[i][str].length > 0) {
                        // console.log('该列数据[0]:', tableData[0][str])
                        columnContent = tableData[i][str];
                        break;
                    }
                }
            } else {
                // 获取该列中最长的数据(内容)
                let index = 0;
                for (let i = 0; i < tableData.length; i++) {
                    if (tableData[i][str] === null) {
                        return;
                    }
                    const now_temp = tableData[i][str] + "";
                    const max_temp = tableData[index][str] + "";
                    if (now_temp.length > max_temp.length) {
                        index = i;
                    }
                }
                columnContent = tableData[index][str] ? tableData[index][str] : "暂无数据";
            }
            // console.log('该列数据[i]:', columnContent)
            // 以下分配的单位长度可根据实际需求进行调整
            let flexWidth = 0;
            for (const char of columnContent) {
                if (char >= "a" && char <= "z") {
                    flexWidth += 13;
                } else if (char >= "A" && char <= "Z") {
                    // 如果是大写英文字符，为字符分配23个单位宽度
                    flexWidth += 23;
                } else if (char >= "\u4e00" && char <= "\u9fa5") {
                    // 如果是中文字符，为字符分配23个单位宽度
                    flexWidth += 23;
                } else if (char >= "0" && char <= "9") {
                    // 如果是数字，为字符分配10个单位宽度
                    flexWidth += 11;
                } else {
                    // 其他种类字符，为字符分配8个单位宽度
                    flexWidth += 8;
                }
            }
            if (flexWidth < 80) {
                // 设置最小宽度
                flexWidth = 80;
                console.log("宽度小于80");
            }
            // if (flexWidth > 250) {
            //   // 设置最大宽度
            //   flexWidth = 250
            // }
            return flexWidth;
        },

        fontSize(res) {
            const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (!clientWidth) return;
            let fontSize = clientWidth / 1920;
            return res * fontSize;
        },

        rotateImages() {
            // this.images[this.currentIndex].classList.remove('active');
            // this.currentIndex++;
            // if (this.currentIndex >= this.images.length) {
            // 	this.currentIndex = 0;
            // }
            // this.images[this.currentIndex].classList.add('active');
        },
    }, //------------------------------------------methods 结束
};

var Ctor = Vue.extend(Main);
new Ctor().$mount("#real_data_list");
