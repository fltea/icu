<script setup>
import { reactive, onMounted } from 'vue';
import { list } from '@/api/statistic';

const curData = reactive({
  list: [],
  adialog: false,
  item: null,
  finished: false,
  loading: false,
});
let params = null;
const search = reactive({
  name: '',
});

const listData = () => {
  curData.loading = true;
  list(params).then((res) => {
    console.log(res);
    if (res.list) {
      curData.list.push(...res.list || []);
    }
    curData.finished = curData.list.length >= res.count;
  }).finally(() => {
    curData.loading = false;
  });
};

const listMData = () => {
  const page = params?.page || 1;
  if (!params) {
    params = {};
  }
  params.page = page + 1;
  listData();
};
const searchList = () => {
  const { name } = search;
  params = {
    name,
  };
  curData.list = [];
  listData();
};
const resetSearch = () => {
  search.name = '';
  params = null;
  curData.list = [];
  listData();
};

const modItem = (item) => {
  const value = item.id ? item : null;
  curData.adialog = true;
  curData.item = value;
};

onMounted(listData);
</script>

<template>
<h1>Stats</h1>
  <section class="com-controls">
    <input type="text" v-model="search.name" placeholder="name">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="modItem">新增</button>
  </section>
  <com-list :finished="curData.finished" :loading="curData.loading" @load="listMData">
    <section>
      <div class="list-item" v-for="(item, index) in curData.list" :key="`curData.list-${index}`">
        <p>{{ item.name }}</p>
        <button @click="modMeans(item)">修改</button>
      </div>
    </section>
  </com-list>
</template>

<style scoped lang='less'>
</style>
