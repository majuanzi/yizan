<template>
	<Card dis-hover>
		<p slot="title">更改时长</p>
		<Table :columns="columns" :data="data" :stripe=true :border=true :show-header=true :loading=false :highlight-row=true @on-current-change="select"></Table>
		<Texter :text="texter"></Texter>
		<Select :text="tests" filterable></Select>
		<Button :thisButton="thisButton"></Button>
		<RadioGroup v-model="phone" vertical type="button">
		<Radio label="apple">
			<Icon type="social-apple"></Icon>
			<span>Apple</span>
		</Radio>
		
		<Radio label="android" disabled>
			<Icon type="social-android"></Icon>
			<span>android</span>
		</Radio>
		
		<Radio label="windows">
			<Icon type="social-windows"></Icon>
			<span>windows</span>
		</Radio>
		</RadioGroup>
		{{phone}}
	</Card>
</template>

<script>
import Texter from "../../components/props.vue";


const btnstatus = (vm,h) =>{
	return h(
		'Button',
		{
			props:{
				type:'primary',
				size:'small'
			},
			on:{
				click: () =>{
				}
			}
		},
		'编辑'
	)
}

export default {
name: "page1",
components: {
	Texter
},
data : function() {
	return {
	texter: "测试测试",
	phone : 'apple',
	columns: [
		{
		title: "姓名",
		key: "name",
		align: "center"
		},
		{
		title: "年龄",
		key: "age",
		align : 'center',
		},
		{
		title: "状态",
		align : 'center',
		render: (h, params) => {
			const row = params.row;
			const color =
			row.status === 1 ? "blue" : row.status === 2 ? "green" : "yellow";  
			const text =
			row.status === 1 ? "Working" : row.status === 2 ? "Success" : "Fail";
			return h("Tag", {
				props: {
				type: "dot",
				color: color
				}
			},
			text
			);
		}
		},
		{
		title: "名称",
		key: "address",
		align : 'center'
		},
		{
		title: "时间",
		key: "date",
		align : 'center'
		},
		{
		title: "操作",
		align : 'center',
		render: (h,params) => {
			return h('div',[
			h('Button',{
				props:{
					type:'primary',
					// size:'small'
				},
				style:{
					marginLeft:'10px'
				},
				on:{
					click: ()=>{
					}
				}
				}, '查看'),
			h('Button',{
				props:{
					type:'error',
					// size:'small'
				},
				style:{
					marginLeft:'10px'
				}
				},'删除'),
			] 
			)
		}
		}
	],
	tests:[

	],
	thisButton:[
	],
	data: [
		{
		name: "John Brown",
		age: 18,
		address: "New York No. 1 Lake Park",
		date: "2016-10-03",
		status:1
		},
		{
		name: "Jim Green",
		age: 24,
		address: "London No. 1 Lake Park",
		date: "2016-10-01",
		status:2
		},
		{
		name: "Joe Black",
		age: 30,
		address: "Sydney No. 1 Lake Park",
		date: "2016-10-02"
		},
		{
		name: "Jon Snow",
		age: 26,
		address: "Ottawa No. 2 Lake Park",
		date: "2016-10-04"
		}
	]
	};
},
methods: {
	select : function(e) {
	},
	setInput : function(){

	}
}
};
</script>
