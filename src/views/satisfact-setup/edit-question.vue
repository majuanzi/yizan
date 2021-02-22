<template>
    <div class="edit" id="edit">
        <div class="header">
            <div class="satis-exit-btn" @click="goBack">
                <span class="icon iconfont icon-back" style="font-size: 16px"></span>
                <span style="font-size: 16px; padding-left: 5px">返回</span>
            </div>
            <div class="tip-box">
                <span>单选题：<span style="color: #1890FF">{{qsType.single}}</span></span>
                <span>复选题：<span style="color: #1890FF">{{qsType.some}}</span></span>
                <span>问答题：<span style="color: #1890FF">{{qsType.ask}}</span></span>
                <span>评分题：<span style="color: #1890FF">{{qsType.rate}}</span></span>
            </div>
        </div>
        <div class="aside">
            <div class="aside-single" @click="addQuestion(1)"
                :style="{ borderColor: mark == 1 ? '#1890FF' : '', color: mark == 1 ? '#1890FF' : '' }">
                <Anchor :affix="false" container=".edit">
                    <AnchorLink v-if="mark==1" href="#basic_usage" title="单选题" class="actives links"
                        style="color:#1890FF"></AnchorLink>
                    <AnchorLink v-else href="#basic_usage" title="单选题" class="links"></AnchorLink>
                </Anchor>
                <i class="iconfont icon-danxuanicon"></i>
                <!-- <span>单选题</span> -->
            </div>
            <div class="aside-single" @click="addQuestion(2)"
                :style="{ borderColor: mark == 2 ? '#1890FF' : '' , color: mark == 2 ? '#1890FF' : ''}">
                <Anchor :affix="false">
                    <AnchorLink v-if="mark==2" href="#basic_usage" title="复选题" class="actives links"></AnchorLink>
                    <AnchorLink v-else href="#basic_usage" title="复选题" class="links"></AnchorLink>
                </Anchor>
                <i class="iconfont icon-fuxuanicon"></i>
            </div>
            <div class="aside-single" @click="addQuestion(3)"
                :style="{ borderColor: mark == 3 ? '#1890FF' : '' , color: mark == 3 ? '#1890FF' : '' }">
                <Anchor :affix="false">
                    <AnchorLink v-if="mark==3" href="#basic_usage" title="问答题" class="actives links"></AnchorLink>
                    <AnchorLink v-else href="#basic_usage" title="问答题" class="links"></AnchorLink>
                </Anchor>
                <i class="iconfont icon-edits"></i>
            </div>
            <div class="aside-single" @click="addQuestion(4)"
                :style="{ borderColor: mark == 4 ? '#1890FF' : '', color: mark == 4 ? '#1890FF' : ''  }">
                <Anchor :affix="false">
                    <AnchorLink v-if="mark==4" href="#basic_usage" title="评分题" class="actives links"></AnchorLink>
                    <AnchorLink v-else href="#basic_usage" title="评分题" class="links"></AnchorLink>
                </Anchor>
                <i class="iconfont icon-pingfenicon"></i>
            </div>
        </div>
        <div class="qs-content">
            <div class="qs-list" v-for="(item,i) in quesList">
                <dl>
                    <span style="padding-right: 5px">{{i+1}}</span>{{item.questionContent}}{{item.txttip}}
                </dl>
                <div class="icon-box" v-if="!item.isediter">
                    <dd style="padding-left: 18px" v-if="item.questionType == 1">
                        <div class="checkbox" v-for="opt in item.options">
                            <Radio disabled>
                                <span>{{opt.optionContent}}</span>
                            </Radio>
                        </div>
                    </dd>
                    <dd style="padding-left: 18px" v-if="item.questionType == 2">
                        <div class="checkbox" v-for="opt in item.options">
                            <Checkbox disabled>{{opt.optionContent}}</Checkbox>
                        </div>
                    </dd>
                    <dd style="padding-left: 18px" v-if="item.questionType == 3">
                        <Input disabled style="max-width: 800px"></Input>
                    </dd>
                    <dd style="padding-left: 18px" v-if="item.questionType == 4">
                        <Rate disabled custom-icon="iconfont icon-star" :count="item.maxGrade" />
                    </dd>
                    <div class="icon-single" v-if="!item.isedit">
                        <i class="iconfont icon-edits" @click="editQuestion(item,i)"></i>
                        <Poptip placement="top-end" confirm title="您确定要删除吗?" @on-ok="deleteQuestion(item,i)"
                            @on-cancel="cancel">
                            <i class="iconfont icon-deletes"></i>
                        </Poptip>
                        <!-- <i class="iconfont icon-deletes" @click="deleteQuestion(item,i)"></i> -->
                    </div>
                </div>
                <div class="edit-box" v-if="item.isedit || item.isediter">
                    <Icon type="ios-close" size="28"
                        style="position: absolute; top: -38px; right:-14px; cursor: pointer;"
                        @click="closeQustion(item.isediter ? i : '')" />
                    <!--<Input :maxlength="50" placeholder="最大可输入50字"-->
                    <!--@on-blur="validateJyh(quesModalData.questionContent)"-->
                    <!--v-model.trim=="quesModalData.questionContent" />-->
                    <Input :maxlength="50" placeholder="最大可输入50字" v-model.trim="editquesModalData.questionContent" />
                    <Row style="padding: 10px 0; font-size:14px">
                        <Col span="8">
                        <label for="">测评维度：</label>

                        <el-select clearable style="width:200px" :disabled="dimDisabled" @change="getAddDi"
                            v-model="quesDimSelect">
                            <el-option v-for="opt in dimensList" :label="opt.dimenName" :value="opt.dimenId"
                                :key="opt.dimenCode">
                            </el-option>
                        </el-select>

                        </Col>
                        <Col span="8" v-if="editquesModalData.questionType == 4">
                        <label for="">最高分：</label>
                        <InputNumber :min="2" :max="10" v-model="editquesModalData.maxGrade" :editable="false"
                            style="width: 100px">
                        </InputNumber>
                        </Col>
                        <Col span="8">
                        <label for="">必答：</label>
                        <i-switch @on-change="changeSwitch" :value="true"></i-switch>

                        </Col>
                    </Row>
                    <Table :columns="columnOptions" :data="qsData" v-if="editquesModalData.questionType == 1">
                        <template slot-scope="{ row, index }" slot="opt-content">
                            <div style="float: left; width:80%">
                                <Input :maxlength="30" placeholder="最大可输入30字"
                                    v-model.trim="editqsData[index]['optionContent']" type="text" clearable
                                    @on-change="getIndexVal"></Input>
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
                                :style="{ color: index == qsData.length-1 ? '' : '#1890FF' }"
                                @click="index == qsData.length-1 ? '' : changePosition(index,2)"></span>
                        </template>
                        <template slot-scope="{ row, index }" slot="up-last">
                            <span class="icon iconfont icon-topm" :style="{ color: index == 0 ? '' : '#1890FF' }"
                                @click="index == 0 ? '' : changePosition(index,3)"></span>
                        </template>
                        <template slot-scope="{ row, index }" slot="down-last">
                            <span class="icon iconfont icon-downm"
                                :style="{ color: index == qsData.length-1 ? '' : '#1890FF' }"
                                @click="index == qsData.length-1 ? '' : changePosition(index,4)"></span>
                        </template>
                    </Table>
                    <Table :columns="columnOptions2" :data="qsData" v-if="editquesModalData.questionType == 2">
                        <template slot-scope="{ row, index }" slot="opt-content">
                            <div style="float: left; width:80%">
                                <Input :maxlength="30" v-model.trim="editqsData[index]['optionContent']" type="text"
                                    clearable @on-change="getIndexVal"></Input>
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
                                :style="{ color: index == qsData.length-1 ? '' : '#1890FF' }"
                                @click="index == qsData.length-1 ? '' : changePosition(index,2)"></span>
                        </template>
                        <template slot-scope="{ row, index }" slot="up-last">
                            <span class="icon iconfont icon-topm" :style="{ color: index == 0 ? '' : '#1890FF' }"
                                @click="index == 0 ? '' : changePosition(index,3)"></span>
                        </template>
                        <template slot-scope="{ row, index }" slot="down-last">
                            <span class="icon iconfont icon-downm"
                                :style="{ color: index == qsData.length-1 ? '' : '#1890FF' }"
                                @click="index == qsData.length-1 ? '' : changePosition(index,4)"></span>
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

                    <Button class="btn" type="primary" long
                        @click="saveQuesModalData(item.isediter ? item : '',i)">完成编辑</Button>
                </div>
            </div>
        </div>
        <div id="basic_usage"></div>
    </div>
