<style type="text/css">
    .addAdminModal .ivu-modal,.changePasswordModal .ivu-modal{width:900px !important;top:118px}
    .addAdminModal .ivu-modal-content .ivu-modal-body,.changePasswordModal .ivu-modal-content .ivu-modal-body{padding:21px 24px}
    .addAdminModal .ivu-modal-footer,.changePasswordModal .ivu-modal-footer{border-top:0;}
    .addAdminModal .ivu-modal-footer{padding:30px 24px}
    .changePasswordModal .ivu-modal-footer{padding:230px 24px 30px;}
</style>
<template>
    <Card class="dept-details">
        <p class="right-title">
            <Button type="text" @click="changeRoute(-1)">{{hospitalname}}</Button>
            &nbsp;&nbsp;<Icon type="ios-arrow-right"></Icon>&nbsp;&nbsp;
            <Button type="text" disabled>管理员设置</Button>
        </p>
        
		<!-- 展示列表 -->
		<div class="hos-card-tab">
			<Table :columns="columnsAdmin" :data="dataAdmin" :stripe=true :border=true :show-header=true :loading=false :highlight-row=true></Table>
			<div class="hos-card-page" style="width:100%">
                <Button style="float:left;" icon="md-person-add" type="primary" @click="addAdminClick">添加管理员</Button>
				<Page style="float:right" :total="totalpage" :current="1" :page-size="10" @on-change="changePage"></Page>
			</div>
		</div>
        <!-- 查看 -->
        <Modal v-model="addmodal" :title="modalTitle" @on-ok="saveAdd('addAdmin')" @on-cancel="cancelAdd('addAdmin')" :mask-closable="false" :loading="modalLoading" class="addAdminModal">
            <Form ref="addAdmin" :model="addAdmin" :rules="ruleInlineAdd" :label-width="100" style="margin-bottom: 251px">
                <Tooltip content="大于两位字符且不包含特殊字符(如：*、/等)" placement="right-start">
                    <FormItem label="登录名：" prop="username" style="width:372px;margin-right:104px">
                        <Input :maxlength="50" type="text" class="dept-details-list" v-model="addAdmin.username" placeholder="请输入管理员账号" clearable/>
                    </FormItem>
                </Tooltip>
                <Tooltip content="大于两位字符" placement="right-start">
                    <FormItem label="姓名：" prop="name" style="width:372px;">
                        <Input :maxlength="50" type="text" class="dept-details-list" v-model="addAdmin.name" placeholder="请输入管理员姓名" clearable/>
                    </FormItem>
                </Tooltip>
                <!-- <Tooltip content="原始密码" placement="right-start">
                    <FormItem label="原密码" prop="oldPW" v-show="!phoneShow">
                        <Input :maxlength="20" type="password" class="dept-details-list" v-model="addAdmin.oldPW" placeholder="请输入原密码" clearable>
                    </FormItem>
                </Tooltip> -->
                <Tooltip content="6-20位且不能包含空格" placement="right-start">
                    <FormItem label="密码：" prop="password" style="width:372px;margin-right:104px">
                        <Input :maxlength="20" type="password" class="dept-details-list" v-model="addAdmin.password" placeholder="请输入密码" clearable/>
                    </FormItem>
                </Tooltip>
                <Tooltip content="与上述密码一致" placement="right-start">
                    <FormItem label="确认密码：" prop="passwordTwo" style="width:372px;">
                        <Input :maxlength="20" type="password" class="dept-details-list" v-model="addAdmin.passwordTwo" placeholder="请再次输入密码" clearable/>
                    </FormItem>
                </Tooltip>
                <FormItem v-show="false">
                    <Button type="error" @click="cancelAdd('addAdmin')">取消</Button>
                    <Button type="success" @click="saveAdd('addAdmin')">确定</Button>
                </FormItem>
			</Form>
		</Modal>
        <Modal v-model="fixedmodal" :title="modalTitle" @on-ok="saveFixed('fixedAdmin')" @on-cancel="cancelAdd('fixedAdmin')" :mask-closable="false" :loading="modalLoading" class="changePasswordModal">
            <Form ref="fixedAdmin" :model="fixedAdmin" :rules="ruleInlineAdd" :label-width="100">
                 <Tooltip content="原始密码" placement="right-start">
                    <FormItem label="原密码：" prop="oldPW" style="width:372px;margin-right:104px">
                        <Input :maxlength="20" type="password" class="dept-details-list" v-model="fixedAdmin.oldPW" placeholder="请输入原密码" clearable/>
                    </FormItem>
                </Tooltip>
                <Tooltip content="6-20位且不能包含空格" placement="right-start">
                    <FormItem label="新密码：" prop="password" style="width:372px;">
                        <Input :maxlength="20" type="password" class="dept-details-list" v-model="fixedAdmin.password" placeholder="请输入密码" clearable/>
                    </FormItem>
                </Tooltip>
                <Tooltip content="与上述密码一致" placement="right-start">
                    <FormItem label="确认密码：" prop="passwordTwo" style="width:372px;">
                        <Input :maxlength="20" type="password" class="dept-details-list" v-model="fixedAdmin.passwordTwo" placeholder="请再次输入密码" clearable/>
                    </FormItem>
                </Tooltip>
                <FormItem v-show="false">
                    <Button type="error" @click="cancelAdd('fixedAdmin')">取消</Button>
                    <Button type="success" @click="saveFixed('fixedAdmin')">确定</Button>
                </FormItem>
            </Form>
        </Modal>
    </Card>
