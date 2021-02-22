<template>
    <div @on-search="getSearchPhyList">
        <Card :bordered="false">
            <div class="title-bar">
                <div class="input-box">
                    <p>医院名称：</p>
                    <el-select v-model="hospitalSelect" :filterable="true" style="width: 200px">
                        <el-option v-for="opt in hospitalList" :label="opt.hospitalName" :value="opt.rid"
                            :key="opt.rid"></el-option>
                    </el-select>
                </div>
                <div class="input-box">
                    <p>人员类别：</p>
                    <el-select v-model="phySelect" @change="handlePhySelect" style="width: 200px">
                        <el-option v-for="opt in phySelectList" :label="opt.name" :value="opt.code" :key="opt.code">
                        </el-option>
                    </el-select>
                </div>
                <div class="input-box">
                    <p>职称名称：</p>
                    <el-select v-model="titleSelect" style="width: 200px">
                        <el-option label="全部" value="0" key="全部职称"></el-option>
                        <el-option v-for="opt in titleList" :value="opt.titleCode" :key="opt.titleCode"
                            :label="opt.titleName"></el-option>
                    </el-select>
                </div>

                <div class="input-box">
                    <p>医师姓名：</p>
                    <el-input style="width: 200px" placeholder="请输入医师姓名" v-model="phyname" clearable>
                    </el-input>
                </div>
                <div class="btn-box">
                    <Button type="primary" @click="getSearchPhyList" size="large">查询</Button>
                </div>
                <div class=" both" style="clear:both"></div>
            </div>

            <vh-search-body :showHeader="false" :total="pageTotal" @on-change="handleChange" :current.sync="pageCurrent"
                @on-size="handleSizeChange">
                <template v-slot:table>
                    <Table :columns="columnOptions" :data="phyList" :border="true">
                        <template slot-scope="{ row, index }" slot="opt-col">
                            <!--<Button type="primary" size="small" @click="toDetail(phyList[index])">查看</Button>-->
                            <p class="btn-text" @click="toDetail(phyList[index])">查看</p>
                        </template>
                    </Table>
                </template>
            </vh-search-body>
        </Card>
        <Modal v-model="physicianModel" fullscreen title="信息查询" class="physicianInfo" @on-ok="saveModalData2">
            <Card id="phy-scroller">
                <div>
                    <Icon style="font-size: 72px;float: left" type="ios-contact" />
                    <div style="float: left">
                        <p style="margin-top: 10px;color: #000000;font-size: 20px">{{empName}} {{empCode}}</p>
                        <span style="float: left;color: rgba(0,0,0,0.45);margin-top: 5px">{{empSexCn}}</span>
                        <span style="float:left;width: 2px;height: 20px;
                        background: darkgray;margin-left: 10px;margin-right: 5px;margin-top: 5px"></span>
                        <span style="float: left;color: rgba(0,0,0,0.45);margin-top: 5px">{{empBirthday}}</span>
                        <span style="float:left;width: 2px;height: 20px;
                        background: darkgray;margin-left: 10px;margin-right: 5px;margin-top: 5px"></span>
                        <span style="float: left;color: rgba(0,0,0,0.45);margin-top: 5px">{{idCode}}</span>

                    </div>
                    <div style="float:right;">
                        <div style="float:right;">
                            <p style="color: rgba(0,0,0,0.45);margin-top: 10px">是否外籍</p>
                            <p style="font-size: 24px;color:#000000;text-align: left">{{isForeign}}</p>
                        </div>
                        <span style="float:right;width: 2px;height: 30px;
                        background: darkgray;margin-top: 25px;margin-right: 20px;margin-left: 15px"></span>
                        <div style="float:right;">
                            <p style="color: rgba(0,0,0,0.45);margin-top: 10px">在职状态</p>
                            <p v-if="activeStatusName" style="font-size: 24px;color:#000000;text-align: left">
                                {{activeStatusName}}</p>
                            <p v-else style="font-size: 24px;color:#000000;text-align: left">在岗</p>

                        </div>
                        <span style="float:right;width: 2px;height: 30px;
                        background: darkgray;margin-top: 25px;margin-right: 20px;margin-left: 15px"></span>
                        <div style="float:right;">
                            <p style="color: rgba(0,0,0,0.45);margin-top: 10px">用工形式</p>
                            <p v-if="employtypeName" style="font-size: 24px;color:#000000;text-align: left">
                                {{employtypeName}}</p>
                            <p v-else style="font-size: 24px;color:#000000;text-align: left">在编</p>
                        </div>
                    </div>
                </div>
                <divider></divider>
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
                            <Table :columns="columnOptions9" :data="phyList11" :loading="false"></Table>
                            <!--<ul class="reference-list">-->
                            <!--<li class="reference-item" v-for="(r, i) in phyList7" :key="r.rid">-->
                            <!--<span class="index">{{i + 1}}.</span>-->
                            <!--<span>{{r.prizeLevel}}</span>-->
                            <!--<span>{{r.prizeName}}</span>-->
                            <!--<span v-if="r.prizeDate">. [{{r.prizeDate}}]</span>-->
                            <!--</li>-->
                            <!--</ul>-->
                        </div>
                    </div>
                    <div class="para-blk" id="para_8">
                        <div class="para-title">
                            <h2 class="title-text">论著发表</h2>
                        </div>
                        <div class="para-content">
                            <Table :columns="columnOptions10" :data="phyList12" :loading="false"></Table>
                            <!--<ul class="reference-list">-->
                            <!--<li class="reference-item" v-for="(r, i) in phyList8" :key="r.rid">-->
                            <!--<span class="index">{{i + 1}}.</span>-->
                            <!--<span>{{r.treatiseName}}</span>-->
                            <!--<span v-if="r.publishHouse">.{{r.publishHouse}}</span>-->
                            <!--<span v-if="r.publishDate">[{{r.publishDate}}]</span>-->
                            <!--<span>{{r.empXh}}</span>-->
                            <!--</li>-->
                            <!--</ul>-->
                        </div>
                    </div>
                    <div class="para-blk" id="para_9">
                        <div class="para-title">
                            <h2 class="title-text">患者满意度</h2>
                        </div>
                        <div class="para-content">
                            <Table :columns="columnOptions7" size="small" :data="phyList9" :loading="false">
                                <template slot-scope="{ row, index }" slot="PatientSatisfaction-col">
                                    <span v-if="phyList9[index].evalGrade" class="phy-row-num"
                                        @click="showTableChart(row.doctorId, row.evalMonth)">{{phyList9[index].evalGrade}}</span>
                                    <span v-if="!phyList9[index].evalGrade">{{phyList9[index].evalGrade}}</span>
                                </template>
                            </Table>
                        </div>
                        <div class="para-content" style="margin-left:11px;margin-top: 20px;border:1px solid #D3D3D3">

                            <ve-line :legend-visible="false" style="margin-top: 10px;margin-left: 10px" width="980px"
                                height="380px" :data="chartData"></ve-line>
                            <p style="text-align: center;margin-top: -30px;color:#000000">患者评价</p>
                        </div>

                    </div>

                </div>
            </Card>
            <Anchor ref="paraAnc" show-ink container=".ivu-modal-body" style="position:fixed; right:50px; top: 30%;">
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
        </Modal>
        <Modal v-model="hideCheckModal" :width="720" :scrollable="true">

            <p slot="header" style="color:#333333;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>查看详情</span>
            </p>
            <div class="para-content">
                <Table :columns="columnOptions8" :data="phyList10" :loading="false"></Table>
            </div>
            <div class="para-content">
                <ve-radar style="margin-top: 10px;margin-left: 150px" width="380px" height="380px" :data="chartData2">
                </ve-radar>
            </div>
            <div slot="footer">
                <i-button type="primary" size="small" style="background: white;color:#333333;" @click="saveModalData">取消
                </i-button>
                <i-button type="primary" size="small" @click="saveModalData">确定</i-button>
            </div>

        </Modal>

    </div>
