<style lang="less">
    .dept-details{
        .ivu-input[disabled], fieldset[disabled] .ivu-input{
            cursor: auto;
        }
    }
</style>

<template>
	<div class="dept-details">
		<!-- 科室信息 -->
        <p class="right-title">
            <Button type="text" disabled>{{departmentmationselect.deptname}}</Button>
        </p>
        <div>
            <div class="dept-details-deptname">
                科室名称：<Input :maxlength="20" style="width:auto;" :disabled="edit.contenteditable" v-model="departmentmationselect.deptname"/></Input>
            </div>
            <p class="dept-details-deptdesc">
                科室简介：
                <Input :maxlength="98" type="textarea" resize="none" :autosize="true" :disabled="edit.contenteditable"
                       v-model="departmentmationselect.deptdesc == 'null'? '': departmentmationselect.deptdesc"></Input>
            </p>
        </div>
		<!-- 科室信息end -->
		<Row v-show="showleftcontent">
			<Col span="4" v-for="item in deptList" style="text-align:center;margin-top:10px;">
				<Button style="width:80%;" type="primary" @click="changeDept(item)">{{item.deptname}}</Button>
			</Col>
		</Row>
	</div>
</template>

<script>
import hosMationDoc from './hos-dept-doc.vue'
export default {
    components : {
        hosMationDoc
    },
	props :['departmentid','hospitalname','showleftcontent','showrightcontent','departmentmationselect'],
	data  : function(){
		return {
            deptDetails : {},//科室详情信息
            edit :{
                contenteditable :true,//是否是可编辑状态
                iconType : 'md-create',
                saveShow : false,
                contentInit : '编辑',//编辑提示信息
            },
            cookieDetails : {
                deptname : '',
                deptdesc : ''
            },
			//科室列表
			deptList : [],
            deptDoc : {},
            deptFirstMation : {
                "deptid": '',
                "deptname": '',
                "deptdesc": '',
                "hospitalid": '',
                "parentid": null,
            }

		}
    },
	mounted : function() {
		// 获取科室子集
        this.getDeptList();
	},
	methods : {
		 // 获取科室详情信息
        getDeptDetails : function(){
            const httpUrl = 'getDepartmentDetail';
            let  httpParams = {
                'departmentId' : this.deptDoc.deptid
            }
            this.$post(httpUrl,httpParams).then(response => {
                if(response!=404){
                    this.deptDetails = response.departmentDetail;
                }
            });
        },
		// 获取科室子集
		getDeptList : function(){
			let httpUrl = 'getChildrenByDeptId';
            let  httpParams = {
                'departmentId' : this.departmentid
            }
            this.$post(httpUrl,httpParams).then(response => {
                this.deptList = response.departmentList;
                if(response!=404){
                    if(response.departmentList.length>0){
                        this.deptDoc = response.departmentList[0];
                        this.getDeptDetails();
                    } else {

                        this.deptList.push(this.departmentmationselect);
                    }
                }
            });
		},
		changeDept : function (item){
            this.$store.dispatch('getDeptId',item.deptid);
            this.$store.dispatch('getHospitalName',this.hospitalname);
			this.$router.push({
				name : 'hos-dept-doc',
				params : {
					deptMation : item,
					hospitalname : this.hospitalname,
				}
			})
		},
        editDeptMation : function(){
            this.edit.contentInit == '编辑'?this.editDept():this.saveDept();
        },
        // 编辑科室信息
        editDept : function(){
            // 编辑使用begin
            this.cookieDetails.deptname = this.departmentmationselect.deptname;
            this.cookieDetails.deptdesc = this.departmentmationselect.deptdesc;
            // 编辑使用end
            this.edit.iconType = 'checkmark-round';
            this.edit.saveShow = true;
            this.edit.contenteditable = false;
            this.edit.contentInit = '保存';
        },
        // 提交并保存科室信息
        saveDept : function(){
            this.deptFirstMation.deptname = this.departmentmationselect.deptname;
            this.deptFirstMation.deptdesc = this.departmentmationselect.deptdesc;
            if(!this.departmentmationselect.deptname||!this.departmentmationselect.deptname){
                this.$message('表单填写不完整，请确认后重试！');
                return false;
            }
            this.edit.iconType = 'md-create';
            this.edit.saveShow = false;
            this.edit.contenteditable = true;
            this.edit.contentInit = '编辑';
            const httpUrl = 'updateDepartment';
            let  httpParams = {
                'departmentDetail' : this.deptFirstMation
            }
            this.$post(httpUrl,httpParams).then(response => {
                if(response!=404){
                    this.$Message.success('保存成功！');
                }
            });
        },
        //取消编辑科室信息
        cancelEdit : function(){
            this.departmentmationselect.deptname = this.cookieDetails.deptname;
            this.departmentmationselect.deptdesc = this.cookieDetails.deptdesc;

            this.edit.iconType = 'md-create';
            this.edit.saveShow = false;
            this.edit.contenteditable = true;
            this.edit.contentInit = '编辑';
        },
	},
	watch : {
		showleftcontent : function(){
		},
		departmentid : function(){
			// 获取科室子集
			this.getDeptList();
		},
		departmentmationselect : function(){
            this.deptFirstMation.deptid = this.departmentmationselect.deptid;
            this.deptFirstMation.deptname = this.departmentmationselect.deptname;
            this.deptFirstMation.deptdesc = this.departmentmationselect.deptdesc;
            this.deptFirstMation.hospitalid = this.departmentmationselect.hospitalid;
            this.deptFirstMation.parentid = this.departmentmationselect.parentid;
		}
	}
}
</script>

