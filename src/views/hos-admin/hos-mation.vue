<template>
    <div class="hos-mation" ref="hosm">
        <Card :bordered="false" dis-hover>
            <div class="hos-right">
                <div style="height: 50px">
                    <div class="title">医院名称：{{hospitalMation.hospitalname}}</div>
                    <Button type="primary" size="large" style="float: right" @click="editHospital">编辑</Button>
                </div>


                <div class="hos-content">
                    <div class="hos-tilte"><span>医院简称：</span>{{hospitalMation.shortname}}</div>
                    <div class="hos-tilte"><span>医院等级：</span>{{hospitalMation.levelName}}</div>
                    <div class="hos-tilte"><span>所在城市：</span>{{hospitalMation.regionname}}</div>
                    <div class="hos-tilte hos-max">
                        <span>医院地址：</span>{{hospitalMation.address}}</div>
                    <div class="hos-tilte hos-max">
                        <span>医院简介：</span>{{hospitalMation.hosdesc}}
                    </div>
                    <div style="clear:both"></div>
                </div>
            </div>
        </Card>
        <Card :bordered="false" dis-hover style="margin-top: 12px">
            <div class="hos-check">
                <ul class="check-left">
                    <li>科室列表：</li>
                    <li v-for="(item,index) in dplist" @click="getdetails(item,index)"
                        :style="{background:mark == index ? '#e9e9e9' : ''}">{{item.deptname}}
                    </li>
                </ul>

                <div class="check-right">
                    <div class="title">
                        <p>科室名称：<span
                                v-if="editBoo">{{detailsRight.deptname == 'null' ? '' : detailsRight.deptname}}</span>
                        </p>
                        <p>科室简介：<span
                                v-if="editBoo">{{detailsRight.deptdesc == 'null' ? '' : detailsRight.deptdesc}}</span>
                        </p>
                    </div>
                    <div class="details">
                        <div class="box" v-for="itemer in childrenDp">
                            <Button size="large" @click="gopageforDc(itemer)">{{itemer.deptname}}</Button>
                            <!-- <p>{{itemer.deptcode}}</p> -->
                            <i class="iconfont icon-deletes" v-if="!editBoo" @click="deletDp(itemer)"></i>
                        </div>
                        <div style="clear: both"></div>
                    </div>
                </div>
                <div style="clear: both"></div>
            </div>
        </Card>
        <Modal ref="tempModalFull" v-model="modalforfull" fullscreen :title="modalforfullD.deptname"
            @on-cancel="cleanDeptId" footer-hide>
            <deptDoc :deptid="getDeptId"></deptDoc>
        </Modal>
        <Modal ref="tempModalHospital" width="900" v-model="modalforhospital" title="编辑医院" :loading="hospitalLoading"
            @on-ok="hospitalOk">
            <Form ref="hospitalDetail" :model="hospitalDetail" :rules="rulehospitalDetail" :label-width="100"
                style="padding: 0 50px">
                <Row>
                    <Col span="10">
                    <FormItem label="医院名称" prop="hospitalname">
                        <Input size="large" placeholder="必填，限制20字以内" :autosize="true" :maxlength="20"
                            v-model="hospitalDetail.hospitalname"></Input>
                    </FormItem>
                    </Col>
                    <Col span="10" offset="4">
                    <FormItem label="医院简称" prop="shortname">
                        <Input size="large" placeholder="必填，不能超过20字" :autosize="true" :maxlength="20"
                            v-model="hospitalDetail.shortname"></Input>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="所在城市">
                        <el-select v-model="hospitalDetail.regionid" placeholder="请选择城市">
                            <el-option v-for="item in cityListAdd" :key="item.regioncode" :value="item.regionID"
                                :label="item.regionname">
                            </el-option>
                        </el-select>
                    </FormItem>
                    </Col>
                    <Col span="10" offset="4">
                    <FormItem label="医院等级">
                        <el-select v-model="hospitalDetail.level">
                            <el-option v-for="item in hospitalEvel" :value="item.levelcode" :key="item.levelcode"
                                :label="item.levelname">
                            </el-option>
                        </el-select>
                    </FormItem>
                    </Col>
                </Row>
                <FormItem label="医院地址" prop="address">
                    <Input size="large" placeholder="必填，不能超过200字" :maxlength="200"
                        v-model="hospitalDetail.address"></Input>

                </FormItem>
                <FormItem label="医院简介" prop="hosdesc">
                    <Input placeholder="必填，不能超过500字" :autosize="{minRows: 5,maxRows: 8}" :maxlength="500"
                        type="textarea" v-model="hospitalDetail.hosdesc"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import deptDoc from './hos-dept-doc';
    import axios from 'axios';
    export default {
        name: 'hos-mation',
        data: function () {
            return {
                hospitalEvel: [], //医院等级
                dplist: [], //科室列表
                AdpList: '',
                dpLoading: true,
                ruledepartmentDetail: {
                    deptname: [
                        { required: true, message: '科室名称不能空,限制20字以内', trigger: 'blur' }
                    ],
                    deptdesc: [
                        { required: true, message: '科室简介不能空,限制100字以内', trigger: 'blur' }
                    ],
                    deptcode: [
                        { required: true, message: '科室编码格式不正确，请重新填写', trigger: 'blur' }
                    ]
                },
                rulehospitalDetail: {
                    hospitalname: [
                        { required: true, message: '医院名称不能为空', trigger: 'blur' }
                    ],
                    shortname: [
                        { required: true, message: '医院简称不能为空', trigger: 'blur' }
                    ],
                    level: [
                        { required: true, message: '医院等级不能为空', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '医院地址不能为空', trigger: 'blur' }
                    ],
                    hosdesc: [
                        { required: true, message: '医院简介不能为空', trigger: 'blur' }
                    ]
                },
                hospitalMation: {}, //医院信息
                hospitalDetail: {
                    regionid: '',
                    hospitalname: '',//医院名称
                    shortname: '',//医院简称
                    level: '',//医院等级
                    address: '',//医院地址
                    hosdesc: '',//医院简介
                    hospitalid: '',//医院ID
                },
                detailsRight: {},
                mark: 0,
                editBoo: true,
                childrenDp: [],
                modalforfull: false,
                modalforfullD: {},
                getDeptId: '',
                isAdddChildren: false,
                poptipContent: '',
                maxlength: 0,
                parentcode: '',
                parentid: '',
                modalforhospital: false,
                hospitalLoading: true,
                tokenHospitalid: '',
                cityListAdd: []
            }
        },
        computed: {
            // tokenHospitalid() {
            //     return this.$store.state.hospital.hospitalid;
            // },
            hospitalids() {
                return this.$store.state.hospital.hospitalid;
            },
        },

        components: {
            deptDoc
        },
        created() {
            this.tokenHospitalid = this.$route.query.hospitalid;
        },

        mounted: function () {

            this.$store.dispatch('getHosPitalId', this.$route.query.hospitalid);
            this.getHospitalMation();
            this.getSavePic();
            this.getHospitalLevelList();//获取医院等级
            let httpParams = {};
            this.$post("getAllRegionList", httpParams).then(response => {
                if (response.resultcode == 1) {
                    console.log(response.regionList)
                    this.cityListAdd = response.regionList;
                }
            });

        },
        methods: {
            cleanDeptId() {
                this.getDeptId = ''
            },
            getSavePic() {
                const httpUrl = "/hospital/getHospitalMap";
                this.$httpPost(httpUrl, null, {
                    params: {
                        hospitalId: this.tokenHospitalid
                    }
                }).then(response => {
                    if (response != 404) {
                        this.savePicAdress = response.result.mapurl
                    }
                })
            },



            hospitalOk() {
                this.$refs.hospitalDetail.validate((valid) => {
                    if (valid) {
                        const httpUrl = 'updateHospital';
                        let httpParams = {
                            hospitalInfo: this.hospitalDetail
                        }
                        this.$post(httpUrl, httpParams).then(response => {
                            if (response != 404) {
                                this.$Message.success('保存成功！');
                                this.getHospitalMation();
                                this.getHospitalLevelList()
                                this.$refs.tempModalHospital.$data.buttonLoading = false;
                                this.modalforhospital = false;
                            } else {
                                this.$refs.tempModalHospital.$data.buttonLoading = false;
                                this.modalforhospital = true;
                            }
                        });
                    } else {
                        this.$refs.tempModalHospital.$data.buttonLoading = false;
                        this.modalforhospital = true;
                    }
                })
            },
            editHospital() {
                this.$refs.hospitalDetail.resetFields();
                this.modalforhospital = true;
                this.hospitalDetail.hospitalname = this.hospitalMation.hospitalname
                this.hospitalDetail.shortname = this.hospitalMation.shortname
                this.hospitalDetail.level = this.hospitalMation.level
                this.hospitalDetail.levelName = this.hospitalMation.levelName
                this.hospitalDetail.address = this.hospitalMation.address
                this.hospitalDetail.hosdesc = this.hospitalMation.hosdesc
                this.hospitalDetail.hospitalid = this.hospitalMation.hospitalid
                this.hospitalDetail.regionid = this.hospitalMation.regionid
                //this.hospitalDetail = JSON.parse(JSON.stringify(this.hospitalMation));
            },
            deleteDpOk() {
                const httpUrl = "isNoOverOrder";
                let httpParams = {
                    'deptId': this.parentid,
                };
                this.$post(httpUrl, httpParams).then(response => {
                    // console.log('response.status====',response);
                    if (response != 404) {
                        if (response.status == 1) {
                            this.$Message.error({
                                content: "该科室下的医生有未完成的订单不允许删除",
                                duration: 3
                            });
                            return false;
                        } else {
                            // 成功调用删除方法
                            this.delDept();
                        }
                    }
                })
            },
            getdetails(e, i) {

                this.getDeptListchild(e.deptid)
                this.parentcode = e.parentcode
                this.parentid = e.deptid
                this.detailsRight = e;
                this.mark = i;
                this.childrenDp = [e, ...e.children];
            },
            // 获取等级
            getHospitalLevelList() {
                const httpUrl = "getHospitalLevelList";
                let httpParams = {};
                this.$post(httpUrl, httpParams).then(response => {
                    if (response.resultcode == 1) {
                        this.hospitalEvel = response.levelList;
                    }
                });
            },
            // 获取医院信息
            getHospitalMation: function () {
                // 获取医院详情信息
                const httpUrl = 'getHospitalDetail';
                let httpParams = {
                    'hospitalId': this.tokenHospitalid
                }
                this.$post(httpUrl, httpParams).then(response => {
                    if (response != 404) {

                        this.hospitalMation = response.hospitalDetail;
                        this.getDeptList();
                        window.sessionStorage.setItem('hospitalName', response.hospitalDetail.hospitalname);//本地存储医院名称
                    } else {
                        return false;
                    }
                })
            },
            //科室列表
            getDeptList() {
                const httpUrl = 'getDeptListByHospitalId';
                let httpParams = {
                    hospitalId: this.hospitalMation.hospitalid
                }
                this.$post(httpUrl, httpParams).then(response => {
                    if (response.resultcode == 1) {
                        this.dplist = response.departmentList[0].children;
                        if (response.departmentList[0].children.length > 0) {
                            this.childrenDp = [this.detailsRight]
                            this.getDeptListchild(response.departmentList[0].children[0].deptid)
                            this.detailsRight = response.departmentList[0].children[0];  //右边科室信息
                            this.parentcode = response.departmentList[0].children[0].parentcode
                            this.parentid = response.departmentList[0].children[0].deptid;
                        }

                    }
                });
            },
            // 获取科室子集
            getDeptListchild: function (departmentid) {
                // console.log(this.departmentid)
                let httpUrl = 'getChildrenByDeptId';
                let httpParams = {
                    'departmentId': departmentid
                }
                this.$post(httpUrl, httpParams).then(res => {
                    if (res != 404) {
                        this.childrenDp = [this.detailsRight, ...res.departmentList];
                        console.log(this.childrenDp)
                    }
                });
            },
            editRight() {
                if (this.editBoo) {
                    this.editBoo = false
                }

            },
            gopageforDc(e) {
                //this.$store.dispatch('getDeptId', e.deptid);
                this.getDeptId = e.deptid;
                this.modalforfullD = e;
                this.modalforfull = true
            },
        },
        watch: {
        }
    }
</script>
<style lang="less">
    @import './style/hos-mation.less';
</style>