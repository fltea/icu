<script setup>
import { ref, onMounted } from 'vue';
import { backups, backup, restore } from '@/api/backup';

const listData = ref([]);
const listDatas = () => {
  backups().then((res) => {
    // console.log(res);
    listData.value = res.data;
  });
};
const backupData = () => {
  backup().then(() => {
    listDatas();
  });
};
const restoreData = (date) => {
  restore({
    date,
  });
};
onMounted(listDatas);
</script>

<template>
  <h1>Datas</h1>
  <div class="com-controls">
  <button @click="backupData">新增备份</button>
  </div>
  <section class="com-container">
    <div v-for="item in listData" :key="`listData-${item}`" class="list-item">
      <p>{{ item }} <button @click="restoreData(item)">还原备份</button></p>
    </div>
  </section>
</template>

<style scoped lang="less">
.com-container {
  .list-item {
    & +.list-item {
      margin-top: 12px;
    }
  }
}
</style>