</template>

<script>
    import vhFormGroup from '../components/vh-form-group';
    import vhSearchHeader from '../components/vh-search-header';
    import vhSearchBody from '../components/vh-search-body';
    import Divider from "iview/src/components/divider/divider";
    export default {
        components: {
            Divider,
            vhFormGroup,
            vhSearchHeader,
            vhSearchBody
        },

        data() {
            return {
                pageTotal: 0,
                pageCurrent: 1,
                pageSize: 10,
                activeStatusName: '',// 在职状态
                hospitalSelect: '',
                hospitalList: [],
                phySelect: '1',  //0-全部 1-医生 2-护士 3-其他
                phySelectList: [
                    {
                        name: '全部',
                        code: '0'
                    },
                    {
                        name: '医生',
                        code: '1'
                    },
                    {
                        name: '护士',
                        code: '2'
                    },
                    {
                        name: '其他',
                        code: '3'
                    }
                ],
                titleSelect: '0',
                titleList: [],
                phyname: '',
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
                        title: '姓名',
                        key: 'empName'
                    },
                    {
                        title: '性别',
                        align: 'center',
                        key: 'sex'
                    },
                    {
                        title: '单位',
                        width: 300,
                        key: 'hospitalName'
                    },
                    {
                        title: '部门',
                        key: 'deptName'
                    },
                    {
                        title: '职称',
                        key: 'titleName',
                    },
                    {
                        title: '工龄',
                        align: 'center',
                        key: 'workAge'
                    },
                    {
                        title: '在职状态',
                        align: 'center',
                        key: 'statusName'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'opt-col'
                    }
                ],
                physicianModel: false,
                phyBaseData: {},
                phyList0: [
                    {
                        name: '员工类别',
                        keyname: 'empTypeName'
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
                        name: '参加工作时间',
                        keyname: 'firstjobDay'
                    },
                    {
                        name: '进单位时间',
                        keyname: 'empInDay'
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
                        name: '在职状态',
                        keyname: 'empStatusName'
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
                        name: '参加日期',
                        keyname: 'empPolDay'
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
                        keyname: 'professionalName'
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
                        key: 'turnoverTypeName'
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
                        key: 'cCompCodeName'
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'cDeptCodeName'
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        key: 'cPostName'
                    },
                    {
                        title: '职务',
                        align: 'center',
                        key: 'cDutyCodeName'
                    },
                    {
                        title: '职级',
                        align: 'center',
                        key: 'cDutyLevelName'
                    },
                    {
                        title: '职等',
                        align: 'center',
                        key: 'cLevelName'
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
                        key: 'troubleLevelName'
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
                        key: 'projLevelName'
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
                        key: 'doctorLevelCn'
                    },
                    {
                        title: '执业范围',
                        align: 'center',
                        key: 'certScrope'
                    },
                    {
                        title: '执业类别',
                        align: 'center',
                        key: 'certTypeCn'
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

                columnOptions9: [
                    {
                        title: '奖励级别',
                        align: 'center',
                        key: 'prizeLevelName'
                    },
                    {
                        title: '奖励称号',
                        align: 'center',
                        key: 'prizeName'
                    },
                    {
                        title: '奖励时间',
                        align: 'center',
                        key: 'prizeDate',

                    }
                ],

                columnOptions10: [
                    {
                        title: '论著名称',
                        align: 'center',
                        key: 'treatiseName'
                    },
                    {
                        title: '出版时间',
                        align: 'center',
                        key: 'publishDate'
                    },
                    {
                        title: '出版社',
                        align: 'center',
                        key: 'publishHouse',

                    },
                    {
                        title: '作者排名',
                        align: 'center',
                        key: 'empXh',

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
                hideCheckModal: false,
                phyList7: [],
                phyList8: [],
                phyList9: [],
                phyList10: [],
                phyList11: [],
                phyList12: [],
                phyPlaceholder: '--',
                empName: '',
                empCode: '',
                empSexCn: '',
                empBirthday: '',
                idCode: '',
                isForeign: '',
                empStatusCn: '',
                employtypeName: '',

            }
        },
        mounted() {
            const $paraAnc = this.$refs.paraAnc;
            $paraAnc.$children[0].$children.forEach((vc) => {
                vc.goAnchor = function () { };
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
            this.getAllHospitalList().then(() => {
                this.getPhyList();
            })
            this.getAllTitleList();

        },

        methods: {
            // 获取医院列表
            getAllHospitalList() {
                return this.$httpPost('queryHrHospitalList').then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        this.hospitalList = res.resultdata;
                        this.hospitalSelect = this.hospitalList[0].rid;
                    }
                })
            },

            // 获取职称列表
            getAllTitleList() {
                this.$httpPost('titelManage/getTitel', null, {
                    params: {
                        rid: '',
                        dentityKey: '',
                        hospitalCode: '',
                        titleType: this.phySelect == '0' ? '' : this.phySelect,
                        startpos: 0,
                        pagecount: 1000
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        this.titleList = res.resultdata;
                        // if (this.phySelect == '0') {
                        //     this.titleList.unshift(this.fistList);
                        // }



                    }
                })
            },

            // 处理空数据
            setPhyListData(data) {
                if (data.length) {
                    data.forEach(d => {
                        d.empName = d.empName || '--';
                        d.sex = d.sex || '--';
                        d.hospitalName = d.hospitalName || '--';
                        d.deptName = d.deptName || '--';
                        d.titleName = d.titleName || '--';
                        d.workAge = d.workAge || '--';

                        if (d.statusName == null || d.statusName.length == 0) {
                            d.statusName = "在岗"
                        }

                    });
                    return data;
                }
                return [];
            },

            getSearchPhyList() {
                this.pageCurrent = 1;
                this.getPhyList();
            },

            // 获取医生列表
            getPhyList() {
                this.$httpPost('queryHrDoctorList', null, {
                    params: {
                        rid: this.hospitalSelect,
                        titleType: this.phySelect == '0' ? '' : this.phySelect,
                        titleCode: this.titleSelect == '0' ? '' : this.titleSelect,
                        empName: this.phyname,
                        startpos: this.pageCurrent - 1,
                        pagecount: this.pageSize,
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        if (res.resultdata) {
                            this.phyList = this.setPhyListData(res.resultdata);
                            this.pageTotal = res.resultCount;
                        }
                    }
                })
            },

            // 查看详情
            toDetail(data) {



                // this.$router.push({ path: `/physician-info-detail/${data.dentityKey}/${data.hospitalCode}/${data.empCode}` })
                // const { dentityKey, hospitalCode, empCode } = this.$route.params;
                const dentityKey = data.dentityKey;
                const hospitalCode = data.hospitalCode;
                const empCode = data.empCode;

                this.$httpPost('getHrDetail', null, {
                    params: {
                        dentityKey,
                        hospitalCode,
                        empCode
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        if (res.resultdata) {
                            const ret = res.resultdata;
                            if (ret.emp.isForeign == 1) {
                                ret.emp.isForeign = "是";
                            } else {
                                ret.emp.isForeign = "否"
                            }

                            let chartData1 = {};
                            chartData1.columns = ['日期', '患者评价'];
                            chartData1.rows = [];

                            for (let i = ret.doctorScoreList.length - 1; i >= 0; i--) {
                                let arrStr = { '日期': ret.doctorScoreList[i].evalMonth, '患者评价': ret.doctorScoreList[i].evalGrade };
                                chartData1.rows.push(arrStr);
                            }
                            this.chartData = chartData1;


                            if (ret.emp.empPolName == null)
                                ret.emp.empPolName = ret.emp.empPolIdcd;


                            this.phyBaseData = ret.emp;
                            this.empName = ret.emp.empName || this.phyPlaceholder;
                            this.empCode = ret.emp.empCode || this.phyPlaceholder;
                            this.empSexCn = ret.emp.empSexCn || this.phyPlaceholder;
                            this.empBirthday = ret.emp.empBirthday || this.phyPlaceholder;
                            this.idCode = ret.emp.idCode || this.phyPlaceholder;
                            this.isForeign = ret.emp.isForeign || this.phyPlaceholder;
                            if (ret.emp.activeStatusName == null || ret.emp.activeStatusName.length == 0) {
                                this.activeStatusName = "在岗";
                            } else {
                                this.activeStatusName = ret.emp.activeStatusName || this.phyPlaceholder;
                            }

                            if (ret.emp.employtypeName == null || ret.emp.employtypeName.length == 0) {
                                this.employtypeName = "在编";
                            } else {
                                this.employtypeName = ret.emp.employtypeName || this.phyPlaceholder;
                            }

                            this.phyList1 = this.setEmpPostList(ret.empPostList);
                            this.phyList2 = this.setHrEmpWorkList(ret.hrEmpWorkList);
                            this.phyList3 = this.setHrEmpMediTroubleList(ret.hrEmpMediTroubleList);
                            this.phyList4 = this.setHrEmpPunishList(ret.hrEmpPunishList);
                            this.phyList5 = this.setHrEmpStudyList(ret.hrEmpStudyList);
                            this.phyList6 = this.setHrEmpDoctorCertList(ret.hrEmpDoctorCertList);
                            this.phyList7 = ret.hrEmpPrizeList;
                            this.phyList8 = ret.hrEmpTreatiseList;
                            this.phyList9 = ret.doctorScoreList;
                            this.phyList12 = this.setHrEmpTreatiseList(ret.hrEmpTreatiseList);
                            this.phyList11 = this.setHrEmpRewardList(ret.hrEmpPrizeList);


                        }


                    }


                })


                this.physicianModel = true;

            },

            // 切换人员类型
            handlePhySelect() {
                this.titleSelect = '0';
                this.getAllTitleList();
            },

            // 当前页数改变
            handleChange(n) {
                this.pageCurrent = n;
                this.getPhyList();
            },

            // 每页显示条数改变
            handleSizeChange(size) {
                this.pageSize = size;

                this.pageCurrent = 1;
                this.getPhyList();
            },


            setEmpPostList(data) {
                if (data.length) {
                    data.forEach(d => {
                        d.turnoverTypeName = d.turnoverTypeName || this.phyPlaceholder;
                        d.dutyDay = d.dutyDay || this.phyPlaceholder;
                        d.endDay = d.endDay || this.phyPlaceholder;

                        d.cCompCodeName = d.cCompCodeName || this.phyPlaceholder;
                        d.cDeptCodeName = d.cDeptCodeName || this.phyPlaceholder;
                        d.cPostName = d.cPostName || this.phyPlaceholder;
                        d.cDutyCodeName = d.cDutyCodeName || this.phyPlaceholder;
                        d.cDutyLevelName = d.cDutyLevelName || this.phyPlaceholder;
                        d.cLevelName = d.cLevelName || this.phyPlaceholder;



                        d.postReason = d.postReason || this.phyPlaceholder;
                    })
                    return data;
                }
                return [];
            },

            setHrEmpWorkList(data) {
                if (data.length) {
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
                if (data.length) {
                    data.forEach(d => {
                        d.troubleDate = d.troubleDate || this.phyPlaceholder;
                        d.troubleName = d.troubleName || this.phyPlaceholder;
                        d.troubleReason = d.troubleReason || this.phyPlaceholder;
                        d.troubleLevelName = d.troubleLevelName || this.phyPlaceholder;
                        d.troubleAttr = d.troubleAttr || this.phyPlaceholder;
                        d.particDegree = d.particDegree || this.phyPlaceholder;
                        d.punishSituation = d.punishSituation || this.phyPlaceholder;
                    })
                    return data;
                }
                return [];
            },

            setHrEmpPunishList(data) {
                if (data.length) {
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
                if (data.length) {
                    data.forEach(d => {
                        d.projName = d.projName || this.phyPlaceholder;
                        d.projLevelName = d.projLevelName || this.phyPlaceholder;
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
                if (data.length) {
                    data.forEach(d => {
                        d.certCode = d.certCode || this.phyPlaceholder;
                        d.doctorLevelCn = d.doctorLevelCn || this.phyPlaceholder;
                        d.certScrope = d.certScrope || this.phyPlaceholder;
                        d.certTypeCn = d.certTypeCn || this.phyPlaceholder;
                        d.certAddress = d.certAddress || this.phyPlaceholder;
                        d.mpqcDate = d.mpqcDate || this.phyPlaceholder;
                        d.endDate = d.endDate || this.phyPlaceholder;
                        d.certCompany = d.certCompany || this.phyPlaceholder;
                    })
                    return data;
                }
                return [];
            },
            setHrEmpRewardList(data) {
                if (data.length) {
                    data.forEach(d => {

                        d.prizeName = d.prizeName || this.phyPlaceholder;
                        d.prizeLevelName = d.prizeLevelName || this.phyPlaceholder;
                        d.prizeDate = d.prizeDate || this.phyPlaceholder;

                    })
                    return data;
                }
                return [];
            },
            setHrEmpTreatiseList(data) {
                if (data.length) {
                    data.forEach(d => {
                        d.treatiseName = d.treatiseName || this.phyPlaceholder;
                        d.publishDate = d.publishDate || this.phyPlaceholder;
                        d.publishHouse = d.publishHouse || this.phyPlaceholder;
                        d.empXh = d.empXh || this.phyPlaceholder;

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
                        if (res.resultdata) {
                            const ret = res.resultdata;
                            if (ret.emp.isForeign == 1) {
                                ret.emp.isForeign = "是";
                            } else {
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
                            chartData1.rows = [];

                            for (let i = ret.doctorScoreList.length - 1; i >= 0; i--) {
                                let arrStr = { '日期': ret.doctorScoreList[i].evalMonth, '患者评价': ret.doctorScoreList[i].evalGrade };
                                chartData1.rows.push(arrStr);
                            }
                            this.chartData = chartData1;
                        }


                    }
                })
            },
            showTableChart(doctorId, evalMonth) {


                this.$httpPost('queryDimensionsScoreList', null, {
                    params: {
                        doctorId,
                        evalMonth
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        if (res.resultdata) {
                            const ret = res.resultdata;
                            this.phyList10 = ret;
                            let chartData3 = {};
                            chartData3.columns = ['日期', '患者评价'];
                            chartData3.rows = [];
                            for (let i = 0; i < ret.length; i++) {
                                let arrStr = { '日期': ret[i].evalMonth, '患者评价': ret[i].evalGrade };
                                chartData3.rows.push(arrStr);
                            }

                            this.chartData2 = chartData3;


                        }
                        this.hideCheckModal = true;
                    }
                })

            },
            saveModalData() {
                this.hideCheckModal = false;
            },
            saveModalData2() {
                this.physicianModel = false;
            }



        }
    }
</script>

<style lang="less" scoped>
    .phy-lab {
        margin-right: 8px;
    }

    .phy-bd {
        padding: 30px 0;
    }

    .page-wrapper {
        padding: 16px 0 0;
        display: flex;
        justify-content: flex-end;
    }

    .phy-bd .para-content .para-info {
        border-bottom: 0 !important;
    }

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
            font-size: 22px;
            font-weight: 400;
            font-family: Microsoft YaHei, SimHei, Verdana;
            margin: 45px 0 20px -16px;
            background: url(https://bkssl.bdimg.com/static/wiki-lemma/normal/resource/img/paraTitle-line_743dba1.png);
            position: relative;

            .title-text {
                float: left;
                display: block;
                padding: 0 8px 0 18px;
                line-height: 20px;
                color: #000000;
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
                    width: 110px;
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