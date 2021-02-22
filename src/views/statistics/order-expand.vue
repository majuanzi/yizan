<template>
    <div>
        <Row class="expand-row" v-for="item in childrenList">
            <Col span="4">
                <span class="expand-key">照护时间: </span>
                <span class="expand-value">{{ item.caredate }}</span>
            </Col>
            <Col span="4">
                <span class="expand-key">开始时间: </span>
                <span class="expand-value">{{ item.carestarttime }}</span>
            </Col>
            <Col span="4">
                <span class="expand-key">结束时间: </span>
                <span class="expand-value">{{ item.careendtime }}</span>
            </Col>  
            <Col span="4">
                <span class="expand-key">照护状态: </span>
                <span class="expand-value">{{ item.status }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">评价: </span>
                <span class="expand-value">{{ item.evaluate }}</span>
            </Col>
        </Row>
        <div v-show="nullShow" style="text-align:center;color:red"> 查询数据为空 </div>
    </div>
</template>

<script>
export default {
    props: {
        row: Object
    },
    data : function(){
        return {
            nullShow : false,
            childrenList : []
        }
    },
    mounted : function(){
        this.getChildrenList();
    },
    methods : {
        getChildrenList : function(){
            const httpUrl = 'getCareListByOrderId';
            let  httpParams = {
                'orderId' : this.row.orderid
            }
            this.$post(httpUrl,httpParams).then(response => {
                if(response.careList.length > 0){
                    this.nullShow = false;
                    this.childrenList = response.careList;
                    for(let i=0;i<this.childrenList.length;i++){
                        if(!this.childrenList[i].status){
                            this.childrenList[i].status = '未知状态'
                        }
                        if(this.childrenList[i].status == 0){
                            this.childrenList[i].status = '未支付'
                        }else if(this.childrenList[i].status == 1){
                            this.childrenList[i].status = '已支付'
                        }else{
                            this.childrenList[i].status = '已取消'
                        }


                        if(!this.childrenList[i].evaluate){
                            this.childrenList[i].evaluate = '未评价'
                        }
                    }
                } else {
                    this.nullShow = true;
                }
            });
        }
    }
}
</script>

