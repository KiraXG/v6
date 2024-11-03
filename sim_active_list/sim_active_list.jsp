<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>



<%@ include file="../import_file.jsp"%>


<body style="margin:0px;">
	<!-- vue 对象窗口  -->
	<div id="sim_active_list" style="display:flex;flex-direction:column;width:100%;height:100%;">
		<!-- 列表上方的查找框与查找按钮的组合 -->
		<div style="display:flex;flex-direction:row;margin-bottom:10px;" ref="topBar">
			<el-input
				placeholder="按ICCID,IEMI,公司名,工程名,工位号,到期时间进行查找"
  				v-model="filterSimText"
  				clearable
  				style="width:300px;margin-right:20px;">
			</el-input>
			<el-button type="primary" @click="btnFilterSim">查找</el-button>								
		</div>
	
		<!-- 列表控件 -->
		<template>
			<el-table :data="simTableData" style="width:100%" border ref="simList" height=100%
				:cell-style="tabCellStyle">
				<el-table-column prop="iccid" label="ICCID" width="180" fixed></el-table-column>
				<el-table-column prop="imei" label="IMEI" width="180"></el-table-column>
				<el-table-column prop="company" label="公司" width="180"></el-table-column>
      			<el-table-column prop="project" label="工程" width="180"></el-table-column>
      			<el-table-column prop="group" label="工位号" width="180"></el-table-column>
      			<el-table-column prop="expired" label="到期日" width="120"></el-table-column>
   				<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<el-button size="small" type="primary"
								icon="el-icon-refresh-right"
			    				@click="btnReflash(scope.$index, scope.row)"
			    					style="margin:0px;padding:10px;"
			    					>刷新</el-button>
			    	</template>
			    </el-table-column>
    		</el-table>
    	
		</template>
	</div>
</body>


<script type="text/javascript" src="sim_active_list.js"></script>