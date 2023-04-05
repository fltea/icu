<script setup>
import { reactive, onMounted } from 'vue';
import { meansList, meansDel } from '@/api/means';
import NewMeans from '@/components/means/Means.vue';

const curData = reactive({
  list: [],
  adialog: false,
  item: null,
});
let params = null;
const search = reactive({
  name: '',
});

const listData = () => {
  meansList(params).then((res) => {
    console.log(res);
    if (res.list) {
      curData.list = res.list;
    }
  });
};
const searchList = () => {
  const { name } = search;
  params = {
    name,
  };
  listData();
};
const resetSearch = () => {
  search.name = '';
  params = null;
  listData();
};

const modMeans = (item) => {
  const value = item.id ? item : null;
  curData.adialog = true;
  curData.item = value;
};

const delMeans = ({ id }) => {
  meansDel({
    id,
  }).then(() => {
    listData();
  });
};
onMounted(listData);
</script>

<template>
  <h1>Property</h1>
  <section class="com-controls">
    <input type="text" v-model="search.name" placeholder="name">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="modMeans">新增</button>
  </section>
  <section>
    <div v-for="(item, index) in curData.list" :key="`curData.list-${index}`">
      <p>{{ item }}</p>
      <button @click="modMeans(item)">修改</button>
      <button @click="delMeans(item)">删除</button>
    </div>
  </section>
  <new-means :means="curData.item" v-model:show="curData.adialog" @success="listData"></new-means>
</template>

<style scoped lang='less'>
</style>
