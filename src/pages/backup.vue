<script setup>
import { ref, onMounted } from 'vue';
import { backups } from '@/api/backup';
import WS from '@/utils/ws';

const listData = ref([]);
const listDatas = () => {
  backups().then((res) => {
    // console.log(res);
    listData.value = res.data;
  });
};

let server;
const wsServer = (datas) => {
  server = WS('backupTable');
  server.onopen = () => {
    server.send(JSON.stringify(datas));
  };
  server.onmessage = (evt) => {
    let msg = evt.data;
    msg = JSON.parse(msg);
    console.log(msg);
  };
};
const backupData = () => {
  const datas = {
    target: 'backup',
  };
  if (server) {
    server.send(JSON.stringify(datas));
  } else {
    wsServer(datas);
  }
};
const restoreData = (date) => {
  const datas = {
    target: 'restore',
    data: {
      date,
    },
  };
  if (server) {
    server.send(JSON.stringify(datas));
  } else {
    wsServer(datas);
  }
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
