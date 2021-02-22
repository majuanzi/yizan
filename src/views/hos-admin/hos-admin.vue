<style lang="less">
	@import "./style/hos-admin.less";
</style>
<template>
	<div @on-search="searchHospitalList">
		<Card :bordered="false">
			<div class="title-bar">
				<div class="input-box">
					<p>所在地区：</p>
					<el-select v-model="allCity" placeholder="全部城市" style="width:200px;" :disabled="showDisabled"
						filterable @change="changeAddress">
						<el-option v-for="item in cityList" :key="item.regionID" :value="item.regionID"
							:label="item.regionname"></el-option>
					</el-select>
				</div>
				<div class="input-box">
					<p>医院等级：</p>
					<el-select v-model="hosLevel" filterable :disabled="showDisabled" placeholder="请选择医院等级"
						@change="changeEvel">
						<el-option v-for="item in hospitalEvel" :key="item.levelcode" :value="item.levelcode"
							:label="item.levelname">
						</el-option>
					</el-select>
				</div>
				<!-- 查询 -->
				<div class="btn-box">
					<ButtonGroup size="large">
						<Button type="primary" @click="searchHospitalList">查 询</Button>
					</ButtonGroup>
				</div>
				<div class=" both" style="clear:both"></div>
			</div>

			<vh-search-body :total="pageTotal">
				<template v-slot:header>
					<ButtonGroup size="large">
						<Button type="primary" @click="addHospital">新 增</Button>
					</ButtonGroup>
				</template>
				<template v-slot:table>
					<Table :columns="columnsHos" :data="dataHos" :border="true"></Table>
					<div class="hos-card-page vh-mg-top-12 clearfix">
						<Page :total="totalNum" :current="pagenum1" @on-page-size-change="handleSizeChange" show-total
							:page-size="10" @on-change="changePage"></Page>
					</div>
				</template>
			</vh-search-body>

			<!-- 新增医院 -->
			<Modal v-model="modalAdd" title="新增医院" @on-ok="saveAddEdit('editAdd')" @on-cancel="cancelAddEdit('editAdd')"
				:mask-closable="false" :loading="modalLoading" class="addHospitalModal">
				<Form class="line36" ref="editAdd" :model="editAdd" :rules="ruleInlineAdd" :label-width="100">
					<FormItem label="医院名称：" prop="hospitalname" title="限制20字以内"
						style="display:inline-block;width:372px;margin-right:104px">
						<Input size="large" :maxlength="20" type="text" class="dept-details-list"
							v-model="editAdd.hospitalname" placeholder="请输入医院名称"></Input>
					</FormItem>
					<FormItem label="医院简称：" prop="shortname" title="限制20字以内" style="display:inline-block;width:372px;">
						<Input size="large" :maxlength="10" type="text" class="dept-details-list"
							v-model="editAdd.shortname" placeholder="请输入医院简称"></Input>
					</FormItem>
					<FormItem label="所在城市：" prop="regionname"
						style="display:inline-block;width:372px;margin-right:104px">
						<el-select class="popSelect" v-model="editAdd.regionname" filterable placeholder="请选择城市"
							@change="changeAddressAdd">
							<el-option v-for="item in cityListAdd" :key="item.regionID" :value="item.regionID"
								:label="item.regionname">{{ item.regionname }}</el-option>
						</el-select>
					</FormItem>
					<FormItem label="医院等级：" prop="level" style="display:inline-block;width:372px;">
						<el-select class="popSelect" v-model="editAdd.level" placeholder="请选择"
							@change="changeModelEvel">
							<el-option v-for="item in modelEvel" :value="item.levelcode" :key="item.levelcode"
								:label="item.levelname">
								{{ item.levelname }}</el-option>
						</el-select>
					</FormItem>
					<FormItem label="医院地址：" prop="address" title="限制50字以内">
						<Input size="large" :maxlength="50" type="text" class="dept-details-list"
							v-model="editAdd.address" placeholder="请输入医院地址"></Input>
					</FormItem>
					<FormItem label="医院简介：" prop="hosdesc" title="限制300字以内">
						<Input size="large" style="width:100%" :maxlength="300" type="textarea"
							class="dept-details-list" v-model="editAdd.hosdesc" placeholder="请输入医院简介"></Input>
					</FormItem>
					<FormItem v-show="submitHide">
						<Button type="primary" @click="cancelAddEdit('editAdd')">Submit</Button>
						<Button type="primary" @click="saveAddEdit('editAdd')">Submit</Button>
					</FormItem>
				</Form>
			</Modal>

			<modal v-model="modalSetting" title="管理员设置" fullscreen class="addSettingModal">
				<Card class="dept-details" dis-hover :bordered="false">
					<ButtonGroup size="large" class="editArea">
						<Button class="addBtn" type="primary" @click="addAdminClick">新增管理员</Button>
					</ButtonGroup>
					<!-- 展示列表 -->
					<div class="hos-card-tab">
						<Table :columns="columnsAdmin" border :data="dataAdmin" :stripe=true :border=true
							:show-header=true :loading=false :highlight-row=true></Table>
						<div class="hos-card-page vh-mg-top-12 clearfix">
							<Page style="float:right" :total="totalNum1" show-total :current="1" :page-size="10"
								@on-change="changePage1"></Page>
						</div>
					</div>
					<!-- 查看 -->
					<Modal v-model="addmodal" :title="modalTitle" @on-ok="saveAdd('addAdmin1')"
						@on-cancel="cancelAdd1('addAdmin1')" :mask-closable="false" :loading="modalLoading1">
						<Form class="line36" ref="addAdmin1" :model="addAdmin1" :rules="ruleInlineAdd1"
							:label-width="100">
							<Tooltip content="大于两位字符且不包含特殊字符(如：*、/等)" placement="right-start">
								<FormItem label="登录名：" prop="username" style="width:372px;">
									<Input size="large" :maxlength="50" type="text" class="dept-details-list"
										v-model="addAdmin1.username" placeholder="请输入管理员登录名" clearable />
								</FormItem>
							</Tooltip>
							<Tooltip content="姓名不能少于两位字符" placement="right-start">
								<FormItem label="姓名：" prop="name" style="width:372px;">
									<Input size="large" :maxlength="50" type="text" class="dept-details-list"
										v-model="addAdmin1.name" placeholder="请输入管理员姓名" clearable />
								</FormItem>
							</Tooltip>
							<Tooltip content="6-20位且不能包含空格" placement="right-start">
								<FormItem label="密码：" prop="password" style="width:372px;">
									<Input size="large" :maxlength="20" type="password" class="dept-details-list"
										v-model="addAdmin1.password" placeholder="请输入密码" clearable />
								</FormItem>
							</Tooltip>
							<Tooltip content="与上述密码一致" placement="right-start">
								<FormItem label="确认密码：" prop="passwordTwo" style="width:372px;">
									<Input size="large" :maxlength="20" type="password" class="dept-details-list"
										v-model="addAdmin1.passwordTwo" placeholder="请再次输入密码" clearable />
								</FormItem>
							</Tooltip>
							<FormItem v-show="false">
								<Button @click="cancelAdd1('addAdmin1')">取消</Button>
								<Button type="success" @click="saveAdd('addAdmin1')">确定</Button>
							</FormItem>
						</Form>
					</Modal>
					<Modal v-model="fixedmodal" :title="modalTitle" @on-ok="saveFixed('fixedAdmin')"
						@on-cancel="cancelAdd1('fixedAdmin')" :mask-closable="false" :loading="modalLoading1"
						class="changePasswordModal">
						<Form class="line36" ref="fixedAdmin" :model="fixedAdmin" :rules="ruleInlineAdd1"
							:label-width="100">
							<Tooltip content="原始密码" placement="right-start">
								<FormItem label="原密码：" prop="oldPW" style="width:372px;margin-right:104px">
									<Input size="large" :maxlength="20" type="password" class="dept-details-list"
										v-model="fixedAdmin.oldPW" placeholder="请输入原密码" clearable />
								</FormItem>
							</Tooltip>
							<Tooltip content="6-20位且不能包含空格" placement="right-start">
								<FormItem label="新密码：" prop="password" style="width:372px;">
									<Input size="large" :maxlength="20" type="password" class="dept-details-list"
										v-model="fixedAdmin.password" placeholder="请输入密码" clearable />
								</FormItem>
							</Tooltip>
							<Tooltip content="与上述密码一致" placement="right-start">
								<FormItem label="确认密码：" prop="passwordTwo" style="width:372px;">
									<Input size="large" :maxlength="20" type="password" class="dept-details-list"
										v-model="fixedAdmin.passwordTwo" placeholder="请再次输入密码" clearable />
								</FormItem>
							</Tooltip>
							<FormItem v-show="false">
								<Button @click="cancelAdd1('fixedAdmin')">取消</Button>
								<Button type="success" @click="saveFixed('fixedAdmin')">确定</Button>
							</FormItem>
						</Form>
					</Modal>
				</Card>
			</modal>
		</Card>
	</div>

