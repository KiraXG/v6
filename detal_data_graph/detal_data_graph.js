/**
 *
 */
var Main = {
    data: function () {
        let myData = {
            linCount: 0,
            tempLine: [],
            dataCount: 0,
            datasLength: 0,
            lineDatas: {},
            changeLineDatas: [],
            chartsDom: [],

            //=======================================错误弹窗
            dialogLostAccessTokenVisible: false,
            dialogLostProjectListVisible: false,

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

            //========================================ProjectsNodes的websocket

            //=======================================右则仪表列表
            manageCompany: false,

            filterNodeText: "",
            nodeTableData: [
                //仪表列表的数据源
            ],

            nodeList: [], //读取到的仪表数据总表
            nodeFilteredList: [], //刷选后的仪表数据表

            pageCount: 0, //总页数,数值是页数 * 10
            pageIndex: 0, //当前页
            //因为在读入当前页时整个表格还未出来,所以分2步,先读,处理完数据后再设置 currentPage 更新显示
            currentPage: 0, //与控件绑定的当前页变量

            tableStyle: {},

            //=======================================数据详图
            bm: null, //百度地图
            tmap: null, //腾讯地图
            gdMap: null, //高德地图
            lastSelectedNodeIndex: -1, //记录正在处理的仪表的下标
            lastSelectedNode: {}, //记录正在处理的仪表
            dialogGraphVisible: false, //窗口是否显示
            jSimListData: {}, //获取到的SIM卡数据

            jSimListDataAll: {}, //全部的数据 张工导出数据需要 看到可以删掉
            jSimListDataAllCCid: [], //全部的iccid数据
            //bdpoint:null,
            //lat:0,
            //lon:0,

            radio1: "1", //切换折线图或者是文字
            // radio2: '列表',

            crConnecting: PsColor.PS_PIN,
            textConnecting: "离线",
            paramColors: [], //['#409EFF','#67C23A','#E6A23C','#F56C6C'],

            selectStartEndTime: false,

            startTimePickerOptions: {
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

            yibiaoDatas: [],
            startTime: null,
            endTime: null,
            statrDate: null,
            endDate: null,

            isExtGraphDisplay: false,
            echartsInstance: [null, null, null, null],
            echartsInstanceVol: null,
            echartsInstanceCsq: null,
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
            webSocket: null,
            alarmListPageCount: 0, //报警列表页总数
            alarmListPageIndex: 0,
            alarmListCurrentPage: 0,

            //=======================================尺寸相关
            mainWindowStyle: {},
            canvasWidth: 800,
            nodeAlarmListHeight: 400,

            bdmapStyle: {},

            //=======================================调试相关
            debugText: "",

            testAppendData: 0, //用于setDateToEchart中画出图，由于使用websocket会多次执行，所以做出限制

            changeChartBool: false,
            selectChart: null,
            gap: null,
            minSet: null,
            maxSet: null,

            //=======================================分页相关
            //当前页数
            pagenum: 1,
            //当前页显示多少条数据
            pagesize: 10,
            //每页需要展示的数据量
            inputOfPageSize: "",
            /*testWebSocket:null,*/

            //=======================================报表
            multipleSelect: [],

            //=======================================仪表
            buttonInfos: [],
            buttonCharts: "",

            //==========
            checkAll: false,
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

        this.webSocketInit();
    },

    beforeMount: function () {},

    mounted() {
        //console.log(this.$route.query);

        /*this.webSocketInit();*/
        this.btnOpenDataGraphInNewTabs();

        //this.yibiaoDatasUnitTransfer();
        this.getNodeDatasByWebsocket();
        this.setupDataAtTotalCanvas();

        this.reflashStartEndTimeData();

        this.setupDataToEcharts();
        /*    this.btnHideDataGraph();*/
        //this.btnHideAlarmList();
        //this.beforeCloseGraphDialog();
        //this.beforeCloseAlarmListDialog();
        //打开页面后读入树的CHECK状况并刷新一次
        //setTimeout(this.loadTreeCheckAndReflash,2000);

        //之后每 n 秒自动刷新.
        //setInterval(this.loadTreeCheckAndReflash, 60 * 1000);
        /*  window.onbeforeunload = function (e) {
                  const storage = window.localStorage
                  storage.clear()
              }*/

        /*window.onunload = function () {
                localStorage.clear();
            }*/
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
        if (this.echartsInstanceCsq) {
            this.echartsInstanceCsq.resize();
        }
        if (this.echartKpaInstance) {
            this.echartKpaInstance.resize();
        }

        if (this.echartVInstance) {
            this.echartVInstance.resize();
        }
    },

    beforeDestroy() {
        this.$refs.myChart && this.$refs.myChart.clear();
        //this.myChartDel.clear();
        window.removeEventListener("resize", this.autoSize);
    },

    //这个 watch 是一个对象,作用是实现树节点的刷选
    //需要监听的在 watch 内填写,当 filterText 值发生变化时,马上执行 函数内的动作
    watch: {
        projectSelected(value) {
            if (null == value) {
                this.textBtnAddNode = TEXT_ADD_BTN_DEFAULT;
            } else {
                this.textBtnAddNode = "在工程 " + value.project_name + " 里添加仪表";
            }
        },

        filterCompanyText(value) {
            this.$refs.companyTree.filter(value);
        },
    },

    methods: {
        onsize(event) {
            //console.log(document.documentElement);
            const width = document.documentElement.offsetWidth;
            const height = document.documentElement.offsetHeight;
            /*let asideWidth = this.$refs.asideWindow.offsetWidth;*/

            //let tableMarginLeft = this.$refs.mainWindow.style.marginLeft;

            //this.$refs.tableWindow.style.width = width - asideWidth - tableMarginLeft + 'px';
            //this.$refs.projectList.width = width - asideWidth - 20 + 'px';
            let paddingStr = window.getComputedStyle(this.$refs.mainWindow, null).paddingLeft;
            let paddingNumber = paddingStr.slice(0, paddingStr.indexOf("px"));
            //console.log('margin left = ' + marginNumber);

            //this.mainWindowStyle.width = width - asideWidth - paddingNumber + 'px';	//2022-02-14
            /*this.mainWindowStyle.width = width - asideWidth + 'px';*/ //2022-02-15 测试列表框全屏时使用
            //this.mainWindowStyle.height = height - 0 + 'px';
            /*this.mainWindowStyle.width = '100%';*/
            this.mainWindowStyle.height = "100%";
            this.canvasWidth = width - 60;

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

                //this.$refs.paramsWindow获取标签元素ref=paramsWindow的组件，getComputedStyle获取CSSstyle的对象
                const paramsWindowStyle = window.getComputedStyle(this.$refs.paramsWindow, null);
                //获取宽度数据：xxxx px
                const paramsWindowWidth = paramsWindowStyle.width;
                //获取宽度数据value，slice取得单位px前的所有字符
                const widthNumber = paramsWindowWidth.slice(0, paramsWindowWidth.indexOf("px"));
                this.bdmapStyle.width = width - 40 - widthNumber - 30;
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
            if (this.$route) {
                console.log(this.$route.query);
            }
        },
        //向web socket服务器发送注册命令.把目前正在显示的仪表注册上服务器
        //将现在显示的仪表id返回给服务器，让服务器检测现在这批仪表是否报警
        /*webSocketRegistNodes() {
                let nodeIdArr = [];
                for (node of this.nodeList) {
                    nodeIdArr.push(node.node_id);
                }

                const jSend = {
                    command: 'register',
                    access_token: parsenCookie.loadAccessToken(),
                    node_id_arr: nodeIdArr,
                };
                if (null != this.webSocket) {
                    this.webSocket.send(JSON.stringify(jSend));
                    //console.log('web socket regist: ' + JSON.stringify(jSend));
                }
            },*/

        //初始化WebSocket
        webSocketInit() {
            if ("WebSocket" in window) {
                console.log("您的浏览器支持WebSocket");

                const url = "wss://app.parsen.com.cn/ParsenHttpApiV020/com/finder/websocket";

                if (null != this.webSocket) {
                    this.webSocket.close();
                }

                this.webSocket = new WebSocket(url); //创建WebSocket连接
                if (null == this.webSocket) {
                    console.log("新建 websocket 失败");
                    return;
                }

                var that = this;

                //console.log(this.webSocket);
                this.webSocket.onopen = function (event) {
                    //console.log(event);
                };

                this.webSocket.onmessage = function (event) {
                    const data = JSON.parse(event.data);
                    if ("alarm_trigger" == data.command) {
                        console.log("websocket onmessage");
                        //that.reflashProjectsNodes(projects);
                    }
                };
            } else {
                console.log("您的浏览器不支持WebSocket");
            }
        },
        alarmListPageChange(index) {
            this.alarmListPageIndex = index;
            this.alarmListTableData = this.nodeAlarmList.slice(
                (this.alarmListPageIndex - 1) * ALARM_LIST_PAGE_ITEM_MAX,
                this.alarmListPageIndex * ALARM_LIST_PAGE_ITEM_MAX
            );
        },
        btnOpenDataGraphInNewTabs() {
            /*var index = localStorage.getItem("index");*/
            const urlEncodeParams = window.location.search;
            const uo = new URLSearchParams(urlEncodeParams);
            console.log(uo.get("node_id"));
            console.log(uo.get("group"));

            var node = JSON.parse(localStorage.getItem("real_data_selected_node_" + uo.get("node_id")));
            this.lastSelectedNode = node;

            for (let x of this.lastSelectedNode.dataInfos) {
                this.buttonInfos.push({ max: 100, min: 0, last_value: x.last_value, line_desc: x.line_desc, unit_name: x.unit_name });
            }
            this.buttonCharts = this.buttonInfos[0] ? 0 : "";
            //this.gudgeChart(0);

            console.log(this.lastSelectedNode);

            var that = this;

            //获取sim卡的属性
            // jQuery.ajax({
            //     type: 'POST',
            //     url: Consts.HTTP_PREFIX + 'GetSim',
            //     /*context:this,*/
            //     data: {
            //         access_token: parsenCookie.loadAccessToken(),
            //         simid: node.iccid,
            //     },
            //     success: function (res) {
            //         /*console.log(res);*/
            //         let getLbsListMs = Date.now() - startms;
            //         console.log('GetLbsList servlet use ms =' + getLbsListMs);
            //         if ("1" == res.result) {
            //             console.log(['get sim list ok', res]);
            //             that.jSimListData = res.jSimList;
            //             /* jSimListFun(jSimList)*/
            //             console.log(that.jSimListData)
            //             if (that.jSimListData.surpFlow === "") {
            //                 that.jSimListData.surpFlow = '****'
            //             }
            //             if (that.jSimListData.openDate === "") {
            //                 that.jSimListData.openDate = '****'
            //             }
            //             if (that.jSimListData.activateTime === "") {
            //                 that.jSimListData.activateTime = '****'
            //             }
            //             if (that.jSimListData.expiryDate === "") {
            //                 that.jSimListData.expiryDate = '****'
            //             }
            //         } else {
            //             console.log(['get sim list no ok', res]);
            //         }
            //     },
            //     error: function (res) {

            //     },
            // });
            //
            // function jSimListFun(jSimList) {
            //     this.jSimListData = jSimList
            //
            // }
            console.log(this.jSimListData);
            //画出腾讯地图
            var that = this;

            if (null == node.node_data) {
                alert("没有任何数据可以查看");
                return;
            }

            const lastDate = mySqlDateToDate(node.node_data.date);
            const nowDate = new Date();
            const spanMinute = (nowDate - lastDate) / 1000 / 60;
            const offline = spanMinute > node.send_gap * ConfigConsts.OFFLINE_JUDGE_COUNT;
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
                console.log('lbsList', lbsList);
                if (null != that.tmap) {
                    that.tmap.destory();
                }
                //if (null == that.tmap) {
                //定义map变量，调用 TMap.Map() 构造函数创建地图
                // that.tmap = new TMap.Map(document.getElementById("map_container"), {
                //     //center: center,//设置地图中心点坐标
                //     zoom: 15, //设置地图缩放级别
                //     viewMode: "2D",
                // });
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

                //坐标转换
                tmapXYConvertorEx(lbsList, function (list) {
                    //                  自己设置点作测试用
                    //		        	list = [];
                    //		        	list.push({lat:39,lng:117});
                    //		        	list.push({lat:39.2,lng:117.4});

                    //console.log(list);
                    let maxLat = list[0].lat;
                    let minLat = maxLat;
                    let maxLon = list[0].lng;
                    let minLon = list[0].lng;

                    let geometryList = [];
                    let path = [];

                    let index = 1;
                    for (const lbs of list) {
                        maxLat = Math.max(maxLat, lbs.lat); //找出maxLat和lbs.lat两个中的最大值，然后把它赋给maxLat
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
                    //console.log(geometryList)
                    //创建并初始化MultiMarker,画点
                    var markers = new TMap.MultiMarker({
                        map: that.tmap, //指定地图容器
                        //样式定义
                        styles: {
                            //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
                            // myStyle: new TMap.MarkerStyle({
                            //     width: 25, // 点标记样式宽度（像素）
                            //     height: 35, // 点标记样式高度（像素）
                            //     //"src": '../img/marker.png',  //图片路径
                            //     //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
                            //     anchor: { x: 16, y: 32 },
                            // }),
                            // "car-down": new TMap.MarkerStyle({
                            //     width: 40,
                            //     height: 40,
                            //     anchor: { x: 20, y: 20 },
                            //     faceTo: "map",
                            //     rotate: 180,
                            //     src: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png",
                            // }),
                            other_pos: new TMap.MarkerStyle({
                                width: 20,
                                height: 30,
                                /*src: '../image/404.jpeg'*/
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
                    const bounds = new TMap.LatLngBounds(ptSW, ptNE); //描叙一个矩形的地理坐标访问
                    that.tmap.fitBounds(bounds, { padding: 100 });
                    //console.log(bounds);

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

            // 加载高德地图
            const loadGDMap = (lbsList) => {
                console.log(lbsList);
                if (null != that.gdMap) {
                    that.gdMap.destory();
                }

                if (null == that.gdMap) {
                    console.log("new gdMap failed!");
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

            let last_date = new Date(node.node_data.date);
            let ms = last_date.getTime();
            ms -= 24 * 60 * 60 * 1000;
            let startTime = new Date(ms);

            let startms = Date.now();

            jQuery.ajax({
                type: "POST",
                url: Consts.HTTP_PREFIX + "GetLbsList",
                context: this,
                data: {
                    access_token: parsenCookie.loadAccessToken(),
                    node_id: node.node_id,
                    start_time: dateToMySqlDate(startTime),
                    end_time: dateToMySqlDate(last_date),
                    count: -1,
                },
                success: function (res) {
                    /*console.log(res);*/
                    let getLbsListMs = Date.now() - startms;
                    console.log("GetLbsList servlet use ms =" + getLbsListMs);
                    if ("1" == res.result) {
                        console.log(["get lbs list ok", res]);
                        //this.lat = res.LBS.lat;
                        //this.lon = res.LBS.lon;
                        loadTMap(res.lbs_list);
                        loadGDMap(res.lbs_list);
                        //setTimeout(loadTMap(res.lbs_list),500);
                        //setTimeout(loadMapV2(res.lbs_list),500);
                        //setTimeout(loadMap(res.lbs_list),500);
                    } else {
                    }
                },
                error: function (res) {},
            });
            /* this.lastSelectedNode = row;
                 this.lastSelectedNode = this.nodeFilteredList[(this.pageIndex - 1) * PAGE_ITEM_MAX + index];
                 this.lastSelectedNodeIndex = index;

                 if (ExtGraphDrawing[this.lastSelectedNode.node_id]) {
                     this.isExtGraphDisplay = true;
                 } else {
                     this.isExtGraphDisplay = false;
                 }



                 setTimeout(this.onsize, 500);*/
            //this.dialogGraphVisible = true;

            //this.reflashStartEndTimeData();
        },
        yibiaoDatasUnitTransfer(datas, node) {
            /* console.log("this is datas")
                 console.log(datas)*/
            /*
                	最后一次Node限制Chart数量
                	取最后一次数据拥有通道编号，对应data中拥有的通道编号，有则在data新建元素，否则忽视
                	
                */
            //                let tempArr = [],num = 0;
            //                for(let dataInfo of node.dataInfos){
            //					tempArr.push(dataInfo.line);
            //				}
            //                for (let data of datas) {
            //                    for (let i in data.line_datas){
            //						let lineDatasNumber = data.line_datas[i].node_line;
            //						if(tempArr.includes(lineDatasNumber)){
            //							num++;
            //							let nodeInfoNumber = tempArr.indexOf(lineDatasNumber);
            //							data['D' + num] = UnitTransfer.transferToUnit(data.line_datas[i].value, data.line_datas[i].unit, node.dataInfos[nodeInfoNumber].displayUnit);
            //                        	data['D' + num + 'U'] = node.dataInfos[nodeInfoNumber].displayUnit;
            //						}
            //						else
            //						{
            //							continue;
            //						}
            //                    }
            //                    num = 0;
            //                }
            /*
                	不以最后一次接受数据通道数为标准，所有通道都输出，当前数据没有相应通道编号不影响输出
                	
                */
            //this.yibiaoDatas = datas;

            //计算间隔时间
            // for(let i in datas){
            //     if(i == 0){
            //         datas[i]['gap'] = 0;
            //         continue;
            //     }
            //     else{
            //         let timeBefore = new Date(datas[i-1].date);
            //         let timeAfter = new Date(datas[i].date);
            //         datas[i]['gap'] = parseFloat((timeAfter - timeBefore)/60/1000).toFixed(1);
            //     }
            // }
            //===========================	获取通道数lineCount，和数据包数量dataCount
            for (let data of datas) {
                if (null == data.line_datas) {
                    this.dataCount++;
                    continue;
                }
                for (let i of data.line_datas) {
                    if (this.tempLine.includes(i.node_line)) {
                        continue;
                    }
                    this.tempLine.push(i.node_line);
                    this.linCount++;
                }
                this.dataCount++;
            }
            //==========================	新建数组待存放数据值和时间
            for (let i = 0; i < this.linCount; i++) {
                this.lineDatas["lineNode" + this.tempLine[i]] = [];
                this.lineDatas["lineTime" + this.tempLine[i]] = [];
            }

            //==========================	压入数据
            for (let data of datas) {
                if (null == data.line_datas) {
                    continue;
                }
                for (let i of data.line_datas) {
                    let lineNode = "lineNode" + i.node_line;
                    let lineNodeTime = "lineTime" + i.node_line;
                    this.lineDatas[lineNode].push(UnitTransfer.transferToUnit(i.value, i.unit, i.unit));
                    this.lineDatas[lineNodeTime].push(data.date);
                    //console.log(this.yibiaoDatas[this.dataCount][lineNodeTime]);
                }
            }

            //==========================	计算最大数据长度
            let maxLength = 0;
            for (let length in this.lineDatas) {
                if (this.lineDatas[length].length > maxLength) {
                    maxLength = this.lineDatas[length].length;
                }
            }

            //==========================	新建存放转换数据的数组，为防止刷新累加，先清空
            this.changeLineDatas = [];
            for (let a = 0; a < maxLength; a++) {
                this.changeLineDatas.push([]);
            }

            //==========================	转换数据
            for (let i in this.lineDatas) {
                for (let a = 0; a < maxLength; a++) {
                    if (a >= this.lineDatas[i].length) {
                        this.changeLineDatas[a].push("-");
                        continue;
                    }
                    this.changeLineDatas[a].push(this.lineDatas[i][a]);
                }
            }

            //                this.yibiaoDatas.push(this.changeLineDatas);
            //				this.dataCount++;

            for (let data of datas) {
                if (data.vol > 200) {
                    data.vol /= 1000;
                }
                if (null == data.line_datas) {
                    continue;
                }
                for (let i of data.line_datas) {
                    let nodeLine = i.node_line;
                    data["D" + nodeLine] = UnitTransfer.transferToUnit(i.value, i.unit, i.unit);
                    data["D" + nodeLine + "U"] = i.unit;
                }
            }
        },
        //使用 websocket 取数据,在内部新建 websocket ,收齐数据后再把 ws close
        //pageCount 是每次返回多少个数据
        getNodeDatasByWebsocket(nodeId, pageCount, startTime, endTime, dataSource) {
            console.log("执行到了getNodeDatasByWebsocket");
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
                console.log("websocket get message");
                console.log(event);
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
                    this.endTime = mySqlDateToDate(this.lastSelectedNode.node_data.date);
                    let ms = this.endTime.getTime();
                    ms -= 24 * 60 * 60 * 1000;
                    this.startTime = new Date(ms);
                } else {
                    return; //当使用默认时间,但是又没有默认时间时,就返回
                }
            }
        },
        handleSelectionChange(selection) {
            this.multipleSelect = selection;
        },

        getRowKey(row) {
            return row.node_data_id;
        },
        showDataRadioButtonChange() {
            if ("1" == this.radio1 || "2" == this.radio1) {
                this.reflashStartEndTimeData();
            }

            if ("3" == this.radio1) {
                console.log("show alarm record");
            }
        },

        reflashStartEndTimeData() {
            this.yibiaoDatas = [];
            console.log("执行到了reflashStartEndTimeData");
            //当使用默认最新24小时的时候
            if (false == this.selectStartEndTime) {
                //求出 js Date 时间
                //this.endTime = dateUpToHour(new Date());
                if (this.lastSelectedNode.node_data.date) {
                    this.endTime = dateUpToHour(mySqlDateToDate(this.lastSelectedNode.node_data.date));
                    this.endDate = new Date(this.lastSelectedNode.node_data.date);
                    let ms_ = this.endDate.getTime();
                    let ms = this.endTime.getTime();
                    ms -= 24 * 60 * 60 * 1000;
                    ms_ -= 24 * 60 * 60 * 1000;
                    this.startDate = new Date(ms_);
                    this.startTime = new Date(ms);
                } else {
                    return; //当使用默认时间,但是又没有默认时间时,就返回
                }
            }

            //对开始时间和结束时间进行比较，开始时间早于结束时间时则弹窗并终止数据请求
            if (this.startTime.getTime() > this.endTime.getTime()) {
                // date.getTime()
                alert("开始时间不能晚于结束时间！请重新选择日期");
                return 0;
            }

            //2022.8.9----reflashStartEndTimeData()使用websocket-----
            if ("WebSocket" in window) {
                console.log("您的浏览器支持websocket");
                const url = Consts.WS_PREFIX + `GetNodeDatasEX`;
                const data = {
                    access_token: parsenCookie.loadAccessToken(),
                    node_id: this.lastSelectedNode.node_id,
                    count: 200, //每次取出数据的数据量
                    start_time: dateToMySqlDate(this.startDate),
                    end_time: dateToMySqlDate(this.endDate),
                };
                if (null != this.webSocket) {
                    this.webSocket.close();
                    this.webSocket = null;
                }

                this.webSocket = new WebSocket(url); //创建websocket的连接

                if (null == this.webSocket) {
                    console.log("创建连接失败");
                    return;
                }

                var that = this;
                //建立连接后发送请求
                this.webSocket.onopen = function (event) {
                    console.log("创建连接成功，发送数据");
                    console.log(JSON.stringify(data));
                    that.webSocket.send(JSON.stringify(data));
                };

                TestDifferentTime = [];
                ddddDifferent = [];
                this.webSocket.onmessage = function (event) {
                    /*   var dddddd1 = +new Date();

                           TestDifferentTime.push(dddddd1);*/
                    /*if ("1" == event.result) {*/
                    console.log("get datas servlet ok");
                    let dataS = null;
                    try {
                        dataS = JSON.parse(event.data);
                    } catch (e) {
                        console.log("websocket onmessage not json string");
                        console.log(event.data);
                        console.log(e);
                        return;
                    }
                    that.dataForNodeDatas = dataS.node_datas;

                    /*显示处理*/
                    var concelLine = [];
                    var lines = that.lastSelectedNode.node_data.line_datas;
                    for (let x of lines) {
                        if (x.line_param.show == 1) continue;
                        let nowLine = x.line_param.line;
                        concelLine.push(nowLine);
                    }

                    /*----------------------------------------*/

                    if (dataS != null) {
                        that.yibiaoDatas.push(...dataS.node_datas);
                        // if(concelLine.length>0){
                        for (let x of that.yibiaoDatas) {
                            let line_datas = [];
                            let lineCount = [];
                            for (let i in x.line_datas) {
                                if (concelLine.includes(x.line_datas[i].node_line)) {
                                    continue;
                                } else if (lineCount.includes(x.line_datas[i].node_line)) {
                                    let index = line_datas.findIndex((item) => item.node_line == i.node_line);
                                    line_datas.splice(index, 1);
                                }
                                line_datas.push(x.line_datas[i]);
                                lineCount.push(x.line_datas[i].node_line);
                            }
                            x.line_datas = line_datas;
                            // }
                        }
                    }
                    /*  console.log(that.yibiaoDatas)*/

                    //websocket可能会传多次数据，为防止数据覆盖，直接使用that.yibiaoDatas
                    that.yibiaoDatasUnitTransfer(that.yibiaoDatas, that.lastSelectedNode);

                    console.log("transfer datas ok");

                    //数据时间排序
                    function compare(proprty, bol) {
                        return function (a, b) {
                            var value1 = Date.parse(a[proprty]);
                            var value2 = Date.parse(b[proprty]);
                            if (bol) {
                                //升序
                                return value1 - value2;
                            } else {
                                //降序
                                return value2 - value1;
                            }
                        };
                    }

                    that.yibiaoDatas.sort(compare("date", false));

                    //计算间隔时间
                    for (let i in that.yibiaoDatas) {
                        if (i == that.yibiaoDatas.length - 1) {
                            that.yibiaoDatas[i]["gap"] = 0;
                        } else {
                            let x = i - 1 + 2;
                            let timeBefore = new Date(that.yibiaoDatas[x].date);
                            let timeAfter = new Date(that.yibiaoDatas[i].date);
                            that.yibiaoDatas[i]["gap"] = parseFloat((timeAfter - timeBefore) / 60 / 1000).toFixed(1);
                        }
                    }

                    that.setupDataToEcharts();

                    let drawInfo = ExtGraphDrawing[that.lastSelectedNode.node_id];
                    if (drawInfo) {
                        //this.isExtGraphDisplay = true;
                        drawInfo.drawFunc(
                            drawInfo.drawData,
                            that.lastSelectedNode.dataInfos[0].displayValue,
                            that.lastSelectedNode.dataInfos[1].displayValue,
                            that.lastSelectedNode.dataInfos[2].displayValue,
                            drawInfo.rou,
                            drawInfo.g
                        );
                    }
                    /* var dddddd2 = +new Date();
                         TestDifferentTime.push(dddddd2);*/

                    /*if (TestDifferentTime[2] != null) {

                        }
                        else{
                            console.log("TestDifferentTime[2]==null");
                        }*/
                };
                /* console.log(that.dataForNodeDatas)
                     if (that.dataForNodeDatas) {
                         for (let i = 0; i < (that.dataForNodeDatas.length) - 1; i++) {
                             ddddDifferent[i] = TestDifferentTime[i] - TestDifferentTime[i - 1];
                             console.log("this is onmessge time");
                             console.log(ddddDifferent[i]);
                         }
                     }*/

                /*  /!* this.lastSelectedNode = row;*!/
                      /!*this.lastSelectedNode = this.nodeFilteredList[(this.pageIndex - 1) * PAGE_ITEM_MAX + index];
                      this.lastSelectedNodeIndex = index;*!/

                      if (ExtGraphDrawing[this.lastSelectedNode.node_id]) {
                          this.isExtGraphDisplay = true;
                      } else {
                          this.isExtGraphDisplay = false;
                      }

                      this.dialogGraphVisible = true;

                      setTimeout(this.onsize, 500);

                      this.reflashStartEndTimeData();*/
            } else {
                console.log("您的浏览器不支持websocket");
            }
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

                if (this.echartsInstanceCsq) {
                    this.echartsInstanceCsq.dispatchAction({
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

                if (this.echartsInstanceCsq) {
                    this.echartsInstanceCsq.dispatchAction({
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
        gudgeChart(index) {
            let optionGudge = {
                series: [
                    {
                        min: this.buttonInfos[index]["min"],
                        max: this.buttonInfos[index]["max"],
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
                        axisTick: {
                            //仪表盘刻度设置
                            distance: -30, //仪表盘刻度+为内，-为外
                            length: 8,
                            lineStyle: {
                                color: "#fff",
                                width: 2,
                            },
                        },
                        splitLine: {
                            //仪表盘数字设置
                            distance: -30,
                            length: 30,
                            lineStyle: {
                                color: "#fff",
                                width: 4,
                            },
                        },
                        axisLabel: {
                            //仪表盘数字标签
                            color: "inherit",
                            distance: 40,
                            fontSize: this.autoFont(15),
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: "{value}" + this.buttonInfos[index].unit_name,
                            color: "inherit",
                            fontSize: this.autoFont(25),
                        },
                        data: [
                            {
                                value: this.buttonInfos[index]["last_value"],
                            },
                        ],
                    },
                ],
            };
            let gudgeDom = document.getElementById("gagueChart");
            let gudgeInstance = echarts.init(gudgeDom);
            gudgeInstance.setOption(optionGudge);

            window.addEventListener("resize", () => {
                //console.log('gudgeresize');
                gudgeInstance.resize();
            });
        },

        setupDataToEcharts() {
            console.log(this.changeLineDatas);
            const infos = this.lastSelectedNode.dataInfos;

            this.gudgeChart(0);
            this.buttonCharts = 0;

            var lineCount = [];
            for (data of this.yibiaoDatas) {
                if (null == data.line_datas) {
                    continue;
                }
                let line_datas = [];
                lineCount = [];
                for (i of data.line_datas) {
                    if (lineCount.includes(i.node_line)) {
                        let index = line_datas.findIndex((item) => item.node_line == i.node_line);
                        line_datas.splice(index, 1);
                    }
                    lineCount.push(i.node_line);
                    line_datas.push(i);
                }
                data.line_datas = line_datas;
            }

            var dnames = [];
            lineCount.forEach(function (value, key) {
                dnames[key] = "D" + value;
                //console.log(dnames);
            }),
                //const dnames = ['D1', 'D2', 'D3', 'D4'];
                //return回ps_consts_f.js中PsColor的数组，包含16进制的颜色
                (colors = PsColor.paramColors()); //['#409EFF','#67C23A','#E6A23C','#F56C6C'];

            var that = this;

            //设置好时间轴datazoom元素，画Chart时直接带入对应变量名
            //单独滑动条
            let dzSlider = {
                // 这个dataZoom组件，默认控制x轴。
                type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: 0, // 左边在 10% 的位置。
                end: 100, // 右边在 60% 的位置。
                showDetail: false,
            };
            //内置
            let dzInside = {
                // 这个dataZoom组件，也控制x轴。
                type: "inside", // 这个 dataZoom 组件是 inside 型 dataZoom 组件
                start: 0, // 左边在 10% 的位置。
                end: 100, // 右边在 60% 的位置。
            };

            const volDomInstance = document.getElementById("canvas_vol");
            this.echartsInstanceVol = echarts.init(volDomInstance);
            this.echartsInstanceVol.on("dataZoom", this.onDataZoom); //绑定事件
            const volMax = 8;
            const volMin = 0;
            let volLabel = {
                formatter: function (param) {
                    //formatter函数格式化显示时间数据
                    const dt = new Date(param.value);
                    //const timeStr = dt.getMonth() + '月' + dt.getDay() + '日' + dt.getHours() + '时' + dt.getMinutes() + '分';
                    const timeStr = dt.getMonth() + 1 + "-" + dt.getDate() + " " + formatNumber(dt.getHours()) + ":" + formatNumber(dt.getMinutes());
                    return timeStr;
                },
            };

            const csqDomInstance = document.getElementById("canvas_csq");
            this.echartsInstanceCsq = echarts.init(csqDomInstance);
            this.echartsInstanceCsq.on("dataZoom", this.onDataZoom);
            const csqMax = 33;
            const csqMin = -1;
            let csqLabel = {
                formatter: function (param) {
                    //formatter函数格式化显示时间数据
                    const dt1 = new Date(param.value);
                    //const timeStr = dt.getMonth() + '月' + dt.getDay() + '日' + dt.getHours() + '时' + dt.getMinutes() + '分';
                    const timeStr1 =
                        dt1.getMonth() + 1 + "-" + dt1.getDate() + " " + formatNumber(dt1.getHours()) + ":" + formatNumber(dt1.getMinutes());
                    return timeStr1;
                },
            };

            //画出了供电电压表
            let volOption = {
                //Echart设置
                title: {
                    text: this.yibiaoDatas[0].vol < 10 ? "供电电压" : "电池电量",
                    left: "center",
                },
                tooltip: {
                    trigger: "axis",

                    axisPointer: {
                        type: "shadow", //['line','shadow','cross','none'][i],
                        animation: false,
                        axis: "x",
                        //snap:false,
                        label: volLabel, //时间
                    },
                    //formatter:'{a} {b} {c} {a0} {b0} {c0} {a1} {b1} {c1}',
                },
                xAxis: {
                    type: "time",
                    max: this.endDate,
                    min: this.startDate,
                },
                yAxis: {
                    type: "value",
                    name: this.yibiaoDatas[0].vol < 10 ? "V" : "%",
                    max: this.yibiaoDatas[0].vol < 10 ? volMax : 100, //'dataMax',
                    min: this.yibiaoDatas[0].vol < 10 ? volMin : 50, //'dataMin',
                },
                grid: {
                    bottom: 40,
                    containLabel: true,
                },
                dataZoom: [
                    dzSlider,
                    dzInside,
                    /* {filterMode: 'filter'}*/
                ],
                color: "#000000",
                dataset: {
                    source: this.yibiaoDatas,
                },
                series: [
                    {
                        name: this.yibiaoDatas[0].vol < 10 ? "电压" : "百分比",
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
            //?
            /*  this.echartsInstanceVol.clear(); */
            this.echartsInstanceVol.setOption(volOption);
            this.chartsDom.push(this.echartsInstanceVol);
            //console.log(this.yibiaoDatas)

            //尝试appendData进行数据加载 速度缓慢
            /*             window.addEventListener("resize", function () {
                                 this.echartsInstanceVol.resize();
                             });

                             this.echartsInstanceVol.appendData({
                                 seriesIndex: 0,
                                 data: this.yibiaoDatas,
                             });

                             this.echartsInstanceVol.resize();*/

            //信号强度图表设置
            let csqOption = {
                title: {
                    text: "信号强度",
                    left: "center", //水平安放位置
                },
                tooltip: {
                    //提示框
                    trigger: "axis", //触发类型:轴触发；axis是鼠标移动到柱状图显示全部数据，item是显示折线图全部数据

                    axisPointer: {
                        //坐标轴指示器
                        type: "shadow", //默认为line,line直线，cross十字准星，shadow阴影
                        animation: false, //设置echart是否开启动画
                        axis: "x",
                        label: csqLabel, //文字描述
                    },
                },
                xAxis: {
                    type: "time",
                    max: this.endDate,
                    min: this.startDate,
                },
                yAxis: {
                    type: "value",
                    name: "信号强度",
                    max: this.yibiaoDatas[0].vol_type == 0 ? csqMax : 100, //'dataMax',
                    min: this.yibiaoDatas[0].vol_type == 0 ? csqMin : 50, //'dataMin',
                },
                grid: {
                    bottom: 40, //距离底部容器的距离
                    containLabel: true, //gird区域是否包含坐标轴的刻度标签
                },
                dataZoom: [
                    dzSlider,
                    dzInside,
                    /* {filterMode: 'filter'}*/
                ],
                color: "#A511FE",
                dataset: {
                    source: this.yibiaoDatas,
                },

                series: [
                    {
                        name: "信号强度",
                        type: "line",
                        symbolSize: 8,
                        encode: {
                            x: "date",
                            y: "csq",
                            //y:'displayValue',
                        },
                    },
                ],
            };
            /*   this.echartsInstanceCsq.clear();*/
            this.echartsInstanceCsq.setOption(csqOption);
            this.chartsDom.push(this.echartsInstanceCsq);
            //循环读取data部署chart
            for (var i in infos) {
                //!!!!!!循环只依赖于lastselectedNode
                const domInstance = document.getElementById(infos[i].canvas_id); //返回dom
                //lastselectednode控制dom容器
                if (!domInstance) {
                    continue;
                }

                this.echartsInstance[i] = echarts.init(domInstance); //图表实例
                if (!this.echartsInstance[i]) {
                    continue;
                }

                this.echartsInstance[i].on("dataZoom", this.onDataZoom); //绑定事件
                //				this.echartsInstance[i].on('dataZoom',function(params){
                //					console.log('onDataZoom triggered');
                //					console.log(params);
                //				});

                const yMax =
                    infos[i].setMax == "1"
                        ? infos[i].max
                        : function (value) {
                              return Math.ceil((value.max - value.min) * 0.1 + value.max); //向上取整
                          };
                const yMin =
                    infos[i].setMin == "1"
                        ? infos[i].min
                        : function (value) {
                              return Math.floor(value.min - (value.max - value.min) * 0.1); //向下取整
                          };
                //let yMax = infos[i].setMax ? infos[i].max : 'dataMax';
                //let yMin = infos[i].setMin ? infos[i].min : 'dataMin';

                let labelEx = {};

                const lineNumber = i;
                const funcName = that.lastSelectedNode.node_id + "_" + i;

                //特殊指定计算
                if (ExtUnitCalculate[funcName]) {
                    //此处调用ext_unit_calc_f.js文件中的计算函数
                    //在detal_data_graph.jsp文件中引用ext_unit_calc_f.js
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

                            const value = param.seriesData[0].data[lineNumber];
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

                //通用图表格式设定
                let option = {
                    title: {
                        text: infos[i].line_desc, //！！！！！！lastselectednode控制表头
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
                        max: this.endDate,
                        min: this.startDate,
                    },
                    yAxis: {
                        type: "value",
                        name: "单位: " + infos[i].unit_name, //!!!!!lastselectednode控制单位
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
                        /*  { filterMode: 'filter'}*/
                        //				        {   // 这个dataZoom组件，默认aaaaaaaa控制x轴。
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
                    color: colors[i % 4], //!!!!!!一共四个颜色，超过索引需要修改
                    dataset: {
                        source: this.changeLineDatas,
                    },
                    series: [
                        {
                            name: infos[i].unit_desc,
                            type: "line",
                            symbolSize: 8,
                            encode: {
                                x: i * 2 + 1,
                                y: i * 2,
                                //y:'displayValue',
                            },
                        },
                    ],
                };
                /*  this.echartsInstance[i].clear();*/
                // let d1 = +new Date();
                this.echartsInstance[i].setOption(option);
                this.chartsDom.push(this.echartsInstance[i]);
                /* let d2 = +new Date();
                     let dDifferent = d2 - d1;
                     console.log("this is Vgraph time");
                     console.log(dDifferent);*/
            } //for(int i=0 ~ 4)结束

            //======================================特殊图标绘制
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
                }; //画特殊图表

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
                /*this.echartVInstance.clear();*/

                this.echartVInstance.setOption(optionV, true);
            }

            //this.echartKpaInstance.on('dataZoom',this.onDataZoom);
            const self = this;
            window.addEventListener("resize", self.autoSize);
        },

        autoSize() {
            for (let x of this.chartsDom) {
                x.resize();
            }
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

                    this.onsize(null);
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
        //列表数据的样式
        setCellStyle(row, column, rowIndex, columnIndex) {
            //使用下面的数组来设置第0，1，2，3行的颜色
            /*  const COLOR_ARR = [
                      PsColor.PS_PROJECT_ICON,
                      PsColor.PS_YIBIAO_ICON,
                      '#428675',
                      '#2F4988',
              ];*/
            /*if (row.column.label == "压力") {
                    return {color: PsColor.PS_PROJECT_ICON}
                }
                if (row.column.label == "温度") {
                    return {color: PsColor.PS_YIBIAO_ICON}
                }
                if (row.column.label == "信号") {
                    return {color: PsColor.PS_XINHAO_ICON}
                }*/

            //数据行如果有报警则把底色设成黄色
            if ("信号" == row.column.label && "1" == row.ALARM_NOTICE) {
                return { backgroundColor: PsColor.PS_YELLOW };
            }
        },

        //分页之监听分页大小改变的事件
        handleSizeChange(newSize) {
            this.pagesize = newSize;

            /*this.reflashStartEndTimeData();*/
        },
        //分页之监听页码值改变的事件
        handleCurrentChange(newPage) {
            this.pagenum = newPage;

            /* this.reflashStartEndTimeData();*/
        },
        //分页之自定义页面想要展示的数据量
        reflashPageSize() {
            this.pagesize = this.inputOfPageSize;
            // this.reflashStartEndTimeData();
        },
        //分页排序
        sortChange(column) {
            console.log(column);
            if (column.order === "ascending") {
                this.yibiaoDatas = this.yibiaoDatas.sort((a, b) => {
                    return a.csq - b.csq;
                });
            } else if (column.order === "descending") {
                this.yibiaoDatas = this.yibiaoDatas.sort((a, b) => {
                    return b.csq - a.csq;
                });
            }
        },

        //			outPutDataSelected(){
        //				consle.log("outPutDataSelected");
        //
        //			},

        outPutDataSelected() {
            console.log("outPutDataSelected");
            this.multipleSelect;
            let selectData = [];
            let tempSelect = {};
            let title = "";
            //选择全部单位desc用于输出
            for (let i of this.multipleSelect[0]["line_datas"]) {
                title += unitCodeToDesc(i["unit"]);
                title += ",";
            }
            //后续循环顺序此三项在后面，所以置后
            title += `时间,信号,电池\n`;
            for (let i of this.multipleSelect) {
                tempSelect = {};
                tempSelect["date"] = i["date"].substring(0, 16);
                for (let x in i.line_datas) {
                    tempSelect[x] = i["line_datas"][x]["value"];
                }
                tempSelect["Csq"] = i["csq"];
                tempSelect["vol"] = i["vol"];
                selectData.push(tempSelect);
            }
            for (let i = 0; i < selectData.length; i++) {
                for (const key in selectData[i]) {
                    title += `${selectData[i][key] + "\t"},`;
                }
                title += "\n";
            }
            // encodeURIComponent解决中文乱码
            const uri = "data:text/csv;charset=utf-8," + encodeURIComponent(title);
            // 通过创建a标签实现
            const link = document.createElement("a");
            link.href = uri;
            // 对下载的文件命名
            link.download = "导出数据表.csv";
            link.click();
        },
        //导出文件提供用户下载成excel文件
        outPutData() {
            // const outPutData = () => {
            // 要导出的json数据
            console.log(this.yibiaoDatas);

            //将原本的杂乱仪表数据中选出`时间,压力,温度,信号,电池`五项数据放入outputData[]
            const outputData = [];
            this.yibiaoDatas.forEach((item) => {
                outputData.push({
                    outputDataDate: item.date,
                    outputDataPre: item.line_datas[0].value,
                    outputDataTem: item.line_datas[1].value,
                    outputDataVol: item.vol,
                    outputDataCsq: item.csq,
                });
            });
            console.log(outputData);
            // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
            let str = `时间,压力,温度,信号,电池\n`;
            // 增加  为了不让表格显示科学计数法或者其他格式
            for (let i = 0; i < outputData.length; i++) {
                for (const key in outputData[i]) {
                    str += `${outputData[i][key] + "\t"},`;
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

        outPutDataALL() {
            var that = this;
            jQuery.ajax({
                type: "POST",
                url: Consts.HTTP_PREFIX + "GetSimAll",
                data: {
                    access_token: parsenCookie.loadAccessToken(),
                },
                success: function (res) {
                    if ("1" == res.result) {
                        console.log(["get ALL sim list ok", res]);
                        that.jSimListDataAll = res.jSimList.billingGroups;
                        /* jSimListFun(jSimList)*/
                        console.log(that.jSimListDataAll);
                    } else {
                        console.log(["get ALL sim list no ok", res]);
                    }
                },
                error: function (res) {},
            });
            console.log(this.jSimListDataAll);
            if (this.jSimListDataAllCCid === undefined) {
                this.jSimListDataAllCCid = [];
            }
            //张工所需数据 之后删除
            //下面的请求是根据计费组id来调用fc.function.card.list方法，但不知道为何每次循环最多只能调用100个数据
            for (var i = 0; i < this.jSimListDataAll.length; i++) {
                //打印计费组的id
                console.log(this.jSimListDataAll[i].id);
                jQuery.ajax({
                    type: "POST",
                    url: Consts.HTTP_PREFIX + "GetSimAllIccid",
                    data: {
                        access_token: parsenCookie.loadAccessToken(),
                        DataGroupId: this.jSimListDataAll[i].id,
                    },
                    success: function (res) {
                        if ("1" == res.result) {
                            console.log(res);
                            /*that.jSimListDataAll = res.jSimList.billingGroups;*/
                            /* jSimListFun(jSimList)*/
                            // console.log(that.jSimListDataAll)
                            for (var j = 0; j < res.jSimList.cards.length; j++) {
                                that.jSimListDataAllCCid.push(res.jSimList.cards[j].iccid);
                            }
                        } else {
                            console.log(["get ALL sim list no ok", res]);
                        }
                    },
                    error: function (res) {},
                });
            }
        },

        outPutDataALLTest() {
            console.log(this.jSimListDataAllCCid);
            console.log(window.location.search);
        },

        autoFont(res) {
            const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (!clientWidth) return;
            let fontSize = clientWidth / 1920;
            return res * fontSize;
        },

        //调整表格
        // chartSetting(){
        //     this.changeChartBool = !this.changeChartBool;
        // },

        // printOut(){
        //     console.log('选中的表内容：'+this.selectChart);
        //     console.log(this.chartsDom[this.selectChart]);
        //     let dom = this.chartsDom[this.selectChart];
        //     let option = dom.getOption();
        //     console.log(option);
        //     option.yAxis[0].minInterval=parseInt(this.gap);
        //     option.yAxis[0].min=parseInt(this.minSet);
        //     option.yAxis[0].max=parseInt(this.maxSet);
        //     dom.setOption(option);
        // }
    },
    //------------------------------------------methods 结束
};

var Ctor = Vue.extend(Main);
new Ctor().$mount("#detal_data_graph");
