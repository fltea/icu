<script setup>
import { reactive, onMounted } from 'vue';
import { group } from '@/api/douban';
import GroupDetail from '@/components/douban/GroupDetail.vue';

const curData = reactive({
  list: [],
});
const search = reactive({
  name: '',
});
let params = null;

const listData = () => {
  group(params).then((res) => {
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

onMounted(listData);
</script>

<template>
  <h1>GROUP</h1>
  <section class="com-controls">
    <input type="text" v-model="search.name" placeholder="name">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <!-- <button @click="addNewItem">新增小组</button> -->
  </section>
  <section>
    <div v-for="(item, index) in curData.list" :key="`curData.list${index}`" class="list-item">
      <group-detail :detail="item"></group-detail>
    </div>
  </section>
</template>

<style scoped lang='less'>
.list-item {
  margin-top: 12px;
}
</style>
