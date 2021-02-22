<style lang="less" scoped>
    @import "./statistics.less";

    .hos-card-tab {
        padding-top: 0;
    }

    .evaluate-header {
        margin-bottom: 4px;
    }

    .input-box {
        width: 100%;
        padding-right: 0;
    }

    .input-box .el-select {
        width: 100%;
    }
</style>
<template>
    <Card class="evaluate">
        <!-- 筛选 -->
        <Row class="evaluate-header">
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
            <!-- <Col span="4">
                <Select filterable :disabled="showDisabled" placeholder="请选择医生" @on-change="selectDoctor">
                    <Option v-show="showAll" :value="allDoctorValue" label="全部医生"> 全部医生 </Option>
                    <p v-if="docList.length==0" style="text-align:center;color:#999;" disabled="disabled">查询数据为空</p>
                    <Option v-else v-for="item in docList" :value="item.doctorid" :key="item.doctorname">{{ item.doctorname }}</Option>
                </Select>
            </Col> -->
            <!-- 日期 -->
            <Col class="evaluate-header-col" span="4">
            <DatePicker size="large" :disabled="showDisabled" type="daterange" split-panels placeholder="请选择评价日期"
                style="width: 100%" @on-change="selectDate" @on-clear="clearDate"></DatePicker>
            </Col>
        </Row>
        <!-- 评价列表 -->

        <div class="hos-card-tab">
            <Table :columns="columnsEvaluate" :data="dataEvaluateList" :stripe=true :border=true :show-header=true
                :loading=showLoading :highlight-row=true></Table>
            <div class="hos-card-page vh-mg-top-12 clearfix">
                <Page :total="totalNum" show-total :current="1" :page-size="10" @on-change="changePage"></Page>
            </div>
        </div>

    </Card>
</template>

