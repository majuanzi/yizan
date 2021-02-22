<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="android-more-horizontal"></Icon>  
                单元测试
            </p>
            <can-edit-table refs="table" v-model="editInlineData" :columns-list="editInlineColumns"  @on-change="handleChange"></can-edit-table>
        </Card>
    </div>
</template>

<script>
import canEditTable from "../../components/canEditTable.vue";
export default {
  name: "page2",
  components: {
    canEditTable
  },
  data : function() {
    return {
      editInlineColumns: [
        {
          title: "序号",
          type: "index",
          width: 65,
          align: "center"
        },
        {
          title: "姓名",
          align: "center",
          key: "name",
          width: 90,
          editable: true
        },
        {
          title: "性别",
          align: "center",
          key: "sex",
        },
        {
          title: "岗位",
          align: "center",
          key: "work",
          editable: true
        },
        {
          title: "操作",
          align: "center",
          width: 190,
          key: "handle",
          handle: ["edit", "delete"]
        }
      ],
      editInlineData: [
        {
          name: "Aresn",
          sex: "男",
          work: "职业"
        },
        {
          name: "Lison",
          sex: "男",
          work: "职业"
        },
        {
          name: "lisa",
          sex: "女",
          work: "职业"
        }
      ]
    };
  },
  methods: {
    handleChange : function(val, index) {
      this.$Message.success("修改第" + (index + 1) + "行数据成功");
    }
  }
};
</script>