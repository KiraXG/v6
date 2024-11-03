
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>



<%@ include file="../import_file.jsp"%>



<style>	
	.el-scrollbar__wrap{overflow-x:hidden;}
	
	  .table-expand {
		font-size: 0;
	  }
	  .table-expand label {
		width: 90px;
		color: #99a9bf;
	  }
	  .table-expand .el-form-item {
		  padding-left:20px;
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	  }
	
	.el-table--border{	
		border-radius:8px;
		} 
		
	  .el-table .H2-row {
		background: #FF6666;
	  }
	
	  .el-table .H1-row {
		background: #FFCC00;
	  }
	  
	  .el-table .L2-row {
		background: #99CCFF;
	  }
	  
	  .el-table .L1-row {
		background: #99FFFF;
	  }
	  
	  .el-table .reN-row {
		background: #99FF99;
	  }
	
	  .withPic{
		display: flex;
		flex-direction: column;
	  }
	
	  .picInline{
		margin: 0 auto;
	  }
	 
	  #gudge{
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 5px;
	  }


	  .slideshow-container {
		padding: 5 0 10 5;
        position: relative;
        width: 100%;
        max-width: 25%;
        height: 90%;
        overflow: hidden;
		display: flex;
		flex-direction: column;
    }

	  .slideshow-image {
        position: absolute;
        opacity: 0;
        z-index: 1;
        transition: opacity 1s ease-in-out;
        object-fit: cover;
        width: 100%;
        height: 100%;
	}

	.active {
        opacity: 1;
        z-index: 2;
    }


	</style>



