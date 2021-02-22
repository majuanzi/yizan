<template>
    <Card>
        <Form :model="parameterDoctor" :label-width="200">
            <Row>
                <Col span="12">
                    <FormItem label="医生可取消订单次数：">
                        <InputNumber :disabled="itemStatus" :min="1" v-model.number="parameterDoctor.setcanceltimes" :editable="false"></InputNumber><em style="margin-left:10px;font-style:normal;">次/月</em>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="患者每天可免费就诊次数">
                        <InputNumber :disabled="itemStatus" :min="1" v-model.number="parameterDoctor.setcanceltimes" :editable="false"></InputNumber><em style="margin-left:10px;font-style:normal;">次/天</em>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div style="text-align:center;">
            <Button v-show="itemStatus" type="primary" icon="md-create" @click="editParameter">编辑</Button>
            <Button v-show="!itemStatus" type="error" style="margin:0 10px;" icon="close-round" @click="cancleParams">取消</Button>
            <Button v-show="!itemStatus" :disabled="isDisabled" type="success" style="margin:0 10px;" icon="checkmark-round" @click="savaParams">
                确认
                <Icon v-show="showLoad" type="load-c" size=15 class="demo-spin-icon-load"></Icon>
            </Button>
        </div>
    </Card>
</template>

<script>
export default {
    data(){
        return {
            showLoad : false,//点击确定加载动画
            isDisabled : false,//确定按钮是否可点
            itemStatus : true,
            parameterDoctor : {
                'setcanceltimes' : 0,//医生月取消次数
            },
            cookieParamsDoctor : {
                'setcanceltimes' : 0,//医生月取消次数
            }
        }
    },
   mounted (){
       this.getCancelTimes();
   },
   methods :{
        // 平台参数获取
        getCancelTimes (){
            const httpUrl = 'getCancelTimes';
            let httpParams = {};
            this.$post(httpUrl,httpParams).then(response=>{
                if(response.resultcode == 1){
                    this.parameterDoctor.setcanceltimes = Number(response.setcanceltimes);
                    // 取消时使用
                    this.cookieParamsDoctor.setcanceltimes = Number(response.setcanceltimes);
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
            this.parameterDoctor.setcanceltimes = this.cookieParamsDoctor.setcanceltimes;
            this.itemStatus = true;
        },
        // 保存
        savaParams(){
            this.showLoad = true;//点击确定加载动画
            this.isDisabled = true;//确定按钮是否可点
            const httpUrl = 'setCancelTimes';
            let httpParams = {
                'setCancelTimes' : this.parameterDoctor.setcanceltimes
            };
            this.$post(httpUrl,httpParams).then(response=>{
                if(response.resultcode == 1){
                    this.cookieParamsDoctor.setcanceltimes = this.parameterDoctor.setcanceltimes;
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

