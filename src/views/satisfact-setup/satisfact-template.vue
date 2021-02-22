<template>
    <div>
        <Card>
            <Tabs :animated="false" value="2" @on-click="handleMenuSelect">
                <TabPane label="门诊患者满意度调查" icon="icon iconfont icon-manyidutongji" name="2"></TabPane>
                <TabPane label="住院患者满意度调查" icon="icon iconfont icon-zhuyuanregular" name="3"></TabPane>
                <TabPane label="员工满意度调查" icon="icon iconfont icon-yuangongactive" name="1"></TabPane>
            </Tabs>

            <div class="sat-temp-content">
                <div class="clasiclist">
                    <div v-if="!classificNumber.length" v-for="(ques, index) in classificNumber">
                        {{questionTypeEm[index]}}：<span>{{ques}}</span></div>
                </div>
                <div class="sat-temp-list-wrap">
                    <div class="sat-ques-content" v-if="!dimensList.length">
                        <p>还没有项目维度数据，<router-link to="/satisfact-setup/satisfact-dimension">点此添加维度</router-link>
                        </p>
                    </div>
                    <div class="sat-ques-content" v-if="dimensList.length && !quesTypeList.length">
                        <p>此问卷还没有问题明细数据，<span @click="showQuesImportModal"
                                style="color:#34A9FF; cursor:pointer;">点此导入问题</span></p>
                    </div>
                    <ques-list :data="quesTypeList" :hasCheck="true" :hasEdit="false" @vh-ques-del="delQuesSingle"
                        @vh-ques-checkall="handleQuesCheckAll"></ques-list>
                </div>
                <div class="sat-temp-title">
                    <span class="sat-temp-checkall" v-if="dimensList.length && quesTypeList.length">
                        <Checkbox :value="quesCheckAll" @click.prevent.native="handleQuesCheckAllClick"></Checkbox>
                        <label style="margin-left:8px;">全选</label>
                    </span>
                    <!-- <span class="totals">已选择<em class="num">{{totalNum}}</em>条</span> -->

                    <span class="sat-temp-btns">
                        <ButtonGroup size="large">
                            <Button :disabled="dimDisabled" class="groupDel" @click="delQuesBatch">批量删除</Button>
                            <Button type="primary" :disabled="dimDisabled" @click="showQuesImportModal">导入问题</Button>
                        </ButtonGroup>
                        <!-- <Button type="primary" :disabled="dimDisabled" @click="saveQuesData">保存模版</Button> -->
                    </span>
                </div>
            </div>

        </Card>

        <!-- <Card>
            <Menu class="sat-temp-menu" active-name="1-2" :open-names="['1']" @on-select="handleMenuSelect"
                style="width:220px;">
                <MenuGroup title="满意度调查类型">
                    <MenuItem name="1-2">
                    <Icon type="ios-cube-outline" />
                    门诊患者满意度调查
                    </MenuItem>
                    <MenuItem name="1-3">
                    <Icon type="ios-trending-up" />
                    住院患者满意度调查
                    </MenuItem>
                    <MenuItem name="1-1">
                    <Icon type="ios-create-outline" />
                    员工满意度调查
                    </MenuItem>
                </MenuGroup>
            </Menu>

        </Card> -->

        <Modal ref="tempModalWrap" fullscreen v-model="tempModal" :width="720" :title="modalTitle" ok-text="确定导入"
            @on-ok="saveTempModalData()" :mask-closable="false" :loading="modalLoading">
            <div class="temp-modal-hd">
                <Row style="margin-bottom: 10px">
                    <Col span="24">
                    <div class="title-bar">
                        <div class="input-box">
                            <p>测评维度：</p>
                            <el-select v-model="quesDimSelect" style="width:200px;" :disabled="dimDisabled"
                                @change="handleDimSelect">
                                <el-option v-for="opt in dimensList" :label="opt.dimenName" :value="opt.dimenId"
                                    :key="opt.dimenCode"></el-option>
                            </el-select>
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>
            <div class="temp-model-bd">
                <div class="sat-ques-content" v-if="!quesList.length">
                    <p class="sat-ques-tips">此维度还没有问题明细数据，<router-link
                            :to="{ path: '/satisfact-setup/satisfact-ques', query: { did: quesDimSelect }}">点此添加问题
                        </router-link>
                    </p>
                </div>
                <ques-list :data="quesList" v-if="quesList.length" :hasCheck="true" :hasEdit="false" :hasDel="false"
                    @vh-ques-checkall="handleCheckAll"></ques-list>
                <span class="sat-ques-checkall" v-if="quesList.length" style="z-index:9;">
                    <Checkbox :value="libCheckAll" @click.prevent.native="handleCheckAllClick"
                        :disabled="libCheckAllDisabled"></Checkbox><label style="margin-left:8px;">全选</label>
                </span>
            </div>
        </Modal>
    </div>
