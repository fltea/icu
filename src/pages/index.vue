<script setup>
import { ref } from 'vue';

const loading = ref(false);

const changValue = () => {
  loading.value = !loading.value;
};
</script>

<template>
<h1>INDEX</h1>
<section class="com-controls">
  <button @click="changValue">修改值</button>
</section>
<section class="components">
  <div class="com-items loading-container" v-loading="loading">
    <p class="items-title">loading</p>
  </div>
  <div class="com-items">
    <p class="items-title">date-picker</p>
    <date-picker></date-picker>
  </div>

  <div class="com-items" style="margin-top: 80px;">
    <!-- <input type="text"> -->
  </div>
</section>
</template>

<style scoped lang='less'>
.com-items {
  margin-top: @small;
}
.items-title {
  font-size: 20px;
  line-height: 27px;
  font-weight: bold;
}
.loading-container {
  height: 80px;
  background-color: antiquewhite;
}
</style>