<body style="margin:0px;">
	<div id="real_data_list" >
		<div style="display:flex;flex-direction:row;height:100%;width:100%">
		
			<div id="aside_window" style="display:flex;flex-direction:column;height:100%;" ref="asideWindow">
				<el-input
					placeholder="输入关键字进行过滤"
		  			v-model="filterCompanyText"
		  			clearable
		  			style="margin:11px 0 10 0;"
		  			>
				</el-input>
				<div :style="scrollbarStyle" >
					<el-scrollbar style="height:100%;">
						<el-tree
							class="filter-tree"
							:data="companyTreeData"
							default-expand-all
							:show-checkbox="true"
							:expand-on-click-node="true"
							:filter-node-method="filterCompanyTreeFunc"
							@node-click="companyTreeNodeClick"
							@check="companyTreeNodeCheck"
							ref="companyTree"
							node-key="id"
							:render-content="handleRenderContent"
							@node-expand="companyTreeExpand"
							@node-collapse="companyTreeCollapse"
							>
						</el-tree>
					</el-scrollbar>		
				</div>
				<el-button :style="alarmButton" v-on:click = "dialogAlarmVisible = true" style="margin-top: 8px;">详细报警信息</el-button>
				
				<div id="gudge" :style="gudgeStyle">
					
				</div>

			</div>
			
				<div style="padding:10px;display:flex;flex-direction:row;background-color:white;"
					:style="mainWindowStyle" ref="mainWindow">		
					<div style="display:flex;flex-direction: column;width:99%">
					<div style="display:flex;flex-direction:row;margin-bottom:10px;width: 70%;" ref="topBar">
						<div style="width:100%;border: 1px solid rgba(0, 0, 0, 0.1);border-radius: 10px;display: flex;flex-direction: row;">
							<el-input
								placeholder="按工位号,IEMI号进行查找"
								v-model="filterNodeText"
								clearable
								style="width:300px;margin-right:20px;">
							</el-input>
							<el-button type="primary" @click="btnFilterNode">查找</el-button>
							<div style="margin-left: auto;">					 
								<el-button @click="btnFullscreen">最大化</el-button>
								<el-button @click="outPutList">导出</el-button>
							</div>
							
						</div>				
					</div>
					<div :style="listStyle">
					<template>
						<el-table :data="nodeFilteredList.slice((pageIndex-1)*pageItemCount,(pageIndex)*pageItemCount)"
							ref="projectList"
							stripe border
							height=100%  :cell-style="setCellStyle" :header-cell-style="parsenTabCellStyle"
							:default-sort="{prop:'node_data.date',order:'descending'}"
							@sort-change="sortChangeHandler" 
							id="table"
							>
							<div slot="empty" >
								<el-empty description="请先点击左侧项目树哦"></el-empty>
							</div>
							
							
							<el-table-column prop="company_name" label="所属公司" :width="flexColumnWidth('company_name',nodeFilteredList.slice((pageIndex-1)*pageItemCount,(pageIndex)*pageItemCount))" align="center" fixed v-if="manageCompany"></el-table-column>
							<el-table-column prop="project_name" label="所属工程" :width="flexColumnWidth('project_name',nodeFilteredList.slice((pageIndex-1)*pageItemCount,(pageIndex)*pageItemCount))" align="center"></el-table-column>
							
							
							<el-table-column prop="node_name" width="120" :width="Math.max(120,flexColumnWidth('node_name',nodeFilteredList.slice((pageIndex-1)*pageItemCount,(pageIndex)*pageItemCount)))" label="仪表名称" align="center">
								<template slot-scope="info">
									<div v-if="info.row.node_name.includes('压力')"  class="withPic">
									<image src="../image/pressure.png" width="100px" height="100px" class="picInline">
										<span>{{info.row.node_name}}</span>
									</div>
									<div v-else-if="info.row.node_name.includes('温度')"  class="withPic">
										<image src="../image/temp.png" width="100px" height="100px" class="picInline">
										<span>{{info.row.node_name}}</span>
									</div>>
									<div v-else-if="info.row.node_name.includes('多参量')" class="withPic">
										<image src="../image/multiple.png" width="100px" height="100px" class="picInline">
										<span>{{info.row.node_name}}</span>
									</div>
									<div v-else-if="info.row.node_name.includes('液位')" class="withPic">
										<image src="../image/liquid.png" width="100px" height="100px" class="picInline">
										<span>{{info.row.node_name}}</span>
									</div>
									<div v-else style="width:fit-content;margin: 0 auto;">
										<span>{{info.row.node_name}}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="imei" label="IMEI号" :width="flexColumnWidth('imei',nodeFilteredList.slice((pageIndex-1)*pageItemCount,(pageIndex)*pageItemCount))" sortable="custom" align="center"></el-table-column>
			      			<el-table-column prop="group" label="工位号" :width="30+flexColumnWidth('group',nodeFilteredList.slice((pageIndex-1)*pageItemCount,(pageIndex)*pageItemCount))" align="center" sortable="custom"></el-table-column>
			      			
			      			<el-table-column prop="detal_info" label="数据" :width="58+flexColumnWidth('shortTime',nodeFilteredList.slice((pageIndex-1)*pageItemCount,(pageIndex)*pageItemCount))" sortable="custom" align="center">
					      		<template slot-scope="scope">
					    			<div style="display:flex;flex-direction:column;">
					    				<span>时间: {{scope.row.shortTime}}</span>
						      			<div v-for="(info,i) in scope.row.dataInfos">
						      				<el-tag :type="['primary','success','warning','danger'][i]"
						      					style="margin-top:2px;height:auto;"
						      					>{{info.line_desc}} {{info.last_value}} {{info.unit_name}}<br/>{{info.extText}}
						      				</el-tag>
						      			</div>
				      				</div>
					    		</template>
					    	</el-table-column>
			      			
			      			<el-table-column label="操作" wilder="87px"  align="center">
								<template slot-scope="scope">
									<div style="display:flex;flex-direction:column">
										<div>
											
											<el-button size="small" type="primary"
												icon="el-icon-picture-outline"
						    					@click="btnOpenDataGraphInNewTabs(scope.$index, scope.row)"
						    					style="margin:0px;padding:10px;"
						    					>仪表详情</el-button>
							    			
						    				
						    				<el-badge value="!!!" :hidden="[true,false][scope.row.alarm_notice]"> 
							    				<el-button size="small" type="primary"
							    					icon="el-icon-date" 
							    					@click="btnOpenAlarmRecordInNewTab(scope.$index, scope.row)"
							    					style="margin:0px;padding:10px;"
							    					>报警记录</el-button>
						    				</el-badge>
						    				
										</div>
										<!-- 
										<div style="margin-top:10px">
											<el-badge value="!!!" :hidden="[true,false][scope.row.ALARM_NOTICE]">
												<el-button size="small" type="warning"
													icon="el-icon-odometer"
													@click="btnOpenAlarmList(scope.$index, scope.row)"
													style="margin:0px;padding:10px;"
													>报警记录</el-button>
											</el-badge>
										</div>
										-->
			    					</div>
								</template>		
							</el-table-column>
							
							
			    		</el-table>
			    	
					</template>
					</div>
					<div style="margin-top: 10px; height: 40px; width: 100%; display: flex;flex: right;border: 1px solid rgba(0, 0, 0, 0.1);border-radius: 8px;">
					<div style="padding-top: 5px;">
						<el-pagination background 
							layout=" prev, pager, next, jumper"
							:total="pageCount"
							@current-change="pageChange"
							:current-page="currentPage"			  				
							>
						</el-pagination>
					</div>
					</div>
					</div>
					
					<!-- <div class="slideshow-container">
						<div >
							<img class="slideshow-image  active" src="../image/zcl-1.jpg ">
							<img class="slideshow-image" src="../image/zcl-2.jpg ">
							<img class="slideshow-image" src="../image/group-1.jpg ">
							<img class="slideshow-image" src="../image/group-2.jpg ">
							<img class="slideshow-image" src="../image/group-3.jpg ">
						</div>
					</div> -->
				</div>

			<el-dialog :visible.sync="dialogAlarmListVisible"
				fullScreen
				:show-close="false"
				:close-on-press-escape="false"
				:before-close="beforeCloseAlarmListDialog">
				<div slot="title" style="display:flex;flex-direction:row;">
					<el-button @click="btnHideAlarmList">返回仪表列表</el-button>
					<span style="height:40px;self-align:center;margin-left:20px;font-size:25;font-family:cursive;">{{lastSelectedNode.NAME}} 的报警记录</span>
				</div>
				
				<el-popconfirm
					confirm-button-text='已处理报警'
					cancel-button-text='还没处理好'
					icon="el-icon-info"
					icon-color="red"
					confirm-button-type="danger"
					cancel-button-type="success"
					title="确定已经处理好报警了吗？"
					>
					<el-button style="margin-bottom:20px;" @click="btnCleanAlarmNoticeFlag" slot="reference">如果已经处理好报警内容,请点我撤销报警提示!</el-button>
				</el-popconfirm>
				
				<el-table :data="alarmListTableData" style="width:100%" border :height="nodeAlarmListHeight"
					:cell-style="alarmListCellStyle">
										
					<el-table-column prop="date" label="时间" width="180" fixed></el-table-column>
					
					<div v-for="index in [0,1,2,3]">
						<el-table-column v-if="enaLoAlarm[index]" :prop="la[index]" :label="descLo[index]" width="150">						 
							<template slot-scope="scope">{{['否','是'][scope.row.la[index]]}}
								<span v-if="[false,true][scope.row.la[index]]" style="margin-left:10px;">{{scope.row.alarmValue[index]}}</span>
							</template>			
						</el-table-column>
						<el-table-column v-if="enaHiAlarm[index]" :prop="ha[index]" :label="descHi[index]" width="150">
							<template slot-scope="scope">{{['否','是'][scope.row.ha[index]]}}
								<span v-if="[false,true][scope.row.ha[index]]" style="margin-left:10px;">{{scope.row.alarmValue[index]}}</span> 
							</template>
						</el-table-column>
					</div>
				
					<el-table-column prop="status" label="事件类型" width="100"></el-table-column>					
					
				</el-table>
				
				<el-pagination background 
							layout="prev, pager, next, jumper"
			  				:total="alarmListPageCount"
			  				@current-change="alarmListPageChange"
			  				:current-page="alarmListCurrentPage"
			  				>
					</el-pagination>
			</el-dialog>
					
					
			<el-dialog v-if="dialogGraphVisible" 
					:visible.sync="dialogGraphVisible"
					fullScreen					
					:show-close="false"
					:close-on-press-escape="false"
					:before-close="beforeCloseGraphDialog">
				
				<div slot="title" style="display:flex;flex-direction:row;">
					<el-button @click="btnHideDataGraph">返回仪表列表</el-button>
					<span style="height:40px;self-align:center;margin-left:20px;font-size:25;font-family:cursive;"
						>{{lastSelectedNode.node_name}} 的详细图表,工位号: {{lastSelectedNode.group}} <br>IMEI:{{lastSelectedNode.imei}}, SIM卡号:{{lastSelectedNode.iccid}}</p>
				</div>
				
				<div style="display:flex;flex-direction:column;"><!-- 整个详图窗,分为上中下3大块 -->
					
					<div style="display:flex;flex-direction:row;"><!-- 上部,左最新数据,右地图 -->					
						<div style="display:flex;flex-direction:column;width:300px;" ref="paramsWindow">
							<el-card shadow="always" :style="{color:PsColor.PS_BLUE,}">
								<div style="display:flex;flex-direction:column;">
									<span>最后更新时间 : </span>
									<span>{{lastSelectedNode.node_data.date}}</span>
								</div>
							</el-card>
							<el-card shadow="always">
								<span>连网状态: </span><span :style="{color:crConnecting}">{{textConnecting}}</span>
							</el-card>
							
							<div v-for="(info,i) in lastSelectedNode.dataInfos" >
								<el-card :style="{color:PsColor.paramColors()[i],}"
								>{{info.line_desc}} {{info.displayValue}} {{info.unit_name}}<br/>{{info.extText}}</el-card>
							</div>
						</div>
						
						<canvas v-if="isExtGraphDisplay" id="cav_guan" style="margin:10px;" width="400px" height="500px"></canvas>
						
						<div id="map_container" style="height:500px;margin-left:20px;" :style="bdmapStyle"
							>
						</div>
					</div>
					
					<!-- 中上部最新数据的仪表控件 -->
					<!-- 
					<div style="display:flex;flex-direction:row;">						
						<div id="instrum_kpa" style="width:400px;height:400px;margin:10px;"></div>
						<div id="instrum_volume" style="width:400px;height:400px;margin:10px;"></div>
						<div id="instrum_tonne" style="width:300px;height:300px;margin:10px;"></div>
					</div>
				 	-->
					
					<!-- 中间设置数据区域的控件 -->
					<div style="display:flex;flex-direction:row;margin-top:10px;">
						<el-switch
							style="height:40px;margin-left:10px;"
							v-model="selectStartEndTime"
							:active-color="PsColor.PS_GREEN"
							:inactive-color="PsColor.PS_GREY"
							active-text="自定义时间段"
							inactive-text="默认最新24小时"
							>
						</el-switch>

						<el-date-picker
							v-model="startTime"
							align=""
							type="date"
							placeholder="选择开始日期"
							:picker-options="startTimePickerOptions"
							style="margin-left:10px;"
							:disabled="!selectStartEndTime">
						</el-date-picker>
						
						<el-date-picker
							v-model="endTime"
							align=""
							type="date"
							placeholder="选择结束日期"
							:picker-options="endTimePickerOptions"
							style="margin-left:10px;"
							:disabled="!selectStartEndTime"
							>
						</el-date-picker>
						
						<el-button type="primary" @click="reflashStartEndTimeData"
							style="margin-left:10px;" 
							>更新</el-button>
					</div>
					
