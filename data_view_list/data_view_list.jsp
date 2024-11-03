<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%> <%@ include file="../import_file.jsp"%>

<style>
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>

<body style="margin: 0px">
    <div id="data_view_list">
        <div style="display: flex; flex-direction: row; height: 100%; width: 100%">
            <div style="margin-right: 20px; padding: 10 0 10 0; border: 1px rgba(0, 0, 0, 0.1) solid; border-radius: 10px">
                <el-scrollbar style="height: 100%" id="scr">
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
                    ></el-tree>
                </el-scrollbar>
            </div>
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
                <div id="chartsContainer" style="width: 100%; height: 50%; display: flex; flex-direction: row">
                    <div v-for="(item,index) in chartsName" style="padding: 0 5 5 5; width: 20%; height: 100%" id="chartContainer">
                        <div
                            :id="item"
                            style="margin: 0 auto; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; width: 100%; height: 100%"
                        ></div>
                    </div>
                </div>
                <div id="map_container" style="width: 100%; height: 50%"></div>
            </div>
        </div>
    </div>
</body>

<script type="text/javascript">
    window._AMapSecurityConfig = {
        securityJsCode: "535f73f17b632653974ce7e5af37947e",
    };
</script>
<script src="https://webapi.amap.com/loader.js"></script>
<script type="text/javascript" src="data_view_list.js"></script>
