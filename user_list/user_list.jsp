
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- import CSS -->
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
</head>

<!-- import Vue before Element -->
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<!-- import JavaScript -->
<script src="https://unpkg.com/element-ui/lib/index.js"></script>  
  
<script src="https://unpkg.com/element-ui@2.15.1/lib/index.js"></script>


<script
	src="https://code.jquery.com/jquery-3.6.0.min.js"
	integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
	crossorigin="anonymous">
</script>



	<div id="user_list" width="100%">
		<el-text>用户列表</el-text>
		<el-button type="primary">添加</el-button>		
		<template>
			<el-table :data="tableData" style="width:100%"
				@select="rowSelectClick">
				

				
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="ACCOUNT" label="账号名称" width="180"></el-table-column>
      			<el-table-column prop="NAME" label="公司全称" width="280"></el-table-column>
      			<el-table-column prop="SNAME" label="公司简称" width="180"></el-table-column>
      			<el-table-column prop="TEL" label="绑定电话"></el-table-column>
      			
      			<el-table-column label="操作">
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
						  		@confirm="clickDeleteUser(scope.$index, scope.row)"
							>
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
		
		<el-dialog title="修改用户信息" :visible.sync="editShowHide" 
				show-close="false"
				close-on-press-escape="false"				
				:before-close="handleClose">
			
			 
			<el-form :model="form">
				<el-form-item label="用户账号" >
     				<el-input v-model="form.account" size="medium"></el-input>
    			</el-form-item>
    			<el-form-item label="用户全称" style="width:180">
     				<el-input v-model="form.name" ></el-input>
    			</el-form-item>
    			<el-form-item label="用户简称" label-width="180">
     				<el-input v-model="form.sname" ></el-input>
    			</el-form-item>
    			<el-form-item label="绑定手机号" label-width="180">
     				<el-input v-model="form.tel" ></el-input>
    			</el-form-item>
  			</el-form>
  			
  			 
			<span slot="footer" class="dialog-footer">
		    	<el-button @click="editShowHide = false">取 消</el-button>
		    	<el-button type="primary" @click="clickUpdateCompanyInfo">确 定</el-button>
			</span>
		</el-dialog>
		
	</div>
	



<script type="text/javascript" src="user_list.js"></script>