<!-- 					<div id="totalCanvas" :style="{width:canvasWidth,height:'800px'}" -->
<!-- 						style="border:1px solid #000000;margin:10px;border-radius:8px;"> -->
<!-- 					</div> -->

<!-- :id="['canvasD1','canvasD2','canvasD3','canvasD4'][i]" -->
					
					<div v-for="(info,i) in lastSelectedNode.dataInfos">
						<div :id="info.canvas_id" 
							:style="{width:canvasWidth,height:'400px',}"
							style="border:1px solid #000000;margin:10px;border-radius:8px">
						</div>	
						
<!-- 						<div id="canvas_vol"  -->
<!-- 							:style="{width:canvasWidth,height:'400px',}" -->
<!-- 							style="border:1px solid #000000;margin:10px;border-radius:8px"> -->
<!-- 						</div>					 -->
					</div>
					
					<div id="canvas_vol" 
							:style="{width:canvasWidth,height:'400px',}"
							style="border:1px solid #000000;margin:10px;border-radius:8px">
					</div>
					
<!-- 					<div v-for="(info,i) in lastSelectedNode.dataInfos"> -->
<!-- 						<div :id="canvas_cp_+'i'" -->
<!-- 							:style="{width:canvasWidth,height:'400px',}" -->
<!-- 							style="border:1px solid #000000;margin:10px;border-radius:8px">>						 -->
<!-- 						</div> -->
<!-- 					</div> -->
				</div>
			</el-dialog>
					
