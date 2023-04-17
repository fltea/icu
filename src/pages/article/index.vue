<script setup>
import { reactive, onMounted } from 'vue';
import { list } from '@/api/article';
import { deepCopy } from '@/utils/tools';

const curData = reactive({
  list: [],
  loading: false,
  finished: false,
});
const search = reactive({
  title: '',
  content: '',
});
let params = null;

// const dialog = ref(false);

const newArticle = (id) => {
  window.open(`/article/edit/${id || 'new'}`, 'articleEdit');
};
const loadList = () => {
  curData.loading = true;
  list(params).then((res) => {
    // console.log(res, curData.list);
    curData.list.push(...deepCopy(res.list) || []);
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
  loadList();
};
const searchList = () => {
  const { title, content } = search;
  params = {
    title,
    content,
  };
  curData.list = [];
  loadList();
};
const resetSearch = () => {
  search.title = '';
  search.content = '';
  params = null;
  curData.list = [];
  loadList();
};
onMounted(loadList);
</script>

<template>
  <h1>ARTICLE</h1>
  <section class="com-controls">
    <input type="text" v-model="search.title" placeholder="title">
    <input type="text" v-model="search.content" placeholder="content">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="newArticle()">新增</button>
  </section>
  <com-list :finished="curData.finished" :loading="curData.loading" @load="listMData">
  <section>
    <div class="list-item" v-for="(item, index) in curData.list" :key="`curData.list-${index}`">
    <p><a :href="`/article/${item.id}`" target="_blank">{{ item.title }}</a></p>
    <p>{{ item.content }}</p>
    <button @click="newArticle(item.id)">编辑</button>
    </div>
  </section>
  </com-list>
</template>

<style scoped lang='less'>
</style>
