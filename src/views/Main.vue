<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <!-- 左侧 -->
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'220px'}">
            <shrinkable-menu :shrink="shrink" :menu-list="menuList">
                <div slot="top" class="logo-con" style="height:60px">
                    <img class="logo-max" v-show="!shrink" src="../../src/images/logo.png" key="max-logo" />
                    <img class="logo-min" v-show="shrink" src="../../src/images/logo.png" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <!-- 顶部导航条 -->
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'220px'}">
            <div class="main-header">
                <!-- 展开隐藏左侧 -->
                <div class="navicon-con">
                    <Button class="nav-btn" :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}"
                        type="text" @click="toggleClick">
                        <Icon type="ios-menu" size="32" style="color:#fff"></Icon>
                    </Button>
                </div>
                <!-- 用户操作-退出/个人中心 -->
                <div class="header-avator-con">
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)" style="color:#fff">
                                    <span class="main-user-name">管理员</span>
                                    <Icon type="md-arrow-dropdown"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="login">退出登录</DropdownItem>
                                    <!-- <DropdownItem name="my-center" divided>个人中心</DropdownItem> -->
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar icon="md-person" style="background: #619fe7;margin-left:10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <!-- 右侧列表 -->
        <div class="single-page-con vh-bg" :style="{left: shrink?'60px':'220px'}">
            <div class="single-page">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';

    export default {
        components: {
            shrinkableMenu
        },
        data: function () {
            return {
                shrink: false,
                userName: '',
                tester: '#198be3' //主题颜色
            };
        },
        created: function () {
            // this.$router.push({
            //     name: 'hos-admin'
            // });
        },
        computed: {
            menuList() {
                return this.$store.state.app.menuList;
            }
        },
        methods: {
            init: function () {
                this.userName = window.sessionStorage.getItem('response.adminid');
            },
            toggleClick: function () {
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown: function (name) {
                if (name == 'login') {
                    this.$store.commit('logout');
                }
                this.$router.push({
                    name: name
                });
            }
        },
        mounted() {
            this.init();
        }
    };
</script>