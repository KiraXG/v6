/**
 * 专门做保存与读取相关的工作
 */
 
 
 //=========================================用于获取主目录下的路径
//获取主机地址之后的目录
var pathName = window.document.location.pathname;
//获取带"/"的项目名
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);



function saveCookie(str,name) {
	let idStr = jQuery.cookie('ps_company_id');
	const cookieName = name + '_id_' + idStr;
	jQuery.cookie(cookieName,str,{expires:30,path:projectName});
}

function loadCookie(name) {
	let idStr = jQuery.cookie('ps_company_id');
	const cookieName = name + '_id_' + idStr;
	return jQuery.cookie(cookieName);
}

function removeCookie(name) {
	let idStr = jQuery.cookie('ps_company_id');
	const cookieName = name + '_id_' + idStr;
	const ret = jQuery.removeCookie(cookieName,{path:projectName});
	return ret;
}

/*
var parsenCookie = {
	EXPIRE_DAYS:7,
	PATH:'/',
		
	
	saveLoginSuccess:function(loginSuccess) {
		jQuery.cookie('ps_login_success',loginSuccess ? "1" : "0",{expires:30,path:'/'});
	},
	loadLoginSuccess:function(){
		const loginSuccess = jQuery.cookie('ps_login_success');
		return "1" == loginSuccess;
	},
	
	saveAccessToken:function(accessToken) {
		const param = {expires:this.EXPIRE_DAYS,path:this.PATH};
		jQuery.cookie('ps_access_token',accessToken,param);
	},
	loadAccessToken:function() {
		const at = jQuery.cookie('ps_access_token');
		return at;
	},
	removeAccessToken:function() {
		//const allc = jQuery.cookie();
		const ret = jQuery.removeCookie('ps_access_token',{path:'/'});
		return ret;
	},
	
	saveAccount:function(account) {
		jQuery.cookie('ps_account',account,{expires:30,path:'/'});
		const ac = jQuery.cookie('ps_account');
		try {
		const acObj = JSON.parse(ac);
		}catch(err){
			console.log(JSON.stringify(err));
		}
	},
	loadAccount:function() {
		jQuery.cookie('ps_account');
	},

	saveCompanyId:function(companyId) {
		jQuery.cookie('ps_company_id',companyId,{expires:30,path:'/',});
//		const id = jQuery.cookie('ps_company_id');
//		try {
//		const idObj = JSON.parse(id);
//		}catch (err) {
//			console.log(JSON.stringify(err));
//		}
	},
	loadCompanyId:function() {
		return jQuery.cookie('ps_company_id');
	},
	removeCompanyId:function() {
		const ret = jQuery.removeCookie('ps_company_id',{path:'/'});
		return ret;
	},


	saveCompanyName:function(name){
		jQuery.cookie('ps_company_name',name,{expires:30,path:'/',});
	},
	loadCompanyName:function(){
		return jQuery.cookie('ps_company_name');
	},
	removeCompanyName:function(){
		const ret = jQuery.removeCookie('ps_company_name',{path:'/'});
		return ret;
	},
	
	saveCompanyManageNode:function(manageNode) {
		jQuery.cookie('ps_company_manage_node',manageNode,{expires:30,path:'/',});
	},
	loadCompanyManageNode:function() {
		return jQuery.cookie('ps_company_manage_node');
	},

	saveCompanyManageCompany:function(manageCompany) {
		jQuery.cookie('ps_company_manage_company',manageCompany,{expires:30,path:'/',});
	},
	loadCompanyManageCompany:function(){
		return jQuery.cookie('ps_company_manage_company');
	},
	
	saveCompanyTel:function(tel) {
		saveCookie(tel,'ps_company_tel');
	},
	loadCompanyTel:function() {
		return loadCookie('ps_company_tel');
	},
	

	saveTabList:function(arr) {
		saveCookie(arr,'ps_tab_list');
	},
	loadTabList:function() {
		return loadCookie('ps_tab_list');	
	},
	
	saveTabSelected:function(sel) {
		saveCookie(sel,'ps_tab_selected');
	},
	loadTabSelected:function() {
		return loadCookie('ps_tab_selected');
	},
	
	
	saveMainMenuOpens:function(arr) {
		saveCookie(arr,'ps_main_menu');
	},
	loadMainMenuOpens:function() {
		return loadCookie('ps_main_menu');
	},
	
	saveRealListCompanyTreeCheck:function(arr) {
		saveCookie(arr,'ps_real_list_tree_check');
	},
	loadRealListCompanyTreeCheck:function() {
		return loadCookie('ps_real_list_tree_check');
	},
	
	saveRealListPageIndex:function(index) {
		saveCookie(index,'ps_real_list_page_index');
	},
	loadRealListPageIndex:function() {
		return loadCookie('ps_real_list_page_index');
	},
	
	saveMapViewJumpNodeId:function(nodeId) {
		saveCookie(nodeId,'ps_map_view_jump_node_id');
	},
	loadMapViewJumpNodeId:function() {
		return loadCookie('ps_map_view_jump_node_id');
	},
	removeMapViewJumpNodeId:function() {
		return removeCookie('ps_map_view_jump_node_id');
	},
	
	saveHistoryViewJumpNodeId:function(nodeId) {
		saveCookie(nodeId,'ps_history_view_jump_node_id');
	},
	loadHistoryViewJumpNodeId:function() {
		return loadCookie('ps_history_view_jump_node_id');
	},
	removeHistoryViewJumpNodeId:function() {
		return removeCookie('ps_history_view_jump_node_id');
	},
	
	
	
	
	

};
*/




