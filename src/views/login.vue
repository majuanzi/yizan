<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">

                <div class="login-logo">
                    <img src="../images/logo.png" />
                    <h3>欢迎登录望海医生综合管理系统</h3>
                </div>
                <!-- <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录海豚医生平台管理系统
                </p> -->
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名" icon="md-person" />
                            <span slot="prepend">
                                <Icon :size="16" type="md-person"></Icon>
                            </span>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码" icon="md-lock" />
                        </FormItem>
                        <FormItem>
                            <Button :disabled="isDisabled" @click="handleSubmit" type="primary" long>
                                {{login}}
                                <Icon v-show="showLoad" type="load-c" size=15 class="demo-spin-icon-load"></Icon>
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <!-- <div>
                    <span>
                        <Button type="text" icon="">验证码登录</Button>
                    </span>
                    <span>
                        <Button type="text" icon="">扫码登录</Button>
                    </span>
                    <span>
                        <Button type="text" icon="">忘记密码</Button>
                    </span>
                </div> -->
            </Card>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    export default {
        data: function () {
            return {
                login: '登录',
                isDisabled: false,
                showLoad: false,
                form: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [
                        { required: true, message: '账号不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ]
                }
            };
        },
        mounted() {
            // 禁止返回
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
        },
        methods: {
            // decryptData(word) {
            //     let key = cryptoJs.enc.Hex.parse(keyOne)
            //     let enc = ''
            //     if (typeof word === 'string') {
            //         enc = cryptoJs.AES.encrypt(word, key, {
            //             iv: '12345678',
            //             mode: cryptoJs.mode.ECB,
            //             padding: cryptoJs.pad.Pkcs7
            //         })
            //     } else if (typeof word === 'object') {
            //         let data = JSON.stringify(word)
            //         enc = cryptoJs.AES.encrypt(data, key, {
            //             // iv: iv
            //             mode: cryptoJs.mode.ECB,
            //             padding: cryptoJs.pad.Pkcs7
            //         })
            //     }
            //     let encResult = enc.ciphertext.toString()
            //     return encResult
            // },
            handleSubmit: function () {
                this.login = '登录中...';
                this.isDisabled = true;
                this.showLoad = true;
                this.$refs.loginForm.validate((valid) => {
                    // console.log(1111111)
                    if (valid) {
                        // console.log(2222222)
                        const httpUrl = 'loginPlatformSafe';

                        let httpParams = {
                            'userName': this.form.userName,
                            'password': this.$crypto(this.form.password)
                        }
                        this.$postSafe(httpUrl, httpParams).then(response => {
                            if (response != 404) {
                                this.$Message.success('登录成功');
                                window.sessionStorage.setItem('sessionToken', response.token);//储存token
                                window.sessionStorage.setItem('adminUser', this.form.userName);//储存token
                                window.sessionStorage.setItem('adminHospitalid', response.adminid);//储存token

                                // Cookies.set('adminUser', this.form.userName);
                                // Cookies.set('adminHospitalid', response.adminid);
                                this.$router.push({
                                    name: 'hos-admin'
                                });
                            } else {
                                this.login = '登录';
                                this.isDisabled = false;
                                this.showLoad = false;
                            }
                        })
                    } else {
                        this.login = '登录';
                        this.isDisabled = false;
                        this.showLoad = false;
                    }
                });
            }
        }
    };
</script>

<style>

</style>