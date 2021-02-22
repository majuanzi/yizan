<template>
    <div>

        <Card id="phy-scroller">
            <Card>
                <template>
                    <p  style="color:#333333;text-align:left">
                        <Icon type="information-circled"></Icon>
                        <span>信息查询</span>
                        <Icon style = "float: right;font-size: 22px" v-on:click=" $router.back(-1)" type="md-close" />
                    </p>
                </template>
            </Card>
            <div class="phy-bd">
                <div class="para-blk" id="para_0">
                    <div class="para-title">
                        <h2 class="title-text">基本信息</h2>
                    </div>
                    <div class="para-content">
                        <Row>
                            <Col span="8" v-for="item in phyList0" :key="item.keyname">
                                <dl class="para-info" v-if="!!phyBaseData[item.keyname]">
                                    <dt class="para-info-name" v-html="item.name"></dt>
                                    <dd class="para-info-value">{{phyBaseData[item.keyname]}}</dd>
                                </dl>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div class="para-blk" id="para_1">
                    <div class="para-title">
                        <h2 class="title-text">院内任职记录</h2>
                    </div>
                    <div class="para-content">
                        <Table :columns="columnOptions1" :data="phyList1" :loading="false"></Table>
                    </div>
                </div>
                <div class="para-blk" id="para_2">
                    <div class="para-title">
                        <h2 class="title-text">工作履历</h2>
                    </div>
                    <div class="para-content">
                        <Table :columns="columnOptions2" :data="phyList2" :loading="false"></Table>
                    </div>
                </div>
                <div class="para-blk" id="para_3">
                    <div class="para-title">
                        <h2 class="title-text">医疗事故</h2>
                    </div>
                    <div class="para-content">
                        <Table :columns="columnOptions3" :data="phyList3" :loading="false"></Table>
                    </div>
                </div>
                <div class="para-blk" id="para_4">
                    <div class="para-title">
                        <h2 class="title-text">处罚记录</h2>
                    </div>
                    <div class="para-content">
                        <Table :columns="columnOptions4" :data="phyList4" :loading="false"></Table>
                    </div>
                </div>
                <div class="para-blk" id="para_5">
                    <div class="para-title">
                        <h2 class="title-text">科研记录</h2>
                    </div>
                    <div class="para-content">
                        <Table :columns="columnOptions5" :data="phyList5" :loading="false"></Table>
                    </div>
                </div>
                <div class="para-blk" id="para_6">
                    <div class="para-title">
                        <h2 class="title-text">医师资格证</h2>
                    </div>
                    <div class="para-content">
                        <Table :columns="columnOptions6" :data="phyList6" :loading="false"></Table>
                    </div>
                </div>
                <div class="para-blk" id="para_7">
                    <div class="para-title">
                        <h2 class="title-text">奖励记录</h2>
                    </div>
                    <div class="para-content">
                        <ul class="reference-list">
                            <li class="reference-item" v-for="(r, i) in phyList7" :key="r.rid">
                                <span class="index">{{i + 1}}.</span>
                                <span>{{r.prizeLevel}}</span>
                                <span>{{r.prizeName}}</span>
                                <span v-if="r.prizeDate">. [{{r.prizeDate}}]</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="para-blk" id="para_8">
                    <div class="para-title">
                        <h2 class="title-text">论著发表</h2>
                    </div>
                    <div class="para-content">
                        <ul class="reference-list">
                            <li class="reference-item" v-for="(r, i) in phyList8" :key="r.rid">
                                <span class="index">{{i + 1}}.</span>
                                <span>{{r.treatiseName}}</span>
                                <span v-if="r.publishHouse">.{{r.publishHouse}}</span>
                                <span v-if="r.publishDate">[{{r.publishDate}}]</span>
                                <span>{{r.empXh}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="para-blk" id="para_9">
                    <div class="para-title">
                        <h2 class="title-text">患者满意度</h2>
                    </div>
                    <div class="para-content">
                        <Table :columns="columnOptions7" size = "small" :data="phyList9" :loading="false">
                            <template slot-scope="{ row, index }" slot="PatientSatisfaction-col">
                                <span v-if="phyList9[index].evalGrade" class="phy-row-num" @click="showTableChart(row.doctorId, row.evalMonth)">{{phyList9[index].evalGrade}}</span>
                                <span v-if="!phyList9[index].evalGrade">{{phyList9[index].evalGrade}}</span>
                            </template>
                        </Table>
                    </div>
                        <div class="para-content" style="margin-left:11px;margin-top: 20px;border:1px solid #D3D3D3">

                            <ve-line  :data="chartData"></ve-line>
                        </div>

                </div>

            </div>
        </Card>
        <Anchor ref="paraAnc" show-ink container=".single-page-con"
                style="position:fixed; right:30px; top: 30%;">
            <AnchorLink href="#para_0" title="1.基本信息" />
            <AnchorLink href="#para_1" title="2.院内任职记录" />
            <AnchorLink href="#para_2" title="3.工作履历" />
            <AnchorLink href="#para_3" title="4.医疗事故" />
            <AnchorLink href="#para_4" title="5.处罚记录" />
            <AnchorLink href="#para_5" title="6.科研记录" />
            <AnchorLink href="#para_6" title="7.医师资格证" />
            <AnchorLink href="#para_7" title="8.奖励记录" />
            <AnchorLink href="#para_8" title="9.论著发表" />
            <AnchorLink href="#para_9" title="10.患者满意度" />
        </Anchor>
        <Modal v-model="hideCheckModal" :width="720" :scrollable ="true">

            <p slot="header" style="color:#333333;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>查看详情</span>
            </p>
            <div class="para-content">
                <Table :columns="columnOptions8" :data="phyList10" :loading="false"></Table>
            </div>
            <div class="para-content">
            <ve-radar style="margin-top: 10px;margin-left: 150px" width="380px" height="380px" :data="chartData2"></ve-radar>
            </div>
            <div slot="footer">
                <i-button type="primary"  size="small" style="background: white;color:#333333;"
                          @click="saveModalData">取消</i-button>
                <i-button type="primary"  size="small"
                          @click="saveModalData">确定</i-button>
            </div>

        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                phyBaseData: {},
                phyList0: [
                    {
                        name: '姓&nbsp;&nbsp;&nbsp;&nbsp;名',
                        keyname: 'empName'
                    },
                    {
                        name: '性&nbsp;&nbsp;&nbsp;&nbsp;别',
                        keyname: 'empSexCn'
                    },
                    {
                        name: '出生日期',
                        keyname: 'empBirthday'
                    },
                    {
                        name: '身份证号',
                        keyname: 'idCode'
                    },
                    {
                        name: '员工类别',
                        keyname: 'empTypeName'
                    },
                    {
                        name: '员工编码',
                        keyname: 'empCode'
                    },
                    {
                        name: '单&nbsp;&nbsp;&nbsp;&nbsp;位',
                        keyname: 'compName'
                    },
                    {
                        name: '部&nbsp;&nbsp;&nbsp;&nbsp;门',
                        keyname: 'deptName'
                    },
                    {
                        name: '参加工作时间11111',
                        keyname: 'firstjobDay'
                    },
                    {
                        name: '进单位时间',
                        keyname: 'empInDay'
                    },
                    {
                        name: '用工形式',
                        keyname: 'employtypeName'
                    },
                    {
                        name: '岗位类别',
                        keyname: 'positionSeriesName'
                    },
                    {
                        name: '岗&nbsp;&nbsp;&nbsp;&nbsp;位',
                        keyname: 'positionName'
                    },
                    {
                        name: '岗位等级',
                        keyname: 'positionLevelName'
                    },
                    {
                        name: '卫生人员类别',
                        keyname: 'healthTypeName'
                    },
                    {
                        name: '员工状态',
                        keyname: 'empStatusName'
                    },
                    {
                        name: '在职状态',
                        keyname: 'activeStatusName'
                    },
                    {
                        name: '职&nbsp;&nbsp;&nbsp;&nbsp;称',
                        keyname: 'titleName'
                    },
                    {
                        name: '职称评聘时间',
                        keyname: 'titleDay'
                    },
                    {
                        name: '职&nbsp;&nbsp;&nbsp;&nbsp;务',
                        keyname: 'dutyName'
                    },
                    {
                        name: '职务等级',
                        keyname: 'gradeName'
                    },
                    {
                        name: '职务任职时间',
                        keyname: 'dutyDay'
                    },
                    {
                        name: '职员等级',
                        keyname: 'jobLevelName'
                    },
                    {
                        name: '民&nbsp;&nbsp;&nbsp;&nbsp;族',
                        keyname: 'peopleCn'
                    },
                    {
                        name: '政治面貌',
                        keyname: 'empPolName'
                    },
                    {
                        name: '参加时间',
                        keyname: 'empPolDay'
                    },
                    {
                        name: '是否外籍',
                        keyname: 'isForeign'
                    },
                    {
                        name: '特殊人才',
                        keyname: 'specialName'
                    },
                    {
                        name: '学&nbsp;&nbsp;&nbsp;&nbsp;位',
                        keyname: 'empDegreeName'
                    },
                    {
                        name: '毕业学校',
                        keyname: 'school'
                    },
                    {
                        name: '专&nbsp;&nbsp;&nbsp;&nbsp;业',
                        keyname: 'professionalCode'
                    },
                    {
                        name: '毕业时间',
                        keyname: 'graduateDay'
                    },
                    {
                        name: '第一学历',
                        keyname: 'firstEdu'
                    },
                    {
                        name: '毕业时间',
                        keyname: 'firstSchoolEnd'
                    },
                    {
                        name: '最高学历',
                        keyname: 'educationBgName'
                    },
                    {
                        name: '婚姻状况',
                        keyname: 'isMarriage'
                    },
                    {
                        name: '人员来源',
                        keyname: 'comefromName'
                    },
                    {
                        name: '移动电话',
                        keyname: 'mobilePhone'
                    },
                    {
                        name: '工作电话',
                        keyname: 'workPhone'
                    },
                    {
                        name: 'E-mail',
                        keyname: 'email'
                    },
                    {
                        name: '年&nbsp;&nbsp;&nbsp;&nbsp;龄',
                        keyname: 'nl'
                    },
                    {
                        name: '工&nbsp;&nbsp;&nbsp;&nbsp;龄',
                        keyname: 'workAge'
                    },
                    {
                        name: '院&nbsp;&nbsp;&nbsp;&nbsp;龄',
                        keyname: 'hospitalAge'
                    },
                    {
                        name: '户口性质',
                        keyname: 'regResidenceTypeName'
                    },
                    {
                        name: '邮&nbsp;&nbsp;&nbsp;&nbsp;编',
                        keyname: 'zipCode'
                    },
                    {
                        name: '家庭住址',
                        keyname: 'homeAddress'
                    },
                    {
                        name: '籍&nbsp;&nbsp;&nbsp;&nbsp;贯',
                        keyname: 'native'
                    },
                    {
                        name: '户籍地址',
                        keyname: 'nativeAddr'
                    }
                ],
                phyList1: [],
                columnOptions1: [
                    {
                        title: '流动类型',
                        align: 'center',
                        key: 'turnoverType'
                    },
                    {
                        title: '开始时间',
                        align: 'center',
                        key: 'dutyDay'
                    },
                    {
                        title: '结束时间',
                        align: 'center',
                        key: 'endDay'
                    },
                    {
                        title: '单位',
                        align: 'center',
                        key: 'cCompCode'
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'cDeptCode'
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        key: 'cPost'
                    },
                    {
                        title: '职务',
                        align: 'center',
                        key: 'cDutyCode'
                    },
                    {
                        title: '职级',
                        align: 'center',
                        key: 'cDutyLevel'
                    },
                    {
                        title: '职等',
                        align: 'center',
                        key: 'cLevel'
                    },
                    {
                        title: '流动原因',
                        align: 'center',
                        key: 'postReason'
                    }
                ],
                phyList2: [],
                columnOptions2: [
                    {
                        title: '开始时间',
                        align: 'center',
                        key: 'beginDate'
                    },
                    {
                        title: '结束时间',
                        align: 'center',
                        key: 'endDate'
                    },
                    {
                        title: '工作单位',
                        align: 'center',
                        key: 'workCompany'
                    },
                    {
                        title: '工作部门',
                        align: 'center',
                        key: 'workDept'
                    },
                    {
                        title: '担任职位',
                        align: 'center',
                        key: 'dutyName'
                    },
                    {
                        title: '技术职称',
                        align: 'center',
                        key: 'titleName'
                    },
                    {
                        title: '证明人',
                        align: 'center',
                        key: 'reference'
                    }
                ],
                phyList3: [],
                columnOptions3: [
                    {
                        title: '时间',
                        align: 'center',
                        key: 'troubleDate'
                    },
                    {
                        title: '事件名',
                        align: 'center',
                        key: 'troubleName'
                    },
                    {
                        title: '原由',
                        align: 'center',
                        key: 'troubleReason'
                    },
                    {
                        title: '事故级别',
                        align: 'center',
                        key: 'troubleLevel'
                    },
                    {
                        title: '定性',
                        align: 'center',
                        key: 'troubleAttr'
                    },
                    {
                        title: '过错参与度',
                        align: 'center',
                        key: 'particDegree'
                    },
                    {
                        title: '处分情况',
                        align: 'center',
                        key: 'punishSituation'
                    }
                ],
                phyList4: [],
                columnOptions4: [
                    {
                        title: '处罚时间',
                        align: 'center',
                        key: 'punishDate'
                    },
                    {
                        title: '处罚事由',
                        align: 'center',
                        key: 'punishReason'
                    },
                    {
                        title: '处罚程度',
                        align: 'center',
                        key: 'punishDegree'
                    }
                ],
                phyList5: [],
                columnOptions5: [
                    {
                        title: '课题名',
                        align: 'center',
                        key: 'projName'
                    },
                    {
                        title: '课题级别',
                        align: 'center',
                        key: 'projLevel'
                    },
                    {
                        title: '立项年度',
                        align: 'center',
                        key: 'projYear'
                    },
                    {
                        title: '作者排名',
                        align: 'center',
                        key: 'empXh'
                    },
                    {
                        title: '开始时间',
                        align: 'center',
                        key: 'beginDate'
                    },
                    {
                        title: '结束时间',
                        align: 'center',
                        key: 'endDate'
                    },
                    {
                        title: '科研经费',
                        align: 'center',
                        key: 'projMoney'
                    }
                ],
                phyList6: [],
                columnOptions6: [
                    {
                        title: '执业证编码',
                        align: 'center',
                        key: 'certCode'
                    },
                    {
                        title: '医师级别',
                        align: 'center',
                        key: 'doctorLevel'
                    },
                    {
                        title: '执业范围',
                        align: 'center',
                        key: 'certScrope'
                    },
                    {
                        title: '执业类别',
                        align: 'center',
                        key: 'certType'
                    },
                    {
                        title: '执业地点',
                        align: 'center',
                        key: 'certAddress'
                    },
                    {
                        title: '发证日',
                        align: 'center',
                        key: 'mpqcDate'
                    },
                    {
                        title: '有效期',
                        align: 'center',
                        key: 'endDate'
                    },
                    {
                        title: '发证机关',
                        align: 'center',
                        key: 'certCompany'
                    }
                ],
                columnOptions7: [
                    {
                        title: '年度',
                        align: 'center',
                        key: 'year'
                    },
                    {
                        title: '月份',
                        align: 'center',
                        key: 'month'
                    },
                    {
                        title: '患者评价',
                        align: 'center',
                        slot: 'PatientSatisfaction-col',
                    },
                    {
                        title: '全院排名',
                        align: 'center',
                        key: 'hospitalRank'
                    }
                ],
                columnOptions8: [
                    {
                        title: '日期',
                        align: 'center',
                        key: 'evalMonth'
                    },
                    {
                        title: '评价维度',
                        align: 'center',
                        key: 'dimenName'
                    },
                    {
                        title: '得分',
                        align: 'center',
                        key: 'evalGrade',

                    }
                ],
                chartData: {
                    columns: ['日期', '患者评价'],
                    rows: [
                    ]
                },
                chartData2: {
                    columns: ['日期', '患者评价'],
                    rows: [
                    ]
                },
                hideCheckModal:false,
                phyList7: [],
                phyList8: [],
                phyList9: [],
                phyList10: [],
                phyPlaceholder: '--'
            }
        },

        mounted() {
            const $paraAnc = this.$refs.paraAnc;
            $paraAnc.$children[0].$children.forEach((vc) => {
                vc.goAnchor = function() {};
            })
            this.$nextTick(() => {
                Array.from(document.querySelectorAll('.ivu-anchor-link-title')).forEach(a => {
                    a.onclick = (e) => {
                        e.preventDefault();
                        const href = e.target.getAttribute('data-href');
                        $paraAnc.currentLink = href;
                        $paraAnc.currentId = href.substring(1);
                        $paraAnc.handleScrollTo();
                    };
                })
            })
        },

        created() {
            this.getPhyDetail();    
        },

        methods: {
            setEmpPostList(data) {
                if( data.length ) {
                    data.forEach(d => {
                        d.turnoverType = d.turnoverType || this.phyPlaceholder;
                        d.dutyDay = d.dutyDay || this.phyPlaceholder;
                        d.endDay = d.endDay || this.phyPlaceholder;
                        d.cCompCode = d.cCompCode || this.phyPlaceholder;
                        d.cDeptCode = d.cDeptCode || this.phyPlaceholder;
                        d.cPost = d.cPost || this.phyPlaceholder;
                        d.cDutyCode = d.cDutyCode || this.phyPlaceholder;
                        d.cDutyLevel = d.cDutyLevel || this.phyPlaceholder;
                        d.cLevel = d.cLevel || this.phyPlaceholder;
                        d.postReason = d.postReason || this.phyPlaceholder;
                    })
                    return data;
                }
                return [];
            },

            setHrEmpWorkList(data) {
                if( data.length ) {
                    data.forEach(d => {
                        d.beginDate = d.beginDate || this.phyPlaceholder;
                        d.endDate = d.endDate || this.phyPlaceholder;
                        d.workCompany = d.workCompany || this.phyPlaceholder;
                        d.workDept = d.workDept || this.phyPlaceholder;
                        d.dutyName = d.dutyName || this.phyPlaceholder;
                        d.titleName = d.titleName || this.phyPlaceholder;
                        d.reference = d.reference || this.phyPlaceholder;
                    })
                    return data;
                }
                return [];
            },

            setHrEmpMediTroubleList(data) {
                if( data.length ) {
                    data.forEach(d => {
                        d.troubleDate = d.troubleDate || this.phyPlaceholder;
                        d.troubleName = d.troubleName || this.phyPlaceholder;
                        d.troubleReason = d.troubleReason || this.phyPlaceholder;
                        d.troubleLevel = d.troubleLevel || this.phyPlaceholder;
                        d.troubleAttr = d.troubleAttr || this.phyPlaceholder;
                        d.particDegree = d.particDegree || this.phyPlaceholder;
                        d.punishSituation = d.punishSituation || this.phyPlaceholder;
                    })
                    return data;
                }
                return [];
            },

            setHrEmpPunishList(data) {
                if( data.length ) {
                    data.forEach(d => {
                        d.punishDate = d.punishDate || this.phyPlaceholder;
                        d.punishReason = d.punishReason || this.phyPlaceholder;
                        d.punishDegree = d.punishDegree || this.phyPlaceholder;
                    })
                    return data;
                }
                return [];
            },

            setHrEmpStudyList(data) {
                if( data.length ) {
                    data.forEach(d => {
                        d.projName = d.projName || this.phyPlaceholder;
                        d.projLevel = d.projLevel || this.phyPlaceholder;
                        d.projYear = d.projYear || this.phyPlaceholder;
                        d.empXh = d.empXh || this.phyPlaceholder;
                        d.beginDate = d.beginDate || this.phyPlaceholder;
                        d.endDate = d.endDate || this.phyPlaceholder;
                        d.projMoney = d.projMoney || this.phyPlaceholder;
                    })
                    return data;
                }
                return [];
            },

            setHrEmpDoctorCertList(data) {
                if( data.length ) {
                    data.forEach(d => {
                        d.certCode = d.certCode || this.phyPlaceholder;
                        d.doctorLevel = d.doctorLevel || this.phyPlaceholder;
                        d.certScrope = d.certScrope || this.phyPlaceholder;
                        d.certType = d.certType || this.phyPlaceholder;
                        d.certAddress = d.certAddress || this.phyPlaceholder;
                        d.mpqcDate = d.mpqcDate || this.phyPlaceholder;
                        d.endDate = d.endDate || this.phyPlaceholder;
                        d.certCompany = d.certCompany || this.phyPlaceholder;
                    })
                    return data;
                }
                return [];
            },
            getPhyDetail() {

                const { dentityKey, hospitalCode, empCode } = this.$route.params;
                this.$httpPost('getHrDetail', null, {
                    params: {
                        dentityKey,
                        hospitalCode,
                        empCode
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        if( res.resultdata )
                        {
                            const ret = res.resultdata;
                            if(ret.emp.isForeign == 1){
                                ret.emp.isForeign = "是";
                            }else{
                                ret.emp.isForeign = "否"
                            }
                            this.phyBaseData = ret.emp;
                            this.phyList1 = this.setEmpPostList(ret.empPostList);
                            this.phyList2 = this.setHrEmpWorkList(ret.hrEmpWorkList);
                            this.phyList3 = this.setHrEmpMediTroubleList(ret.hrEmpMediTroubleList);
                            this.phyList4 = this.setHrEmpPunishList(ret.hrEmpPunishList);
                            this.phyList5 = this.setHrEmpStudyList(ret.hrEmpStudyList);
                            this.phyList6 = this.setHrEmpDoctorCertList(ret.hrEmpDoctorCertList);
                            this.phyList7 = ret.hrEmpPrizeList;
                            this.phyList8 = ret.hrEmpTreatiseList;
                            this.phyList9 = ret.doctorScoreList;
                             let chartData1 = {};
                            chartData1.columns = ['日期', '患者评价'];
                                chartData1.rows  = [];

                            for(let i = ret.doctorScoreList.length-1;i >= 0;i--){
                                let arrStr = {'日期':ret.doctorScoreList[i].evalMonth, '患者评价':ret.doctorScoreList[i].evalGrade};
                                chartData1.rows.push(arrStr);
                            }
                            this.chartData = chartData1;
                        }


                    }
                })  
            },
            showTableChart(doctorId,evalMonth){


                this.$httpPost('queryDimensionsScoreList', null, {
                    params: {
                        doctorId,
                        evalMonth
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        if( res.resultdata )
                        {
                            const ret = res.resultdata;
                             this.phyList10 = ret;
                            let chartData3 = {};
                            chartData3.columns = ['日期', '患者评价'];
                            chartData3.rows  = [];
                            for(let i = 0;i < ret.length;i++){
                                let arrStr = {'日期':ret[i].evalMonth, '患者评价':ret[i].evalGrade};
                                chartData3.rows.push(arrStr);
                            }

                            this.chartData2 = chartData3;


                        }
                        this.hideCheckModal = true;
                    }
                })

            },
            saveModalData(){
                this.hideCheckModal = false;
            },
            back(){
                $router.back(-1);//返回上一层
            },
           
        }
    }
