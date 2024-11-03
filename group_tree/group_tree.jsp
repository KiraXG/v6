
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>


<%@ include file="../import_file.jsp"%>

<body style="margin:0px;padding:0px;">

	<div id="group_tree" style="height:95vh">
		<!--
		<el-tree
      		:data="tree_data"
      		show-checkbox
      		node-key="id"
      		default-expand-all
      		:expand-on-click-node="false"
      		style="width:500px;">
      		<span class="custom-tree-node" slot-scope="{ node, data }">
        		<span >{{ node.label }}</span>
        		<span>
					<el-button
		            	type="text"
		            	size="mini"
		            	@click="() => append(data)">
		            	Append
		          	</el-button>
		          	<el-button
		            	type="text"
		            	size="mini"
		            	@click="() => remove(node, data)">
		            	Delete
		          	</el-button>
		        </span>
      		</span>
    	</el-tree>
      	-->
      	
    	<el-table
    		:data="tableData"
    		row-key="company_id"
    		height="100%"
    		style="width:100%"    		
    		default-expand-all
    		border
    		>
    		<el-table-column
      			label="公司组织"
      			width="700px"
      			>
      			 
      			<template slot-scope="scope">
      			<!--
        			<i class="el-icon-time"></i>
        			-->
        			<!-- 
        			<span style="margin-left: 10px">{{ scope.row.label }}</span>
        			 -->
        			 <span>{{ scope.row.company_name }}</span>
      			</template>
      			 
      			
    		</el-table-column>
    		

			<el-table-column label="操作" width="250">
      			<template slot-scope="scope">
        			<el-button
          				size="mini"
          				@click="handleAddCompany(scope.$index, scope.row)">添加下属公司</el-button>
          			

					
					<el-tooltip class="item" effect="dark" content="注意只是删除归属关系,不会删除整个公司" placement="top-start">
						<el-button
	        				v-if="!scope.row.delete_button_absent"
	          				size="mini"
	          				type="danger"
	          				@click="handleDeleteSon(scope.$index, scope.row)">删除归属关系</el-button>
	          		</el-tooltip>
      			</template>
    		</el-table-column>
  		</el-table>
  		
  		

  		
  		<el-dialog 
  			title="修改下属公司"
  			:visible.sync="addCompanyDialogVisible"
  			fullscreen>
  			<el-button @click="quitAndNotSave" icon="el-icon-back" type="success">放弃修改</el-button>
  			<el-button @click="quitAndSave" icon="el-icon-edit" type="danger">保存修改</el-button>  			
  			<template>
				<el-transfer
			    	filterable			    	
			    	filter-placeholder="请输入公司名称"
			    	v-model="companySelected"
			    	:data="companyList"
			    	:titles="['选择下属公司', '已经添加到下属公司']"
			    	:props="{key:'company_id',label:'company_name'}"	    	
			    	>
				</el-transfer>
			</template>
		</el-dialog>
	</div>
</body>

<!-- 
<style>

    .el-transfer-panel__list.is-filterable{
        height: 400px;
    }
</style>
 -->

<script type="text/javascript" src="group_tree.js"></script>

<style>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
  
	.el-transfer-panel{
        width: 600px;
        height: 600px;
    }
    
    .el-transfer-panel__list.is-filterable{
        height: 500px;
    }
</style>