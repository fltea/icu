<script setup>
import { ref } from 'vue';
import NewMlog from '@/components/mlog/NewMlog.vue';

const loading = ref(false);

const changValue = () => {
  loading.value = !loading.value;
};

const selectValue = ref('');
</script>

<template>
  <h1>404</h1>
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
      <p class="items-title">com-select</p>
      <com-select v-model="selectValue"></com-select>
    </div>
    <div class="com-items" style="margin-top: 80px;">
      <p class="items-title">newMlog</p>
      <new-mlog></new-mlog>
    </div>
  </section>
</template>

<style scoped lang="less">
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
