<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>



<%@ include file="../import_file.jsp"%>


<style>
	.el-scrollbar__wrap{
		overflow-x: hidden;
	}
</style>

<body style="margin:0px;">
	<div id="excel_out">
		<div style="display:flex;flex-direction:row;height:100%;width:100%">
			<div style="margin-right:20px;padding: 10 0 10 0;
			border: 1px rgba(0,0,0,0.1) solid;border-radius: 10px;"
			>
				<el-scrollbar style="height:100%;" id="scr">
					<el-tree
						class="filter-tree"
						:data="companyTreeData"
						default-expand-all
						:show-checkbox="true"
						:expand-on-click-node="true"
						:filter-node-method="filterCompanyTreeFunc"
						@node-click="companyTreeNodeClick"
						@check="companyTreeNodeCheck"
						ref="companyTree"
						node-key="id"
						:render-content="handleRenderContent"
						@node-expand="companyTreeExpand"
						@node-collapse="companyTreeCollapse"
						>
					</el-tree>
				</el-scrollbar>
			</div>
			
			
   		</div> 
   	</div>

</body>

<script type="text/javascript" src="./excel_out.js"></script>