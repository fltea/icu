<script setup>
import { reactive, onMounted } from 'vue';
import { doulist, doubanDel } from '@/api/douban';
import NewDoulist from '@/components/douban/Doulist.vue';

const curData = reactive({
  list: [],
  adialog: false,
  item: null,
  finished: false,
  loading: false,
});
let params = null;
const search = reactive({
  title: '',
  author: '',
});

const listData = () => {
  curData.loading = true;
  doulist(params).then((res) => {
    // console.log(res);
    curData.list.push(...(res.list || []));
    curData.finished = curData.list.length >= res.count;
  }).finally(() => {
    curData.loading = false;
  });
};
const reloadList = () => {
  params = null;
  curData.list = [];
  listData();
};
const searchList = () => {
  const { title, author } = search;
  params = {
    title,
    author,
  };
  curData.list = [];
  listData();
};
const resetSearch = () => {
  search.title = '';
  search.author = '';
  reloadList();
};
const listMData = () => {
  const page = params?.page || 1;
  if (!params) {
    params = {};
  }
  params.page = page + 1;
  listData();
};

const modDoulist = (item) => {
  const value = item.clutter ? item : null;
  curData.adialog = true;
  curData.item = value;
};

const delDoulist = ({ clutter }) => {
  if (clutter) {
    doubanDel({
      clutter,
    }).then(() => {
      listData();
    });
  }
};
onMounted(listData);
</script>

<template>
  <h1>DOULIST</h1>
  <section class="com-controls">
    <input type="text" v-model="search.title" placeholder="title">
    <input type="text" v-model="search.author" placeholder="author">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="modDoulist">新增</button>
  </section>
  <com-list :finished="curData.finished" :loading="curData.loading" @load="listMData">
  <section>
    <div v-for="(item, index) in curData.list" :key="`curData.list${index}`" class="list-item">
      <p><a :href="`/douban/doulist/${item.clutter}`" target="_blank">{{ item.title }}</a></p>
      <p>{{ item.author }}</p>
      <p>{{ item.createTime }} / {{ item.updateTime }}</p>
      <button @click="modDoulist(item)">修改</button>
      <button @click="delDoulist(item)">删除</button>
    </div>
  </section>
  </com-list>
  <new-doulist :doulist="curData.item" v-model:show="curData.adialog" @success="listData"></new-doulist>
</template>

<style scoped lang='less'>
.list-item {
  margin-top: @small;
}
</style>
