<script setup>
import { reactive, onMounted } from 'vue';
import { list, add, del } from '@/api/mlog';
import { deepCopy } from '@/utils/tools';

const search = reactive({
  text: '',
  creator: '',
});
let params = null;
const mlog = reactive({
  item: {
    text: '',
  },
  list: [],
  finished: false,
  loading: false,
});

const listData = () => {
  mlog.loading = true;
  if (params && params.page) {
    params.page += 1;
  }
  list(params).then((res) => {
    const page = +res.page;
    if (page === 1) {
      mlog.list = [];
    }
    mlog.list.push(...deepCopy(res.list) || []);
    if (!params) {
      params = {};
    }
    params.page = page;
    mlog.finished = mlog.list.length >= res.count;
  }).finally(() => {
    mlog.loading = false;
  });
};
const addMlog = () => {
  add(mlog.item).then(() => {
    if (params && params.page) {
      params.page -= 1;
    }
    listData();
  });
};
const deleteMlog = (id) => {
  del({
    id,
  }).then((res) => {
    console.log(res);
    if (params && params.page) {
      params.page -= 1;
    }
    listData();
  });
};
const resetSearch = () => {
  search.text = '';
  search.creator = '';
  params = null;
  listData();
};
const searchList = () => {
  const { text, creator } = search;
  params = {
    text,
    creator,
  };
  listData();
};

onMounted(listData);
</script>

<template>
  <h1>MLOG</h1>
  <section class="list-controls">
    <textarea v-model="mlog.item.text"></textarea>
    <button @click="addMlog">提交</button>
  </section>
  <section class="list-controls">
    <input type="text" v-model="search.text" placeholder="text">
    <input type="text" v-model="search.creator" placeholder="creator">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
  </section>
  <section class="mlog-list">
    <div v-for="(item ,index) in mlog.list" :key="`mlog.list${index}`">
      <p>{{ item.text }}</p>
      <button @click="deleteMlog(item.id)">删除</button>
    </div>
  </section>
</template>

<style scoped lang='less'>
.list-controls {
  margin-top: 10px;
  input,
  textarea,
  button {
    margin-right: 10px;
    vertical-align: middle;
  }
}
</style>
