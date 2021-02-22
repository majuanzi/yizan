<style lang="less">
    @import './bill.less';
</style>


<template>
    <Card dis-hover>
        <Row>
            <Col span="4">
                <Select v-model="cityModel" style="width:200px;" filterable>
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </Col>
            <Col span="4">
                <DatePicker type="month" placeholder="请选择账单日期" style="width: 200px"></DatePicker>
            </Col>
        </Row>
        <div class="bill hos-card-tab">
            <Table ref="table" :columns="columnsBill" :data="dataBill" :stripe=true :border=true :show-header=true :loading=false :highlight-row=true @on-current-change="selectBill"></Table>
            <div class="hos-card-page">
		        <Page :total="10" :current="1" :page-size="10" @on-change="changePage"></Page>
            </div>
            <Button style="margin-top:10px;" type="primary" @click="exportData"><Icon type="ios-download-outline"></Icon> 导出</Button>
        </div>
    </Card>
</template>

<script>
export default {
    name : 'bill',
    data : function(){
        return {
            cityList : [
                {
                    value : '北京',
                    label : '北京'
                },
                {
                    value : '上海',
                    label : '上海'
                },
                {
                    value : '深圳',
                    label : '深圳'
                },
                {
                    value : '广东',
                    label : '广东'
                },
                {
                    value : '杭州',
                    label : '杭州'
                }
            ],
            cityModel : '北京',
            // 列表
            columnsBill : [
                {
                    type: 'index',
                    width: 65,
                    align: 'center',
                    title: '序号'
                },
                {
                    title : '对账机构编码',
                    key : 'billNum'
                },
                {
                    title : '创建人',
                    key : 'createPeople'
                },
                {
                    title : '交易流水号',
                    key : 'transactionNum'
                },
                {
                    title : '交易账号',
                    key : 'transactionAccount'
                },
                {
                    title : '交易时间',
                    key : 'transactionTime'
                },
                {
                    title : '交易金额',
                    key : 'AccountMoney'
                },
                {
                    title : '医生姓名',
                    key : 'docName'
                },
                {
                    title : '医生手机号',
                    key : 'docPhone'
                },
                {
                    title : '备注',
                    key : 'note'
                }
            ],
            dataBill : [{
                billNum : 'wx0001',
                createPeople : '张三',
                transactionNum : '2018041700001',
                transactionAccount : '6227002233118987',
                transactionTime : '2018-04-17',
                AccountMoney : '108',
                docName : '主治医师',
                docPhone : '15701160222',
                note : '无'
            }]
        }
    },
    mounted : function(){
        this.getData();
    },
    methods :{
        getData:function(){
            // for(let i=0;i<this.dataBill.length;i++){
            //     this.dataBill[i].transactionAccount = '="'+this.dataBill[i].transactionAccount+'"';
            // }
        },
        selectBill : function(e){
        },
        changePage : function(){

        },
        // 导出
        exportData : function(){
            this.$refs.table.exportCsv({
                filename: '对账单'
            });
        }
    }
}
</script>

