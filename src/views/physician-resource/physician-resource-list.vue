<template>
    <div @on-search="getPhyList">
        <Card :bordered="false">
            <div class="title-bar">
                <div class="input-box">
                    <p>所在地区：</p>
                    <el-select v-model="citySelect" filterable @change="getAllHospitalList()">
                            <el-option value="0" key="全部城市">全部城市</el-option>
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
                    <Button type="primary" @click="getPhyList" size="large">查询</Button>
                </div>
                <div class=" both" style="clear:both"></div>
            </div>

            <vh-search-body 
            :showHeader="false" 
            :total="pageTotal" 
            @on-change="handleChange"
            @on-size="handleSizeChange">
                <template v-slot:table>
                    <Table :columns="columnOptions" :data="phyList" :border="true">
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
    </div>
</template>

<script>
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
                        type: 'index',
                        width: 65,
                        align: 'center',
                    },
                    {
                        title: '医院名称',
                        width: 300,
                        key: 'hospitalName'
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
            this.getAllRegionList().then(() => {
                this.getPhyList();
                this.getAllHospitalList();
            })
            this.getHospitalLevelList();
        },

        methods: {

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
            getAllRegionList: function() {
                return this.$httpPost('getAllRegionList').then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        const rid = this.$route.params.id;

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
                        startpos: this.pageCurrent - 1,
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
            }
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
</style>