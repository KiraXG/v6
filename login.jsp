
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<!DOCTYPE html>
<html style="width:100%;height:100%;">


<head>
	<meta charset="UTF-8">
	<!-- import CSS -->
	<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
	<link rel="shortcut icon" href="ps.png" type="image/x-icon" />
	<title>物联网 远程监控系统</title>
</head>



<head>
	<meta charset="UTF-8">
	<!-- import CSS -->
	<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
	
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" /> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />	
	
</head>

<!-- import Vue before Element -->
<!-- <script src="https://unpkg.com/vue@2.6.14/dist/vue.min.js"></script> -->
<!-- import JavaScript -->
<!-- <script src="https://unpkg.com/element-ui/lib/index.js"></script>
<script src="https://unpkg.com/element-ui@2.15.6/lib/index.js"></script>
<script src="https://unpkg.com/@jiaminghi/data-view/dist/datav.map.vue.js"></script> -->


<!-- 
<script
	src="https://code.jquery.com/jquery-3.6.0.min.js"
	integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
	crossorigin="anonymous">
</script>
 -->


 
<!-- <script src="https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js"></script>
 
<script src="../js/jquery.md5.js"></script>

<script src="https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
 
<script type="text/javascript" src="https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=q7EDeRKHgad7k1HiC9HT3UUN9srG3S2x"></script>
<script type="text/javascript" charset="utf-8" src="https://map.qq.com/api/gljs?v=1.exp&key=R55BZ-G426D-SDR4G-HTX2V-MRN2Z-RABKY"></script>

<script src="https://cdn.jsdelivr.net/npm/echarts@4.3.0/dist/echarts.min.js"></script>


<script src="./ps_consts_f.js"></script>
<script src="./util_f.js"></script>
<script src="./sha1.js"></script>
<script src="./sim_api_zc_f.js"></script>
<script src="./common.js"></script> -->



<%@ include file="./import_file.jsp"%>



    
<body style="width:100%;height:100%;margin:0;padding:0;">
	<!-- 
	<p>2020-11-18 成功进入!!!<p>
	 -->
	<div id="login" v-if="autoLogin==false" style="width:100%;height:100%;">
		<!-- 
		<dv-decoration-9 style="width:150px;height:150px;">66%</dv-decoration-9>
		-->
		<div style="width:100%;height:100%;
			display:flex;flex-direction:column;justify-content:center;align-items:center;">
			<div style="width:400px;">
				<el-form :model="form">
					<el-form-item label="账号">
		   				<el-input v-model="form.account" prefix-icon="el-icon-user-solid" clearable></el-input>
		   				<el-check>记住账号</el-check>
		  			</el-form-item>
		  			<el-form-item label="密码">
		   				<el-input v-model="form.password" prefix-icon="el-icon-key" show-password></el-input>
					</el-form-item>
				</el-form>
				<el-button @click="clickLogin" type="primary" style="width:400px;">登录</el-button>
			</div>
		</div>
		<!-- 
		<span>
			忘记密码或注册请联系厂家
		<span>
		<el-button @click="clickDebugCheckToken" type="primary" style="width:180">读登录TOKEN测试</el-button>		
		<p>{{access_token}}</p>
		 -->
	</div>
</body>

<script type="text/javascript" src="index_login.js"></script>



</html>