<template>
    <div>
        <Card class="phy-blk">
            <div class="phy-hd">
                <h3 class="phy-count-title">平台拥有医生总人数</h3>
            </div>
                <br/>
            <div class="phy-count-num">
                <span style="font-size: 50px">{{totalNum}} <span style="font-size: 18px">    人</span></span>
            </div>
            <div class="phy-bd">
                <div id="myChartChina" >
                </div>
                <div class="common_diseases"  v-if="top10List.length">
                    <Table rules= none class="small-table" size = "small" style="border:0"
                           :columns="columnOptions1" :data="top10List"
                    >
                        <template slot-scope="{ row, index }" slot="city-col">
                            <span v-if="top10List[index].provCode" class="phy-row-num" @click="showCityDetail(top10List[index])">{{top10List[index].name}}</span>
                            <span  v-else class="phy-row-nums">{{top10List[index].name}}</span>
                        </template>
                    </Table>
                    <div>
                        <Button v-if="top10List.length >= 10" style="width: 20vw" @click="toLookMoreDetail()"> . . . </Button>
                    </div>
                </div>
            </div>
            <modal v-model="modalMapSetting" title="医师资源详情" @on-cancel="cancel" fullscreen class="addSettingModal">
                <Card :bordered="false">
                    <div class="title-bar">
                        <div class="input-box">
                            <p>所在地区：</p>
                            <el-select v-model="citySelect" filterable @change="getAllHospitalList()">
                                <el-option  key="0" value="0" label="全部省市">全部省市</el-option>
                                <el-option v-for="opt in cityList" :label="opt.regionname" :value="opt.regioncode" :key="opt.regioncode"></el-option>
                            </el-select>
                        </div>
                        <div class="input-box">
                            <p>医院等级：</p>
                            <el-select v-model="levelSelect" @change="getAllHospitalList()">
                                <el-option value="0" key="0" label="全部等级">全部等级</el-option>
                                <el-option v-for="opt in hospitalEvel" :label="opt.levelname" :value="opt.levelcode" :key="opt.levelcode"></el-option>
                            </el-select>
                        </div>
                        <div class="input-box">
                            <p>医院名称：</p>
                            <el-select v-model="hospitalSelect" :filterable="true">
                                <el-option v-for="opt in hospitalList" :label="opt.hospitalName" :value="opt.rid" :key="opt.rid"></el-option>
                            </el-select>
                        </div>
                        <div class="btn-box">
                            <Button type="primary" @click="getSearchList" size="large">查询</Button>
                        </div>
                        <div class=" both" style="clear:both"></div>
                    </div>

                    <vh-search-body
                            :showHeader="false"
                            :total="pageTotal"
                            :current.sync="pageCurrent"
                            @on-change="handleChange"
                            @on-size="handleSizeChange">
                        <template v-slot:table>
                            <Table :columns="columnOptions" :data="phyList" :border="true">
                                <template slot-scope="{ row, index }" slot="hospitalName-col">
                                    <span v-if="phyList[index].hospitalName">{{phyList[index].hospitalName}}</span>
                                    <span v-if="!phyList[index].hospitalName">未知医院</span>
                                </template>

                                <template slot-scope="{ row, index }" slot="doctorNum-col">
                                    <span v-if="phyList[index].doctorNum" class="phy-row-num" @click="showPhyDetail(phyList[index], '1')">{{phyList[index].doctorNum}}</span>
                                    <span v-if="!phyList[index].doctorNum">0</span>
                                </template>
                                <template slot-scope="{ row, index }" slot="nurseNum-col">
                                    <span v-if="phyList[index].nurseNum" class="phy-row-num" @click="showPhyDetail(phyList[index], '2')">{{phyList[index].nurseNum}}</span>
                                    <span v-if="!phyList[index].nurseNum">0</span>
                                </template>
                                <template slot-scope="{ row, index }" slot="otherNum-col">
                                    <span v-if="phyList[index].otherNum" class="phy-row-num" @click="showPhyDetail(phyList[index], '3')">{{phyList[index].otherNum}}</span>
                                    <span v-if="!phyList[index].otherNum">0</span>
                                </template>
                            </Table>
                        </template>
                    </vh-search-body>

                    <Modal v-model="phyModal" :width="960" :title="phyModalTitle" :mask-closable="false" :footer-hide="true">
                        <Row style="padding-bottom: 30px;">
                            <Col span="12">
                            <Table :columns="comcolumnOptions" :data="composeList" :max-height="232"></Table>
                            </Col>
                            <Col span="12">
                            <ve-pie width="460px" height="240px" :tooltip="tooltipData" :legend="legendData" :series="pieData"></ve-pie>
                            </Col>
                        </Row>
                    </Modal>
                </Card>
            </modal>

        </Card>
    </div>
