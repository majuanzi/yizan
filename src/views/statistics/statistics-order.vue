<style type="text/css" scoped>
    .input-box {
        width: 100%;
        padding-right: 0;
    }

    .input-box .el-select {
        width: 100%;
    }

    .hos-card-tab {
        padding-top: 0;
        margin-top: 4px;
    }
</style>
<template>
    <Card>
        <!-- 筛选 -->
        <Row>

            <!-- 区域 -->
            <Col span="4">
            <div class="input-box">
                <el-select v-model="cityInitId" filterable placeholder="请选择区域" :disabled="showDisabled"
                    @change="changeAddress">
                    <p v-if="cityList.length==0" style="text-align:center;color:#999;" disabled="disabled">查询数据为空</p>
                    <el-option v-else v-for="item in cityList" :key="item.regionID" :value="item.regionID"
                        :label="item.regionname">{{ item.regionname }}</el-option>
                </el-select>
            </div>
            </Col>
            <!-- 医院 -->
            <Col span="4">
            <div class="input-box">
                <el-select v-if="hospitalList.length!=0" v-model="hospitalid" filterable placeholder="请选择医院"
                    :disabled="showDisabled" @change="changeHospital">
                    <el-option v-for="item in hospitalList" :key="item.hospitalid" :value="item.hospitalid"
                        :label="item.hospitalname">{{item.hospitalname}}</el-option>
                </el-select>
                <el-select v-else filterable placeholder="请选择医院" :disabled="showDisabled">
                    <p v-if="hospitalList.length==0" style="text-align:center;color:#999;" disabled="disabled">查询数据为空
                    </p>
                </el-select>
            </div>
            </Col>
            <!-- 科室 -->
            <Col span="4">
            <div class="input-box">
                <el-select v-if="deptList.length!=0" v-model="allDeptValue" filterable placeholder="请选择科室"
                    @change="selectDept">
                    <el-option key="0" value="0" label="全部科室">全部科室</el-option>
                    <el-option-group v-for="(item,index) in deptList" :label="item.deptname" :key="index">
                        <el-option v-if="item.children.length>0" v-for="itemChildren in item.children"
                            :key="itemChildren.deptid" :value="itemChildren.deptid" :label="itemChildren.deptname">
                            {{ itemChildren.deptname }}</el-option>

                        <el-option v-if="item.children.length==0" :key="item.deptid" :value="item.deptid"
                            :label="item.deptname">{{item.deptname}}</el-option>

                    </el-option-group>
                </el-select>
                <el-select v-else filterable placeholder="请选择科室" :disabled="showDisabled">
                    <p v-if="deptList.length==0" style="text-align:center;color:#999;" disabled="disabled">
                        查询数据为空
                    </p>
                </el-select>
            </div>
            </Col>
            <!-- 医生 -->
            <Col span="4">
            <div class="input-box">
                <el-select :disabled="showDisabled" v-model="allDoctorValue" placeholder="请选择医生" @change="selectDoctor">
                    <el-option v-show="showAll" key="0" value="0" label="全部医生">全部医生</el-option>
                    <p v-if="docList.length==0" style="text-align:center;color:#999;" disabled="disabled">查询数据为空</p>
                    <el-option v-else v-for="item in docList" :key="item.doctorid" :value="item.doctorid"
                        :label="item.doctorname">{{ item.doctorname }}</el-option>
                </el-select>
            </div>
            </Col>
            <!-- 状态 -->
            <Col span="4">
            <div class="input-box">
                <el-select v-model="allStatus" :disabled="showDisabled" placeholder="全部状态" @change="selectStatus">
                    <el-option v-for="item in statusList" :key="item.value" :value="item.value" :label="item.label">
                        {{ item.label }}</el-option>
                </el-select>
            </div>
            </Col>
            <!-- 日期 -->
            <Col span="4">
            <DatePicker size="large" :disabled="showDisabled" type="daterange" split-panels placeholder="请选择订单日期"
                style="width: 100%" @on-change="selectDate" @on-clear="clearDate"></DatePicker>
            </Col>
        </Row>
        <!-- 列表 -->
        <div class="statistics-tab hos-card-tab">
            <Table :columns="columnsCard" :data="dataCard" :stripe=true :border=true :show-header=true
                :loading=showLoading :highlight-row=true @on-current-change="selectCard"></Table>
            <div class="hos-card-page vh-mg-top-12 clearfix">
                <Page :total="totalpage" show-total :current="1" :page-size="10" @on-change="changePage"></Page>
            </div>
        </div>
    </Card>
</template>