<audio src="../notice/alarm.mp3" ref="audio" muted></audio>

			<el-dialog 
					title = "最新报警"
					:visible.sync="dialogAlarmVisible"
					:show-close ="false"	
					:close-on-press-escape="false"
					width="655">
			

 			<el-table 	:data = "alarmList"
 						border   
 						:row-class-name = "tableRowClassName" 
 						@selection-change = "handleSelectionChange"
						height="500"> 

				<div slot="empty">
					<el-empty description="当前没有仪器异常哦"></el-empty>
				</div>
				
				<el-table-column fixed type="selection" width="40"></el-table-column>	
					
				<el-table-column label="详情"  type = "expand"> 
					<template slot-scope="props">
						<el-form label-position="left" inline class="table-expand">
							<el-form-item label= "报警状态">
								<span>{{props.row.alarmType}}</span>
							</el-form-item>		
							<el-form-item label= "参量类型">
								<span>{{props.row.paramType}}</span>
							</el-form-item>		
							<el-form-item label= "imei号">
								<span>{{props.row.imei}}</span>
							</el-form-item>		
							<el-form-item label= "公司名称">
								<span>{{props.row.companyName}}</span>
							</el-form-item>		
							<el-form-item label= "项目名称">
								<span>{{props.row.projectName}}</span>
							</el-form-item>		
							<el-form-item label= "仪表名称">
								<span>{{props.row.nodeName}}</span>
							</el-form-item>		
						</el-form>
					</template>
				</el-table-column>	

				<el-table-column property = "date" label = "日期"  ></el-table-column>
				<el-table-column property = "group" label = "工位号"  ></el-table-column>
 				<el-table-column property = "value" label = "当前测量值" ></el-table-column>

			</el-table> 
		  		<div style="margin-top: 20px">
		  			<el-button type = "buttonType" @click="disVisableSelection()">取消选中显示</el-button>
		  		<el-button type = "buttonType" style="float:right" @click="disAlarmSelection()">取消选中报警</el-button>		  		
		  		</div>
		</el-dialog>	
			
		
		

	</div>
</body>


<!-- 公司树横向滚动条隐藏 -->
<!-- table列表圆角处理  -->



<script type="text/javascript" src="ext_unit_calc_f.js"></script>
<script type="text/javascript" src="ext_drawing_f.js"></script>
<script type="text/javascript" src="real_data_list.js"></script>













