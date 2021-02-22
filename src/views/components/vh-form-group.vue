<template>
    <div class="vh-form-group pull-left vh-mg-right-24 vh-mg-bottom-8">
        <label class="vh-form-group-lab">{{label}}：</label>
        <div class="vh-vh-form-group-input">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'vh-form-group',
        props: {
            label: {
                type: String
            }
        }
    }
</script>