<script>
    export default {
        data: function () {
            return {
                showAll: true,//全部医生选项显示
                showDisabled: false,
                showLoading: false,// 加载动画
                allDeptValue: '',//查看全部科室
                departmentId: '',//科室ID
                deptList: [],
                modelDep: "呼吸内科",
                allAddressValue: '',
                cityList: [],
                cityInitId: '',
                allDoctorValue: '',
                hospitalList: [],
                docList: [],// 科室列表
                // 列表
                columnsEvaluate: [
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
                        title: '所在科室',
                        key: 'departmentname'
                    },
                    {
                        title: '总体满意度',
                        key: 'scare',
                        align: 'right'
                    },
                    {
                        title: '专业性',
                        key: 'firstscare',
                        align: 'right'
                    },
                    {
                        title: '及时性',
                        key: 'secondscare',
                        align: 'right'
                    },
                    {
                        title: '满意度',
                        key: 'thirdscare',
                        align: 'right'
                    }
                ],
                dataEvaluateList: [],
                startTime: '',//开始时间
                endTime: '',//截止时间
                pagenum: 1,
                pagecount: 10,
                totalpage: 10,//总页数
                totalNum: 0,//默认渲染条数
            };
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
                    'pagecount': '1000000'
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
                this.cityInitId = value;//更新

                this.hospitalid = '';

                this.getDeptList();
                // this.getHospitalList();
            },
            // 选择医院
            changeHospital: function (value) {
                this.departmentId = '';//科室ID
                this.doctorId = '';//医生ID
                this.allDeptValue = '';
                this.getDeptList();//更新科室
            },
            // 获取科室列表
            getDeptList: function () {
                const httpUrl = 'getDeptListByHospitalId';
                let httpParams = {
                    'hospitalId': this.hospitalid,//医院ID
                }
                this.$post(httpUrl, httpParams).then(response => {
                    this.deptList = response.departmentList[0].children;
                    this.getEvaluate();//获取订单统计列表
                    // this.getDoctorList();
                });
            },
            // 选择科室进行筛选， e是选中option的value值
            selectDept: function (e) {
                this.departmentId = e;//科室id赋值
                // this.getDoctorList();//重新获取医生列表
                this.getEvaluate();//获取订单统计列表
            },
            // 根据科室ID获取医生列表
            // getDoctorList : function(){
            //     if(this.hospitalid){
            //         const httpUrl = 'getDoctorListByDeptId';
            //         let  httpParams = {
            //             'hospitalId' : this.hospitalid,//医院ID
            //             'departmentId' : this.departmentId,//科室ID
            //             'pagenum' : 1,//分页显示的页码
            //             'pagecount' : 100000,//每页请求的数据条数
            //         };
            //         this.$post(httpUrl,httpParams).then(response => {
            //             if(response!=404){
            //                 this.getEvaluate();//更新列表
            //                 this.docList = response.doctorList;
            //                 if(this.docList.length>0){
            //                     this.showAll = true;
            //                 } else {
            //                     this.showAll = false;
            //                 }
            //             }
            //         });
            //     } else {
            //         this.docList = [];//医生列表
            //     }
            // },
            // 选择医生
            // selectDoctor : function(e){
            //     console.log('医生id==='+e)
            //     this.doctorId = e;//医生id赋值
            //     this.getEvaluate();//获取订单统计列表
            // },
            // 满意度列表
            getEvaluate: function () {
                this.showDisabled = true;
                this.showLoading = true;
                const httpUrl = 'getSatisfactionStatisticsList';
                let httpParams = {
                    'hospitalId': this.hospitalid,//医院ID **必传**
                    'departmentId': this.departmentId,//科室ID
                    'startTime': this.startTime,//预约时间段
                    'endTime': this.endTime,//预约时间段
                    'pagenum': this.pagenum,//分页显示的页码
                    'pagecount': this.pagecount,//每页请求的数据条数
                }
                this.$post(httpUrl, httpParams).then(response => {
                    this.dataEvaluateList = response.satisfactionList;
                    for (let i = 0; i < this.dataEvaluateList.length; i++) {
                        this.dataEvaluateList[i].scare = parseFloat(this.dataEvaluateList[i].scare * 100).toFixed(2) + '%';
                        this.dataEvaluateList[i].firstscare = parseFloat(this.dataEvaluateList[i].firstscare * 100).toFixed(2) + '%';
                        this.dataEvaluateList[i].secondscare = parseFloat(this.dataEvaluateList[i].secondscare * 100).toFixed(2) + '%';
                        this.dataEvaluateList[i].thirdscare = parseFloat(this.dataEvaluateList[i].thirdscare * 100).toFixed(2) + '%'
                    }
                    this.totalpage = (response.totalpage) * 10;//当前查询结果共多少页
                    this.totalNum = response.totalNum; //当前查询结果共多少条数据
                    this.showDisabled = false;
                    this.showLoading = false;
                });
            },
            // 选择日期 e返回所选时间，例：["2018-05-03", "2018-05-04"]
            selectDate: function (e) {
                this.startTime = e[0];//开始时间
                this.endTime = e[1];//截止时间
                this.getEvaluate();//获取订单统计列表
            },
            // 清空日期
            clearDate: function () {
                this.startTime = '';//开始时间
                this.endTime = '';//截止时间
                this.getEvaluate();//获取订单统计列表
            },
            // 分页
            changePage: function (e) {
                this.pagenum = e;//
            }
        },
        watch: {
            // 改变地址
            cityInitId() {
                this.getHospitalList();//获取医院列表
            },
            // 翻页
            pagenum() {
                this.getEvaluate();//获取照护统计列表
            },
            // 改变医院
            hospitalid() {
                this.getDeptList();//更新科室
                this.pagenum = 1;
                this.totalpage = 10;
            },
            // 改变科室
            departmentId() {
                this.getEvaluate();//获取订单统计列表
                this.pagenum = 1;
                this.totalpage = 10;
            },
            // 改变时间
            startTime() {
                this.pagenum = 1;
                this.totalpage = 10;
            },
            // 改变时间
            endTime() {
                this.pagenum = 1;
                this.totalpage = 10;
            }
        }
    }
</script>