<style type="text/css" scoped>
.ivu-btn-group{float:right;}
</style>
<template>
    <div class="vh-search-header clearfix" @keydown.enter="handleSearch">
        <div class="vh-search-header-group pull-left">
            <slot></slot>
        </div>
        <div v-if="false" class="vh-search-header-expand pull-left">
            <Button type="text" class="expand-btn">展开
                <Icon type="ios-arrow-down" /></Button>
        </div>
        <ButtonGroup size="large">
            <Button v-if="showSearch" type="primary" @click="handleSearch">查 询</Button>
        </ButtonGroup>
        
    </div>
</template>

<script>
    export default {
        name: 'vh-search-header',
        props: {
            showSearch: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            handleSearch() {
                this.$emit('on-search');
            }
        }
    }
</script>

<style lang="less">

</style>