</template>

<script>
	import vhFormGroup from '../components/vh-form-group';
	import vhSearchHeader from '../components/vh-search-header';
	import vhSearchBody from '../components/vh-search-body';

	export default {
		name: "hosAdmin",
		components: {
			vhFormGroup,
			vhSearchHeader,
			vhSearchBody
		},
		computed: {
			// 获得医院id
			hospitalid() {
				return this.$store.state.hospital.hospitalid
			}
		},
		data: function () {
			// 密码验证
			const passwordVerification = (rule, value, callback) => {
				if (this.fixedAdmin.password != this.fixedAdmin.passwordTwo) {
					callback(new Error('两次密码输入不一致，请重新输入'))
				} else {
					callback();
				}
			};
			// 登录名验证
			const userNameVerifivation = (rule, value, callback) => {
				if (value.length < 2) {
					callback(new Error('大于两位字符且不包含特殊字符(如：*、/等)'))
					return false;
				}
				const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
					regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
				if (regEn.test(value) || regCn.test(value)) {
					callback(new Error('名称不能包含特殊字符'))
					return false;
				}
				callback();
			};
			// 姓名验证
			const nameVerifivation = (rule, value, callback) => {
				if (value.length < 2) {
					callback(new Error('姓名不能少于两位字符'))
					return false;
				}
				const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
					regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
				if (regEn.test(value) || regCn.test(value)) {
					callback(new Error('姓名不能包含特殊字符'))
					return false;
				}
				callback();
			};
			// 密码验证
			const passwordVerifivation = (rule, value, callback) => {
				var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
				if (reg.test(value)) {
					callback(new Error('密码不允许包含中文'));
					return false;
				}
				this.addAdmin1.password = value.replace(/\s+/g, "");
				if (value.length < 6 || value.length > 20) {
					callback(new Error('密码长度有误'));
					return false;
				}
				callback();
			}
			return {
				modalLoading1: true,
				modalTitle: '',//管理员弹窗文字信息说明
				addmodal: false,//弹窗显隐
				fixedmodal: false,
				pageTotal: 0,
				pageCurrent: 1,
				pageSize: 10,
				modalLoading: true,
				submitHide: false,
				pagenum1: 1,//管理员设置默认第一页
				totalpage1: 10,//管理员设置总页数
				totalNum1: 0, //管理员设置总条数
				pagecount1: 10,//管理员设置每页请求的数据
				modelEvel: [], //新增医院等级
				allCity: "全部城市",
				allCities: {
					regionID: "0",
					regionname: "全部城市"
				},
				showDisabled: false, //是否可筛选
				//管理员设置内部弹窗信息
				addAdmin1: {
					'username': '',
					'name': '',
					'password': '',
					'passwordTwo': '',
				},
				fixedAdmin: {
					'oldPW': '',
					'password': '',
					'passwordTwo': '',
				},
				// 新增医生提交表单
				hospitalAdminInfo: {//提交表单信息
					'username': '',
					'name': '',
					'password': '',
					'hospitalid': '',
				},
				// 修改医生提交表单
				hospitalFixedInfo: {
					// 'oldPW' : '',
					// 'newPW' : '',
					'adminId': '',
				},
				//管理员信息
				dataAdmin: [],
				//管理员列表title
				columnsAdmin: [
					{
						title: '序号',
						// type: 'index',
						width: 65,
						align: 'center',
						render: (h, params) => {
							return h('span', params.index + (this.pagenum - 1) * this.pagecount + 1);
						}
					},
					{
						title: '管理员账号',
						key: 'username'
					},
					{
						title: '管理员姓名',
						key: 'name'
					},
					{
						title: '创建时间',
						key: 'createtime',
						align: 'center'
					},
					{
						title: '操作',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Span', {
									style: {
										display: "inline-block",
										margin: "0 8px",
										color: "#1890ff",
										cursor: "pointer"
									},
									on: {
										click: () => {
											this.fixedPassword(params.row);//编辑
										}
									}
								}, '修改密码'),
								h('Span', {
									style: {
										position: "relative",
										top: "3px",
										display: "inline-block",
										width: "1px",
										height: "14px",
										background: "#e9e9e9"
									}
								}),
								h('Span', {
									style: {
										display: "inline-block",
										margin: "0 8px",
										color: "#1890ff",
										cursor: "pointer"
									},
									on: {
										click: () => {
											this.delHospitalAdmin(params.row);//删除
										}
									}
								}, '删除')
							])
						}
					}
				],
				//表单验证
				ruleInlineAdd1: {
					username: [
						{ required: true, message: '登录名不能为空', trigger: 'blur' },
						{ validator: userNameVerifivation, trigger: 'blur' }
					],
					name: [{ required: true, message: '姓名不能为空', trigger: 'blur' },
					{ validator: nameVerifivation, trigger: 'blur' }],//姓名
					oldPW: [{ required: true, message: '密码不能为空', trigger: 'blur' }],//原密码
					password: [{ required: true, message: '密码不能为空', trigger: 'blur' },
					{ validator: passwordVerifivation, trigger: 'blur' }],//新密码
					passwordTwo: [//确认密码
						{ required: true, message: '请输入确认密码', trigger: 'blur' },
						{ validator: passwordVerification, trigger: 'blur' }
					]
				},
				columnsHos: [
					{
						title: '序号',
						// type: 'index',
						width: 65,
						align: 'center',
						render: (h, params) => {
							return h('span', params.index + (this.pagenum - 1) * this.pagecount + 1);
						}
					},
					{
						title: "医院名称",
						key: "hospitalname"
					},
					{
						title: "医院简称",
						key: "shortname",
						width: 150,

					},
					{
						title: "医院等级",
						key: "levelName",
						width: 120,
					},
					{
						title: "医院地址",
						key: "address"
					},
					{
						title: "医院简介",
						key: "hosdesc",
						width: 180,
					},
					{
						title: "操作",
						align: "center",
						key: "operation",
						width: 220,
						render: (h, params) => {
							return h("div", [
								h(
									"Span",
									{
										style: {
											color: "#1890ff",
											cursor: "pointer"
										},
										on: {
											click: () => {
												this.$store.dispatch(
													"getHosPitalId",
													params.row.hospitalid
												);
												this.$router.push({
													name: "hos-mation",
													query: {
														hospitalid: params.row.hospitalid,//医院id
														// hospitalname: params.row.hospitalName, //医院名称
														// address: params.row.hospitalAddress, //医院地址
														// shortname: params.row.hospitalAbbreviation, //医院简称
														// hospitaldesc: params.row.hospitalMation,//医院简介
														// levelName: params.row.levelName,
													}
												});
											}
										}
									},
									"查看"
								),
								h(
									"Span",
									{
										style: {
											position: "relative",
											top: "3px",
											display: "inline-block",
											width: "1px",
											height: "14px",
											margin: "0 8px",
											background: "#e9e9e9"
										},
									},
								),
								h(
									"Span",
									{
										style: {
											marginLeft: "5px",
											color: "#1890ff",
											cursor: "pointer"
										},
										on: {
											click: () => {
												this.$store.dispatch(
													"getHosPitalId",
													params.row.hospitalid
												);
												this.modalSetting = true;// 打开管理员设置弹窗
												this.getHospitalAdminList(); // 默认获取医院管理员列表
											}
										}
									},
									"管理员设置"
								),
								h(
									"Span",
									{
										style: {
											position: "relative",
											top: "3px",
											display: "inline-block",
											width: "1px",
											height: "14px",
											margin: "0 8px",
											background: "#e9e9e9"
										},
									},
								),
								h(
									"Span",
									{
										style: {
											color: "#1890ff",
											cursor: "pointer"
										},
										on: {
											click: () => {
												this.isNoOverOrder(params.row);
											}
										}
									},
									"删除"
								)
							]);
						}
					}
				],
				dataHos: [], //医院列表
				// 新增签约医院
				editAdd: {
					hospitalname: "", //医院名称
					shortname: "", //医院简称
					address: "", //医院地址
					hosdesc: "", //医院简介
					level: "", //医院等级
					createtime: "", //创建时间
					regionid: "", //区域id
					modifytime: null,
					regionname: "",
				},
				modalAdd: false, //是否显示新增信息
				modalSetting: false, // 是否显示设置弹窗信息
				modalVisible: "",
				ruleInlineAdd: {
					hospitalname: [
						{ required: true, message: "医院名称不能为空", trigger: "blur" }
					],
					shortname: [
						{ required: true, message: "医院简称不能为空", trigger: "blur" }
					],
					level: [
						{ required: true, message: "等级不能为空", trigger: "change" }
					],
					regionname: [{ required: true, message: "城市不能为空", trigger: "change" }],
					address: [
						{ required: true, message: "医院地址不能为空", trigger: "blur" }
					],
					hosdesc: [
						{ required: true, message: "医院简介不能为空", trigger: "blur" }
					]
				},
				cityList: [], //城市地址列表
				cityListAdd: [], //城市地址列表
				hospitalEvel: [],
				hospitalEvelAll: {
					levelname: "全部等级",
					levelcode: "0"
				},
				cityModel: "",
				hosLevel: "全部等级",
				regionid: "", //区域ID
				levelName: "", //医院等级
				pagenum: 1, //分页显示的页码
				pagecount: 10, //每页请求的数据条数
				totalpage: 10,
				totalNum: 0, //医院管理首页总条数
			};
		},
		mounted: function () {
			this.getAllRegionList(); // 获取城市地址
			this.getAllRegionListAdd(); // 获取城市地址
			this.getHospitalList(); //获取医院列表
			this.getHospitalLevelList(); //获取等级
			this.getHospitalLevelListAdd();
		},
		methods: {
			// 获取城市地址
			getAllRegionList: function () {
				const httpUrl = "getAllRegionList";
				let httpParams = {};
				this.$post(httpUrl, httpParams).then(response => {
					this.cityList = response.regionList; //筛选城市列表
					this.cityListAdd = response.regionList;
					this.cityList.unshift(this.allCities);// 默认展示全部城市
					//新增城市列表
				});
			},
			getAllRegionListAdd: function () {
				const httpUrl = "getAllRegionList";
				let httpParams = {};
				this.$post(httpUrl, httpParams).then(response => {
					if (response.resultcode == 1) {
						this.cityListAdd = response.regionList;
					}
				});
			},
			// 获取等级
			getHospitalLevelList() {
				const httpUrl = "getHospitalLevelList";
				let httpParams = {};
				this.$post(httpUrl, httpParams).then(response => {
					if (response.resultcode == 1) {
						// levelcode
						// levelname
						this.hospitalEvel = response.levelList;
						this.hospitalEvel.unshift(this.hospitalEvelAll);
					}
				});
			},
			// 获取等级
			getHospitalLevelListAdd() {
				const httpUrl = "getHospitalLevelList";
				let httpParams = {};
				this.$post(httpUrl, httpParams).then(response => {
					if (response.resultcode == 1) {
						this.modelEvel = response.levelList;
					}
				});
			},
			// 选择城市
			changeAddress: function (value) {
				this.regionid = value;
				this.pagenum = 1;
				//this.getHospitalList(); //获取医院列表
			},
			// 选择医院等级
			changeEvel: function (value) {
				this.levelName = value;
				this.pagenum = 1;
				//this.getHospitalList(); //获取医院列表
			},
			// 获取医院列表
			getHospitalList: function () {
				this.showDisabled = true;
				const httpUrl = "getHospitalList";
				let httpParams = {
					regionId: this.regionid, //区域ID
					level: this.levelName, //医院类型 0:一级 1:二级 3：三级...未列出全部
					pagenum: this.pagenum, //分页显示的页码
					pagecount: this.pagecount //每页请求的数据条数
				};
				this.$post(httpUrl, httpParams).then(response => {
					this.dataHos = response.hospitalList;

					// 显示医院等级，后台返回的是等级编号，要用编号取等级
					// if(this.dataHos.length > 0){
					//   for(let i=0;i<this.dataHos.length;i++){
					//     for(let j=0;j<this.hospitalEvel.length;j++){
					//       if(this.dataHos[i].level == this.hospitalEvel[j].levelcode){
					//         this.dataHos[i].level = this.hospitalEvel[j].levelname;
					//       }
					//     }
					//   }
					//   // let thisLevel = this.dataHos.level;
					//   //   console.log(this.hospitalEvel)
					//   // this.dataHos.level = this.hospitalEvel.map(levelcode)
					// }
					// this.totalpage = response.totalpage * 10;
					this.totalNum = response.totalNum;
					this.showDisabled = false;
				});
			},
			// 选中当前行
			select: function (e) {
				//   console.log(e);
			},
			// 选择分页
			changePage: function (index) {
				this.pagenum = index;
				//这两个地方改了
				this.getHospitalList();
			},
			searchHospitalList() {
				//这两个地方改了
				this.pagenum = 1;
				this.getHospitalList();

			},
			// 每页显示条数改变
			handleSizeChange(size) {
				this.pagecount = size;

				this.pagenum = 1;
				this.getHospitalList();
			},

			// 删除医生
			deleteHospital: function (hosParams) {
				this.$Modal.confirm({
					title: "提示",
					content: "确定要删除“" + hosParams.hospitalname + "”吗？",
					onOk: () => {
						const httpUrl = "delHospital";
						let httpParams = {
							// regionid : hosParams.regionid,//区域id
							hospitalId: hosParams.hospitalid //医院id
						};
						this.$post(httpUrl, httpParams).then(response => {
							if (response != 404) {
								this.$Message.success("删除成功");
								this.dataHos.splice(hosParams._index, 1);
								this.getHospitalList();
							}
						});
					},
					onCancel: () => {
						this.$Message.info("操作取消");
					}
				});
			},
			// 判断医生是否有未完成的订单
			isNoOverOrder(hosParams) {
				const httpUrl = "isNoOverOrder";
				let httpParams = {
					hospitalId: hosParams.hospitalid
					// deptId: this.deptDoc.deptid
					// 'doctorId' : '',
				};
				this.$post(httpUrl, httpParams).then(response => {
					if (response != 404) {
						if (response.status == 1) {
							this.$Message.error({
								content: "该医生有未完成的订单不允许删除",
								duration: 3
							});
							return false;
						} else {
							// 成功调用删除方法
							this.deleteHospital(hosParams);
						}
					}
				});
			},
			// 取消保存
			canCelEdit: function () { },
			addAdminHospital() {
				this.modaladd = true;
			},
			// 新增医院选择等级
			changeModelEvel(value) {
				this.editAdd.level = value;
			},
			// 点击新增医院
			addHospital: function () {
				this.modalAdd = true;
			},
			// 新增医院选择城市
			changeAddressAdd(value) {
				this.editAdd.regionid = value;
			},
			// 取消保存
			cancelAddEdit(name) {
				this.$refs[name].resetFields();
			},
			// 保存新增医院
			saveAddEdit: function (name) {
				setTimeout(() => {
					this.modalLoading = false;
					this.$nextTick(() => {
						this.modalLoading = true;
					});
				}, 0);
				// console.log('this.modalAdd===',this.modalAdd)
				this.$refs[name].validate(valid => {
					if (valid) {
						let dates = new Date();
						this.editAdd.createtime = //"2018-6-22 15:58:10";
							dates.toLocaleDateString() + " " + dates.toLocaleTimeString();
						const httpUrl = "addHospital";
						let httpParams = {
							hospitalInfo: this.editAdd
						};
						this.$post(httpUrl, httpParams).then(response => {
							if (response != 404) {
								this.modalAdd = false;
								this.$Message.success("新增成功");
								this.$refs[name].resetFields();
								this.getHospitalList();
							}
						});
					} else {
						this.$Message.error("表单填写不完整!");
						return false;
					}
				});
			},

			// 当前页数改变
			handleChange(n) {
				this.pageCurrent = n;
				this.getHospitalList();
			},

			// 每页显示条数改变
			handleSizeChange(size) {
				this.pageSize = size;
				this.getHospitalList();
			},
			// 以下为管理员设置弹窗
			// 新增管理员
			addAdminClick: function () {
				// this.phoneShow = true;
				this.modalTitle = '新增管理员';
				this.addmodal = true;
			},
			// 保存新增管理员
			saveAdd: function (name) {
				this.pagenum1 = 1;
				setTimeout(() => {
					this.modalLoading1 = false;
					this.$nextTick(() => {
						this.modalLoading1 = true;
					});
				}, 0);
				this.$refs[name].validate((valid) => {
					if (valid) {
						this.hospitalAdminInfo.username = this.addAdmin1.username;
						this.hospitalAdminInfo.name = this.addAdmin1.name;
						this.hospitalAdminInfo.password = this.$crypto(this.addAdmin1.password);
						this.hospitalAdminInfo.hospitalid = this.hospitalid;
						const httpUrl = 'addHospitalAdminV2Safe';
						let httpParams = {
							'hospitalAdminInfo': JSON.stringify(this.hospitalAdminInfo)
						};
						this.$postSafe(httpUrl, httpParams).then(response => {
							if (response != 404) {
								// 新增成功
								this.addmodal = false;
								this.$Message.success('新增成功');
								this.getHospitalAdminList();//重新获取数据
								this.cancelAdd1(name);//清空表单
							} else {
								// 新增失败
								return false;
							}
						})
					} else {
						this.$Message.error('表单填写不完整');
					}
				})
			},
			// 修改保存
			saveFixed(name) {
				setTimeout(() => {
					this.modalLoading1 = false;
					this.$nextTick(() => {
						this.modalLoading1 = true;
					});
				}, 0);
				this.$refs[name].validate((valid) => {
					if (valid) {
						const httpUrl = 'updateHospitalAdminPWSafe';
						let httpParams = {
							//待修改的医院管理员json
							'oldPW': this.$crypto(this.fixedAdmin.oldPW),
							'newPW': this.$crypto(this.fixedAdmin.password),
							'adminId': this.hospitalFixedInfo.adminId
						};
						this.$postSafe(httpUrl, httpParams).then(response => {
							if (response != 404) {
								this.fixedmodal = false;
								this.$Message.success('修改成功');
								this.cancelAdd1();//清空表单
							}
						})
					} else {
						this.$Message.error('表单填写不完整，请重新填写');
					}
				})
			},
			// 取消新增
			cancelAdd1: function (name) {
				// 清空新增医生表单
				this.addAdmin1.username = '';
				this.addAdmin1.name = '';
				this.addAdmin1.password = '';
				this.addAdmin1.passwordTwo = '';
				// 清空修改医生表单
				this.fixedAdmin.oldPW = '';
				this.fixedAdmin.password = '';
				this.fixedAdmin.passwordTwo = '';
				if (name != undefined) {
					this.$refs[name].resetFields();
				}
			},
			// 根据医院id获取医院管理员列表
			getHospitalAdminList() {
				// alert('获取id=',this.hospitalid);
				const httpUrl = 'getHospitalAdminList';
				let httpParams = {
					'hospitalId': this.hospitalid,
					'pagenum': this.pagenum1,
					'pagecount': this.pagecount1
				};
				this.$post(httpUrl, httpParams).then(response => {
					if (response != 404) {
						this.dataAdmin = response.hospitalAdminList;
						// this.totalpage1 = (response.totalpage) * 10;
						this.totalNum1 = response.totalNum;
					}
				})
			},
			// 修改管理员密码
			fixedPassword(value) {
				this.modalTitle = '修改密码';
				// this.phoneShow = false;
				this.fixedmodal = true;
				this.fixedAdmin.username = value.username;
				this.fixedAdmin.name = value.name;

				this.hospitalFixedInfo.adminId = value.adminid;//管理员id
			},
			// 提交修改密码
			updateHospitalAdmin(name) {

			},
			// 删除医院管理员
			delHospitalAdmin(value) {
				const httpUrl = 'delHospitalAdmin';
				let httpParams = {
					'hospitalAdminId': value.adminid//管理员id
				};
				this.$Modal.confirm({
					title: '提示',
					content: '确定要删除' + value.name + '吗？',
					onOk: () => {
						this.$post(httpUrl, httpParams).then(response => {
							if (response != 404) {
								this.dataAdmin.splice(value._index, 1);//成功删除，不刷请求接口
								this.$Message.success('删除成功');
								this.getHospitalAdminList();//重新获取数据
							}
						})
					},
					onCancel: () => {
						// this.$Message.info('Clicked cancel');
					}
				});
			},
			changePage1: function (e) {
				this.pagenum1 = e;
				// 根据医院id获取医院管理员列表
				this.getHospitalAdminList();//获取照护统计列表
			}

		}
	};
</script>