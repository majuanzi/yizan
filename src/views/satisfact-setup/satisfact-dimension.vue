<style type="text/css">
    .vh-search-header .vh-search-header-group .labelLine36 .vh-form-group-lab {
        padding-top: 0;
        line-height: 36px;
        font-size: 14px;
    }

    .ivu-form.labelLine36 .ivu-form-item-label {
        padding: 0 12px 0 0;
        line-height: 36px;
        font-size: 14px;
    }
</style>
<template>
    <div>
        <Card :bordered="false">
            <vh-search-header @on-search="getSearchList">
                <vh-form-group label="维度名称" class="labelLine36">
                    <Input size="large" v-model="queryDimenName" @keyup.enter.native="getSearchList"
                        placeholder="请输入维度名称" />
                </vh-form-group>
            </vh-search-header>
            <vh-search-body :total="pageTotal" @on-change="handleChange" :current.sync="pageCurrent"
                @on-size="handleSizeChange">
                <template v-slot:header>
                    <ButtonGroup size="large">
                        <Button type="primary" @click="addDimConfirm">新 增</Button>
                    </ButtonGroup>
                </template>
                <template v-slot:table>
                    <Table :columns="columnSat" :data="dimensList" :border="true">
                        <template slot-scope="{ row, index }" slot="opt-col">
                            <p class="btn-text" @click="showDimModal(dimensList[index])">编辑</p>
                        </template>
                    </Table>
                </template>
            </vh-search-body>
        </Card>

        <!-- 编辑 -->
        <Modal ref="dimModalWrap" v-model="dimModal" :title="modalTitle" @on-ok="saveDimModalData()"
            @on-cancel="cancelDimModalData()" :mask-closable="false">
            <Form ref="dimModal" :model="dimModalData" :rules="ruleInlineAdd" :label-width="120" class="labelLine36">
                <Tooltip content="请输入5位随机数" placement="right-start">
                    <FormItem label="维度项目编码：" prop="dimenCode">
                        <Input size="large" :maxlength="5" type="text" class="dept-details-list" style="width: 370px"
                            v-model.trim="dimModalData.dimenCode" placeholder="请输入维度项目编号" clearable></Input>
                    </FormItem>
                </Tooltip>
                <Tooltip content="请输入维度项目名称" placement="right-start">
                    <FormItem label="维度项目名称：" prop="dimenName">
                        <Input size="large" :maxlength="10" type="text" class="dept-details-list" style="width: 370px"
                            v-model.trim="dimModalData.dimenName" placeholder="请输入维度项目名称" clearable></Input>
                    </FormItem>
                </Tooltip>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import vhFormGroup from '../components/vh-form-group';
    import vhSearchHeader from '../components/vh-search-header';
    import vhSearchBody from '../components/vh-search-body';

    export default {
        name: "satisfact-dimension",

        components: {
            vhFormGroup,
            vhSearchHeader,
            vhSearchBody
        },

        data() {
            const checkInList = (prop, value) => {
                const result = this.dimModalData.dimenId === undefined ? this.dimensList :
                    this.dimensList.filter((val) => val.dimenId !== this.dimModalData.dimenId)
                return result.some((val) => val[prop] === value);
            }

            const validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(rule.msg));
                } else if (!/^\d{5}$/.test(value)) {
                    callback(new Error(rule.msg));
                } else if (checkInList('dimenCode', value)) {
                    callback(new Error('维度项目编码不能重复'));
                } else {
                    callback();
                }
            }

            const validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(rule.msg));
                } else if (checkInList('dimenName', value)) {
                    callback(new Error('维度项目内容不能重复'));
                } else {
                    callback();
                }
            }

            return {
                pageTotal: 0,
                pageCurrent: 1,
                pageSize: 10,
                modalLoading: true,
                modalTitle: '',
                queryDimenName: '',
                dimModal: false,
                dimModalData: {},
                ruleInlineAdd: {
                    dimenCode: [
                        { validator: validateCode, required: true, type: 'number', msg: "维度项目编号为5位随机数", trigger: "blur" }
                    ],
                    dimenName: [
                        { validator: validateName, required: true, msg: "维度项目名称不能为空", trigger: "blur" }
                    ]
                },
                columnSat: [
                    {
                        title: '序号',
                        width: 65,
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.index + (this.pageCurrent - 1) * this.pageSize + 1);
                        }
                    },
                    {
                        title: "维度项目编码",
                        align: 'center',
                        width: 120,
                        key: "dimenCode"
                    },
                    {
                        title: "维度项目名称",
                        key: "dimenName"
                    },
                    {
                        title: "操作",
                        width: 120,
                        align: "center",
                        slot: "opt-col"
                    }
                ],
                dimensList: []
            }
        },

        created() {
            this.getDimensList();
        },

        methods: {
            addDimConfirm() {
                this.showDimModal();
            },
            showDimModal(data) {
                if (data && data.dimenId) {
                    this.modalTitle = '编辑维度项目';
                    this.dimModalData = {
                        dimenId: data.dimenId,
                        dimenCode: data.dimenCode,
                        dimenName: data.dimenName
                    };
                } else {
                    this.modalTitle = '新增维度项目';
                    this.dimModalData = {
                        isSys: '1',
                        dimenCode: '',
                        dimenName: '',
                    };
                }
                this.dimModal = true;
            },
            getSearchList() {
                this.pageCurrent = 1;
                this.getDimensList();
            },

            // 获取维度列表
            getDimensList() {
                this.$httpPost('sysDimenManage/getAllSysDimenByPage', null, {
                    params: {
                        startpos: (this.pageCurrent - 1) * this.pageSize,
                        pagecount: this.pageSize,
                        dimenName: this.queryDimenName
                    }
                }).then(res => {
                    if (res != 404 && res.resultcode == 1) {
                        this.dimensList = res.sysDimenList;
                        this.pageTotal = res.count;
                    }
                })
            },

            delDim({ _index, dimenId }) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定要删除此维度吗？',
                    onOk: () => {
                        this.$httpPost('sysDimenManage/delPlatformSysDimen', null, {
                            params: {
                                dimenId
                            }
                        }).then(res => {
                            if (res != 404 && res.resultcode == 1) {
                                this.dimensList.splice(_index, 1);
                                this.$Message.success('删除成功');
                            }
                        })
                    }
                });
            },

            saveDimModalData() {

                if (this.dimModalData.dimenCode.length == 0) {
                    this.$message('维度项目编码不能为空');
                    this.$refs.dimModal.resetFields();
                    return;
                }
                if (this.dimModalData.dimenName.length == 0) {
                    this.$message('维度项目名称不能为空');
                    this.$refs.dimModal.resetFields();
                    return;
                }
                if (!/^[0-9]+$/.test(this.dimModalData.dimenCode)) {
                    this.$message("维度项目编码只能是五位随机数");
                    this.$refs.dimModal.resetFields();
                    return;
                }
                // if (this.dimModalData.dimenCode.length!=0&&this.dimModalData.dimenCode[0] == '0') {
                //     this.$message("维度项目编码第一位不能为0");
                //     this.$refs.dimModal.resetFields();
                //     return;
                //
                // }
                this.$Modal.confirm({
                    title: '提示',
                    content: this.dimModalData.dimenId ? '确定维度修改？' : '维度新增后不能删除，确定新增？',
                    onOk: () => {
                        // this.$refs.dimModalWrap.$data.buttonLoading = true;
                        this.$refs.dimModal.validate((valid) => {
                            if (valid) {
                                const isModify = !!this.dimModalData.dimenId;
                                this.$httpPost(
                                    isModify ?
                                        'sysDimenManage/modifyPlatformSysDimen' :
                                        'sysDimenManage/addSysDimen',
                                    this.dimModalData
                                ).then(res => {
                                    if (res != 404 && res.resultcode == 1) {
                                        this.$Message.success(isModify ? '编辑成功' : '保存成功');
                                        this.getDimensList();
                                    }
                                    this.dimModal = false;
                                    this.$refs.dimModal.resetFields();
                                }).catch(err => {
                                    this.dimModal = false;
                                    this.$refs.dimModal.resetFields();
                                })
                            } else {
                                // this.$refs.dimModalWrap.$data.buttonLoading = false;
                            }
                        })
                    },
                    onCancel: () => {
                        // this.$refs.dimModalWrap.$data.buttonLoading  = false;
                    }
                });

            },

            cancelDimModalData() {
                this.$refs.dimModal.resetFields();
            },

            // 当前页数改变
            handleChange(n) {
                this.pageCurrent = n;
                this.getDimensList();
            },

            // 每页显示条数改变
            handleSizeChange(size) {
                this.pageSize = size;
                this.pageCurrent = 1;
                this.getDimensList();
            }
        }
    }
</script>