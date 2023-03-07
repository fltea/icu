<script setup>
import { ref, reactive, onMounted } from 'vue';

import { list, novelDel } from '@/api/novel';

import newNovel from '@/components/novel/Novel.vue';
import NovelDetail from '@/components/novel/NovelDetail.vue';

const idialog = ref(false);
const curData = reactive({
  list: [],
});
const search = reactive({
  title: '',
  aurthor: '',
});
let params = null;

const linkItems = () => {
  idialog.value = true;
};

const listItems = () => {
  list(params).then((res) => {
    // console.log(res);
    curData.list = res.list;
  });
};

const delItem = ({ id }) => {
  novelDel({
    id,
  }).then((res) => {
    console.log(res);
    listItems();
  });
};

const resetSearch = () => {
  search.title = '';
  search.aurthor = '';
  params = null;
  listItems();
};
const searchList = () => {
  const { title, aurthor } = search;
  params = {
    title,
    aurthor,
  };
  listItems();
};

onMounted(listItems);
</script>

<template>
  <h1>Novel</h1>
  <div class="com-controls">
    <input type="text" v-model="search.title" placeholder="title">
    <input type="text" v-model="search.aurthor" placeholder="aurthor">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="linkItems">新增 Novel</button>
  </div>
  <section>
    <novel-detail v-for="(item, index) in curData.list" :key="`curData.list-${index}`" :detail="item">
      <template v-slot:controls>
        <button @click="delItem(item)">刪除 Novel</button>
      </template>
    </novel-detail>
  </section>
  <new-novel v-model:show="idialog" @success="listItems"></new-novel>
</template>

<style lang='less' scoped>
</style>
