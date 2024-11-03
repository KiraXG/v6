
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<%@ include file="../import_file.jsp"%>

<body style="margin:0px;padding:0px;">
<div id="company_list">
	<div style="display:flex;flex-direction:column;width:100%;height:100%;">
		<div style="display:flex;flex-direction:row;margin-bottom:10px;">
			<el-input
				placeholder="输入关键字进行查找"
						v-model="textfilterCompany"
						clearable
						style="width:400px;margin-right:20px;">
			</el-input>
			<el-button type="primary" @click="btnFilterCompany">查找</el-button>
			<el-button type="primary" @click="btnAddCompany">添加</el-button>
		</div>
		<template>
			<el-table :data="tableData" style="width:100%" border height="100%">						
				
				<el-table-column prop="account" label="账号名称" width="120"></el-table-column>
				<el-table-column prop="company_name" label="公司简称" width="150"></el-table-column>
	     		<el-table-column prop="company_full_name" label="公司全称" width="280"></el-table-column>
	     		<el-table-column prop="password" label="密码" width="120"></el-table-column>
	     		<el-table-column prop="tel" label="绑定电话" width="150"></el-table-column>
	     		<el-table-column prop="manage_node" label="管仪表" width="70">
	     			<template slot-scope="scope">
	     				<el-tag :type="['danger','success'][scope.row.manage_node]">
	     					{{['否','是'][scope.row.manage_node]}}	
	     				</el-tag>
	     			</template>
	     		</el-table-column>
	     		
	     		<el-table-column prop="manage_company" label="管用户" width="70">
	     			<template slot-scope="scope">
	     				<el-tag :type="['danger','success'][scope.row.manage_company]">
	     					{{['否','是'][scope.row.manage_company]}}
	     				</el-tag>
	     			</template>
	     		</el-table-column>
	     			
	     		<el-table-column label="操作" width="200">
					<template slot-scope="scope">
	   					<el-button size="mini" type="primary" icon='el-icon-edit'
	   					@click="clickEditUser(scope.$index, scope.row)">编辑</el-button>
						
						<template>
							<el-popconfirm
						  		confirm-button-text='确定删除'
						  		confirm-button-type='danger'
						  		cancel-button-text='再想想'
						  		cancel-button-type='primary'
						  		icon="el-icon-warning"
						  		icon-color="red"
						  		title="确定要删除用户吗?"
						  		@confirm="clickDeleteUser(scope.$index, scope.row)">
						  		
								<el-button size='mini' type='danger' slot="reference"
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
	
	
	<el-dialog title="修改公司信息"
			:show-close="false"
			:visible.sync="editShowHide"
			:close-on-press-escape="false"				
			:before-close="btnCloseEditInfoDialog"
			fullscreen
			>		
		 
		<el-form :model="editCompanyInfoForm" label-width="100px"
			ref="companyInfoForm" :rules="companyInfoRules">
			<el-form-item label="登录账号" prop="account">
    				<el-input v-model="editCompanyInfoForm.account"></el-input>
   			</el-form-item>
   			<!-- 
   			<el-form-item label="登录密码" prop="password">
    				<el-input v-model="editCompanyInfoForm.password"></el-input>
    		 --> 
   			</el-form-item>
   			<el-form-item label="公司全称" prop="company_full_name">
    				<el-input v-model="editCompanyInfoForm.company_full_name" ></el-input>
   			</el-form-item>
   			<el-form-item label="公司简称" prop="company_name">
    				<el-input v-model="editCompanyInfoForm.company_name" ></el-input>
   			</el-form-item>
   			<el-form-item label="绑定手机号" prop="tel">
    				<el-input v-model="editCompanyInfoForm.tel" ></el-input>
   			</el-form-item>

   			<el-form-item label="管理用户" prop="manage_company">
   				<el-select v-model="editCompanyInfoForm.manage_company">
   					<el-option key="0" label="不可以" value="0"></el-option>
   					<el-option key="1" label="可以" value="1"></el-option>
   				</el-select>
   			</el-form-item>
   			   			
   			<el-form-item label="管理仪表" prop="manage_node">
   				<el-select v-model="editCompanyInfoForm.manage_node" :disabled="editCompanyInfoForm.manage_company==1">
					<el-option key="0" label="不可以" value="0"></el-option>
				    <el-option key="1" label="可以" value="1"></el-option>
				  </el-select>
   			</el-form-item>

 		</el-form>
 			 
		<span slot="footer" class="dialog-footer">
	    	<el-button @click="editShowHide = false">取 消</el-button>
	    	<el-button type="primary" @click="clickUpdateCompanyInfo">确 定</el-button>
		</span>
	</el-dialog>
	
	<el-dialog title="新建公司"
		:visible.sync="addCompanyDialogVisable"
		fullscreen
		:show-close="false"
		:close-on-press-escape="false"
		:before-close="beforeCloseAddCompanyDialog"
		>
		<el-form :model="editCompanyInfoForm" label-width="100px"
			ref="companyInfoForm" :rules="companyInfoRules">
			<el-form-item label="公司账号" prop="account">
    				<el-input v-model="editCompanyInfoForm.account"></el-input>
   			</el-form-item>
   			<el-form-item label="登录密码" prop="password">
    				<el-input v-model="editCompanyInfoForm.password"></el-input>
   			</el-form-item>
   			<el-form-item label="公司全称" prop="company_full_name">
    				<el-input v-model="editCompanyInfoForm.company_full_name" ></el-input>
   			</el-form-item>
   			<el-form-item label="公司简称" prop="company_name">
    				<el-input v-model="editCompanyInfoForm.company_name" ></el-input>
   			</el-form-item>
   			<el-form-item label="绑定手机号" prop="tel">
    				<el-input v-model="editCompanyInfoForm.tel" ></el-input>
   			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
	    	<el-button @click="addCompanyDialogVisable = false">取 消</el-button>
	    	<el-button type="primary" @click="btnAddCompanyComfirm">确 定</el-button>
		</span>
	</el-dialog>
	
</div>
</body>



<script type="text/javascript" src="company_list.js"></script>