</template>

<script>
    import 'echarts/map/js/china';
    import vhFormGroup from '../components/vh-form-group';
    import vhSearchHeader from '../components/vh-search-header';
    import vhSearchBody from '../components/vh-search-body';
    export default {
        components: {
            vhFormGroup,
            vhSearchHeader,
            vhSearchBody
        },
        data() {
            return {
                modalMapSetting: false,
                totalNum: 0,
                top10List: [],
                mapData: [],
                prCode:["110000","120000","130000","140000","150000","210000","220000","230000","310000","320000",
                    "330000","340000","350000","360000","370000","410000","420000","430000","440000","450000","460000",
                    "500000","510000","520000","530000","540000","610000","620000","630000","640000","650000","710000",
                    "810000","820000"
                ],
                prName:["北京","天津","河北","山西","内蒙古","辽宁","吉林","黑龙江","上海","江苏",
                    "浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","广西","海南",
                    "重庆","四川","贵州","云南","西藏","陕西","甘肃","青海","宁夏","新疆",
                    "台湾","香港","澳门"],
                code:'',
                columnOptions1: [
                    {
                        title: ' ',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '省市',
                        slot: 'city-col'
                    },
                    {
                        title: '医生数量',
                        align: 'center',
                        key: 'value'
                    }
                ],
                eventsData: {
                    click: (d) => {

                        if( d.data && d.data.code ) {
                            this.code = d.data.code;
                            this.$router.push({ path: `/physician-resource-list/${d.data.code}/` });
                        }   
                    }
                },
                seriesData: [{
                    type: 'map',
                    map: 'china',
                    selectedMode: 'single',
                    label: {
                        show: true
                    },
                    itemStyle:{
                        areaColor: '#99B7EC'
                    },
                    emphasis: {
                        label: {
                            color: '#000'
                        },
                        itemStyle: {
                            areaColor: '#99B7EC'
                        }
                        
                    },
                    top: '10px',
                    left: '10px',
                    data: []
                }],

                //
                pageTotal: 0,
                pageCurrent: 1,
                pageSize: 10,
                citySelect: '0',
                cityList: [],
                levelSelect: '',
                hospitalEvel: [],
                hospitalName: '',
                hospitalSelect: '',
                hospitalList: [],
                phyList: [],
                columnOptions: [
                    {
                        title: '序号',
                        width: 65,
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.index + (this.pageCurrent - 1) * this.pageSize + 1);
                        }
                    },
                    {
                        title: '医院名称',
                        width: 300,
                        slot: 'hospitalName-col'
                    },
                    {
                        title: '职工人数（人）',
                        align: 'center',
                        key: 'totalNum'
                    },
                    {
                        title: '医生人数（人）',
                        align: 'center',
                        slot: 'doctorNum-col'
                    },
                    {
                        title: '护士人数（人）',
                        align: 'center',
                        slot: 'nurseNum-col'
                    },
                    {
                        title: '其他人数（人）',
                        align: 'center',
                        slot: 'otherNum-col'
                    }
                ],
                phyModal: false,
                phyModalTitle: '',
                phyTypeEm: {
                    '1': '医生',
                    '2': '护士',
                    '3': '其他人员'
                },
                composeList: [],
                comcolumnOptions: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 65,
                        align: 'center',
                    },
                    {
                        title: '职称',
                        align: 'center',
                        key: 'titleName'
                    },
                    {
                        title: '人数（人）',
                        align: 'center',
                        key: 'num'
                    },
                    {
                        title: '占比（%）',
                        align: 'center',
                        key: 'numRatio'
                    },
                ],
                legendData: {
                    type: 'scroll',
                    top: 0,
                    left: '20%',
                    right: '20%',
                    data: []
                },
                tooltipData: {
                    formatter: function(data) {
                        return data.data.ratio + '%';
                    }
                },
                pieData: [
                    {
                        type: 'pie',
                        radius : '65%',
                        center: ['50%', '55%'],
                        data: []
                    }
                ],
            }
        },

        created() {
            this.getPhyCount();

        },
        mounted() {
           this.drawLine();
        },
        methods: {

            drawLine(){

                let myChartContainer = document.getElementById('myChartChina');
                let resizeMyChartContainer = function(){
                     // myChartContainer.style.width= 1050+'px'//页面一半的大小
                    // myChartContainer.style.width = ( window.innerWidth - 300 ) + 'px';
                   // myChartContainer.style.width= (document.body.offsetWidth)+'px'//页面一半的大小
                    myChartContainer.style.width=(document.body.clientWidth-800)+'px'
                    myChartContainer.style.height =(document.body.offsetWidth/3)+'px'//页面一半的大小
                }
                resizeMyChartContainer();
                let myChartChina = this.$echarts.init(myChartContainer);
                const option = {
                    tooltip: {
                        show: true,
                        formatter: function(params) {
                            if (params.data) {
                                return `${params.name}：${params.value}人</br>`
                            } else {
                                return;
                            }
                        }
                    },
                    visualMap: {
                        type: "continuous",
                        text: ["1000", "<10"],
                        showLabel: true,
                        orient: 'horizontal',
                        seriesIndex: [0],
                        min: 0,
                        // calculable: true,
                        max: this.mapData[0].value,
                        inRange: {
                            color: ['#b3ccf7', '#144db5']
                        },
                        textStyle: {
                            color: "#000"
                        },
                        bottom: '0',
                        width:100,
                        left: 80
                    },
                    geo: {
                        roam: false,
                        map: "china",
                        layoutCenter: ["50%", "50%"],
                        layoutSize: "100%",
                        provName: {
                            emphasis: {
                                show: false
                            }
                        },
                        scaleLimit: {
                            min: 1.3,
                            max: 1.3,
                        },
                        itemStyle: {
                            normal:{
                                borderColor:'#ffffff',
                                borderWidth:2,
                                areaColor: '#B3CCF7',
                            },
                            emphasis: {
                                areaColor: "#FD747B",

                            }
                        },
                    },
                    series: [{
                        name: "mapSer",
                        type: "map",
                        roam: false,
                        geoIndex: 0,
                        label: {
                            show: false
                        },
                        data: this.mapData
                    }, ]
                };

                myChartChina.setOption(option);
                window.onresize=function(){
                    resizeMyChartContainer();
                    myChartChina.resize();
                };
                let self = this;
                myChartChina.on('click', function (params) {
           debugger
                    let data = params.data;
                    if(data.provCode){
                        self.getAllRegionList(data).then(() => {
                            self.getPhyList();
                            self.getAllHospitalList();
                        })
                        self.getHospitalLevelList();
                        self.modalMapSetting = true;
                    }


                    // self.$router.push({ path: `/physician-resource-list/${params.data.provCode}/` });


                        });
            },
            toLookMoreDetail(){
               let data= {name:"全国",value:0};
                this.getAllRegionList(data).then(() => {
                    this.getPhyList();
                    this.getAllHospitalList();
                })
                this.getHospitalLevelList();
                this.modalMapSetting = true;
                // this.$router.push({ path: `/physician-resource-list/${"全国"}/` });

            },
            // 处理数据
            setSeriesData(data) {
                let ret = [];
                let colorArr  = ['#FF4081', '#FF80AB', '#FF6D00', '#FB8C00','#F50057','#FFB6C1','#FF00FF', '#DC143C', '#FFF0F5', '#DB7093',
                    '#FF69B4', '#FF1493', '#C71585', '#DA70D6','#D8BFD8','#DDA0DD','#EE82EE', '#8B008B', '#800080', '#BA55D3',
                    '#9400D3', '#9932CC', '#4B0082', '#8A2BE2','#9370DB','#7B68EE','#6A5ACD', '#483D8B', '#E6E6FA', '#F8F8FF',
                    '#0000FF', '#0000CD', '#191970', '#000080','#4169E1'
                ];
                if( data.length ) {

                    data.forEach(function(value, index){
                        ret.push({
                            name: value.provName,
                            value: value.empNum,
                            code: value.provCode,

                            itemStyle: {
                                areaColor:colorArr[index]

                            }
                        })
                    });
                }
                return ret;
            },
            // 获取地区医生总数
            getPhyCount() {
                this.$httpPost('queryHrDoctorStatistics').then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        if( res.resultdata ) {
                            const ret = res.resultdata;
                            const data = ret.areaHospitalList;
                            this.totalNum = this.format(ret.doctorNum);

                            // this.top10List = data.length > 10 ? data.slice(0,10) : data;
                            // this.top10List = data;

                            this.seriesData[0].data = this.setSeriesData(data);
                            if(data.length){
                                for(let i = 0;i<data.length;i++)
                                {
                                    let tempMap = {};
                                    tempMap.provCode = data[i].provCode;
                                    if(tempMap.provCode){
                                        for (let j = 0; j < this.prCode.length; j++) {
                                            if(this.prCode[j]== data[i].provCode){
                                                tempMap.name = this.prName[j];
                                            }
                                        }
                                    }else {
                                        tempMap.name = "未知"

                                    }
                                    tempMap.value = data[i].empNum;

                                    this.mapData.push(tempMap);
                                }


                                this.drawLine();
                            }

                            this.top10List = this.mapData.length > 10 ? this.mapData.slice(0,10) : this.mapData;
                          for(let i=0;i<this.top10List.length;i++)
                          {
                                this.top10List[i].value = this.format(this.top10List[i].value);
                            }

                        }

                    }
                })  
            },
            format (num) {
           let reg=/\d{1,3}(?=(\d{3})+$)/g;
             return (num + '').replace(reg, '$&,');
             },
            showCityDetail(data) {

                this.getAllRegionList(data).then(() => {
                    this.getPhyList();
                    this.getAllHospitalList();
                })
                this.getHospitalLevelList();
                this.modalMapSetting = true;
                // this.$router.push({ path: `/physician-resource-list/${data.provCode}/` });
            },

            // 获取医院列表
            getAllHospitalList() {
                return this.$httpPost('queryHrHospitalList', null, {
                    params: {
                        prov: this.citySelect == '0' ? '' : this.citySelect,
                        hospLevelCode: this.levelSelect == '0' ? '' : this.levelSelect
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        this.hospitalList = res.resultdata;
                        this.hospitalSelect = '';
                        //this.hospitalSelect = this.hospitalList[0].rid;
                    }
                })
            },
            // 获取城市地址
            getAllRegionList: function(data) {
                return this.$httpPost('getAllRegionList').then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        const rid = data.provCode;
                        this.cityList = res.regionList;
                        this.citySelect = this.cityList.findIndex(c => c.regioncode === rid) > -1 ? rid : '0';
                    }
                })
            },
            // 获取等级
            getHospitalLevelList() {
                this.$httpPost('getHospitalLevelList').then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        this.hospitalEvel = res.levelList;
                    }
                })
            },
            // 设置职工总数
            setPhyList(data) {
                if(data.length) {
                    data.forEach(d => {
                        d.totalNum = d.doctorNum + d.nurseNum + d.otherNum;
                    })
                    return data;
                }
                return [];
            },
            // 获取医院职工数列表
            getPhyList() {
                this.$httpPost('queryHrProvDoctorStatistics', null, {
                    params: {
                        startpos:  this.pageCurrent,
                        pagecount: this.pageSize,
                        prov: this.citySelect == '0' ? '' : this.citySelect,
                        hospLevelCode: this.levelSelect == '0' ? '' : this.levelSelect,
                        rid: this.hospitalSelect
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        if( res.resultdata ) {
                            this.phyList = this.setPhyList(res.resultdata);
                            this.pageTotal = res.resultCount;
                        }
                    }
                })
            },
            // 处理数据
            setPhyRateData(data, total) {
                this.pieData[0].data = [];
                this.legendData.data = [];
                if( data.length ) {
                    data.forEach(d => {
                        d.numRatio = !total ? 0 : ((d.num / total) * 100).toFixed(1);
                        this.pieData[0].data.push({
                            name: d.titleName,
                            value: d.num,
                            ratio: d.numRatio
                        })
                        this.legendData.data.push(d.titleName);

                    });
                    return data;
                }
                return [];
            },
            // 获取医院人员占比
            // 1-医生 2-护士 3-其他
            getPhyRate({rid, dentityKey, hospitalCode, titleType, doctorNum, nurseNum, otherNum}) {
                this.$httpPost('queryHrDoctorTypeStatistics', null, {
                    params: {
                        rid,
                        dentityKey,
                        hospitalCode,
                        titleType,
                        startpos: 0,
                        pagecount: 1000
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        if( res.resultdata ) {
                            this.composeList = this.setPhyRateData(res.resultdata, titleType == '1' ? doctorNum : titleType == '2' ? nurseNum : otherNum );
                        }
                        this.phyModal = true;
                    }
                })
            },
            // 查看详情
            showPhyDetail(data, type) {
                this.phyModalTitle = `${this.phyTypeEm[type]}构成情况`;
                this.getPhyRate( Object.assign({}, data, { titleType: type }) );
            },
            // 当前页数改变
            handleChange(n) {
                this.pageCurrent = n;
                this.getPhyList();
            },
            // 每页显示条数改变
            handleSizeChange(size) {
                this.pageSize = size;
                //
                this.pageCurrent = 1;
                this.getPhyList();
            },
            getSearchList() {
                this.pageCurrent = 1;
                this.getPhyList();
            },
            cancel () {
                this.hospitalSelect = '';
                this.levelSelect =  '';
            },

        }
    }
