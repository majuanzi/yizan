<style lang="less">
    @import './style/hos-dept-doc.less';
</style>


<template>
    <Card class="dept-details" dis-hover :bordered="false">
        <div style="height: 40px; border-bottom:1px solid #f0f0f0">
            <div class="dept-details-deptname">
                科室名称：{{deptDetails.deptname}}
            </div>
            <div class="dept-details-deptname">
                科室简介：
                {{deptDetails.deptdesc}}
            </div>
            <div style="clear: both"></div>
        </div>
        <!-- 展示列表 -->
        <div class="hos-card-tab">
            <Table :columns="columnsDoc" :data="dataDoc" :stripe=true :border=true :show-header=true
                :loading=showLoading :highlight-row=true></Table>
            <div style="text-align: right; padding-top: 12px">
                <Page :total="totalpage" :current="1" :page-size="10" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal v-model="shwoConfirmLook" title="医生详情" class="doctor-details" width="700">
            <Form ref="cookieDoctor" :model="cookieDoctor" :label-width="120">
                <FormItem label="姓名：">
                    <!-- <Input type="text" class="dept-details-list" v-model="cookieDoctor.doctorname"></Input> -->
                    <p type="text" class="dept-details-list">{{cookieDoctor.doctorname}}</p>
                </FormItem>
                <FormItem label="擅长治疗疾病：">
                    <p type="text" class="dept-details-list btn-normal">{{cookieDoctor.speciality}}</p>
                </FormItem>
                <FormItem label="从业年数：">
                    <p type="text" class="dept-details-list">{{cookieDoctor.workyear}}</p>
                </FormItem>
                <FormItem label="手机号：">
                    <p type="text" class="dept-details-list">{{cookieDoctor.phonenumber}}</p>
                </FormItem>
                <FormItem label="身份证号：">
                    <p type="text" class="dept-details-list">{{cookieDoctor.idcard}}</p>
                </FormItem>
                <FormItem label="职称：">
                    <p type="text" class="dept-details-list">{{cookieDoctor.titleName}}</p>
                </FormItem>
                <FormItem label="出生日期：">
                    <p type="text" class="dept-details-list">{{cookieDoctor.birthday}}</p>
                </FormItem>
            </Form>
        </Modal>
    </Card>
</template>

<script>
    export default {
        computed: {
            hospitalid() {
                return this.$store.state.hospital.hospitalid;
            }
        },
        data() {
            // 手机号正则验证
            const validatePhone = (rule, value, callback) => {
                let phoneExpression = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!phoneExpression.test(value)) {
                    callback(new Error('请输入手机号'));
                } else {
                    callback();
                }
            };
            // 身份证号正则验证
            const validateIdCard = (rule, value, callback) => {
                let iSum = 0;
                let info = "";
                const aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
                if (!/^\d{17}(\d|x)$/i.test(value)) return callback(new Error("你输入的身份证长度或格式错误"));

                value = value.replace(/x$/i, "a");

                if (aCity[parseInt(value.substr(0, 2))] == null) return callback(new Error("你的身份证地区非法"));

                let sBirthday = value.substr(6, 4) + "-" + Number(value.substr(10, 2)) + "-" + Number(value.substr(12, 2));

                let d = new Date(sBirthday.replace(/-/g, "/"));

                if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return callback(new Error("身份证上的出生日期非法"));

                for (let i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(value.charAt(17 - i), 11);

                if (iSum % 11 != 1) return callback(new Error("你输入的身份证号非法"));

                // aCity[parseInt(value.substr(0,2))]+","+sBirthday+","+(value.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
                return callback();
            }
            return {
                shwoConfirmLook: false,
                isJurisdiction: '',
                userState: '设为管理员',
                showLoading: true,//加载动画
                hospitalname: this.$route.params.hospitalname,
                deptDetails: {},//科室详情信息
                cookieDetails: {
                    deptname: '',
                    deptdesc: ''
                },
                edit: {
                    contenteditable: true,//是否是可编辑状态
                    iconType: 'md-create',
                    saveShow: false,
                    contentInit: '编辑',//编辑提示信息
                    modal: false,
                },
                cookieDoctor: {},
                ruleInline: {
                    doctorname: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    speciality: [
                        { required: true, message: '擅长治疗疾病不能为空', trigger: 'blur' }
                    ],
                    workyear: [
                        { required: true, message: '工作年限不能为空' }
                    ],
                    phonenumber: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' },
                        { validator: validatePhone, trigger: 'blur' },
                    ],
                    idcard: [
                        { required: true, message: '身份证号不能为空', trigger: 'blur' },
                        { validator: validateIdCard, trigger: 'blur' },
                    ],
                    titleName: [
                        { required: true, message: '职称不能为空', trigger: 'blur' }
                    ],
                    birthday: [
                        { required: true, message: '必填项目', trigger: 'change' }
                    ]
                },
                selectIndex: '',//当前选中选项的索引
                columnsDoc: [
                    {
                        type: 'index',
                        width: 65,
                        align: 'center',
                        title: '序号'
                    },
                    {
                        title: '姓名',
                        width: 100,
                        key: 'doctorname'
                    },
                    {
                        title: '擅长治疗疾病',
                        key: 'speciality'
                    },
                    {
                        title: '从业年数',
                        width: 100,
                        key: 'workyear'
                    },
                    {
                        title: '手机号',
                        width: 130,
                        key: 'phonenumber'
                    },
                    {
                        title: '身份证号',
                        key: 'idcard'
                    },
                    {
                        title: '职称',
                        key: 'titleName'
                    },
                    {
                        title: '出生年月',
                        width: 120,
                        key: 'birthday'
                    },
                    {
                        title: '操作',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    on: {
                                        click: () => {
                                            this.cookieDoctor = params.row;
                                            this.selectIndex = params.index;//索引赋值
                                            this.shwoConfirmLook = true;
                                        }
                                    },
                                    style: {
                                        color: '#2d8cf0',
                                        cursor: 'pointer'
                                    }
                                }, '查看')
                            ])
                        }
                    }
                ],
                dataDoc: [],
                viewDetailsModel: false,
                pagenum: 1,
                pagecount: 10,
                totalpage: 10,//总页数
            }
        },
        props: {
            deptid: {
                type: String
            }
        },
        watch: {
            deptid(val) {
                if (val != '') {
                    this.getDeptDetails();
                    this.getDoctorList();
                }
            }
        },

        methods: {
            // // 获取科室详情信息
            getDeptDetails: function () {
                const httpUrl = 'getDepartmentDetail';
                let httpParams = {
                    'departmentId': this.deptid
                }
                this.$post(httpUrl, httpParams).then(response => {
                    this.deptDetails = response.departmentDetail
                });
            },
            // 获取当前科室下的医生列表
            getDoctorList: function () {
                this.showLoading = true;
                const httpUrl = 'getDoctorListByDeptId';
                let httpParams = {
                    'hospitalId': this.hospitalid,
                    'departmentId': this.deptid,
                    'pagenum': this.pagenum,
                    'pagecount': this.pagecount
                }
                this.$post(httpUrl, httpParams).then(response => {
                    this.totalpage = (response.totalpage) * 10;
                    this.dataDoc = response.doctorList;
                    this.showLoading = false;
                }, response => {
                    this.showLoading = false;
                });
            },
            // 点击每排列表获取列表信息
            selectTable: function (e) {
                this.cookieDoctor = e
            },
            changeTime: function (e) {
                this.cookieDoctor.birthday = e;
            },
            // 点击分页
            changePage: function (e) {
                this.pagenum = e;
                this.getDoctorList();
            },
        }
    }
</script>