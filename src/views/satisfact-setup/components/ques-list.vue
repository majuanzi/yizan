<template>
    <div class="sat-ques-content">
        <dl v-for="(ques, index) in data" :key="ques.paperQuestionId">
            <dt>
                <Row style="margin-bottom: 10px">
                    <Col span="1" style="width:36px;" v-if="hasCheck">
                    <span>
                        <Checkbox v-model="ques.isChecked" :disabled="ques.isDisabled" @on-change="handleCheckChange">
                        </Checkbox>
                    </span>
                    </Col>
                    <Col span="22">
                    <span>{{index+1}}. {{ques.questionContent}}</span>
                    <span class="q-type">[{{questionTypeEm[ques.questionType]}}]</span>
                    <span class="q-type" v-if="!!ques.dimenName">[{{ques.dimenName}}]</span>
                    <span class="q-type" v-if="!!ques.departname">[{{ques.departname}}]</span>
                    <Button v-if="hasEdit" :disabled="ques.isSys === '1'" class="c-edit" type="text"
                        icon="ios-create-outline" @click="handleEdit(ques)"></Button>
                    <Button v-if="hasDel" :disabled="ques.isSys === '1'" class="c-trash" type="text"
                        icon="ios-trash-outline" @click="handleDel(index, ques.dbquestionId)"></Button>
                    </Col>
                </Row>
            </dt>
            <dd class="ivu-radio-group ivu-radio-group-vertical" :class="{ 'hasCheck': hasCheck }"
                v-if="ques.questionType == '1' || ques.questionType == '2'">
                <label class="ivu-radio-wrapper ivu-radio-group-item" v-for="opt in ques.options"
                    :key="opt.dbquestionOptionId">
                    <span class="ivu-radio">
                        <span class="ivu-radio-inner" v-if="ques.questionType == '1'"></span>
                        <span class="ivu-checkbox-inner" v-if="ques.questionType == '2'"></span>
                    </span>
                    <span>{{opt.optionContent}}</span>
                </label>
            </dd>
        </dl>
    </div>
</template>

<script>
    export default {
        name: 'ques-list',
        props: {
            data: {
                type: Array,
                required: true
            },
            hasCheck: {
                type: Boolean,
                default: false
            },
            hasEdit: {
                type: Boolean,
                default: true
            },
            hasDel: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                questionTypeEm: {
                    "1": "单选",
                    "2": "多选",
                    "3": "问答",
                    "4": "评分"
                },
            }
        },
        methods: {
            handleEdit(ques) {
                this.$emit('vh-ques-edit', ques);
            },

            handleDel(index, id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定要删除此题目吗？',
                    onOk: () => {
                        this.$emit('vh-ques-del', index, id);
                    }
                });

            },
            handleCheckChange(val) {
                let ret;
                if (!val) {
                    ret = val;
                } else {
                    ret = this.data.filter(d => d.isChecked).length === this.data.length;
                }
                this.$emit('vh-ques-checkall', ret);
            }
        }
    }
</script>

<style lang="less" scoped>
    .sat-ques-content {
        padding: 16px 30px 30px;
    }

    .sat-ques-content dl+dl {
        margin-top: 26px;
    }

    .sat-ques-content dl dd {
        padding-left: 16px;
    }

    .sat-ques-content dl dd.hasCheck {
        padding-left: 46px;
    }

    .sat-ques-content .ivu-radio-group-vertical .ivu-radio-wrapper {
        line-height: 20px;
        height: auto;
        margin-bottom: 14px;
        white-space: normal;
        display: flex;
    }

    .sat-ques-content .ivu-radio-group-vertical .ivu-radio-wrapper .ivu-radio {
        margin-right: 6px;
        margin-top: 3px;
    }

    .sat-ques-content dl dt .q-type {
        color: #9B9B9B;
    }

    .sat-ques-content dl dt .c-edit,
    .sat-ques-content dl dt .c-trash {
        padding: 0 6px;
        font-size: 14px;
    }
</style>