<style type="text/css" scoped>
    .paraConfig .ivu-card-body {
        padding: 16px 0 !important;
    }

    .left-title {
        margin: 24px 24px 11px 24px;
        line-height: 22px;
        color: #333;
        font-weight: bold;
    }

    .infoIcon {
        position: relative;
        bottom: 1px;
        margin-right: 8px;
        background: #ef2a2a;
        color: white;
        border-radius: 50%;
        opacity: .7;
    }

    .slotFooter {
        height: 54px;
        line-height: 54px;
        position: sticky;
        bottom: 0;
        width: 100%;
        padding-left: 30px;
        border-top: 1px solid #f0f0f0;
        background: rgb(255, 255, 255)
    }

    .groupBtns {
        position: relative;
        top: 15px;
        float: right;
    }

    .ivu-btn-group.groupBtns:not(.ivu-btn-group-vertical) .ivu-btn-primary+.ivu-btn {
        border-left-color: #dcdee2;
    }
    .ivu-btn-group.groupBtns:not(.ivu-btn-group-vertical) .ivu-btn-primary+.ivu-btn:hover{
        border-left-color:#2b85e4;
    }

    .groupBtns button.ivu-btn-primary {
        border-radius: 4px !important;
    }

    .groupBtns button.ivu-btn-error {
        border-top-left-radius: 4px !important;
        border-bottom-left-radius: 4px !important;
    }

    .groupBtns button {
        border-radius: 4px !important;
    }

    .ivu-form-item {
        margin-bottom: 7px;
        line-height: 32px;
    }

    .info {
        margin-top: 16px 0 24px;
        padding-bottom: 24px;
        line-height: 20px;
        color: #ef2a2a;
        border-bottom: 1px solid #e9e9e9;

    }

    .docCancel {
        margin-bottom: 37px;
    }

    .freeTimes {
        margin-bottom: 67px;
    }

    .ivu-form .ivu-form-item-label {
        color: rgba(0, 0, 0, 0.65);
    }

    .ivu-input-number {
        width: 224px !important;
    }

    .forms {
        margin: 0 8px 24px;
        border: 1px solid #e9e9e9;
        border-radius: 4px 4px 0 0;
    }

    .forms em {
        line-height: 32px;
        font-style: normal
    }
