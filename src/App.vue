<template>
  <div>
    <div id="drag-bar">
      <div class="close" @click="alert"><i class="icon-false" ></i></div>
    </div>
    <router-view>

  </router-view>
  </div>
</template>
<script>
export default {
  methods:{
    alert(){
      window.alert('功能暂未开放')
    }
  }
}
</script>

<style lang="less">
#drag-bar{
  width: 100%;
  height: 25px;
  position: fixed;
  z-index: 99;
  -webkit-app-region: drag;
  background-color: #000;
  .close{
    width: 25px;
    height: 25px;
    float: right;
    line-height: 25px;
    text-align: center;
     -webkit-app-region: no-drag;
    i{
      color: #fff;
      cursor: pointer;
    }
  }
}

</style>
