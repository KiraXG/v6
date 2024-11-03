
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<!DOCTYPE html style="margin:0px;padding:0px;width:100%;height:100%;"> 

<html>



<head>
	<meta charset="UTF-8">
	<!-- import CSS -->
	<!-- <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"> -->
	<link rel="stylesheet" href="./main_window.css">
	<link rel="shortcut icon" href="ps.png" type="image/x-icon" />
	<title>物联网 远程监控系统</title>
</head>



<head>
	<meta charset="UTF-8">
	<!-- import CSS -->
	<!-- <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"> -->
	
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" /> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />	
	
</head>



<!-- 
<script
	src="https://code.jquery.com/jquery-3.6.0.min.js"
	integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
	crossorigin="anonymous">
</script>
 -->


 
<%-- <script src="https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js"></script>
<script src="https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
<script type="text/javascript" charset="utf-8" src="https://map.qq.com/api/gljs?v=1.exp&key=R55BZ-G426D-SDR4G-HTX2V-MRN2Z-RABKY"></script>

<script src="<%=request.getContextPath()%>/js/jquery.md5.js"></script>
<script src="<%=request.getContextPath()%>/js/echarts.min.js"></script>

<script src="<%=request.getContextPath()%>/ps_consts_f.js"></script>
<script src="<%=request.getContextPath()%>/util_f.js"></script>
<script src="<%=request.getContextPath()%>/sha1.js"></script>
<script src="<%=request.getContextPath()%>/sim_api_zc_f.js"></script>
<script src="<%=request.getContextPath()%>/common.js"></script> --%>


<%@ include file="./import_file.jsp"%>