</style>
<template>
    <Card class="paraConfig" :bordered="false">
        <Form :model="parameterList" :label-width="200" class="forms">
            <div class="ivu-modal-header"><span class="ivu-modal-header-inner" style="margin-left:8px;">参数配置</span>
            </div>
            <p class="left-title">
                照护参数配置
            </p>
            <Row>
                <Col span="12">
                <FormItem label="评价过期时间：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.comment_expire}}</span>
                        <em>天</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="1" v-model.number="parameterList.comment_expire"
                            :editable="false"></InputNumber>
                        <em style="margin-left:8px;">天</em>
                    </div>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="照护抽成比例：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.care_cut}}</span>
                        <em>%</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="0.1" v-model.number="parameterList.care_cut"
                            :editable="false"></InputNumber>
                        <em style="margin-left:8px">%</em>
                    </div>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="照护时长：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.care_minite}}</span><em>分钟</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="5" :max="60"
                            v-model.number="parameterList.care_minite" :editable="false"></InputNumber>
                        <em style="margin-left:8px">分钟</em>
                    </div>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="照护开始前不可预约时间：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.care_before_limit}}</span><em>分钟</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="10" :max="60"
                            v-model.number="parameterList.care_before_limit" :editable="false"></InputNumber>
                        <em style="margin-left:8px">分钟</em>
                    </div>

                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="未支付订单时效：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.nopay_minite}}</span><em>分钟</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="10" :max="60"
                            v-model.number="parameterList.nopay_minite" :editable="false"></InputNumber>
                        <em style="margin-left:8px">分钟</em>
                    </div>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="医生取消订单时效：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.doctor_cancel_minite}}</span><em>分钟</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="10" :max="60"
                            v-model.number="parameterList.doctor_cancel_minite" :editable="false"></InputNumber>
                        <em style="margin-left:8px">分钟</em>
                    </div>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="患者可退款时效：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.patient_cancel_minite}}</span>
                        <em>分钟</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="10" :max="60"
                            v-model.number="parameterList.patient_cancel_minite" :editable="false"></InputNumber>
                        <em style="margin-left:8px">分钟</em>
                    </div>
                </FormItem>
                </Col>

                <Col span="12">
                <FormItem label="患者留言字数：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.bbs_word}}</span>
                        <em>字</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="10" :max="60"
                                     v-model.number="parameterList.bbs_word" :editable="false"></InputNumber>
                        <em style="margin-left:8px">字</em>
                    </div>
                </FormItem>
                </Col>

                <Col span="12">
                <FormItem label="患者留言条数：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.bbs_number}}</span>
                        <em>条</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="10" :max="60"
                                     v-model.number="parameterList.bbs_number" :editable="false"></InputNumber>
                        <em style="margin-left:8px">条</em>
                    </div>
                </FormItem>
                </Col>

                <Col span="12">
                <FormItem label="患者咨询字数限制：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.care_word}}</span>
                        <em>字</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="10" :max="60"
                                     v-model.number="parameterList.care_word" :editable="false"></InputNumber>
                        <em style="margin-left:8px">字</em>
                    </div>
                </FormItem>
                </Col>

                <Col span="12">
                <FormItem label="医生回复时间（天）：">
                    <div v-if="itemStatus">
                        <span>{{parameterList.doctor_reply_time}}</span>
                        <em>天</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="10" :max="60"
                                     v-model.number="parameterList.doctor_reply_time" :editable="false"></InputNumber>
                        <em style="margin-left:8px">天</em>
                    </div>
                </FormItem>
                </Col>


                <Col span="24" class="infoDetail" style="padding:0 24px;">
                <div class="info">
                    <Icon type="ios-information" class="infoIcon" size="16"></Icon>注：照护开始前不可预约时间必须大于未支付订单时效5分钟以上
                </div>
                </Col>
            </Row>
            <p class="left-title">
                医生参数配置
            </p>
            <Row>
                <Col span="12" class="infoDetail">
                <FormItem label="医生可取消订单次数：" class="docCancel">
                    <div v-if="itemStatus">
                        <span>{{parameterDoctor.setcanceltimes}}</span>
                        <em>次/月</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="1" v-model.number="parameterDoctor.setcanceltimes"
                            :editable="false"></InputNumber>
                        <em style="margin-left:8px">次/月</em>
                    </div>
                </FormItem>
                </Col>
            </Row>
            <p class="left-title">
                免费照护参数配置
            </p>
            <Row>
                <Col span="12">
                <FormItem label="患者每天可免费就诊次数：" class="freeTimes">
                    <div v-if="itemStatus">
                        <span>{{parameterFree.getFreeTimes}}</span>
                        <em>次/天</em>
                    </div>
                    <div v-else>
                        <InputNumber :disabled="itemStatus" :min="0" v-model.number="parameterFree.getFreeTimes"
                            :editable="false"></InputNumber>
                        <em style="margin-left:8px">次/天</em>
                    </div>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <div class="slotFooter">
            <ButtonGroup size="large" class="groupBtns">
                <Button v-show="itemStatus" type="primary" size="large" @click="editParameter">编辑</Button>
                <Button v-show="!itemStatus" style="margin:0 10px;" size="large" 
                    @click="cancleParams" class="abc">取消</Button>
                <Button v-show="!itemStatus" :disabled="isDisabled" size="large" type="primary" style="margin:0 10px;"
                    @click="savaParams">
                    确认
                    <Icon v-show="showLoad" type="load-c" size=15 class="demo-spin-icon-load"></Icon>
                </Button>
            </ButtonGroup>
        </div>
    </Card>