</script>

<style lang="less" scoped>
    .phy-lab {
        margin-right: 8px;
    }
    .phy-bd {
        padding: 0 0 10px;
        margin-right: 160px;

        .para-blk {
            margin-bottom: 30px;
        }
        .phy-row-num {
            padding: 4px 8px;
            color: #34A9FF;
            text-decoration: underline;
            cursor: pointer;
        }
        .para-title {
            display: block;
            clear: both;
            zoom: 1;
            overflow: hidden;
            font-size: 20px;
            border-left: 8px solid #4F9CEE;
            line-height: 20px;
            font-size: 22px;
            font-weight: 400;
            font-family: Microsoft YaHei,SimHei,Verdana;
            margin: 45px 0 20px -16px;
            background: url(https://bkssl.bdimg.com/static/wiki-lemma/normal/resource/img/paraTitle-line_743dba1.png);
            position: relative;

            .title-text {
                float: left;
                display: block;
                padding: 0 8px 0 18px;
                line-height: 20px;
                font-size: 16px;
                font-weight: 400;
                background: #fff;
            }
        }

        .para-content {
            padding-left: 12px;

            .para-info {
                width: 100%;
                float: left;
                border-bottom: 1px dotted #ccc;

                .para-info-name {
                    width: 90px;
                    padding: 0 5px 0 12px;
                    font-weight: 700;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                    color: #999;
                }

                .para-info-value {
                    float: left;
                    position: relative;
                    word-break: break-all;
                    color: #333;
                }

                .para-info-name,
                .para-info-value {
                    line-height: 26px;
                    display: block;
                    float: left;
                    font-size: 14px;
                }
            }

            .reference-list {
                padding: 0;
                margin: 0;
                list-style: none;

                .reference-item {
                    color: #aaa;
                    line-height: 20px;
                    margin-top: 9px;
                    width: 100%;
                    font-size: 14px;

                    .index {
                        color: #666;
                        float: left;
                        margin-right: 4px;
                    }
                }
            }

        }

    }
</style>