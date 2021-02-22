<template>
    <div class="vh-search-body">
        <div v-if="showHeader" class="vh-search-body-title vh-mg-bottom-12 clearfix">
            <h3 v-if="!!title" class="vh-search-body-h3 vh-pd-left-12 pull-left">{{title}}</h3>
            <div class="vh-search-body-btns pull-right">
                <slot name="header"></slot>
            </div>
        </div>
        <div class="vh-search-body-table">
            <slot name="table"></slot>
            <div class="vh-search-body-pager vh-mg-top-12 clearfix">
                <Page v-if="!!total"
                      :total="total"
                      show-total
                      :current="current"
                      @on-change="handlePageChange"
                      @on-page-size-change="handlePagesizeChange"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'vh-search-body',
        props: {
            total: {
                type: Number
            },
            current:{
                type:Number,
                default: 1
            },
            showIndex: {
                type: Boolean,
                default: true
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            title: {
                type: String
            },
            data: {
                type: Array
            },
            columns: {
                type: Array
            }
        },

        methods: {
            handlePageChange(n) {
                this.$emit('on-change', n);
            },

            handlePagesizeChange(size) {
                this.$emit('on-size', size);
            }
        }
    }
</script>

<style lang="less" scoped>

</style>