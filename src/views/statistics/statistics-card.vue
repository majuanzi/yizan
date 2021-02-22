<style lang="less" scoped>
    .statistics-tab {
        margin-top: 0;
        padding-top: 0;
    }

    .input-box {
        width: 100%;
        padding-right: 0 !important;
    }

    .input-box .el-select {
        width: 100%;
    }

    .title-bar {
        min-height: 44px;
        margin-bottom: 4px;
        padding-right: 0;
    }
</style>


<template>
    <Card>
        <!-- 筛选 -->
        <div class="title-bar">
            <Row>
                <!-- 区域 -->
                <Col span="4">
                <div class="input-box">
                    <el-select v-model="cityInitId" placeholder="请选择区域" :disabled="showDisabled" filterable
                        @change="changeAddress">
                        <p v-if="cityList.length==0" style="text-align:center;color:#999;" disabled="disabled">查询数据为空
                        </p>
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
                            :label="item.hospitalname">
                            {{item.hospitalname}} </el-option>
                    </el-select>
                    <el-select v-else filterable placeholder="请选择医院" :disabled="showDisabled">
                        <p v-if="hospitalList.length==0" style="text-align:center;color:#999;" disabled="disabled">
                            查询数据为空
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
                    <el-select placeholder="请选择医生" :disabled="showDisabled" v-model="allDoctorValue"
                        @change="selectDoctor">
                        <el-option v-show="showAll" key="0" value="0" label="全部医生">全部医生</el-option>
                        </el-option>
                        <p v-if="docList.length==0" style="text-align:center;color:#999;" disabled="disabled">查询数据为空</p>
                        <el-option v-else v-for="item in docList" :value="item.doctorid" :key="item.doctorid"
                            :label="item.doctorname">{{ item.doctorname }}</el-option>
                    </el-select>
                </div>
                </Col>
                <!-- 状态 -->
                <Col span="4">
                <div class="input-box">
                    <el-select v-model="allStatus" placeholder="全部状态" :disabled="showDisabled" @change="selectStatus">
                        <el-option v-for="item in statusList" :value="item.value" :key="item.value" :label="item.label">
                            {{ item.label }}</el-option>
                    </el-select>
                </div>
                <!-- <Select v-model="allStatus" placeholder="全部状态" @on-change="selectStatus" :disabled="showDisabled">
                    <Option v-for="item in statusList" :value="item.value" :key="item.label">{{ item.label }}</Option>
                </Select> -->
                </Col>
                <!-- 日期 -->
                <Col span="4">
                <DatePicker size="large" :disabled="showDisabled" type="daterange" split-panels placeholder="请选择照护日期"
                    style="width: 100%" @on-change="selectDate" @on-clear="clearDate"></DatePicker>
                </Col>
            </Row>
        </div>
        <div class="statistics-tab hos-card-tab">
            <Table :columns="columnsCard" :data="dataCard" :stripe=true :border=true :show-header=true
                :loading=showLoading :highlight-row=true @on-current-change="selectCard"></Table>
            <div class="hos-card-page vh-mg-top-12 clearfix">
                <Page :total="totalpage" :current="1" show-total :page-size="10" @on-change="changePage"></Page>
            </div>
        </div>
    </Card>
</template>