</template>
<script>
export default {
    computed : {
        hospitalid (){
            return this.$store.state.hospital.hospitalid
        }
    },
    data(){
        // 密码验证
        const passwordVerification = (rule, value, callback) =>{
            if(this.fixedAdmin.password != this.fixedAdmin.passwordTwo){
                callback(new Error('两次密码输入不一致，请重新输入'))
            } else {
                callback();
            }
        };
        // 登录名验证
        const userNameVerifivation = (rule, value, callback)=>{
            if(value.length<2){
                callback(new Error('用户名长度必须大于6个字符'))
                return false;
            }
            const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            if(regEn.test(value) || regCn.test(value)) {
                callback(new Error('名称不能包含特殊字符'))
                return false;
            }
            callback();
        };
        // 姓名验证
        const nameVerifivation = (rule, value, callback)=>{
            if(value.length<2){
                callback(new Error('医生姓名必须大于1个字符'))
                return false;
            }
            const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            if(regEn.test(value) || regCn.test(value)) {
                callback(new Error('医生姓名不能包含特殊字符'))
                return false;
            }
            callback();
        };
        // 密码验证
        const passwordVerifivation = (rule, value, callback)=>{
            var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(reg.test(value)){
                callback(new Error('密码不允许包含中文'));
                return false;
            }
            this.addAdmin.password = value.replace(/\s+/g,"");
            if(value.length<6||value.length>20){
                callback(new Error('密码长度有误'));
                return false;
            }
            callback();
        }
        return {
            modalLoading : true,
            hospitalname : this.$route.params.hospitalname,
            modalTitle : '',//管理员弹窗文字信息说明
            addmodal : false,//弹窗显隐
            fixedmodal : false,
            pagenum: 1,
            totalpage : 10,//总页数
            pagecount : 10,//每页请求的数据
            //弹窗信息
			addAdmin : {
                'username' : '',
                'name' : '',
				'password' : '',
                'passwordTwo' : '',
            },
            fixedAdmin:{
                'oldPW' : '',
				'password' : '',
                'passwordTwo' : '',
            },
            //表单验证
			ruleInlineAdd : {
				username : [
                    {required : true ,message : '用户名不能为空', trigger : 'blur'},
                    { validator:userNameVerifivation,trigger:'blur' }
                ],
                name : [{required : true ,message : '姓名不能为空', trigger : 'blur'},
                    { validator:nameVerifivation,trigger:'blur' }],//姓名
                oldPW : [{required : true ,message : '密码不能为空', trigger : 'blur'}],//原密码
                password : [{required : true ,message : '密码不能为空', trigger : 'blur'},
                    { validator:passwordVerifivation,trigger:'blur' }],//新密码
				passwordTwo : [//确认密码
                    {required : true ,message : '请输入确认密码', trigger : 'blur'},
                    { validator: passwordVerification, trigger: 'blur' }
                ]
            },
            // 添加医生提交表单
            hospitalAdminInfo : {//提交表单信息
                'username' : '',
                'name' : '',
				'password' : '',
                'hospitalid' : '',
            },
            // 修改医生提交表单
            hospitalFixedInfo : {
                // 'oldPW' : '',
                // 'newPW' : '',
                'adminId' : '',
            },
            //管理员列表title
            columnsAdmin : [
                {
                    type: 'index',
                    width: 65,
                    align: 'center',
                    title: '序号'
                },
                {
                    type: 'selection',
                    width: 40,
                    align: 'center',
                },
                {
					title : '管理员账号',
					key : 'username'
                },
                {
					title : '管理员姓名',
					key : 'name'
                },
                {
					title : '创建时间',
					key : 'createtime'
                },
                {
                    title : '操作',
                    align : 'center',
					render : (h,params) => {
						return h('div',[
							h('Span',{
								style : {
                                    display: "inline-block",
                                    margin: "0 8px",
                                    color: "#1890ff",
                                    cursor: "pointer"
								},
								on : {
									click : () =>{
                                        this.fixedPassword(params.row);//编辑
									}
								}
                            },'修改密码'),
                            h('Span',{
                                style: {
                                    position: "relative",
                                    top: "3px",
                                    display: "inline-block",
                                    width: "1px",
                                    height: "14px",
                                    background: "#e9e9e9"
                                }
                            }),
							h('Span',{
								style : {
                                    display: "inline-block",
                                    margin: "0 8px",
                                    color: "#1890ff",
                                    cursor: "pointer"
								},
								on : {
									click : () =>{
                                        this.delHospitalAdmin(params.row);//删除
									}
								}
                            },'删除')
                        ])
                    }
                }
            ],
            //管理员信息
            dataAdmin : []
        }
    },
    mounted : function(){
        this.getHospitalAdminList();
    },
    methods : {
        // 添加管理员
		addAdminClick : function(){
            // this.phoneShow = true;
            this.modalTitle = '添加管理员';
			this.addmodal = true;
        },
        // 保存添加管理员
		saveAdd : function(name){
            setTimeout(() => {
                this.modalLoading = false;
                this.$nextTick(() => {
                    this.modalLoading = true;
                });
            }, 0);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.hospitalAdminInfo.username = this.addAdmin.username;
                    this.hospitalAdminInfo.name = this.addAdmin.name;
                    this.hospitalAdminInfo.password = this.addAdmin.password;
                    this.hospitalAdminInfo.hospitalid = this.hospitalid;
                    const httpUrl = 'addHospitalAdminV2';
                    let httpParams = {
                        'hospitalAdminInfo' : this.hospitalAdminInfo
                    };
                    this.$post(httpUrl,httpParams).then(response=>{
                        if(response!=404){
                            // 添加成功
                            this.addmodal = false;
                            this.$Message.success('添加成功');
                            this.getHospitalAdminList();//重新获取数据
                            this.cancelAdd(name);//清空表单
                        } else {
                            // 添加失败
                            return false;
                        }
                    })
                } else {
                    this.$Message.error('表单填写不完整');
                }
             })
        },
        // 修改保存
        saveFixed (name){
            setTimeout(() => {
                this.modalLoading = false;
                this.$nextTick(() => {
                    this.modalLoading = true;
                });
            }, 0);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    const httpUrl = 'updateHospitalAdminPW';
                    let httpParams = {
                        //待修改的医院管理员json
                        'oldPW' : this.fixedAdmin.oldPW,
                        'newPW' : this.fixedAdmin.password,
                        'adminId' : this.hospitalFixedInfo.adminId
                    };
                    this.$post(httpUrl,httpParams).then(response=>{
                        if(response!=404){
                            this.fixedmodal = false;
                            this.$Message.success('修改成功');
                            this.cancelAdd();//清空表单
                        }
                    })
                } else {
                    this.$Message.error('表单填写不完整，请重新填写');
                }
            })
        },
        // 取消添加
        cancelAdd : function(name){
            // 清空添加医生表单
			this.addAdmin.username = '';
			this.addAdmin.name = '';
			this.addAdmin.password = '';
            this.addAdmin.passwordTwo = '';
            // 清空修改医生表单
			this.fixedAdmin.oldPW = '';
			this.fixedAdmin.password = '';
            this.fixedAdmin.passwordTwo = '';
            this.$refs[name].resetFields();

        },
        // 根据医院id获取医院管理员列表
        getHospitalAdminList (){
            // alert('获取id=',this.hospitalid);
            const httpUrl = 'getHospitalAdminList';
            let httpParams = {
                'hospitalId' : this.hospitalid,
                'pagenum' : this.pagenum,
                'pagecount' : this.pagecount
            };
            this.$post(httpUrl,httpParams).then(response=>{
                if(response!=404){
                    this.dataAdmin = response.hospitalAdminList;
                    this.totalpage = (response.totalpage)*10;
                }
            })
        },
        // 修改管理员密码
        fixedPassword (value){
            this.modalTitle = '编辑管理员信息';
            // this.phoneShow = false;
            this.fixedmodal = true;
            this.fixedAdmin.username = value.username;
            this.fixedAdmin.name = value.name;

            this.hospitalFixedInfo.adminId = value.adminid;//管理员id
        },
        // 提交修改密码
        updateHospitalAdmin (name){
            

            
        },
        // 删除医院管理员
        delHospitalAdmin (value){
            const httpUrl = 'delHospitalAdmin';
            let httpParams = {
                'hospitalAdminId' : value.adminid//管理员id
            };
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除'+value.name+'吗？',
                onOk: () => {
                    this.$post(httpUrl,httpParams).then(response=>{
                        if(response!=404){
                            this.dataAdmin.splice(value._index,1);//成功删除，不刷请求接口
                            this.$Message.success('删除成功')
                        }
                    })
                },
                onCancel: () => {
                    // this.$Message.info('Clicked cancel');
                }
            });
        },
        changePage : function(e){
            this.pagenum = e;
            // 根据医院id获取医院管理员列表
            this.getHospitalAdminList();//获取照护统计列表
        },
        changeRoute : function(){
            this.$router.go('-1');
        },
        // 输入密码的时候清除空格
        // clearSpace(value){
        //     this.addAdmin.password = value.data.replace(/\s+/g,"");
        //     console.log(this.addAdmin.password);
        // }
    }
}
</script>

