
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<%@ include file="../import_file.jsp"%>



<body style="margin:0px;padding:0px;">
	<div id="alarm_record">
		<div style="display:flex;flex-direction:row;width:100%;height:100%">
			
			
			<div style="display:flex;flex-direction:column;height:500px;padding:10px;background-color:white;"
				:style="mainWindowStyle" ref="mainWindow">
				
				<div v-if="nodeInfoReady" style="display:flex;flex-direction:row;margin-bottom:20px;"> 			
					<div :style="{'margin-right':'10px',color:PsColor.PS_BLUE,}">{{lastSelectedNode.project_name}}</div>			
					<div :style="{'margin-right':'10px',color:PsColor.PS_GREEN,}">{{lastSelectedNode.node_name}}</div>
					<div :style="{'margin-right':'10px',color:PsColor.PS_YELLOW,}">{{lastSelectedNode.group}}</div>
					
					<el-checkbox v-model="iKnowValueAbnormalChecked">我已经知道参数异常，我希望撤销最后一次报警提示！</el-checkbox>
					<el-button @click="btnCleanNodeAlarmNotice" type="danger" :disabled="!iKnowValueAbnormalChecked">确认勾选前述内容，撤销最后一次报警提示</el-button>	
				</div>
				
				<div style="display:flex;flex-direction:row;margin-bottom:10px;" ref="topBar">
					<el-date-picker
							v-model="startTime"
							align=""
							type="date"
							placeholder="选择开始日期"
							:picker-options="startTimePickerOptions"
							style="margin-left:10px;"
							>
					</el-date-picker>
						
					<el-date-picker
						v-model="endTime"
						align=""
						type="date"
						placeholder="选择结束日期"
						:picker-options="endTimePickerOptions"
						style="margin-left:10px;"
						
						>
					</el-date-picker>
					
					<el-input v-model="pageLineCount" placeholder="8"
						style="margin-left:10px;width:250px;">					
						<template slot="prepend">每页显示</template>
						<template slot="append">行数据</template>	
					</el-input>
					
					<!-- 
					<div style="margin-left:10px;width:220px;text-align:left;align-self:center;">每页显示多少行数据</div>
					 -->
					
					<el-button type="primary" @click="btnReflashAlarms"
						style="margin-left:10px;" 
						>更新</el-button>
										
				</div>
														
				<template>
					<el-table :data="dataPageList" style="width:100%;" border ref="historyDataList"
						height=100% :cell-style="tabCellStyle" stripe
						:header-cell-style="parsenTabCellStyle">
		      			<el-table-column prop="date" label="时间" width="240"></el-table-column>
		      			
		      			
		      			
		      			
		      			
	      				<el-table-column v-for="(info,i) in lastSelectedNode.nodeInfos"
		      				:label="info.lineDesc" width="120">
		      				<template slot-scope="scope">
		      					<div :style="{color:scope.row.line_alarms[i].color}"
		      						>{{scope.row.line_alarms[i].text}}
		      					</div>
		      				</template>
		      			</el-table-column>
		      			
		      			
		      			
		      			
		      			
		      			
		      			
		      			
		      			
		      			
		      			
		      			
		      			
		      			<el-table-column prop="alarm_name" label="报警类型" width="180">
		      				<template slot-scope="scope">
		      					<div :style="{color:scope.row.alarm_color}">{{scope.row.alarm_name}}</div>
		      				</template>
		      			</el-table-column>
		      			

		    		</el-table>
		    	
				</template>


				<el-pagination background 
						layout="prev, pager, next, jumper"
		  				:total="pageCount"
		  				@current-change="pageChange"
		  				:current-page="currentPage"
		  				>
				</el-pagination>				

			</div mainWindow结束="">
			
			
			
			
			
			
			
			
		
		
		</div>
	</div>
</body>



<style lang="css">
	
	.tree_scroll .el-scrollbar__wrap{
		overflow-x: hidden;
	}

</style>


<script type="text/javascript" src="alarm_record.js"></script>