</template>

<script>
    export default {
        name: "edit-question",
        data() {
            return {
                dpDisabled: false,
                quesModalData: {
                    dimenId: '',
                    questionContent: '',
                    ismust: '1',
                    questionType: '',
                    viewOrder: '',
                    options: [],
                    maxGrade: ''
                },
                editquesModalData: {},
                dimDisabled: true,
                quesDimSelect: '',
                dimensList: [],
                quesList: [],
                closeType: false,
                qsData: [],
                editqsData: [],
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
                qsType: {
                    single: 0,
                    some: 0,
                    ask: 0,
                    rate: 0,
                },
                mark: 0,
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
                ]
            }
        },

        created() {
            this.getDimensList()
        },

        mounted() {

        },

        methods: {
            cancel() { },
            addQuestion(e) {
                this.closeType = false;
                if (e == this.mark) return false;
                if (this.editqsData.length == 0) {
                    this.editquesModalData = {
                        dimenId: '',
                        questionContent: '',
                        ismust: '1',
                        questionType: '',
                        viewOrder: '',
                        options: [],
                        maxGrade: ''
                    };
                    this.quesDimSelect = '';
                    this.mark = e;
                    this.switchIndex(e)
                } else {
                    let Bootype = []
                    for (let r = 0; r < this.editqsData.length; r++) {
                        if (this.editqsData[r].optionContent != '' || this.editquesModalData.questionContent != '') {
                            Bootype.push('one')
                        }
                    }
                    let a = this.quesList.find(n => n.isedit == true || n.isediter == true)
                    if (Bootype.length > 0 && a != undefined) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: '您还有正在编辑的问题，确认要切换吗？',
                            onOk: () => {
                                this.editquesModalData = {
                                    dimenId: '',
                                    questionContent: '',
                                    ismust: '1',
                                    questionType: '',
                                    viewOrder: '',
                                    options: [],
                                    maxGrade: ''
                                };
                                this.editqsData = [];
                                this.quesDimSelect = '';
                                this.mark = e;
                                this.switchIndex(e)
                            },
                            onCancel: () => {
                                return false;
                            }
                        });
                    } else {
                        this.editquesModalData = {
                            dimenId: '',
                            questionContent: '',
                            ismust: '1',
                            questionType: '',
                            viewOrder: '',
                            options: [],
                            maxGrade: ''
                        };
                        this.quesDimSelect = '';
                        this.mark = e;
                        this.switchIndex(e)
                    }

                }


            },
            switchIndex(e) {
                //存在问题变状态
                let tList = [];
                if (this.quesList.length > 0) {
                    this.quesList.forEach((val, index, arr) => {
                        if (val.isediter) {
                            val.isediter = false;
                        }
                        tList.push(val);
                    })
                    this.quesList = tList;
                }
                //最后问题变状态
                if (this.quesList.length > 0 && this.quesList[this.quesList.length - 1].isedit) {
                    this.quesList.pop();
                    this.quesList.push({ isedit: true })
                } else {
                    this.quesList.push({ isedit: true })
                    console.log(this.quesList)
                }
                switch (e) {
                    case 1:
                        this.editquesModalData.questionType = 1;
                        this.qsData = [{ optionContent: '', optionGrade: 5, viewOrder: 1 }, { optionContent: '', optionGrade: 5, viewOrder: 2 }];
                        this.editqsData = this.cloneObj(this.qsData);
                        break;
                    case 2:
                        this.editquesModalData.questionType = 2;
                        this.qsData = [{ optionContent: '', optionGrade: 0, viewOrder: 1 }, { optionContent: '', optionGrade: 0, viewOrder: 2 }];
                        this.editqsData = this.cloneObj(this.qsData);
                        break;
                    case 3:
                        this.editquesModalData.questionType = 3
                        break;
                    case 4:
                        this.editquesModalData.questionType = 4;
                        this.editquesModalData.maxGrade = 10
                        break;
                }
            },
            getAddDi(e) {
                if (e == undefined) {
                    this.editquesModalData.dimenId = '';
                } else {
                    this.editquesModalData.dimenId = e;
                }
            },

            // 获取维度列表
            getDimensList() {
                this.$httpPost('sysDimenManage/getAllSysDimen').then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        this.dimensList = res.sysDimenList;
                        if (this.dimensList.length) {
                            this.dimDisabled = false;
                        }
                    }
                })
            },
            mm(a) {
                return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f" + a.join("\x0f\x0f") + "\x0f");
            },
            saveQuesModalData(el, idx) {
                //未填部分的处理
                if (this.editquesModalData.questionContent == '') {
                    this.$Message.warning('您还没有完善问题哦~');
                    return false;
                }
                if (this.editquesModalData.dimenId == '') {
                    this.$Message.warning('您尚未选择测评维度哦~');
                    return false;
                }
                //选项未填判断
                if (this.editquesModalData.questionType == 1 || this.editquesModalData.questionType == 2) {

                    for (let i = 0; i < this.editqsData.length; i++) {
                        if (this.editqsData[i].optionContent.length == 0) {
                            this.$Message.warning('问题选项不能有空的情况哦~');
                            return false;
                            break;
                        }
                    }
                    //相同选项判断
                    let booABarr = [];
                    for (let x = 0; x < this.editqsData.length; x++) {
                        let booAB = this.editqsData.findIndex(n => n.optionContent == this.editqsData[x].optionContent);
                        booABarr.push(booAB)
                    }
                    if (this.mm(booABarr)) {
                        this.$Message.warning('问题选项不能重复哦~');
                        return false;
                    }


                }


                //禁用分数的处理
                if (this.dpDisabled) {
                    this.editqsData.forEach((val, index) => {
                        val.optionGrade = 0
                    })
                }
                this.editquesModalData.options = this.editqsData;

                let subOpt = {}
                if (el == '') { //添加问题

                    subOpt = Object.assign(this.quesModalData, this.editquesModalData)
                    subOpt.viewOrder = this.quesList.length - 1;
                    delete (subOpt["txttip"])
                    delete (subOpt["dbquestionId"])
                } else {
                    subOpt = Object.assign(this.quesModalData, this.editquesModalData, { dbquestionId: el.dbquestionId })
                    delete (subOpt["txttip"])
                    delete (subOpt["isediter"])

                }
                this.$httpPost(el == '' ? 'questionDBManage/addQuestionDB' : 'questionDBManage/modifyQuestionDB', subOpt).then(res => {
                    if (res.resultcode == 1) {
                        if (el == '') {
                            subOpt = Object.assign(subOpt, { dbquestionId: res.dbquestionId })
                            this.quesList.pop()
                            let _newList = this.cloneObj(this.quesList);
                            _newList.push(JSON.parse(JSON.stringify(subOpt)));
                            let num1 = 0;
                            let num2 = 0;
                            let num3 = 0;
                            let num4 = 0;
                            _newList.forEach(val => {
                                let txttip = '';
                                switch (val.questionType) {
                                    case 1:
                                        txttip = '（单选）';
                                        num1++;
                                        break;
                                    case 2:
                                        txttip = '（复选）';
                                        num2++;
                                        break;
                                    case 4:
                                        txttip = '（评分）';
                                        num3++;
                                        break;
                                    case 3:
                                        txttip = '（问答）';
                                        num4++;
                                        break;
                                }
                                this.qsType.single = num1;
                                this.qsType.some = num2;
                                this.qsType.rate = num3;
                                this.qsType.ask = num4;
                                val.txttip = txttip;
                            })
                            this.quesList = _newList;
                        } else {
                            let _txttip = '';
                            switch (subOpt.questionType) {
                                case 1:
                                    _txttip = '（单选）';
                                    break;
                                case 2:
                                    _txttip = '（复选）';
                                    break;
                                case 4:
                                    _txttip = '（评分）';
                                    break;
                                case 3:
                                    _txttip = '（问答）';
                                    break;
                            }
                            let OB = this.cloneObj(this.quesList)
                            subOpt.txttip = _txttip;
                            OB[idx] = JSON.parse(JSON.stringify(subOpt));
                            this.quesList = OB;
                        }
                        this.$Message.success(el == '' ? '添加成功' : '修改成功');
                        this.qsData = [];
                        this.editqsData = [];
                        this.mark = ''
                    }


                })
            },

            changeSwitch(e) {
                if (e) {
                    this.editquesModalData.ismust = '1'
                } else {
                    this.editquesModalData.ismust = '0'
                }
            },
            getIndexVal() {
            },
            getGrade(row, index) {
                this.editqsData[index].optionGrade = row.optionGrade;

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
                if (this.mark == 1) {
                    Kdata.splice(e + 1, 0, { optionContent: '', optionGrade: 5, viewOrder: '' })
                } else {
                    Kdata.splice(e + 1, 0, { optionContent: '', optionGrade: 1, viewOrder: '' })
                }

                Kdata.forEach((val, index) => {
                    val.viewOrder = index + 1
                })
                this.editqsData = Kdata;
                this.qsData = Kdata;


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
                if (this.mark == 1) {
                    Kdata.push({ optionContent: '', optionGrade: 5, viewOrder: Kdata.length + 1 })
                } else {
                    Kdata.push({ optionContent: '', optionGrade: 5, viewOrder: Kdata.length + 1 })
                }

                this.editqsData = Kdata;
                this.qsData = Kdata;
            },
            //删除选项
            loseOption(e) {
                // this.qsData.splice(e, 1)
                // this.qsData.forEach((val, index) => {
                //     val.viewOrder = index + 1
                // })
                if (this.qsData.length == 2) {
                    this.$Message.warning('选项个数不能少于两个哦~');
                    return false;
                }
                let Kdata = []
                for (let i = 0; i < this.qsData.length; i++) {
                    if (e !== i) {
                        Kdata.push(this.qsData[i]);
                        Kdata.viewOrder = i + 1;
                    }
                }
                this.qsData = Kdata;
                this.editqsData = this.cloneObj(this.qsData);
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
            closeQustion(e) {
                this.closeType = true;
                this.qsData = [];
                if (e === '') {
                    this.quesList.pop();
                } else {
                    let aList = [];
                    this.quesList.forEach((val, index, arr) => {
                        if (val.isediter) {
                            val.isediter = false
                        }
                        aList.push(val)
                    })
                    this.quesList = aList
                }


            },
            editQuestion(e, i) {
                this.closeType = false;
                this.qsData = [];
                let aList = [];
                //添加是否存在，存在就删除，页面是否还存在编辑，存在就还原
                this.quesList.forEach((val, index, arr) => {
                    if (arr[arr.length - 1].isedit) {
                        arr[arr.length - 1].isedit = false;
                        arr.pop()
                    }
                    if (val.isediter) {
                        val.isediter = false
                    } else {
                        if (i == index) {
                            val.isediter = true
                        }
                    }
                    aList.push(val)
                })
                this.quesList = aList;  //刷新list状态
                //添加题目内容到编辑模板

                this.editquesModalData.dimenId = e.dimenId;
                this.editquesModalData.questionContent = e.questionContent;
                this.quesDimSelect = e.dimenId;
                switch (e.questionType) {
                    case 1:
                        this.editquesModalData.questionType = 1
                        this.qsData = e.options;
                        this.editqsData = this.cloneObj(this.qsData);
                        break;
                    case 2:
                        this.editquesModalData.questionType = 2
                        this.qsData = e.options;
                        this.editqsData = this.cloneObj(this.qsData);
                        break;
                    case 3:
                        this.editquesModalData.questionType = 3
                        break;
                    case 4:
                        this.editquesModalData.questionType = 4
                        this.editquesModalData.maxGrade = e.maxGrade
                        break;
                }

            },
            cloneObj(obj) {
                let o
                if (typeof obj === 'object') {
                    if (obj == null) {
                        o = null
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (let i = 0; i < obj.length; i++) {
                                o.push(this.cloneObj(obj[i]))
                            }
                        } else {
                            o = {};
                            for (let j in obj) {
                                o[j] = this.cloneObj(obj[j])
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            deleteQuestion(e, i) {
                this.$httpPost('questionDBManage/deleteQuestionDB', null, {
                    params: {
                        dbquestionId: e.dbquestionId
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        switch (e.questionType) {
                            case 1:
                                this.qsType.single--
                                break;
                            case 2:
                                this.qsType.some--
                                break;
                            case 4:
                                this.qsType.rate--;
                                break;
                            case 3:
                                this.qsType.ask--;
                                break;
                        }
                        this.quesList.splice(i, 1);
                        this.$Message.success('删除成功');
                    }
                })
            },
            goBack() {
                this.$router.push({
                    name: 'satisfact-ques'
                })
            }
        }

    }
</script>

<style lang="less">
    .edit {
        width: 100%;
        height: 100vh;
        overflow: auto;
    }

    .edit .header {
        position: fixed;
        top: 0;
        height: 60px;
        width: 100%;
        background-color: #fff;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        z-index: 100;

        .satis-exit-btn {
            width: 100px;
            height: 100%;
            padding: 18px 0 0 24px;
            cursor: pointer;
            float: left;


        }

        .tip-box {
            float: left;
            line-height: 60px;
            padding-left: 30px;

            span {
                padding-right: 10px;
                font-size: 16px
            }
        }

        .satis-exit-btn:hover {
            color: #1890FF
        }
    }

    .edit .aside {
        width: 116px;
        position: fixed;
        height: 100vh;
        background: #fff;
        padding-top: 80px;

        .ivu-anchor-ink {
            display: none !important;
        }

        .ivu-anchor-link {
            padding: 0 !important;
            margin: 8px 0 0 0px;
            width: 100%;
            height: 100%;
            font-size: 14px;

            a {
                color: #515a6e;
                width: 100%;
                height: 100%;
                display: block;
                padding-left: 16px
            }
        }

        .aside-single {
            margin: 10px auto 0;
            background: #f4f4f4;
            border: 1px solid #d8d8d8;
            border-radius: 4px;
            width: 90px;
            height: 32px;
            line-height: 32px;

            text-align: center;

            i {
                position: relative;
                top: -22px;
                left: -24px;
            }

            span {
                font-size: 14px;
                color: rgba(0, 0, 0, 0.65);
            }
        }

    }

    .qs-content {
        margin-left: 126px;
        font-size: 16px;
        margin-right: 10px;
        margin-top: 70px;
        color: #333333;

        .edit-box {
            position: relative;
        }

        .qs-list {
            background: #fff;
            padding: 20px;
            margin-top: 10px;
            border: 2px solid transparent;

            border-radius: 3px;

            span {
                cursor: pointer;
            }

            .icon-box {
                position: relative;
                padding-top: 10px;

                .icon-single {
                    display: none;
                    position: absolute;
                    right: 20px;
                    bottom: -10px;

                    .iconfont {
                        padding-right: 20px;
                        cursor: pointer;
                    }

                    .iconfont:hover {
                        color: #1890FF
                    }
                }
            }



            .ivu-table-wrapper {
                border: 0px !important;

                .ivu-table td,
                .ivu-table th {
                    border-bottom: 0px !important
                }

                .ivu-table:after,
                .ivu-table:before {
                    background-color: transparent !important
                }
            }

            .btn {
                margin-top: 20px
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

            .checkbox {
                padding: 5px 0;

                .ivu-radio-wrapper,
                .ivu-checkbox-wrapper {
                    font-size: 16px
                }
            }
        }

        .qs-list:hover {
            border-color: rgb(141, 198, 252);

            .icon-single {
                display: block
            }

        }
    }

    .edit .aside .aside-single:hover {
        border-color: rgb(24, 144, 255);
    }

    .edit .aside .ivu-anchor-link.actives a {
        color: rgb(24, 144, 255) !important;
    }

    .edit .aside .ivu-anchor-link.links {
        margin: 0 !important;
    }

    .edit .aside .ivu-anchor-link.links a {
        height: 32px;
        line-height: 32px;
    }

    .aside-single .icon-danxuanicon:before,
    .aside-single .icon-fuxuanicon:before,
    .aside-single .icon-edits:before,
    .aside-single .icon-pingfenicon:before {
        position: relative;
        bottom: 10px;
    }
</style>