<script setup>
import { ref, onMounted } from 'vue';
import { list } from '@/api/mark';

const listData = ref([]);
const newItem = () => {

};
// const changFile = (event) => {

// };

onMounted(() => {
  list().then((res) => {
    console.log(res);
    listData.value.push('cesss');
  });
});
</script>

<template>
  <h1>MARK</h1>
  <section>
    <button @click="newItem">新增</button>
    <button class="file-button">批量导入<input type="file" name="file" id="myFile" @change="changFile"></button>
  </section>
  <section>
    <!-- 列表 -->
    <div>
      <!-- icon -->
      <div></div>
      <!-- 内容 -->
      <div></div>
      <!-- 操作 -->
      <div></div>
    </div>
  </section>
</template>

<style scoped lang="less">

</style>