</template>

<script>
    import quesList from './components/ques-list';

    export default {
        name: "satisfact-template",

        components: {
            quesList
        },

        data() {
            return {
                templateId: '',
                questionTypeEm: {
                    "1": "单选",
                    "2": "多选",
                    "3": "问答",
                    "4": "评分"
                },
                tempTypeEM: {
                    '1': '员工满意度调查',
                    '2': '门诊患者满意度调查',
                    '3': '住院患者满意度调查'
                },
                tempModal: false,
                modalLoading: true,
                isButtonLoading: false,
                modalTitle: '导入问题',
                dimDisabled: true,
                quesDimSelect: '',
                dimensList: [],
                statistype: '2', // 1-员工 2-门诊 3-住院
                quesList: [],
                quesTypeList: [],
                quesChecked: {},
                libCheckAll: false,
                libCheckAllDisabled: false,
                quesCheckAll: false,
                classificNumber: {},
                // totalNum:'',// 选择的条数
            }
        },

        created() {
            this.getDimensList();
        },

        methods: {
            handleMenuSelect(e) {
                this.statistype = e;
                this.getQuesListByType();
            },

            // 获取维度列表
            getDimensList() {
                this.$httpPost('sysDimenManage/getAllSysDimen').then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        this.dimensList = res.sysDimenList;
                        if (this.dimensList.length) {
                            this.dimDisabled = false;
                            this.quesDimSelect = this.dimensList[0].dimenId;
                            this.getQuesListByType();
                        }
                    }
                })
            },

            // 处理题目数据 增加 isChecked | isDisabled 
            setQuesData(data, flag) {
                if (data) {
                    let sum = 0;
                    data.forEach(d => {
                        if (flag) {
                            d.isChecked = false
                        } else {
                            if (this.quesChecked[d.dbquestionId]) {
                                d.isDisabled = d.isChecked = true;
                                sum++;
                            } else {
                                d.isDisabled = d.isChecked = false;
                            }
                        }
                    })
                    this.libCheckAllDisabled = sum == data.length;
                    return data;
                }
                return [];
            },
            getWordCnt(arr) { //已知数组个数
                return arr.reduce(function (prev, next) {
                    prev[next] = (prev[next] + 1) || 1;
                    return prev;
                }, {})
            },

            // 通过维度获取题目列表
            getQuesListByDim() {
                this.$httpPost('questionDBManage/getAllQuestionDB', null, {
                    params: {
                        dimenId: this.quesDimSelect
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        this.quesList = this.setQuesData(res.questionDBlist);
                        this.libCheckAll = false;
                    }
                })
            },

            // 通过模版类型获取题目列表 
            getQuesListByType() {
                this.$httpPost('paperTemplateManage/getPaperByPaperType', null, {
                    params: {
                        statistypeId: this.statistype
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        if ((this.quesTypeList = this.setQuesData(res.questions, true))) {
                            this.templateId = res.templateId;
                            this.quesChecked = {};
                            this.quesCheckAll = false;
                            var arr = [];

                            this.quesTypeList.forEach(q => {
                                this.quesChecked[q.dbquestionId] = true;
                                arr.push(q.questionType);
                                this.classificNumber = this.getWordCnt(arr);
                            });
                            if (this.quesTypeList.length == 0) {
                                this.classificNumber = [];
                            }
                        }
                    }
                })
            },

            // 删除问题
            delQuesData(qid, callback) {
                this.$httpPost('paperTemplateManage/deleteTemplateQuestion', null, {
                    params: {
                        templateId: this.templateId,
                        questionIds: qid
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        callback && callback();
                        this.$Message.success('删除成功');
                    }
                })
            },

            // 单个删除模版问题
            delQuesSingle(idx, qid) {
                this.delQuesData(qid, () => {
                    const ret = this.quesTypeList.splice(idx, 1)[0];
                    delete this.quesChecked[ret.dbquestionId];
                    var arr = [];
                    this.quesTypeList.forEach(q => {
                        //this.quesChecked[q.dbquestionId] = true;
                        arr.push(q.questionType);
                        this.classificNumber = this.getWordCnt(arr);
                    });
                });
            },

            // 批量删除模版问题
            delQuesBatch() {
                let ret = [];
                this.quesTypeList.forEach(q => {
                    if (q.isChecked) {
                        ret.push(q.dbquestionId);
                    }
                })
                if (!ret.length) {
                    this.$message('请选择要删除的问题');
                    return;
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定要删除题目吗？',
                    onOk: () => {
                        this.delQuesData(ret.join(','), () => {
                            this.getQuesListByType();
                        })
                    }
                });
            },

            // 显示导入问题面板
            showQuesImportModal() {
                this.tempModal = true;
                this.getQuesListByDim();
            },

            // 维度选择
            handleDimSelect(val) {
                this.getQuesListByDim();
            },

            // 获取此维度下选中题目
            getQuesChecked() {
                const ret = [];
                this.quesList.forEach(q => {
                    if (!q.isDisabled && q.isChecked) {
                        ret.push(q.dbquestionId);
                        this.quesChecked[q.dbquestionId] = true;
                    }
                })
                return ret;
            },

            // 保存导入
            saveTempModalData() {
                if (this.isButtonLoading) return;
                this.$refs.tempModalWrap.$data.buttonLoading = this.isButtonLoading = true;
                let checkedList = [...this.getQuesChecked()];
                if (!checkedList.length) {
                    this.$message('请选择要导入的问题');
                    this.$refs.tempModalWrap.$data.buttonLoading = this.isButtonLoading = false;
                    return;
                }
                this.$httpPost('paperTemplateManage/saveTemplate', null, {
                    params: {
                        templateId: this.templateId,
                        questionIds: [...this.quesTypeList.map(q => q.dbquestionId), ...checkedList].join(',')
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        this.$Message.success('导入成功');
                        this.tempModal = this.isButtonLoading = false;
                        this.getQuesListByType();
                    }
                }).catch(err => {
                    this.tempModal = this.isButtonLoading = false;
                })
            },


            // 处理从题库导入问题的全选
            handleCheckAll(val) {
                this.libCheckAll = val;
            },

            // 点击全选
            handleCheckAllClick() {
                this.libCheckAll = !this.libCheckAll;
                this.quesList.forEach(q => {
                    if (!q.isDisabled) {
                        q.isChecked = this.libCheckAll;
                    }
                });
            },

            // 处理问题的全选
            handleQuesCheckAll(val) {
                this.quesCheckAll = val;
            },

            // 点击全选
            handleQuesCheckAllClick() {
                this.quesCheckAll = !this.quesCheckAll;
                // if(!this.quesCheckAll){
                //     this.totalNum =0;
                // }else{
                //     this.totalNum =this.quesTypeList.length;
                // }
                this.quesTypeList.forEach(q => {
                    if (!q.isDisabled) {
                        q.isChecked = this.quesCheckAll;
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .groupDel {
        margin-right: 8px
    }

    .sat-temp-menu {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
    }

    .sat-temp-content {
        /* position: absolute;
        top: 0;
        right: 0;
        left: 220px;
        height: 100%;
        overflow: hidden; */

        h2 {
            text-align: center;
            font-size: 16px;
            font-weight: normal
        }
    }

    .sat-temp-title {
        height: 54px;
        line-height: 54px;
        position: sticky;
        bottom: 0;
        width: 100%;
        padding-left: 30px;
        border-top: 1px solid #f0f0f0;
        background: rgb(255, 255, 255)
    }


    .sat-temp-title .sat-temp-btns {
        position: absolute;
        right: 0px;
    }

    /* 
    .sat-temp-title .sat-temp-checkall {
        position: absolute;
        top: 16px;
        left: 30px;
    } */

    /* .sat-temp-list-wrap {
        position: absolute;
        top: 80px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
    } */

    .sat-ques-lab {
        margin-right: 10px;
    }

    .temp-modal-hd {
        height: 44px;
    }

    .temp-model-bd {
        width: 100%;
        /* height: 294px; */
        min-height: 294px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .sat-ques-tips {
        padding: 50px 16px 0;
        text-align: center;
    }

    .sat-ques-content {
        padding: 16px 30px 30px;
    }

    .sat-ques-checkall {
        position: fixed;
        left: 46px;
        bottom: 20px;
    }

    /* .totals{
        display:inline-block;
        margin-left:20px;
        font-size:14px;
        color:#1890ff;
    } */
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
        background: none
    }

    .clasiclist {
        text-align: right;

        div {
            display: inline-block;
            margin-right: 15px;

            span {
                color: #2d8cf0
            }
        }
    }
</style>