</template>
<script>
    export default {
        data: function () {
            return {
                showLoad: false,//点击确定加载动画
                isDisabled: false,//确定按钮是否可点
                itemStatus: true,
                // 照护参数
                parameterList: {
                    'comment_expire': 0,//评价过期时间：
                    'care_cut': 0,//照护抽成比例：
                    'care_minite': 0,//照护时长：
                    'care_before_limit': 0,//照护开始前不可预约时间：

                    'nopay_minite': 0,//待支付时长
                    'doctor_cancel_minite': 0,//医生可取消时长

                    'bbs_word': 0//

                },
                // 取消操作使用
                cookieParams: {
                    'comment_expire': 0,//评价过期时间：
                    'care_cut': 0,//照护抽成比例：
                    'care_minite': 0,//照护时长：
                    'care_before_limit': 0,//照护开始前不可预约时间：

                    'nopay_minite': 0,//待支付时长
                    'doctor_cancel_minite': 0,//医生可取消时长
                    'patient_cancel_minite': 0,//患者取消时长
                    'bbs_word': 0,
                    'bbs_number': 0,
                    'care_word': 0,
                    'doctor_reply_time': 0,



                },
                // 医生参数配置
                parameterDoctor: {
                    'setcanceltimes': 0,//医生月取消次数

                },
                cookieParamsDoctor: {
                    'setcanceltimes': 0,//医生月取消次数

                },
                // 医生参数配置
                parameterFree: {
                    'getFreeTimes': 0,//医生月取消次数
                },
                cookieParamsFree: {
                    'getFreeTimes': 0,//医生月取消次数
                }
            }
        },
        mounted() {
            this.getPlatformCareParam();//照护获取参数
            this.getCancelTimes();//医生参数获取
            this.getFreeTimes();//获取免费次数
        },
        methods: {
            //获取照护参数
            getPlatformCareParam() {
                const httpUrl = 'getPlatformCareParam';
                let httpParams = {};
                this.$post(httpUrl, httpParams).then(response => {
                    if (response.resultcode == 1) {
                        // 评论过期天数、照护时长、照护前不可预约、照护抽成
                        this.parameterList.comment_expire = Number(response.pfCareParam.comment_expire);
                        this.parameterList.care_minite = Number(response.pfCareParam.care_minite);
                        this.parameterList.care_before_limit = Number(response.pfCareParam.care_before_limit);
                        this.parameterList.care_cut = Number(response.pfCareParam.care_cut);

                        this.parameterList.nopay_minite = Number(response.pfCareParam.nopay_minite);//待支付时长
                        this.parameterList.doctor_cancel_minite = Number(response.pfCareParam.doctor_cancel_minite);//医生可取消时长
                        this.parameterList.patient_cancel_minite = Number(response.pfCareParam.patient_cancel_minite);//患者取消时长
                        this.parameterList.bbs_word = Number(response.pfCareParam.bbs_word);
                        this.parameterList.bbs_number = Number(response.pfCareParam.bbs_number);
                        this.parameterList.care_word = Number(response.pfCareParam.care_word);
                        this.parameterList.doctor_reply_time = Number(response.pfCareParam.doctor_reply_time);



                        // 取消时使用
                        this.cookieParams.comment_expire = Number(response.pfCareParam.comment_expire);
                        this.cookieParams.care_minite = Number(response.pfCareParam.care_minite);
                        this.cookieParams.care_before_limit = Number(response.pfCareParam.care_before_limit);
                        this.cookieParams.care_cut = Number(response.pfCareParam.care_cut);

                        this.cookieParams.nopay_minite = Number(response.pfCareParam.nopay_minite);
                        this.cookieParams.doctor_cancel_minite = Number(response.pfCareParam.doctor_cancel_minite);
                        this.cookieParams.patient_cancel_minite = Number(response.pfCareParam.patient_cancel_minite);
                        this.cookieParams.bbs_word = Number(response.pfCareParam.bbs_word);
                        this.cookieParams.bbs_number = Number(response.pfCareParam.bbs_number);
                        this.cookieParams.care_word = Number(response.pfCareParam.care_word);

                        this.cookieParams.octor_reply_time = Number(response.pfCareParam.octor_reply_time);



                    }
                })
            },

            // 医生参数获取
            getCancelTimes() {
                const httpUrl = 'getCancelTimes';
                let httpParams = {};
                this.$post(httpUrl, httpParams).then(response => {
                    if (response.resultcode == 1) {
                        this.parameterDoctor.setcanceltimes = Number(response.setcanceltimes);



                        // 取消时使用
                        this.cookieParamsDoctor.setcanceltimes = Number(response.setcanceltimes);


                    }
                })
            },
            // 患者每天免费就诊次数获取
            getFreeTimes() {
                const httpUrl = 'getFreeTimes';
                let httpParams = {};
                this.$post(httpUrl, httpParams).then(response => {
                    if (response.resultcode == 1) {
                        this.parameterFree.getFreeTimes = Number(response.setfreetimes);
                        // 取消时使用
                        this.cookieParamsFree.getFreeTimes = Number(response.setfreetimes);
                    }
                })
            },
            // 编辑
            editParameter() {
                this.itemStatus = false;
            },
            // 取消保存
            cancleParams() {
                // 照护重置参数值
                this.parameterList.comment_expire = this.cookieParams.comment_expire;
                this.parameterList.care_minite = this.cookieParams.care_minite;
                this.parameterList.care_before_limit = this.cookieParams.care_before_limit;
                this.parameterList.care_cut = this.cookieParams.care_cut;

                this.parameterList.nopay_minite = this.cookieParams.nopay_minite;
                this.parameterList.doctor_cancel_minite = this.cookieParams.doctor_cancel_minite;
                this.parameterList.patient_cancel_minite = this.cookieParams.patient_cancel_minite;
                this.parameterList.bbs_word = this.cookieParams.bbs_word;
                this.parameterList.bbs_number = this.cookieParams.bbs_number;
                this.parameterList.care_word = this.cookieParams.care_word;
                this.parameterList.octor_reply_time = this.cookieParams.octor_reply_time;

                // 医生重置参数值
                this.parameterDoctor.setcanceltimes = this.cookieParamsDoctor.setcanceltimes;


                this.itemStatus = true;
            },
            // 保存照护参数
            savaParams() {
                if (this.parameterList.care_before_limit - this.parameterList.nopay_minite < 5) {
                    this.$Message.error({
                        content: '照护开始前不可预约时间必须大于未支付订单时效5分钟以上',
                        duration: 3
                    })
                    return;
                }
                this.showLoad = true;//点击确定加载动画
                this.isDisabled = true;//确定按钮是否可点
                const httpUrl = 'savePlatformCareParam';
                let httpParams = {
                    'paramInfo': this.parameterList
                };
                this.$post(httpUrl, httpParams).then(response => {
                    if (response != 404) {
                        this.cookieParams.comment_expire = this.parameterList.comment_expire;
                        this.cookieParams.care_minite = this.parameterList.care_minite;
                        this.cookieParams.care_before_limit = this.parameterList.care_before_limit;
                        this.cookieParams.care_cut = this.parameterList.care_cut;

                        this.cookieParams.nopay_minite = this.parameterList.nopay_minite;
                        this.cookieParams.doctor_cancel_minite = this.parameterList.doctor_cancel_minite;
                        this.cookieParams.patient_cancel_minite = this.parameterList.patient_cancel_minite;

                        this.cookieParams.bbs_word = this.parameterList.bbs_word;
                        this.cookieParams.bbs_number = this.parameterList.bbs_number;
                        this.cookieParams.care_word = this.parameterList.care_word;
                        this.cookieParams.octor_reply_time = this.parameterList.octor_reply_time;




                        this.savaParamsDoctor();
                    } else {
                        this.showLoad = false;//点击确定加载动画
                        this.isDisabled = false;//确定按钮是否可点
                    }
                })
            },

            // 保存医生参数
            savaParamsDoctor() {
                const httpUrl = 'setCancelTimes';
                let httpParams = {
                    'setCancelTimes': this.parameterDoctor.setcanceltimes,

                };
                this.$post(httpUrl, httpParams).then(response => {
                    if (response.resultcode == 1) {
                        this.cookieParamsDoctor.setcanceltimes = this.parameterDoctor.setcanceltimes;



                        this.savaParamsFree();
                        // this.$Message.success('修改成功');
                        // this.itemStatus = true;
                        // this.showLoad = false;//点击确定加载动画
                        // this.isDisabled = false;//确定按钮是否可点   
                    } else {
                        this.showLoad = false;//点击确定加载动画
                        this.isDisabled = false;//确定按钮是否可点
                    }
                })
            },

            // 保存免费参数配置
            savaParamsFree() {
                const httpUrl = 'setFreeTimes';
                let httpParams = {
                    'setfreetimes': this.parameterFree.getFreeTimes
                };
                this.$post(httpUrl, httpParams).then(response => {
                    if (response.resultcode == 1) {
                        this.cookieParamsFree.getFreeTimes = this.parameterFree.getFreeTimes;
                        this.$Message.success('修改成功');
                        this.itemStatus = true;
                        this.showLoad = false;//点击确定加载动画
                        this.isDisabled = false;//确定按钮是否可点   
                    } else {
                        this.showLoad = false;//点击确定加载动画
                        this.isDisabled = false;//确定按钮是否可点
                    }
                })
            }
        }
    }
</script>