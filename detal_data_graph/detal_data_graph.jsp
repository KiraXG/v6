<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %> <%@ include file="../import_file.jsp" %>

<style>
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .el-table--border {
        border-radius: 8px;
    }

    /* #modelTree .el-tree-node.is-current > .el-tree-node_content {
         background-color: #FF1E10 !important;
     }*/
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .myRedCheckBox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        border-color: #ff0000;
        background-color: #ff0000;
    }

    /*
        .el-checkbox{
            background-color:#FF1E10;
        }*/

    .info {
        font-size: 15px;
        color: black;
    }

    #idState {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-top: 10px;
    }

    #headInfo {
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        width: 45%;
    }

    #gagueChart {
        width: 100%;
        height: 90%;
    }

    #buttonContainer {
        width: fit-content;
        height: 10%;
        margin: 0 auto;
    }
</style>

<body>
    <div id="detal_data_graph" style="width: 100%; height: 100%; overflow: auto">
        <div style="display: flex; flex-direction: column; margin-bottom: 10px" id="headInfo">
            <div style="font-size: 25px; color: #409eff">{{ lastSelectedNode.node_name }}详情</div>
            <div id="idState">
                <el-card>
                    <div class="info">IMEI : {{ lastSelectedNode.imei }}</div>
                </el-card>
                <el-card>
                    <div class="info">工位号 : {{ lastSelectedNode.group }}</div>
                </el-card>
                <el-card>
                    <div class="info">SIM卡号 : {{ lastSelectedNode.iccid }}</div>
                </el-card>
            </div>
        </div>
        <div slot="title" style="display: flex; flex-direction: row; padding-bottom: 10px">
            <!-- <span style="height:40px;self-align:center;margin-left:20px;font: size 20px;;"
            >{{lastSelectedNode.node_name}} 的详细图表,工位号: {{lastSelectedNode.group}}
                <br>IMEI:{{lastSelectedNode.imei}}, SIM卡号:{{lastSelectedNode.iccid}}
                <br>SIM卡剩余流量:{{jSimListData.residueFlow}}
                , SIM卡开卡日期:{{jSimListData.openDate}}
                , SIM卡激活日期:{{jSimListData.activateTime}}
                , SIM卡到期日期:{{jSimListData.expiryDate}}</p> -->
        </div>

        <div style="display: flex; flex-direction: column">
            <!-- 整个详图窗,分为上中下3大块 -->

            <div style="display: flex; flex-direction: row">
                <!-- 上部,左最新数据,右地图 -->
                <div style="display: flex; flex-direction: column; width: 15%" ref="paramsWindow" pa>
                    <el-card shadow="always" :style="{color:PsColor.PS_BLUE,}">
                        <div style="display: flex; flex-direction: column">
                            <span>最后更新时间 :</span>
                            <span>{{ lastSelectedNode.node_data.date }}</span>
                        </div>
                    </el-card>
                    <el-card shadow="always">
                        <span>连网状态:</span>
                        <span :style="{color:crConnecting}">{{ textConnecting }}</span>
                    </el-card>

                    <div v-for="(info,i) in lastSelectedNode.dataInfos">
                        <el-card :style="{color:PsColor.paramColors()[i],}">
                            {{ info.line_desc }} {{ info.displayValue }} {{ info.unit_name }}
                            <br />
                            {{ info.extText }}
                        </el-card>
                    </div>
                </div>

                <canvas v-if="isExtGraphDisplay" id="cav_guan" style="margin: 10px; width: 50%" width="50%" height="500px"></canvas>

                <div id="map_container" style="height: 500px; margin-left: 20px; width: 50%" :style="bdmapStyle"></div>

                <div style="width: 30%; height: 500px; margin-left: 10px; display: flex; flex-direction: column">
                    <div id="gagueChart"></div>
                    <div id="buttonContainer">
                        <el-radio-group v-for="(item,index) in buttonInfos" v-model="buttonCharts" @change="gudgeChart(index)">
                            <el-radio-button :label="index">{{ item.line_desc }}</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
            </div>

            <!-- 中间设置数据区域的控件 -->
            <div style="display: flex; flex-direction: row; margin-top: 10px">
                <el-switch
                    style="height: 40px; margin-left: 10px"
                    v-model="selectStartEndTime"
                    :active-color="PsColor.PS_GREEN"
                    :inactive-color="PsColor.PS_GREY"
                    active-text="自定义时间段"
                    inactive-text="默认最新24小时"
                ></el-switch>

                <el-date-picker
                    v-model="startTime"
                    align=""
                    type="date"
                    placeholder="选择开始日期"
                    :picker-options="startTimePickerOptions"
                    style="margin-left: 10px"
                    :disabled="!selectStartEndTime"
                ></el-date-picker>

                <el-date-picker
                    v-model="endTime"
                    align=""
                    type="date"
                    placeholder="选择结束日期"
                    :picker-options="endTimePickerOptions"
                    style="margin-left: 10px"
                    :disabled="!selectStartEndTime"
                ></el-date-picker>

                <el-button type="primary" @click="reflashStartEndTimeData" style="margin-left: 10px">更新</el-button>

                <!--线图与列表的切换-->
                <el-radio-group v-model="radio1" style="padding-left: 40" @change="showDataRadioButtonChange">
                    <el-radio-button label="1">线图</el-radio-button>
                    <el-radio-button label="2">数据记录</el-radio-button>
                </el-radio-group>

                <!-- <el-button v-if="radio1==1" type="success" @click="chartSetting">调整表格</el-button> -->

                <!-- 调整表格 -->
                <!-- <div v-if="changeChartBool">
                <template>
                    <el-radio-group v-model="selectChart" >
                        <el-radio  :key="index" :label="item"  v-for="(index,item) in chartsDom"></el-radio>
                    </el-radio-group>
                </template>
                <input type="text" v-model="gap" style="width: 15px;">
                <input type="text" v-model="minSet" style="width: 15px;">
                <input type="text" v-model="maxSet" style="width: 15px;">
                <el-button @click="printOut">确认</el-button>
            </div> -->

                <el-button v-if="radio1==2" type="success" @click="outPutDataSelected">导出选中</el-button>
                <!--<el-button type="success" @click="outPutData">导出数据</el-button> -->
                <!--<el-button type="success"  @click="outPutDataALL">获取计费组id</el-button>
            <el-button type="success"  @click="outPutDataALLTest">导出全部数据</el-button>
             -->
            </div>

            <div v-if="radio1==1">
                <div v-for="(info,i) in lastSelectedNode.dataInfos">
                    <!--             图标个数在html中由lastselectedNode限制 -->
                    <div
                        :id="info.canvas_id"
                        :style="{width:'98%',height:'400px',}"
                        style="border: 1px solid #000000; margin: 10px; border-radius: 8px"
                    ></div>
                </div>

                <div id="canvas_vol" :style="{width:'98%',height:'400px',}" style="border: 1px solid #000000; margin: 10px; border-radius: 8px"></div>

                <div id="canvas_csq" :style="{width:'98%',height:'400px',}" style="border: 1px solid #000000; margin: 10px; border-radius: 8px"></div>
            </div>

            <!--列表模块页的数据-->
            <div v-if="radio1==2">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagenum"
                    :page-sizes="[10,20,50,100,200,400]"
                    :page-size="pagesize"
                    :total="yibiaoDatas.length"
                    layout="total,sizes,prev, pager, next, jumper, slot"
                >
                    <div style="display: flex; margin: 10">
                        <span>每页展示</span>
                        <el-col :span="1">
                            <el-input size="mini" v-model="inputOfPageSize"></el-input>
                        </el-col>
                        <span>条数据</span>
                        <el-button @click="reflashPageSize">确定</el-button>
                    </div>
                </el-pagination>

                <el-table
                    :data="yibiaoDatas.slice((pagenum-1)*pagesize,pagenum*pagesize)"
                    style="width: auto; margin-top: 10"
                    border
                    ref="projectList"
                    stripe
                    @selection-change="handleSelectionChange"
                    :row-key="getRowKey"
                    height="100%"
                    :cell-style="setCellStyle"
                    :header-cell-style="{background:'#2E62CD',color:'#FFFF9E'}"
                >
                    <el-table-column fixed type="selection" reserve-selection="true" width="40"></el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="date" label="时间" width="220"></el-table-column>
                    <el-table-column prop="gap" label="间隔" width="100"></el-table-column>

                    <!--  
                <el-table-column prop="line_datas[0].value" label="压力" width="120"></el-table-column>
                <el-table-column prop="line_datas[1].value" label="温度" width="120"></el-table-column>
				-->

                    <el-table-column v-for="(info,i) in lastSelectedNode.dataInfos" :label="info.line_desc" width="120">
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.line_datas[i] ? scope.row.line_datas[i].value : "NULL" }} {{ lastSelectedNode.dataInfos[i].unit_name }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="csq" label="信号" width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="group" label="电池" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.vol<10">
                                <span>{{ scope.row.vol }}V</span>
                            </div>
                            <div v-if="scope.row.vol>=10">
                                <p>{{ scope.row.vol }}%</p>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</body>

<!--jsp中引入js文件-->
<script src="https://webapi.amap.com/loader.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/real_data_list/ext_unit_calc_f.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/real_data_list/ext_drawing_f.js"></script>
<script type="text/javascript" src="detal_data_graph.js"></script>