var parsenCookie = {
	EXPIRE_DAYS:7,
	PATH:projectName,
		
	
	saveLoginSuccess:function(loginSuccess) {
		jQuery.cookie('ps_login_success',loginSuccess ? "1" : "0",{expires:30,path:projectName});
	},
	loadLoginSuccess:function(){
		const loginSuccess = jQuery.cookie('ps_login_success');
		return "1" == loginSuccess;
	},
	
	saveAccessToken:function(accessToken) {
		const param = {expires:this.EXPIRE_DAYS,path:this.PATH};
		jQuery.cookie('ps_access_token',accessToken,param);
	},
	loadAccessToken:function() {
		const at = jQuery.cookie('ps_access_token');
		return at;
	},
	removeAccessToken:function() {
		//const allc = jQuery.cookie();
		const ret = jQuery.removeCookie('ps_access_token',{path:projectName});
		return ret;
	},
	
	saveAccount:function(account) {
		jQuery.cookie('ps_account',account,{expires:30,path:projectName});
		const ac = jQuery.cookie('ps_account');
		try {
		const acObj = JSON.parse(ac);
		}catch(err){
			console.log(JSON.stringify(err));
		}
	},
	loadAccount:function() {
		jQuery.cookie('ps_account');
	},

	saveCompanyId:function(companyId) {
		jQuery.cookie('ps_company_id',companyId,{expires:30,path:projectName});
//		const id = jQuery.cookie('ps_company_id');
//		try {
//		const idObj = JSON.parse(id);
//		}catch (err) {
//			console.log(JSON.stringify(err));
//		}
	},
	loadCompanyId:function() {
		return jQuery.cookie('ps_company_id');
	},
	removeCompanyId:function() {
		const ret = jQuery.removeCookie('ps_company_id',{path:projectName});
		return ret;
	},


	saveCompanyName:function(name){
		jQuery.cookie('ps_company_name',name,{expires:30,path:projectName});
	},
	loadCompanyName:function(){
		return jQuery.cookie('ps_company_name');
	},
	removeCompanyName:function(){
		const ret = jQuery.removeCookie('ps_company_name',{path:projectName});
		return ret;
	},
	
	saveCompanyManageNode:function(manageNode) {
		jQuery.cookie('ps_company_manage_node',manageNode,{expires:30,path:projectName});
	},
	loadCompanyManageNode:function() {
		return jQuery.cookie('ps_company_manage_node');
	},

	saveCompanyManageCompany:function(manageCompany) {
		jQuery.cookie('ps_company_manage_company',manageCompany,{expires:30,path:projectName});
	},
	loadCompanyManageCompany:function(){
		return jQuery.cookie('ps_company_manage_company');
	},
	
	saveCompanyTel:function(tel) {
		saveCookie(tel,'ps_company_tel');
	},
	loadCompanyTel:function() {
		return loadCookie('ps_company_tel');
	},
	

	saveTabList:function(arr) {
		saveCookie(arr,'ps_tab_list');
	},
	loadTabList:function() {
		return loadCookie('ps_tab_list');	
	},
	
	saveTabSelected:function(sel) {
		saveCookie(sel,'ps_tab_selected');
	},
	loadTabSelected:function() {
		return loadCookie('ps_tab_selected');
	},
	
	
	saveMainMenuOpens:function(arr) {
		saveCookie(arr,'ps_main_menu');
	},
	loadMainMenuOpens:function() {
		return loadCookie('ps_main_menu');
	},
	
	saveRealListCompanyTreeCheck:function(arr) {
		saveCookie(arr,'ps_real_list_tree_check');
	},
	loadRealListCompanyTreeCheck:function() {
		return loadCookie('ps_real_list_tree_check');
	},
	
	saveRealListPageIndex:function(index) {
		saveCookie(index,'ps_real_list_page_index');
	},
	loadRealListPageIndex:function() {
		return loadCookie('ps_real_list_page_index');
	},
	
	saveMapViewJumpNodeId:function(nodeId) {
		saveCookie(nodeId,'ps_map_view_jump_node_id');
	},
	loadMapViewJumpNodeId:function() {
		return loadCookie('ps_map_view_jump_node_id');
	},
	removeMapViewJumpNodeId:function() {
		return removeCookie('ps_map_view_jump_node_id');
	},
	
	saveHistoryViewJumpNodeId:function(nodeId) {
		saveCookie(nodeId,'ps_history_view_jump_node_id');
	},
	loadHistoryViewJumpNodeId:function() {
		return loadCookie('ps_history_view_jump_node_id');
	},
	removeHistoryViewJumpNodeId:function() {
		return removeCookie('ps_history_view_jump_node_id');
	},
	
	
	
	
	

};