<template>
  <div style="height:20px; width:100px; background:pink">{{text}}</div>
</template>

<script>
    export default{
        name: 'Texter',
        props:{
            text:String
        }
    }
</script>
