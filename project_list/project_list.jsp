

<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<%@ include file="../import_file.jsp"%>

<body style="margin:0px;padding:0px;">
<div id="project_list">
	<div style="width:100%;height:100%;display:flex;flex-direction:row;">
		<div style="display:flex;flex-direction:column;height:100%;margin-right:10px;" ref="asideWindow">
			<div style="display:flex;flex-direction:row;margin-bottom:10px;">
				<el-input
					placeholder="输入关键字进行过滤"
		  			v-model="filterCompanyText"
		  			clearable
		  			style="width:200px;margin-right:5px;"
		  			>
				</el-input>
				
				<div style="display:flex;flex-direction:column;">
					<template>
						<el-checkbox v-model="companyTreeSelectIncludeSubCompany"
							:disabled="companyTreeAllowMultiSelect"  
							>
							包括子公司
						</el-checkbox>
					</template>
					<template>
						<el-checkbox v-model="companyTreeAllowMultiSelect"
							>
							允许多选
						</el-checkbox>
					</template>
				</div>
			</div>
			
			 
			<el-scrollbar class="tree_scroll" style="height:100%;">			
				<el-tree
					class="filter-tree"					
					:data="companyTreeData"
					:props="defaultProps"
					default-expand-all
					:show-checkbox="companyTreeAllowMultiSelect"				
					:filter-node-method="filterCompanyTreeFunc"
					:expand-on-click-node="companyTreeExpandOnClickNode"
					@check="companyTreeNodeCheck"
					@node-click="companyTreeNodeClick"
					:render-content="handleRenderContent"
					@node-expand="companyTreeExpand"
					@node-collapse="companyTreeCollapse"					
					ref="companyTree">
				</el-tree>
			</el-scrollbar>
		</div>

					
		<div style="display:flex;flex-direction:column;" :style="mainWindowStyle" ref="mainWindow">
			<div style="display:flex;flex-direction:row;margin-bottom:10px;" ref="topBar">
				<el-input
					placeholder="按项目名称或项目说明查找"
	  				v-model="filterProjectText"
	  				clearable
	  				style="width:300px;margin-right:20px;">
				</el-input>
				<el-button type="primary" @click="clickFilterProject">查找</el-button>
				<el-tooltip class="item" content="注意先在左边点选母公司,再点添加工程" placement="top" >
					<el-button type="primary" @click="btnAddProject" :disabled="btnAddProjectDisable">添加</el-button>
				</el-tooltip>
			</div>
			
			
			<template>		
				<el-table :data="tableData" style="width:100%" height="100%" border ref="projectList">
					<el-table-column prop="company_name" label="所属公司" width="180"></el-table-column>
					<el-table-column prop="project_name" label="项目名称" width="180"></el-table-column>
	      			<el-table-column prop="project_desc" label="项目说明" width="180"></el-table-column>		
	      			
	      			<el-table-column label="操作" width="220">
						<template slot-scope="scope">
	    					<el-button size="small" type="primary" icon="el-icon-edit"
		    					@click="btnEditProject(scope.$index, scope.row)">
		    					编辑
		    				</el-button>

	    					
							<template>
								<el-popconfirm
							  		confirm-button-text='确定删除'
							  		confirm-button-type='danger'
							  		cancel-button-text='再想想'
							  		cancel-button-type='primary'
							  		icon="el-icon-warning"
							  		icon-color="red"
							  		title="确定要删除工程吗?"
							  		@confirm="clickDeleteProject(scope.$index, scope.row)"
									>
									<el-button size='small' type='danger' slot="reference"
											icon='el-icon-delete'>
										删除
									</el-button>
								</el-popconfirm>
							</template>
						</template>
	
					</el-table-column>
	    		</el-table> 
			</template>
			
			<el-pagination background 
					layout="prev, pager, next, jumper"
	  				:total="pageCount"
	  				@current-change="pageChange"
	  				>
			</el-pagination>
			
		</div>
		
	</div>	
				
				 
				<el-dialog :title="titleAddProject" :visible.sync="dialogAddProjectShowHide"
						:show-close="false"
						:close-on-press-escape="false"
						:before-close="beforeCloseAddProjectDialog"
						>
					
					<el-form ref="projectInfoForm" :model="projectInfoData"
						label-width="100px" :rules="projectInfoRules">
						<el-form-item label="工程名称" prop="project_name">
							<el-input v-model="projectInfoData.project_name"></el-input>
						</el-form-item>
						<el-form-item label="工程描述" prop="project_desc">
							<el-input v-model="projectInfoData.project_desc"></el-input>
						</el-form-item>
						
						<el-form-item>
							<el-button type="primary" @click="btnSubmitAddProject">
								创建
							</el-button>
							<el-button @click="btnCancelAddProject">取消</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
				
				<el-dialog :title="titleEditProject" :visible.sync="dialogEditProjectVisible"
						:show-close="false"
						:close-on-press-escape="false"
						:before-close="beforeCloseEditProjectDialog"
						>
					
					<el-form ref="projectInfoForm" :model="projectInfoData"
						label-width="100px" :rules="projectInfoRules">
						<el-form-item label="工程名称" prop="project_name">
							<el-input v-model="projectInfoData.project_name"></el-input>
						</el-form-item>
						<el-form-item label="工程描述" prop="project_desc">
							<el-input v-model="projectInfoData.project_desc"></el-input>
						</el-form-item>
						
						<el-form-item>
							<el-button type="primary" @click="btnSubmitEditProject">
								保存修改
							</el-button>
							<el-button @click="btnCancelEditProject">取消</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
				

</div>
</body>

<style>	
	.tree_scroll .el-scrollbar__wrap{
		overflow-x:hidden;
	}
</style>

<script type="text/javascript" src="project_list.js"></script>













