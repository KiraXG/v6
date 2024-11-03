<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>



<%@ include file="../import_file.jsp"%>

<style>
	
</style>


<body style="margin:0px;">
	<!-- vue 对象窗口  -->
	<div id="sim_list" >
		<el-button @click="allUp">全部更新</el-button>
		<el-button @click="outPutList">导出</el-button>
		<el-input 
			v-model="searchText" placeholder="输入IMEI/ICCID/项目/公司,enter以搜索" @keyup.enter.native="search"
		></el-input>
		<template>					
			<el-table :data="simData" style="width:100%" border ref="simList" height=90%
				:cell-style="tabCellStyle">
				<el-table-column prop="imei" label="imei" width="auto" ></el-table-column>
				<el-table-column prop="iccid" label="iccid" width="auto"></el-table-column>
				<el-table-column prop="project_name" label="项目" width="auto"></el-table-column>
      			<el-table-column prop="company_name" label="公司" width="auto"></el-table-column>
      			<el-table-column prop="status" label="状态" width="90"></el-table-column>
      			<el-table-column prop="network_type" label="类型" width="90"></el-table-column>
      			<el-table-column prop="activate_time" label="激活日" width="auto"></el-table-column>
      			<el-table-column prop="expiry_date" label="到期日" width="auto"></el-table-column>
      			<el-table-column prop="residue_flow" label="剩余流量(MB)" width="auto"></el-table-column>
      			<el-table-column prop="last_date" label="上传时间" width="auto"></el-table-column>
    		</el-table>
		</template>
	</div>
</body>


<script type="text/javascript" src="sim_list.js"></script>









