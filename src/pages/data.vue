<script setup>
import { ref, onMounted } from 'vue';
import { backups, backup, restore } from '@/api/common';

const listData = ref([]);
const backupData = () => {
  backup();
};
const restoreData = (date) => {
  restore({
    date,
  });
};
onMounted(() => {
  backups().then((res) => {
    // console.log(res);
    listData.value.push(...res.data);
  });
});
</script>

<template>
  <h1>Datas</h1>
  <button @click="backupData">新增备份</button>
  <section>
    <div v-for="item in listData" :key="`listData-${item}`">
      <p>{{ item }}</p>
      <button @click="restoreData(item)">还原备份</button>
    </div>
  </section>
</template>

<style scoped lang="less">
</style>
