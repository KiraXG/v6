
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<%@ include file="../import_file.jsp"%>



<body style="margin:0px;padding:0px;">
	<div id="node_list">
		<div style="display:flex;flex-direction:row;width:100%;height:100%">
			<div style="display:flex;flex-direction:column;height:100%;" ref="asideWindow">
				<el-input
					placeholder="输入关键字进行过滤"
		  			v-model="filterCompanyText"
		  			clearable
		  			style="margin-bottom:10px;"
		  			>
				</el-input>
			
				<el-scrollbar class="tree_scroll" style="height:100%">
				
					<el-tree
						class="filter-tree"
						:data="companyTreeData"
						:props="defaultProps"
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
	
		 
					
			<div style="margin-left:10px;display:flex;flex-direction:column;" :style="mainWindowStyle" ref="mainWindow">
				<div style="display:flex;flex-direction:row;margin-bottom:10px;" ref="topBar">
					<el-input
						placeholder="按工位号,IEMI号进行查找"
		  				v-model="filterNodeText"
		  				clearable
		  				style="width:300px;margin-right:20px;">
					</el-input>
					<el-button type="primary" @click="btnFilterNode">查找</el-button>
					<el-tooltip class="item" content="注意先在左边点选工程,再点添加仪表" placement="top" >
						<el-button type="primary" @click="btnAddNode" 
							icon="el-icon-circle-plus-outline">
							{{textBtnAddNode}}
						</el-button>
					</el-tooltip>
					<el-button type="primary" @click="btnAddSim" 
							icon="el-icon-circle-plus-outline">
							{{textBtnAddSim}}
						</el-button>
				</div>
				
				
				<template>
						
						<el-table :data="nodeTableData" style="width:100%;" ref="projectList" border height="100%">
							<el-table-column prop="project_name" label="所属工程" width="180" fixed></el-table-column>
							<el-table-column prop="node_name" label="仪表名称" width="180"></el-table-column>
							<el-table-column prop="imei" label="IMEI号" width="180"></el-table-column>
			      			<el-table-column prop="group" label="工位号" width="150"></el-table-column>
			      			<el-table-column prop="node_data" label="显示" width="auto">
								<template slot-scope="scope">
									<div style="display: flex;flex-direction: row;">
										<div v-for = "(line,index) in scope.row.node_data.line_datas">
											<el-tag>{{unitCodeToDesc(line.line_param.last_unit)}}</el-tag>
											<el-button @click="line.line_param.show = line.line_param.show==0?1:0">{{line.line_param.show}}</el-button>
											<el-button style="margin-left: -10px;margin-right: 10px;" @click="showControl(line.node_id,line.node_line,line.line_param.show)">确认</el-button>
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="220">
								<template slot-scope="scope">
									<div style="display:flex;flex-direction:column;">
										<div>
					    					<el-button size="small" type="primary" icon="el-icon-edit"
					    						style="margin:0px;padding:10px;"
						    					@click="btnEditNode(scope.$index, scope.row)">修改信息</el-button>
								    					
											<template>
												<el-popconfirm
											  		confirm-button-text='确定删除'
											  		confirm-button-type='danger'
											  		cancel-button-text='再想想'
											  		cancel-button-type='primary'
											  		icon="el-icon-warning"
											  		icon-color="red"
											  		title="确定要删除仪表吗?"
											  		@confirm="btnDeleteNode(scope.$index, scope.row)"
													>
													<el-button size='small' type='danger' slot="reference"
														style="margin:0px;padding:10px;"
														icon='el-icon-delete' >删除仪表
													</el-button>
												</el-popconfirm>
											</template>
										</div>
										<div style="margin-top:10px">
										<!-- 
											<el-button size="small" type="warning" icon="el-icon-s-operation"
												style="margin:0px;padding:10px;" 
												@click="btnEditParam(scope.$index, scope.row)">修改参数
											</el-button>
											 -->
											<el-button size="small" type="danger" icon="el-icon-stopwatch"
												style="margin:0px;padding:10px;"
												@click="btnOffsetAndZero(scope.$index, scope.row)">对表调零
											</el-button>
											<el-button size="small" type="danger" icon="el-icon-edit"
												style="margin:0px;padding:10px" @click="ttt(scope.row)">
												替换更新
											</el-button>
											<el-dialog :visible.sync="dialogAlarmListVisible"
											:show-close="true"
											:close-on-press-escape="false"	
											:modal-append-to-body='false'>
												<el-input disabled="true" readonly :value="row_imei"></el-input>
												<el-input v-model="new_imei"></el-input>
												<div><el-button @click="replace_imei">确认</el-button></div>
											</el-dialog>
										</div>
										
										<!-- 
										<el-button size="small" type="danger" icon="el-icon-warning-outline"
											style="margin-top:10px"
											@click="btnEditRunAndAlarmParam(scope.$index, scope.row)">修改运行与报警参数
										</el-button>
										 -->
									</div>
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
				
				
								
				<el-dialog :title="titleAddNode" :visible.sync="dialogAddNodeVisible"
						:fullScreen="false"
						:show-close="false"
						:close-on-press-escape="false"
						:before-close="beforeCloseAddNodeDialog"
						>
					
					<el-form ref="nodeInfoForm" :model="nodeInfoData"
						label-width="100px" :rules="nodeInfoRules">
						
						<el-form-item label="仪表名称" prop="node_name">
							<el-input v-model="nodeInfoData.node_name"></el-input>
						</el-form-item>
						<el-form-item label="IMEI号" prop="imei">
							<el-input v-model="nodeInfoData.imei" placeholder="多台imei以英文逗号分隔"></el-input>
						</el-form-item>
						<el-form-item label="工位号" prop="group">
							<el-input v-model="nodeInfoData.group"></el-input>
						</el-form-item>						
						
						<el-form-item>
							<el-button type="primary" @click="btnSubmitAddNode">
								添加
							</el-button>
							<el-button @click="dialogAddNodeVisible = false">取消</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
				
				<el-dialog  :visible.sync="dialogAddSimVisible"
						:fullScreen="false"
						:show-close="false"
						:close-on-press-escape="false"
						>
					
					<el-form ref="nodeInfoForm" :model="simInfo"
						label-width="100px" >
						<el-form-item label="SIM" >
							<el-input v-model="simInfo.sim" placeholder="多台sim卡号以英文逗号分隔"></el-input>
						</el-form-item>
						<el-form-item label="IMEI" >
							<el-input v-model="simInfo.imei" placeholder="多台imei以英文逗号分隔"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="btnSubmitAddSIM">
								添加
							</el-button>
							<el-button @click="dialogAddSimVisible = false">取消</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
				
				<el-dialog :title="titleEditNode" :visible.sync="dialogEditNodeVisible"
						:fullScreen="true"
						:show-close="false"
						:close-on-press-escape="false"
						:before-close="beforeCloseEditNodeDialog"
						>
						
					
					<el-form ref="nodeInfoForm"
						label-width="150px" style="overflow:auto;">
						
						<el-form-item label="仪表名称" prop="node_name">
							<el-input v-model="lastEditingNode.node_name" style="width:300px;"></el-input>
						</el-form-item>
						
						
						<el-form-item label="IMEI号" prop="imei">
							<el-input v-model="lastEditingNode.imei" style="width:300px;"></el-input>
						</el-form-item>
						<el-form-item label="工位号" prop="group">
							<el-input v-model="lastEditingNode.group" style="width:300px;"></el-input>
						</el-form-item>
						
						<el-form-item label="采样周期">
							<el-input v-model="lastEditingNode.sample_gap" style="width:120px;">
								<template slot="append">秒</template>
							</el-input>												
						</el-form-item>
						<el-form-item label="上传周期">
							<el-input v-model="lastEditingNode.send_gap" style="width:120px;">
								<template slot="append">分</template>
							</el-input>						
						</el-form-item>
						<el-form-item label="报警手机">
							<el-input v-model="lastEditingNode.node_tel" style="width:300px;">
								<template slot="prepend">仅限中国</template>
							</el-input>
						</el-form-item>
					
					
					
					
					
					<div v-for="(info,index) in editingNodeInfos" :label="info.lineDesc">
						<el-divider></el-divider 我是一条分界线="">
						<div style="display:flex;flex-direction:column;" 把设置名称与报警分开两行来排="">
						
							<div>最新数据: {{info.displayValue}} {{info.unitName}}</div>
						
							<div style="margin-bottom:10px;" 第一行是设置名称="">
							
								<el-switch v-model="info.setDesc" 
			    							active-text="自定义"
			    							inactive-text="默认"
			    				></el-switch>
			    							
			    				<el-input v-model="info.lineDesc" style="width:250px;" :disabled="!info.setDesc">
									<template slot="prepend">通道名称</template>
								</el-input>
								
								<el-input v-model="info.pointPos" style="width:130px;">
									<template slot="prepend">小数位</template>
								</el-input>
								
								<el-select v-if="info.isPressureUnit" v-model="info.displayUnit"
									placeholder="kPa(默认)" style="width:130px;">
								    <el-option
								    	v-for="item in displayUnits"
								    	:key="item.value"
								    	:label="item.label"
								    	:value="item.value">
								    </el-option>
								</el-select>
							</div 第一行是设置名称="">	
							
							<div style="margin-bottom:10px;">
							
								<el-switch v-model="info.is_cus_unit" 
			    							active-text="自定义"
			    							inactive-text="默认"
			    				></el-switch>

			    				<el-input v-model="info.cus_unit" style="width:250px;" :disabled="!info.is_cus_unit">
									<template slot="prepend">自定义单位</template>
								</el-input>
								
							</div>	
							
							<div style="margin-bottom:10px;display:flex;flex-direction:row;">
								
								<el-tag type="warning" style="margin:5px"
									>一级报警</el-tag>
								<div style="display:flex;flex-direction:column;margin:5px" 报警值与恢复值分上下排列="">
									<el-input v-model="info.lo_alarm_1" style="width:200px;" :disabled="!info.l1_open">
										<template slot="prepend">&ensp;下限&ensp;</template>
									</el-input>
									<el-input v-model="info.lo_recover_1" style="width:200px;" :disabled="!info.l1_open">
										<template slot="prepend">下恢复</template>
									</el-input>
								</div>
								<el-switch v-model="info.l1_open"></el-switch>
								<div style="display:flex;flex-direction:column;margin:5px" 报警值与恢复值分上下排列="">
									<el-input v-model="info.hi_alarm_1" style="width:200px;" :disabled="!info.h1_open">
										<template slot="prepend">&ensp;上限&ensp;</template>
									</el-input>
									<el-input v-model="info.hi_recover_1" style="width:200px;" :disabled="!info.h1_open">
										<template slot="prepend">上恢复</template>
									</el-input>
								</div>
								<el-switch v-model="info.h1_open"></el-switch>
								
							</div>
							
							<div style="margin-bottom:10px;display:flex;flex-direction:row;">
							
								<el-tag type="danger" style="margin:5px"
									>二级报警</el-tag>	
								<div style="display:flex;flex-direction:column;margin:5px" 报警值与恢复值分上下排列="">								
									<el-input v-model="info.lo_alarm_2" style="width:200px;" :disabled="!info.l2_open">
										<template slot="prepend">下下限</template>
									</el-input>
									<el-input v-model="info.lo_recover_2" style="width:200px;" :disabled="!info.l2_open">
										<template slot="prepend">下恢复</template>
									</el-input>
								</div>
								<el-switch v-model="info.l2_open"></el-switch>
								<div style="display:flex;flex-direction:column;margin:5px" 报警值与恢复值分上下排列="">
									<el-input v-model="info.hi_alarm_2" style="width:200px;" :disabled="!info.h2_open">
										<template slot="prepend">上上限</template>
									</el-input>
									<el-input v-model="info.hi_recover_2" style="width:200px;" :disabled="!info.h2_open">
										<template slot="prepend">上恢复</template>
									</el-input>
									</div>
								<el-switch v-model="info.h2_open"></el-switch>
							</div>
						</div 把设置名称与报警分开两行来排="">
						
					</div>
					
					
					
					
					
					
					
					

						
						<el-form-item>
							<el-button type="primary" @click="btnLoadParams">读入最新配置</el-button>
							<el-button type="primary" @click="btnSubmitEditNode" style="margin-top:30px;"
								>保存修改</el-button>
							<el-button @click="dialogEditNodeVisible = false" style="margin-top:30px;"
								>取消</el-button>
						</el-form-item>
					</el-form>
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
				</el-dialog>
				
				<!--
				<el-dialog :title="titleEditMainInfo" :visible.sync="dialogEditMainInfoVisible"
					:fullScreen="false"
					:show-close="true"
					:close-on-press-escape="false"
					>
					<el-form ref="mainInfoForm" :model="nodeMainInfoData"
						label-width="80px" :rules="mainInfoRules">
						
						<div style="display:flex;flex-direction:row;border:5px solid red;">
							<el-checkbox v-model="nodeMainInfoData.checkSetNameD1">使用默认名称</el-checkbox>
							<el-input v-model="nodeMainInfoData.d1.textName" placeholder="数据名称" style="width:200px;"></el-input>
							<div style="display:flex;flex-direction:column">							 
								<div style="display:flex;flex-direction:row">								
									<el-checkbox v-model="nodeMainInfoData.d1.checkEnableHiAlarm">高报警开启</el-checkbox>									
									<div style="display:flex;flex-direction:column">
										<el-input v-model="nodeMainInfoData.d1.textHiAlarm" placeholder="高报警值"></el-input>
										<el-input v-model="nodeMainInfoData.d1.textHiRecov" placeholder="高恢复值"></el-input>
									</div>
								</div>
								
								<div style="display:flex;flex-direction:row">		
									<el-checkbox v-model="nodeMainInfoData.d1.checkEnableLoAlarm">低报警开启</el-checkbox>									
									<div style="display:flex;flex-direction:column">
										<el-input v-model="nodeMainInfoData.d1.textLoRecov" placeholder="低恢复值"></el-input>
										<el-input v-model="nodeMainInfoData.d1.textLoAlarm" placeholder="低报警值"></el-input>
									</div>
								</div>
							</div>
						</div>
						
						<div style="display:flex;flex-direction:row" border>
							<el-checkbox v-model="nodeMainInfoData.d2.checkSetName">自定义数据名称</el-checkbox>
						</div>
						
					</el-form>
				</el-dialog>
				 -->
				
				
				<el-dialog :title="titleNodeControl" :visible.sync="dialogNodeControlVisible"
					:fullScreen="true" :show-close="true" :close-on-press-escape="false">
					
					<div slot="title" style="display:flex;flex-direction:row;">
						<el-button @click="btnHideNodeControl">返回仪表列表</el-button>
						<span style="height:40px;self-align:center;margin-left:20px;font-size:25;font-family:cursive;"
							>远程控制，仪表名称：{{lastEditingNode.node_name}} ,工位号: {{lastEditingNode.group}} IMEI:{{lastEditingNode.imei}}</p>
					</div>
					
					<div style="display:flex;flex-direction:column;">
						<el-tag style="width:500px;margin:10px">请注意在发送命令后,再唤醒仪表,命令才会传给仪表执行</el-tag>
						<el-input v-model="nodeOffset" placeholder="请输入需要增加或减少的值,注意前面加负号" 
							style="width:500px;margin:10px"></el-input>					
	
						<template>
							<el-popconfirm
						  		confirm-button-text='确定调整(对表)'
						  		confirm-button-type='danger'
						  		cancel-button-text='再想想'
						  		cancel-button-type='primary'
						  		icon="el-icon-warning"
						  		icon-color="red"
						  		title="确定要调整仪表读数吗?"
						  		@confirm="btnSubmitOffsetNode()"
								>
								<el-button size='big' type='danger' slot="reference"
									style="margin:10px;"
									icon='el-icon-odometer' >调整仪表(对表)
								</el-button>
							</el-popconfirm>
						</template>
					</div>									

					<el-divider></el-divider>
					
					<div style="display:flex;flex-direction:column;">
						<el-tag style="width:500px;margin:10px">请注意在发送调零命令后,再唤醒仪表,命令才会传给仪表执行</el-tag>
					
						<template>
							<el-popconfirm
						  		confirm-button-text='确定调零'
						  		confirm-button-type='danger'
						  		cancel-button-text='再想想'
						  		cancel-button-type='primary'
						  		icon="el-icon-warning"
						  		icon-color="red"
						  		title="确定要调零吗?"
						  		@confirm="btnSubmitZeroNode()"
								>
								<el-button size='big' type='danger' slot="reference"
									style="margin:10px;"
									icon='el-icon-warning' >调零
								</el-button>
							</el-popconfirm>
						</template>	
					</div>

				</el-dialog>
				
				 
				<el-dialog :title="titleEditNodeParam" :visible.sync="dialogEditParamVisible"
					:fullScreen="true" :show-close="true" :close-on-press-escape="false">
					<el-form ref="nodeParamForm"
						label-width="80px">
						
						<div v-for="(param,index) in nodeParams">
							<el-divider></el-divider>
							<div style="display:flex;flex-direction:row;margin-top:10px;">
								<div style="display:flex;flex-direction:column;width:150px;">
									<div style="margin:5px;">{{param.line_param.line_desc}}</div>
									<div style="margin:5px;">{{param.line_param.dispValue}} {{param.line_param.unitName}}</div>
								</div>
									
								<div style="display:flex;flex-direction:column">
									<div style="display:flex;flex-direction:row">
			    						<el-switch v-model="param.line_param.set_desc" 
			    							:active-text="['自定义数据描述','使用默认'][param.line_param.set_desc?0:1]"
			    							style="width:300px"></el-switch>
			    					</div>
									<el-input v-model="param.line_param.line_desc" placeholder="举例:入口压力 / 液位差压" style="width:300px;margin-top:5px;"
										:disabled="!param.line_param.set_desc" prop="line_desc"></el-input>
								</div>
								
								<div style="display:flex;flex-direction:column;margin-left:10px;">
									<el-switch v-model="param.line_param.set_disp_max" 
										:active-text="['固定满量程值','满量程使用实时极值'][param.line_param.set_disp_max?0:1]" style="width:200px"></el-switch>
									<el-input v-model="param.line_param.disp_max" style="width:200px;margin-top:5px;"
										type="text" :change="param.line_param.disp_max=param.line_param.disp_max"
										:disabled="!param.line_param.set_disp_max"></el-input>
								</div>
								 
								<div style="display:flex;flex-direction:column;margin-left:10px;">
									<el-switch v-model="param.line_param.set_disp_min" 
										:active-text="['固定零量程值','零量程使用实时极值'][param.line_param.set_disp_min?0:1]" style="width:200px"></el-switch>
									<el-input v-model="param.line_param.disp_min" style="width:200px;margin-top:5px;"
										type="text" :change="param.line_param.disp_min=param.line_param.disp_min"
										:disabled="!param.line_param.set_disp_min"></el-input>
								</div>													
								 
								<div v-if="param.line_param.isPressureUnit" style="display:flex;flex-direction:column;margin-left:10px;">
									<span>显示单位</span>
									<el-select v-model="param.line_param.disp_unit" placeholder="kPa(默认)"
										style="margin-top:5px;">
									    <el-option
									    	v-for="item in displayUnits"
									    	:key="item.value"
									    	:label="item.label"
									    	:value="item.value">
									    </el-option>
									</el-select>
								</div>						 
							</div><!-- 第一行结束  -->
							<div>
							</div><!-- 第二行,设置报警值结束  -->												
						</div>
						
						<el-form-item>
							<el-button type="primary" @click="btnSubmitEditParam" style="margin-top:30px;"
								>保存修改</el-button>
							<el-button @click="dialogEditParamVisible = false" style="margin-top:30px;"
								>取消</el-button>
						</el-form-item> 
					</el-form>
					
					
					
					
					
	
					
					
					
					
					
					
					
					
					
					
				</el-dialog>
			
			</div>
		
		
		</div>
	</div>
</body>



<style lang="css">
	
	.tree_scroll .el-scrollbar__wrap{
		overflow-x: hidden;
	}

</style>


<script type="text/javascript" src="node_list.js"></script>