<script>
    export default {
        data: function () {
            return {
                showAll: true,
                showDisabled: false,
                showLoading: false,//加载动画
                allDeptValue: '',//查看全部科室
                allDoctorValue: '全部医生',//查看全部医生
                statusValue: '',//查看全部状态
                startTime: '',//开始时间
                endTime: '',//截止时间
                departmentId: '0',//科室ID
                doctorId: '',//医生ID
                careStatus: '',//照护状态
                docList: [],
                hospitalList: [],//医院列表
                cityList: [],//城市列表
                cityInitId: '',//页面初始给的地址id
                hospitalid: '',//医院id
                allStatus: '0',
                // 科室列表
                deptList: [],
                dataCard: [],//列表数据
                statusList: [
                    {
                        value: '0',
                        label: '全部状态'
                    },
                    {
                        value: '1',
                        label: '未开始'
                    },
                    {
                        value: '2',
                        label: '进行中'
                    },
                    {
                        value: '3',
                        label: '已结束'
                    },
                    {
                        value: '4',
                        label: '已取消'
                    },
                ],
                // 入参： 1未开始 2 进行中 3 已结束 4 已取消
                // 出参： 0未开始 1 进行中 2 已结束 3 已取消
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
                        title: '医生姓名',
                        key: 'doctorname'
                    },
                    {
                        title: '患者姓名',
                        key: 'username'
                    },
                    {
                        title: '照护日期',
                        key: 'caredate',
                        align: 'center'

                    },
                    {
                        title: '开始时间',
                        key: 'carestarttime',
                        align: 'center'
                    },
                    {
                        title: '结束时间',
                        key: 'careendtime',
                        align: 'center'
                    },
                    {
                        title: '照护状态',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '满意度',
                        key: 'satisfactionLevel',
                        align: 'right'
                    },
                    {
                        title: '评价',
                        key: 'patientcomment',
                        style: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }
                    }
                ],
                pagenum: 1,
                pagecount: 10,
                totalpage: 0,//总页数,
                totalNum: 0,// 当前默认0条数据
            }
        },
        mounted: function () {
            this.getAllRegionList();//获取城市列表
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
                    'pagecount': '100000'
                }
                this.$post(httpUrl, httpParams).then(response => {
                    if (response != 404) {
                        this.hospitalList = response.hospitalList;
                        this.hospitalList.length == 0 ? this.hospitalid = '' : this.hospitalid = this.hospitalList[0].hospitalid;
                    }
                })
            },
            // 选择城市
            changeAddress: function (value) {
                this.careStatus = '0';//照护状态
                this.allStatus = '0';//照护状态
                this.allDoctorValue = '';
                this.cityInitId = value;//更新
                // this.getHospitalList();
            },
            // 选择医院
            changeHospital: function (value) {
                this.careStatus = '0';//照护状态
                this.allStatus = '0';//照护状态
                this.departmentId = '0';//科室ID
                this.allDeptValue = '';
                this.allDoctorValue = '';
                this.doctorId = '';//医生ID
            },
            // 选择科室进行筛选， e是选中option的value值
            selectDept: function (e) {
                this.departmentId = e;//科室id赋值
                this.doctorId = '';//医生id置空
                this.allDoctorValue = '';
                this.getDoctorList();//刷新科室下医生列表
            },
            // 选择医生
            selectDoctor: function (e) {
                this.doctorId = e;//医生id赋值
                this.getStatistics();//获取照护统计列表
            },
            // 获取科室列表
            getDeptList: function () {
                const httpUrl = 'getDeptListByHospitalId';
                let httpParams = {
                    'hospitalId': this.hospitalid,//医院ID
                };
                this.$post(httpUrl, httpParams).then(response => {
                    debugger
                    if (response != 404) {


                        this.getDoctorList();//获取医生列表
                        this.deptList = response.departmentList[0].children;
                    }
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
                            this.getStatistics();//更新列表
                            this.docList = response.doctorList;
                            // console.log('医生id获取了='+this.docList.length)
                            if (this.docList.length > 0) {
                                this.showAll = true;
                            } else {
                                this.showAll = false;
                            }
                        }
                    });
                } else {

                    this.docList = [];//医生列表
                    this.dataCard = [];//列表数据

                }
            },
            // 获取展示列表
            getStatistics: function () {
                if (this.hospitalList.length == 0) {
                    this.deptList = [];//科室列表
                    this.dataCard = [];//列表数据
                    this.docList = [];//医生列表
                    this.departmentId = '0';//科室ID
                    this.doctorId = '';//医生ID
                    this.pagenum = 1;
                    this.pagecount = 10;
                    this.totalpage = 0//总页数
                    this.startTime = '';//开始时间
                    this.endTime = '';//截止时间
                    this.careStatus = '0';//照护状态
                    this.allStatus = '0';//照护状态
                    return false;
                } else {

                    this.showDisabled = true;
                    this.showLoading = true;
                    const httpUrl = 'getCareStatisticsList';
                    let httpParams = {
                        'hospitalId': this.hospitalid,//医院ID
                        'departmentId': this.departmentId,//科室ID
                        'doctorId': this.doctorId,//医生ID
                        'careStatus': this.careStatus,//照护状态 0:未进行 1:正在进行 2：已结束
                        'startTime': this.startTime,//开始时间
                        'endTime': this.endTime,//截止时间
                        'pagenum': this.pagenum,//分页显示的页码
                        'pagecount': this.pagecount,//每页请求的数据条数
                    };
                    this.$post(httpUrl, httpParams).then(response => {
                        this.dataCard = response.careList;
                        if (this.dataCard.length > 0) {
                            for (let i = 0; i < this.dataCard.length; i++) {
                                // 入参： 1未开始 2 进行中 3 已结束 4 已取消
                                // 出参：   0未开始 1 进行中 2 已结束 3 已取消
                                switch (this.dataCard[i].status) {
                                    case '0':
                                        this.dataCard[i].status = '未开始';
                                        break;
                                    case '1':
                                        this.dataCard[i].status = '进行中';
                                        break;
                                    case '2':
                                        this.dataCard[i].status = '已结束';
                                        break;
                                    case '3':
                                        this.dataCard[i].status = '已取消';
                                        break;
                                };
                                // 2018-07-03修改
                                /**
                                 * 时间2018-07-03
                                 * 作者：田春伟
                                 * 版权所有：北京东软望海科技有限公司
                                 */
                                if (!this.dataCard[i].patientcomment || this.dataCard[i].patientcomment == 'null') {
                                    this.dataCard[i].patientcomment = '未评价'
                                    if (!this.dataCard[i].satisfactionLevel || this.dataCard[i].satisfactionLevel == 'null') {
                                        this.dataCard[i].satisfactionLevel = '0%'
                                    }
                                } else {
                                    if (!this.dataCard[i].satisfactionLevel || this.dataCard[i].satisfactionLevel == 'null') {
                                        this.dataCard[i].satisfactionLevel = '100%'
                                    }
                                }
                            }
                        };
                        //this.totalpage = (response.totalpage) * 10;//当前查询结果共多少页
                        this.totalpage = response.totalNum;//当前查询结果共多少条数据
                        this.showLoading = false;
                        this.showDisabled = false;
                    });
                }
            },
            // 选择状态
            selectStatus: function (e) {
                if (this.hospitalList.length == 0) {
                    return false;
                } else {
                    this.careStatus = e;
                    this.getStatistics();//获取照护统计列表
                }
            },
            // 选择日期 e返回所选时间，例：["2018-05-03", "2018-05-04"]
            selectDate: function (e) {
                this.startTime = e[0];//开始时间
                this.endTime = e[1];//截止时间
                this.getStatistics();//获取照护统计列表
            },
            // 清空日期
            clearDate: function () {
                this.startTime = '';//开始时间
                this.endTime = '';//截止时间
                this.getStatistics();//获取照护统计列表
            },
            selectCard: function (e) {
            },
            // 分页
            changePage: function (e) {
                this.pagenum = e;//
            }
        },
        watch: {
            // 改变医院
            cityInitId() {
                this.getHospitalList();//获取医院列表
            },
            // 翻页
            pagenum() {
                this.getStatistics();//获取照护统计列表
            },
            // 改变医院
            hospitalid() {
                this.getDeptList();//更新科室
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
            careStatus() {
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
    };
</script>