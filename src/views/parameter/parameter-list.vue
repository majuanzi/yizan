<template>
    <Card>
        <div>
            <Form :model="parameterList" :label-width="200">
                <Row>
                    <Col span="24">
                        <FormItem label="未支付订单时效：">
                            <InputNumber :disabled="itemStatus" :min="10" :max="60" v-model.number="parameterList.nopay_minite" :editable="false"></InputNumber><em style="margin-left:10px;font-style:normal;">分钟</em>
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem label="医生取消订单时效：">
                            <InputNumber :disabled="itemStatus" :min="10" :max="60" v-model.number="parameterList.doctor_cancel_times" :editable="false"></InputNumber><em style="margin-left:10px;font-style:normal;">分钟</em>
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem label="患者可取消订单时效：">
                            <InputNumber :disabled="itemStatus" :min="10" :max="60" v-model.number="parameterList.patient_cancel_minite" :editable="false"></InputNumber><em style="margin-left:10px;font-style:normal;">分钟</em>
                        </FormItem>
                    </Col>
                </Row>
                <div style="text-align:center;">
                    <Button v-show="itemStatus" type="primary" icon="md-create" @click="editParameter">编辑</Button>
                    <Button v-show="!itemStatus" type="error" style="margin:0 10px;" @click="cancleParams">取消</Button>
                    <Button v-show="!itemStatus" type="success" style="margin:0 10px;" @click="savaParams">确认</Button>
                </div>
            </Form>
        </div>
    </Card>
</template>
<script>

export default {
    data(){
        return{
            itemStatus : true,
            // 参数
            parameterList : {
                'nopay_minite' : 0,//待支付时长
                'doctor_cancel_times' : 0,//医生可取消时长
                'patient_cancel_minite' : 0//患者取消时长
            },
            // 取消操作使用
            cookieParams : {
                'nopay_minite' : 0,//待支付时长
                'doctor_cancel_times' : 0,//医生可取消时长
                'patient_cancel_minite' : 0//患者取消时长
            }
        }
    },
    mounted : function(){
        this.getPlatformParam();
    },
    methods : {
        // 平台参数获取
        getPlatformParam (){
            const httpUrl = 'getPlatformOrderParam';
            let httpParams = {};
            this.$post(httpUrl,httpParams).then(response=>{
                if(response.resultcode == 1){
                    this.parameterList.nopay_minite = Number(response.nopay_minite);//待支付时长
                    this.parameterList.doctor_cancel_times = Number(response.doctor_cancel_times);//医生可取消时长
                    this.parameterList.patient_cancel_minite = Number(response.patient_cancel_minite);//患者取消时长
                    // 取消时使用
                    this.cookieParams.nopay_minite = Number(response.nopay_minite);
                    this.cookieParams.doctor_cancel_times = Number(response.doctor_cancel_times);
                    this.cookieParams.patient_cancel_minite = Number(response.patient_cancel_minite);
                }
            })
        },
        // 编辑
        editParameter (){
            this.itemStatus = false;
        },
        // 取消保存
        cancleParams (){
            // 重置参数值
            this.parameterList.nopay_minite = this.cookieParams.nopay_minite;
            this.parameterList.doctor_cancel_times = this.cookieParams.doctor_cancel_times;
            this.parameterList.patient_cancel_minite = this.cookieParams.patient_cancel_minite;
            this.itemStatus = true;
        },
        // 确定提交
        savaParams (){
            const httpUrl = 'savePlatformOrderParam';
            let httpParams = {
                'paramInfo' : this.parameterList
            };
            this.$post(httpUrl,httpParams).then(response=>{
                if(response != 404){
                    this.cookieParams.nopay_minite = this.parameterList.nopay_minite;
                    this.cookieParams.doctor_cancel_times = this.parameterList.doctor_cancel_times;
                    this.cookieParams.patient_cancel_minite = this.parameterList.patient_cancel_minite;
                    this.itemStatus = true;
                    this.$Message.success('修改成功');
                }
            })
        }
        
    }
}
</script>