<body style="margin:0px;padding:0px;width:100%;height:100%;">

	<div id="app">
		 
		<div :style="topContainerStyle">
			<!-- 头部 -->
			<div id="headLine"
				:style="headWindowStyle"
				ref="winHeader">
				<span style="padding-left: 65px;align-self:center;
					font-size:15;
					color:#FFF;">您好, {{companyName}} </span>
				<span id="system" >远程监控系统</span>
				<el-button @click="clickLogout" icon="el-icon-switch-button" id="resign"  ></el-button>
				<el-button @click="menuSwitch" icon="el-icon-s-unfold"   id="menuButton"></el-button>				 
				
			</div>
		
			
			<!-- 头部下面 -->
			<div style="display:flex;flex-direction:row;">
				<!-- 左边栏 -->
				<div  :style="asideWindowStyle" ref="asideWindow" id="sideMenu"
				@mouseenter = "menuShow"
				@mouseleave = "menuHide"
				>
			
					<el-menu
						class="el-menu-vertical-demo" 
						@open="handleOpen"
						@close="handleClose"
						@select="asideMenuSelected"
						:text-color="textColor"
						style="height:100%;"
						ref="mainMenuWindow"
						:unique-opened="true" 
						:collapse = "menuCover"
						:collapse-transition = "false"
						background-color = "#4fa5fa"
						text-color = "#FFF"
						active-text-color = '#000000'
						>



						<el-menu-item index="DATA_VIEW_LIST">
								<i class="el-icon-s-help" :style="{color:iconColor,}"></i>
								<span >工作台</span>
						</el-menu-item>
						
						<el-submenu index="NODE_DATAS">
							<template slot="title">
								<i class="el-icon-s-data" :style="{color:iconColor,}"></i>
								<span slot="title">仪表数据</span>
							</template>
							<el-menu-item index="REAL_DATA_LIST">
								<el-badge :value="nodeAlarmCount" :hidden="nodeAlarmBadgeHidden">实时数据
								</el-badge>
							</el-menu-item>						
						</el-submenu>
						
						
						<el-menu-item v-if="showNodeList" index="NODE_REMOTE">
							<i class="el-icon-magic-stick" :style="{color:iconColor,}"></i>
							<span >远程调控</span>
						</el-menu-item>
						
						
						<el-submenu index="USER_MANAGER" v-if="0">
							<template slot="title">
								<i class="el-icon-user-solid" :style="{color:iconColor,}"></i>
								<span slot="title">用户管理</span>								
							</template>						
							<el-menu-item index="USER_LIST">用户列表</el-menu-item>
						</el-submenu>
						
						<el-submenu v-if="showNodeList" index="NODE_MANAGER">
							<template slot="title">
								<i class="el-icon-s-grid" :style="{color:iconColor,}"></i>
								<span slot="title">仪表管理</span>
							</template>
							<el-menu-item index="NODE_LIST">仪表增删改查</el-menu-item>
						</el-submenu>
						
						<el-submenu v-if="showProjectList" index="PROJ_MANAGER">
							<template slot="title">
								<i class="el-icon-s-order" :style="{color:iconColor,}"></i>
								<span slot="title">项目管理</span>								
							</template>
							<el-menu-item index="PROJECT_LIST">项目增删改查</el-menu-item>
						</el-submenu>
						
						<el-submenu v-if="showManager" index="GROUP_MANAGER">
							<template slot="title">
								<i class="el-icon-user-solid" :style="{color:iconColor,}"></i>
								<span slot="title">公司管理</span>
							</template>
							<el-menu-item index="GROUP_TREE">{{MENU_COMPANY_RELATION}}</el-menu-item>
							<el-menu-item index="COMPANY_LIST">{{MENU_COMPANY_ZSGC}}</el-menu-item>
						</el-submenu>
						
						<el-submenu  index="SIM_MANAGER">
							<template slot="title">
								<i class="el-icon-s-promotion" :style="{color:iconColor,}"></i>
								<span slot="title">SIM卡管理</span>
							</template>
							<el-menu-item index="SIM_LIST">{{MENU_SIM_LIST}}</el-menu-item>
							<!-- <el-menu-item index="SIM_ACTIVE_LIST">{{MENU_SIM_ACTIVE_LIST}}</el-menu-item>
							<el-menu-item index="SIM_NODE_LIST">{{MENU_SIM_NODE_LIST}}</el-menu-item>
							<el-menu-item index="SIM_EXPIRED_LIST">{{MENU_SIM_EXPIRED_LIST}}</el-menu-item> -->
						</el-submenu>
						
					</el-menu>
				</div>	<!-- 边栏结束 -->
				
				<!-- 主内容与脚位,与左边栏并列 -->
				<div id="mainWindow" :style="mainWindowStyle" ref="winMain">
				
					<!-- 主内容 -->
					<div style="margin: 10px 10px 0px 10px">
				
						<el-tabs v-model="tabSelected" closable type="border-card"
							@tab-click="handleTabClick"
							@tab-add="handleTabAdd"
							@tab-remove="removeTab"
							background-color=""
							>
				  			<el-tab-pane v-for="(item, index) in editableTabs"
				    					:key="item.name"
				    					:label="item.name"
				    					:name="item.name"
				    					:lazy="true"
				    					>
				    		<!-- {{item.content}} -->				    			
				    			<iframe :src="item.url" border="0"
				    				frameborder="no"
				    				scrolling="no"				    						    								    				
				    				:style="tabPaneStyle"
				    				:targetName="item.name"
				    				ref="frameList"
				    				>
				    			</iframe>
				  			</el-tab-pane>
				  			
						</el-tabs>
					
					</div>
					
					<!-- 脚位 -->
					<!-- 
					<el-footer>底部状态栏
					</el-footer>
					 -->
					
				</div> <!-- 主内容与脚位结束 -->
				
			</div> <!-- 头部下面结束 -->
			
		</div>	<!-- 整个 eleme 页面结束 -->
		
	</div>

</body>

<style>

	/* html{
		filter: invert(0.9);
	} */


</style>

<script type="text/javascript" src="main_window.js"></script>
  
</html>



