<style lang="less">
</style>

<template>
    <div>
        <Table :columns="columnsEvaluate" :data="dataEvaluateList" :stripe=true :border=true :show-header=true :loading=false :highlight-row=true></Table>
    </div>
</template>

<script>
export default {
  name: "evaluateAll",
  data: function() {
    return {
      columnsEvaluate: [
        {
          type: "index",
          width: 65,
          align: "center",
          title: "序号"
        },
        {
          title: "医生姓名",
          key: "docName"
        },
        {
          title: "所在科室",
          key: "deptName"
        },
        {
          title: "总体满意度",
          key: "populationSatisfaction"
        },
        {
          title: "专业性",
          key: "speciality"
        },
        {
          title: "及时性",
          key: "timeliness"
        },
        {
          title: "满意度",
          key: "satisfaction"
        }
      ],
      dataEvaluateList: [
        {
          docName: "王医生",
          deptName: "张三",
          populationSatisfaction: "99%",
          speciality: "90%",
          timeliness: "98",
          satisfaction: "92"
        }
      ]
    };
  },
  methods: {}
};
</script>