</script>

<style lang="less" scoped>
    .phy-row-num {
        padding: 4px 8px;
        color: #34A9FF;
        text-decoration: underline;
        cursor: pointer;
    }
    .phy-row-nums {
        padding: 4px 8px;
        color: #34A9FF;
        cursor: pointer;
    }
    .phy-blk {
        background-color: #ffffff;
    }
    /*.phy-map{*/
        /*width: 1200px;*/
        /*height: 1200px;*/
    /*}*/
    .phy-hd {
        width: 360px;
        padding-top: 0px;

        .phy-count-title {
            font-size: 16px;
            color: #000000;
            font-weight: 500;
            margin-bottom:0px;
        }

    }
    .phy-count-num {
        height: 34px;
        line-height: 34px;
        background-color: #ffffff;

        span {
            margin-left: 0px;
            color: #1890ff;
            font-size: 26px;
            font-weight: 400;
        }
    }
    .common_diseases{
        width:20vw;
        height:auto;
        min-height: 40vh;
        position:absolute;
        right:2%;
        top:14%;
        padding:2vh 0;
        h3{
            color:#ffb74d;
            font-weight:normal;
            font-size:24px;
            margin:1vh 2vh;
            padding-bottom:1.5vh;
        }
        .diseases_title{
            width:100%;
            height:5vh;
            span{
                font-size:14px;
                color:#fff;
                &:first-child{
                    float:left;
                    padding-left:3vh;
                }
                &:last-child{
                    float:right;
                    padding-right:3vh;
                }
            }
        }
        ul{
            margin:0;
            padding:0;
            li{
                margin:0;
                list-style:none;
                height:3vh;
                line-height:3vh;
                padding:0 2vh;
                i{
                    width:0.5vh;
                    height:0.5vh;
                    border-radius:0.5vh;
                    display:inline-block;
                    float:left;
                    background:#fff;
                    margin-top:1.5vh;
                    margin-right:0.5vh;
                }
                span{
                    font-size:14px;
                    color:#fff;
                    &:first-child{
                        float:left;
                        padding-left:1vh;
                    }
                    &:last-child{
                        float:right;
                        padding-right:1vh;
                        color:#01E0D1;
                    }
                }
                /*&:hover{
                  background-image: linear-gradient(-270deg, rgba(4,157,152,0.5) 0%, rgba(4,157,152,0.3) 100%) !important;
                }*/
            }
        }
    }
    small-table.ivu-table-header :before{
        background-color: #212c31;
        border: none;
    }
</style>