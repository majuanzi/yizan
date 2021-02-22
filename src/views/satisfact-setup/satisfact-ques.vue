<template>
    <div @keydown.enter="getList">
        <Card :bordered="false">
            <div class="title-bar">
                <div class="input-box">
                    <p>测评维度： </p>
                    <el-select v-model="dimen" clearable style="width: 200px" @change="selectdime">
                        <el-option v-for="item in dimensList" :key="item.dimenId" :value="item.dimenId"
                            :label="item.dimenName"></el-option>
                    </el-select>
                </div>
                <div class="input-box">
                    <p>问题类型： </p>
                    <el-select v-model="types" clearable style="width: 200px" @change="selecttype">
                        <el-option v-for="item in typeList" :key="item.value" :value="item.value" :label="item.label">
                        </el-option>
                    </el-select>
                    <!-- <Select @on-change="selecttype" clearable style="width: 200px">
                        <Option v-for="item in typeList" :value="item.value">
                            {{ item.label }}
                        </Option>
                    </Select> -->
                </div>
                <div class="input-box">
                    <p>问题题目： </p>
                    <Input size="large" placeholder="请输入" v-model="paramsData.questionContent" style="width: 200px" />
                </div>
                <div class="btn-box">
                    <Button type="primary" size="large" @click="getList">查询</Button>
                </div>
                <div class="both" style="clear:both"></div>
            </div>
            <div class="vh-body">
                <div class="t-btn vh-mg-bottom-12">
                    <Button size="large" :disabled="delectDiabled" @click="quesDelect">删除</Button>
                    <Button type="primary" size="large" @click="addquestion">新增</Button>
                </div>
                <Table border ref="selection" :columns="columns" :data="quesList" @on-selection-change="haveSelect">
                    <template slot-scope="{ row, index }" slot="action-opt">
                        <div class="p-box">
                            <p v-for="item in row.optionsStr">{{item}}</p>
                        </div>

                    </template>
                    <template slot-scope="{ row, index }" slot="action-btn">
                        <span class="span-btn one" @click="editquestion(row,index)">编辑</span>
                        <span class="span-btn" @click="row.quoteNum == 0 ? deletqustion(row,index) : ''"
                            :style="{color: row.quoteNum == 0 ? '' : '#999999'}">删除</span>
                    </template>
                </Table>
                <div style="text-align: right; padding:12px 0">
                    <Page :total=count show-total :current.sync="paramsData.pagenum"  @on-change="changePage"
                        @on-page-size-change="changePagesize" />
                </div>

            </div>
        </Card>
        <Modal v-model="modalshow" title="编辑" @on-ok="completeOk" @on-cancel="cancel" width="900">
            <div class="edit-content">
                <Input size="large" :maxlength="50" placeholder="最大可输入50字"
                    v-model.trim="editquesModalData.questionContent" />
                <Row style="padding: 10px 0; font-size:14px">
                    <Col span="8">
                    <label for="">测评维度：</label>
                    <el-select style="width:200px" :disabled="dimDisabled" @change="getAddDi"
                        v-model="editquesModalData.dimenId">
                        <el-option v-for="opt in dimensList" :label="opt.dimenName" :value="opt.dimenId"
                            :key="opt.dimenCode">
                        </el-option>
                    </el-select>

                    </Col>
                    <Col span="8" v-if="editquesModalData.questionType == 4">
                    <label for="">最高分：</label>
                    <InputNumber size="large" :min="2" :max="10" v-model="editquesModalData.maxGrade" :editable="false"
                        style="width: 100px">
                    </InputNumber>
                    </Col>
                    <Col span="8" style="padding-top: 8px">
                    <label for="">必答：</label>
                    <i-switch @on-change="changeSwitch" :value="editquesModalData.ismust == 1"></i-switch>
                    </Col>
                </Row>
                <Table :columns="columnOptions" :data="editqsData" v-if="editquesModalData.questionType == 1">
                    <template slot-scope="{ row, index }" slot="opt-content">
                        <div style="float: left; width:80%">
                            <Input :maxlength="30" placeholder="最大可输入30字"
                                v-model.trim="editqsData[index]['optionContent']" type="text" clearable></Input>
                        </div>
                        <div style="float: left; width: 20%; text-align: center; margin-top: 5px">
                            <span class="icon iconfont icon-charu" @click="addOption(index)"></span>
                            <span class="icon iconfont icon-shanjian" style="padding-left: 20px"
                                @click="loseOption(index)"></span>
                        </div>

                    </template>
                    <template slot-scope="{ row, index }" slot="opt-grade">
                        <InputNumber :editable="false" :max="10" :min="1" v-model="row.optionGrade"
                            :disabled="dpDisabled" @on-change="getGrade(row,index)">
                        </InputNumber>
                    </template>
                    <template slot-scope="{ row, index }" slot="up-move">
                        <span class="icon iconfont icon-top" :style="{ color: index == 0 ? '' : '#1890FF' }"
                            @click="index == 0 ? '' : changePosition(index,1)"></span>
                    </template>
                    <template slot-scope="{ row, index }" slot="down-move">
                        <span class="icon iconfont icon-down"
                            :style="{ color: index == editqsData.length-1 ? '' : '#1890FF' }"
                            @click="index == editqsData.length-1 ? '' : changePosition(index,2)"></span>
                    </template>
                    <template slot-scope="{ row, index }" slot="up-last">
                        <span class="icon iconfont icon-topm" :style="{ color: index == 0 ? '' : '#1890FF' }"
                            @click="index == 0 ? '' : changePosition(index,3)"></span>
                    </template>
                    <template slot-scope="{ row, index }" slot="down-last">
                        <span class="icon iconfont icon-downm"
                            :style="{ color: index == editqsData.length-1 ? '' : '#1890FF' }"
                            @click="index == editqsData.length-1 ? '' : changePosition(index,4)"></span>
                    </template>
                </Table>
                <Table :columns="columnOptions2" :data="editqsData" v-if="editquesModalData.questionType == 2">
                    <template slot-scope="{ row, index }" slot="opt-content">
                        <div style="float: left; width:80%">
                            <Input :maxlength="30" v-model.trim="editqsData[index]['optionContent']" type="text"
                                clearable></Input>
                        </div>
                        <div style="float: left; width: 20%; text-align: center; margin-top: 5px">
                            <span class="icon iconfont icon-charu" @click="addOption(index)"></span>
                            <span class="icon iconfont icon-shanjian" style="padding-left: 20px"
                                @click="loseOption(index)"></span>
                        </div>

                    </template>
                    <template slot-scope="{ row, index }" slot="up-move">
                        <span class="icon iconfont icon-top" :style="{ color: index == 0 ? '' : '#1890FF' }"
                            @click="index == 0 ? '' : changePosition(index,1)"></span>
                    </template>
                    <template slot-scope="{ row, index }" slot="down-move">
                        <span class="icon iconfont icon-down"
                            :style="{ color: index == editqsData.length-1 ? '' : '#1890FF' }"
                            @click="index == editqsData.length-1 ? '' : changePosition(index,2)"></span>
                    </template>
                    <template slot-scope="{ row, index }" slot="up-last">
                        <span class="icon iconfont icon-topm" :style="{ color: index == 0 ? '' : '#1890FF' }"
                            @click="index == 0 ? '' : changePosition(index,3)"></span>
                    </template>
                    <template slot-scope="{ row, index }" slot="down-last">
                        <span class="icon iconfont icon-downm"
                            :style="{ color: index == editqsData.length-1 ? '' : '#1890FF' }"
                            @click="index == editqsData.length-1 ? '' : changePosition(index,4)"></span>
                    </template>
                </Table>
                <div class="model-row" @click="addLastoption"
                    v-if="editquesModalData.questionType == 2 || editquesModalData.questionType == 1">
                    <Icon type="md-add" size="16" style="margin-top:-2px" />
                    <span>添加选项</span>
                </div>
                <div class="model-row" v-if="editquesModalData.questionType == 1">
                    <Checkbox v-model="dpDisabled"></Checkbox>
                    <span style="color: #000">不设分值</span>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "satisfact-ques",
        data() {
            return {
                dimen: '',
                types: '',
                typeList: [
                    {
                        value: '1',
                        label: '单选'
                    },
                    {
                        value: '2',
                        label: '复选'
                    },
                    {
                        value: '3',
                        label: '问答'
                    },
                    {
                        value: '4',
                        label: '评分'
                    }
                ],
                dimensList: [],
                paramsData: {
                    dimenId: '',
                    questionType: '',
                    questionContent: '',
                    pagenum: 1,
                    pagecount: 10
                },
                modalshow: false,
                columns: [
                    {
                        title: '序号',
                        width: 65,
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.index + (this.paramsData.pagenum - 1) * this.paramsData.pagecount + 1);
                        }
                    },
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '测评维度',
                        key: 'dimenName'
                    },
                    {
                        title: '问题题目',
                        key: 'questionContent'
                    },
                    {
                        title: '问题选项',
                        key: 'optionsStr',
                        slot: 'action-opt'
                    },
                    {
                        title: '问题类型',
                        key: 'questionTxt',
                        align: 'center'

                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 150,
                        slot: 'action-btn'
                    }
                ],
                quesList: [],
                editquesModalData: {
                    dimenId: '',
                    questionContent: '',
                    ismust: '1',
                    questionType: '',
                    viewOrder: '',
                    options: [],
                    maxGrade: '',
                    dbquestionId: ''
                },
                columnOptions2: [
                    {
                        title: "选项内容",
                        align: "left",
                        slot: "opt-content"
                    },
                    {
                        title: "上移",
                        width: 80,
                        align: "center",
                        slot: "up-move"
                    },
                    {
                        title: "下移",
                        width: 100,
                        align: "center",
                        slot: "down-move"
                    },
                    {
                        title: "最上",
                        width: 100,
                        align: "center",
                        slot: "up-last"
                    },
                    {
                        title: "最下",
                        width: 80,
                        align: "center",
                        slot: "down-last"
                    }
                ],
                columnOptions: [
                    {
                        title: "选项内容",
                        align: "left",
                        slot: "opt-content"
                    },
                    {
                        title: "对应分值",
                        width: 120,
                        align: "left",
                        slot: "opt-grade",
                        renderHeader: (h, params) => {
                            return h('div', [
                                h('Checkbox', {
                                    attrs: {
                                        id: 'opt-grade-ck'
                                    },
                                    props: {
                                        value: !this.dpDisabled
                                    },
                                    nativeOn: {
                                        click: (e) => {
                                            this.dpDisabled = !e.target.checked;
                                        }
                                    }
                                }),
                                h('label', params.column.title)
                            ]);
                        }
                    },
                    {
                        title: "上移",
                        width: 80,
                        align: "center",
                        slot: "up-move"
                    },
                    {
                        title: "下移",
                        width: 100,
                        align: "center",
                        slot: "down-move"
                    },
                    {
                        title: "最上",
                        width: 100,
                        align: "center",
                        slot: "up-last"
                    },
                    {
                        title: "最下",
                        width: 80,
                        align: "center",
                        slot: "down-last"
                    }
                ],
                dpDisabled: false,
                dimDisabled: true,
                editqsData: [],
                delectDiabled: true,
                subOptionsId: '',
                count: 0,
                currentPage: 1
            }
        },

        created() {
            this.getDimensList()
        },

        mounted() {

        },

        methods: {
            changePage(e) {
                this.paramsData.pagenum = e;
                this.getQuesList();
            },
            changePagesize(e) {
                this.paramsData.pagecount = e;
                this.getQuesList();
            },
            completeOk() {
                if (this.editqsData != null) {
                    for (let i = 0; i < this.editqsData.length; i++) {
                        if (this.editqsData[i].optionContent.length == 0) {
                            this.$message("选项内容不能为空哦！")
                            return;
                        }
                    }
                    if (this.dpDisabled) {
                        this.editqsData.forEach((val, index) => {
                            val.optionGrade = 0
                        })
                    }
                    //相同选项判断
                    let booABarr = [];
                    for (let x = 0; x < this.editqsData.length; x++) {
                        let booAB = this.editqsData.findIndex(n => n.optionContent == this.editqsData[x].optionContent);
                        booABarr.push(booAB)
                    }
                    if (this.mm(booABarr)) {
                        debugger
                        this.$Message.warning('问题选项不能重复哦~');
                        return false;
                    }

                }

                this.editquesModalData.options = this.editqsData;
                this.$httpPost('questionDBManage/modifyQuestionDB', this.editquesModalData).then(res => {
                    if (res.resultcode == 1) {
                        this.$Message.success('修改成功');
                        this.getQuesList();
                    }
                })
            },
            mm(a) {
                return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f" + a.join("\x0f\x0f") + "\x0f");
            },
            cancel() { },
            editquestion(row) {
                if (row.options && row.options.length > 0) {
                    let OKdis = row.options.find(n => n.optionGrade == 0);
                    if (OKdis == undefined) {
                        this.dpDisabled = false;
                    } else {
                        this.dpDisabled = true;
                    }
                }


                this.modalshow = true;
                //let newRow = Object.assign(row)
                this.editquesModalData.dimenId = row.dimenId;
                this.editquesModalData.questionContent = row.questionContent;
                this.editquesModalData.ismust = row.ismust;
                this.editquesModalData.questionType = row.questionType;
                this.editquesModalData.viewOrder = row.viewOrder;
                this.editquesModalData.options = row.options;
                this.editquesModalData.maxGrade = row.maxGrade;
                this.editquesModalData.dbquestionId = row.dbquestionId
                this.editqsData = JSON.parse(JSON.stringify(row.options))
            },
            haveSelect(selec, row) {
                if (selec.length == 0) {
                    this.delectDiabled = true
                } else {
                    let subOptionsId = '';
                    let subIdarr = selec.map(val => {
                        return val.dbquestionId
                    })
                    subOptionsId = subIdarr.join(',');
                    this.subOptionsId = subOptionsId;
                    this.delectDiabled = false;
                }

            },
            getDimensList() {
                this.$httpPost('sysDimenManage/getAllSysDimen').then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        this.dimensList = res.sysDimenList;
                        if (this.dimensList.length) {
                            this.dimDisabled = false;
                            this.getQuesList();
                        }
                    }
                })
            },
            getList() {
                this.paramsData.pagenum = 1;
                this.getQuesList()
            },
            quesDelect() {

                this.$Modal.confirm({
                    title: '提示',
                    content: '确定要删除此问题吗？',
                    onOk: () => {
                        this.$httpPost('questionDBManage/deleteQuestionDB', null, {
                            params: {
                                dbquestionId: this.subOptionsId
                            }
                        }).then(res => {
                            if (res.resultcode == 1) {
                                this.$Message.success('删除成功');
                                this.getQuesList();
                                this.delectDiabled = true;
                            }
                        })
                    }
                });

            },
            deletqustion(row, index) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定要删除此问题吗？',
                    onOk: () => {
                        this.$httpPost('questionDBManage/deleteQuestionDB', null, {
                            params: {
                                dbquestionId: row.dbquestionId
                            }
                        }).then(res => {
                            if (res.resultcode == 1) {
                                this.$Message.success('删除成功');
                                this.getQuesList();
                            }

                        })
                    }
                });
            },
            // 获取题目列表
            getQuesList() {
                this.$httpPost('questionDBManage/getAllQuestionDBByPage', null, {
                    params: {
                        ...this.paramsData
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {

                        if (res.questionDBList.length == 0 && this.paramsData.pagenum != 1) {
                            this.currentPage = Number(this.paramsData.pagenum) - 1;
                            this.changePage(this.currentPage)
                        }
                        this.count = res.count;
                        let tip = '';
                        let newList = res.questionDBList.map((val, index, arr) => {
                            switch (val.questionType) {
                                case '1':
                                    tip = "单选题"
                                    break;
                                case '2':
                                    tip = '复选题'
                                    break;
                                case '3':
                                    tip = '问答题'
                                    break;
                                case '4':
                                    tip = '评分题'
                                    break
                            }
                            if (val.quoteNum != 0) {
                                val._disabled = true
                            }
                            //表格选项
                            let qsOpt = [];
                            if (val.options == null || val.options.length == 0) {
                                qsOpt = []
                            } else {
                                val.options.forEach((item, i) => {
                                    qsOpt.push(item.optionContent)
                                })

                            }
                            return Object.assign(val, { questionTxt: tip, keyValue: index + 1, optionsStr: qsOpt })
                        })
                        this.quesList = newList;
                    }
                })
            },
            selectdime(e) {
                if (e == undefined) {
                    this.paramsData.dimenId = '';
                } else {
                    this.paramsData.dimenId = e;
                }

            },
            selecttype(e) {
                if (e == undefined) {
                    this.paramsData.questionType = '';
                } else {
                    this.paramsData.questionType = e;
                }
            },
            addquestion() {
                this.$router.push({
                    name: 'edit'
                })
            },
            //添加选项
            addOption(e) {
                let Kdata = [];
                if (this.editqsData.length > 9) {
                    this.$Message.warning('选项个数不能超过10个哦~');
                    return false;
                }
                //防止关闭数据遗留
                for (let i = 0; i < this.editqsData.length; i++) {
                    Kdata.push(this.editqsData[i]);
                    Kdata.viewOrder = i + 1;
                }
                Kdata.splice(e + 1, 0, { optionContent: '', optionGrade: 1, viewOrder: '' })
                Kdata.forEach((val, index) => {
                    val.viewOrder = index + 1
                })
                this.editqsData = Kdata;


            },
            //底部添加选项
            addLastoption() {
                let Kdata = [];

                if (this.editqsData.length > 9) {
                    this.$Message.warning('选项个数不能超过10个哦~');
                    return false;
                }
                //防止关闭数据遗留
                for (let i = 0; i < this.editqsData.length; i++) {
                    Kdata.push(this.editqsData[i]);
                }
                Kdata.push({ optionContent: '', optionGrade: 1, viewOrder: Kdata.length + 1 })
                this.editqsData = Kdata;
            },
            //删除选项
            loseOption(e) {
                if (this.editqsData.length == 2) {
                    this.$Message.warning('选项个数不能少于两个哦~');
                    return false;
                }
                let Kdata = []
                for (let i = 0; i < this.editqsData.length; i++) {
                    if (e !== i) {
                        Kdata.push(this.editqsData[i]);
                        Kdata.viewOrder = i + 1;
                    }
                }
                this.editqsData = Kdata;
            },
            getGrade(row, index) {
                this.editqsData[index].optionGrade = row.optionGrade;

            },
            changePosition(val, a) {
                if (a == 1) {
                    let op = this.editqsData.splice(val, 1);
                    this.editqsData.splice(val - 1, 0, ...op)
                } else if (a == 2) {
                    let op = this.editqsData.splice(val, 1);
                    this.editqsData.splice(val + 1, 0, ...op)
                } else if (a == 3) {
                    let op = this.editqsData.splice(val, 1);
                    this.editqsData.unshift(...op)
                } else if (a == 4) {
                    let op = this.editqsData.splice(val, 1);
                    this.editqsData.push(...op)
                }
                this.editqsData.forEach((val, index) => {
                    val.viewOrder = index + 1;
                })
            },
            getAddDi(e) {
                if (e == undefined) {
                    this.editquesModalData.dimenId = '';
                } else {
                    this.editquesModalData.dimenId = e;
                }
            },
            changeSwitch(e) {
                if (e) {
                    this.editquesModalData.ismust = '1'
                } else {
                    this.editquesModalData.ismust = '0'
                }
            },
        }

    }
</script>

<style lang="less" scoped>
    .input-box {
        float: left;
        padding-right: 24px;
        padding-bottom: 8px
    }

    .title-bar {
        min-height: 60px;
        min-width: 1000px;
        padding-right: 70px;
        position: relative;
    }

    .btn-box {
        position: absolute;
        right: 0px;
        top: 0px
    }

    .vh-body {
        min-width: 1000px
    }

    .t-btn {
        text-align: right;
    }

    .span-btn {
        color: #2d8cf0;
        cursor: pointer;
        padding: 0 6px;
        position: relative;
    }

    .one::after {
        content: '';
        width: 1px;
        height: 10px;
        background: #ccc;
        position: absolute;
        right: -2px;
        top: 01px
    }

    .p-box {
        padding: 10px 0;
        line-height: 18px;

    }

    .p-box P {
        position: relative;
    }

    .p-box p::before {
        content: '';
        width: 6px;
        height: 6px;
        background: #a0a0a0;
        border-radius: 6px;
        position: absolute;
        left: -12px;
        top: 5px
    }

    .model-row {
        padding: 10px;
        height: 38px;
        line-height: 20px;
        color: #1890FF;
        font-size: 14px;
        display: inline-block;
        cursor: pointer;
    }
</style>