<script>
    import expandRow from './order-expand.vue';

    export default {
        components: { expandRow },
        name: 'statistics-order',
        data: function () {
            return {
                cityInitId: '',//区域初始ID
                showAll: true,//全部医生选项显示
                allDoctorValue: '',
                showDisabled: false,
                showLoading: false,
                allDeptValue: '',//查看全部科室
                startTime: '',//开始时间
                endTime: '',//截止时间
                careStatus: '999',//订单状态
                allStatus: '999',
                departmentId: '',//科室ID
                doctorId: '',//医生ID
                docList: [],// 科室列表
                deptList: [],//科室列表
                pagenum: 1,
                pagecount: 10,
                totalpage: 0,//总页数
                totalCount: 0, //共多少条数据
                allAddressValue: '',
                cityList: [],//区域数据
                hospitalList: [],//医院数据
                statusList: [
                    {
                        value: '999',
                        label: '全部状态'
                    },
                    {
                        value: '1',
                        label: '未支付'
                    },
                    {
                        value: '2',
                        label: '已支付'
                    },
                    // {
                    //     value : '2',
                    //     label : '支付失败'
                    // },
                    {
                        value: '3',
                        label: '已取消'
                    }
                ],
                // 传参数1 未支付 2 已支付 3 已取消
                //回参：0 未支付 1 已支付 3 已取消
                // 列表
                columnsCard: [
                    {
                        width: 65,
                        align: 'center',
                        title: '序号',
                        render: (h, params) => {
                            return h('span', params.index + (this.pagenum - 1) * this.pagecount + 1);
                        }
                    },
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '订单编号',
                        key: 'orderno'
                    },
                    {
                        title: '医生姓名',
                        key: 'doctorname'
                    },
                    {
                        title: '患者姓名',
                        key: 'username',
                    },
                    {
                        title: '生成时间',
                        key: 'createtime',
                        align: 'center'
                    },
                    {
                        title: '订单金额',
                        key: 'orderamount',
                        align: 'right'
                    },
                    {
                        title: '订单状态',
                        // 传参数1 未支付 2 已支付 3 已取消
                        //回参：0 未支付 1 已支付 3 已取消
                        key: 'orderstatus',
                    },
                    {
                        title: '支付类型',
                        key: 'paytype'
                    },
                    {
                        title: '支付时间',
                        key: 'paytime',
                        align: 'center'
                    }
                ],
                dataCard: []
            }
        },
        mounted: function () {
            this.getAllRegionList();
        },
        methods: {
            // 获取城市地址
            getAllRegionList: function () {
                const httpUrl = "getAllRegionList";
                let httpParams = {};
                this.$post(httpUrl, httpParams).then(response => {
                    if (response != 404) {
                        this.cityList = response.regionList;
                        this.cityInitId = this.cityList[0].regionID;
                    }
                })
            },
            // 根据区域id获取医院列表
            getHospitalList: function () {
                const httpUrl = 'getHospitalList';
                let httpParams = {
                    'regionId': this.cityInitId,
                    'level': '',//查询全部，传空
                    'pagenum': '1',
                    'pagecount': '10'
                }
                this.$post(httpUrl, httpParams).then(response => {
                    if (response != 404) {
                        this.hospitalList = response.hospitalList;
                        this.hospitalList.length == 0 ? this.hospitalid = '' : this.hospitalid = this.hospitalList[0].hospitalid;
                        // this.changeHospital();//获取科室列表
                    }
                })
            },
            // 选择城市
            changeAddress: function (value) {
                this.careStatus = '999';//照护状态
                this.allStatus = '999';//照护状态
                this.cityInitId = value;//更新

                this.hospitalid = '';

                this.getDeptList();

            },
            // 选择医院
            changeHospital: function (value) {
                this.careStatus = '999';//照护状态
                this.allStatus = '999';//照护状态
                this.departmentId = '';//科室ID
                this.doctorId = '';//医生ID
                this.allDeptValue = '';
                // ----------44444444444444444-------------
                this.getDeptList();//更新科室
            },
            // 获取科室列表
            getDeptList: function () {
                const httpUrl = 'getDeptListByHospitalId';
                let httpParams = {
                    'hospitalId': this.hospitalid,//医院ID
                }
                this.$post(httpUrl, httpParams).then(response => {
                    // ----------555555555555555-------------
                    this.selectDept();//获取医生列表
                    this.deptList = response.departmentList[0].children;
                });
            },
            // 根据科室ID获取医生列表
            getDoctorList: function () {
                if (this.hospitalid) {
                    const httpUrl = 'getDoctorListByDeptId';
                    let httpParams = {
                        'hospitalId': this.hospitalid,//医院ID
                        'departmentId': this.departmentId,//科室ID
                        'pagenum': 1,//分页显示的页码
                        'pagecount': 100000,//每页请求的数据条数
                    };
                    this.$post(httpUrl, httpParams).then(response => {
                        if (response != 404) {
                            this.getOrders();//更新列表
                            this.docList = response.doctorList;
                            if (this.docList.length > 0) {
                                this.showAll = true;
                            } else {
                                this.showAll = false;
                            }
                        }
                    });
                } else {
                    this.docList = [];//医生列表
                    this.dataCard = [];
                    this.totalpage = 0;

                }
            },
            // 选择科室进行筛选， e是选中option的value值
            selectDept: function (e) {
                this.departmentId = e;//科室id赋值
                this.doctorId = '';//医生id置空
                this.docList = [];
                this.allDoctorValue = '';
                // this.getOrders();//获取订单统计列表
                this.getDoctorList();//刷新科室下医生列表
            },
            // 选择医生
            selectDoctor: function (e) {
                this.doctorId = e;//医生id赋值
                this.getOrders();//获取订单统计列表
            },
            // 选择状态
            selectStatus: function (e) {
                this.careStatus = e;
                this.getOrders();//获取订单统计列表
            },
            // 选择日期 e返回所选时间，例：["2018-05-03", "2018-05-04"]
            selectDate: function (e) {
                this.startTime = e[0];//开始时间
                this.endTime = e[1];//截止时间
                this.getOrders();//获取订单统计列表
            },
            // 清空日期
            clearDate: function () {
                this.startTime = '';//开始时间
                this.endTime = '';//截止时间
                this.getOrders();//获取订单统计列表
            },
            // 获取订单列表
            getOrders: function () {
                if (this.hospitalList.length == 0) {
                    this.deptList = [];//科室列表
                    this.dataCard = [];//列表数据
                    this.docList = [];//医生列表
                    this.departmentId = '';//科室ID
                    this.doctorId = '';//医生ID
                    this.pagenum = 1;
                    this.pagecount = 10;
                    this.totalpage = 0//总页数
                    this.startTime = '';//开始时间
                    this.endTime = '';//截止时间
                    this.careStatus = '999';//照护状态
                    this.allStatus = '999';//照护状态
                    return false;
                } else {
                    this.showDisabled = true;
                    this.showLoading = true;
                    const httpUrl = 'getOrderStatisticsList';
                    let httpParams = {
                        'hospitalId': this.hospitalid,//医院ID **必传**
                        'departmentId': this.departmentId,//科室ID
                        'doctorId': this.doctorId,//医生ID
                        'orderStatus': this.careStatus,//支付状态 0:未支付 1:已支付 2：支付失败3：已取消
                        'startTime': this.startTime,//预约时间段
                        'endTime': this.endTime,//预约时间段
                        'pagenum': this.pagenum,//分页显示的页码
                        'pagecount': this.pagecount,//每页请求的数据条数
                    }
                    this.$post(httpUrl, httpParams).then(response => {
                        this.dataCard = response.orderStatList;
                       // this.totalpage = (response.totalpage) * 10;//当前查询结果共多少页
                        this.totalpage = response.totalCount;//当前查询结果共多少条数据
                        this.showDisabled = false;
                        this.showLoading = false;
                        if (this.dataCard.length > 0) {
                            for (let i = 0; i < this.dataCard.length; i++) {
                                switch (this.dataCard[i].paytype) {
                                    case '1':
                                        this.dataCard[i].paytype = '支付宝';
                                        break;
                                    case '2':
                                        this.dataCard[i].paytype = '微信';
                                        break;
                                    case '4':
                                        this.dataCard[i].paytype = '免费';
                                        break;
                                    case 'null':
                                        this.dataCard[i].paytype = '用户未支付';
                                        break;
                                };
                                if (this.dataCard[i].paytime == 'null') {
                                    this.dataCard[i].paytime = '未知'
                                };

                                // 传参数1 未支付 2 已支付 3 已取消
                                //回参：0 未支付 1 已支付 3 已取消
                                switch (this.dataCard[i].orderstatus) {
                                    case '0':
                                        this.dataCard[i].orderstatus = '未支付';
                                        break;
                                    case '1':
                                        this.dataCard[i].orderstatus = '已支付';
                                        break;
                                        // case '2':
                                        // this.dataCard[i].orderstatus = '支付失败';
                                        break;
                                    case '3':
                                        this.dataCard[i].orderstatus = '已取消';
                                        break;
                                };

                            }
                        }
                    });
                }
            },
            changePage: function (e) {
                this.pagenum = e;
            },
            selectCard: function (e) {
            }
        },
        watch: {
            // 改变城市
            cityInitId() {
                this.getHospitalList();//获取医院列表
            },
            // 翻页
            pagenum() {
                this.getOrders();//获取照护统计列表
            },
            // 改变医院
            hospitalid() {
                this.getHospitalList();
                this.pagenum = 1;
                this.totalpage = 0;
            },
            // 改变科室
            departmentId() {
                this.pagenum = 1;
                this.totalpage = 0;
            },
            // 改变医生
            doctorId() {
                this.pagenum = 1;
                this.totalpage = 0;
            },
            // 改变状态
            orderStatus() {
                this.pagenum = 1;
                this.totalpage = 0;
            },
            // 改变时间
            startTime() {
                this.pagenum = 1;
                this.totalpage = 0;
            },
            // 改变时间
            endTime() {
                this.pagenum = 1;
                this.totalpage = 0;
            }
        }
    }
</script>