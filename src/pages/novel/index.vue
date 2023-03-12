<script setup>
import { ref, reactive, onMounted } from 'vue';

import { list, novelDel } from '@/api/novel';
import { deepCopy } from '@/utils/tools';

import newNovel from '@/components/novel/Novel.vue';
import NovelDetail from '@/components/novel/NovelDetail.vue';

const idialog = ref(false);
const curData = reactive({
  list: [],
  finished: false,
  loading: false,
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
  curData.laoding = true;
  if (!params) {
    params = {
      page: 0,
    };
  }
  params.page += 1;
  list(params).then((res) => {
    if (res.list) {
      const flist = curData.list;
      const oids = flist.map((v) => v.id);
      const nlist = deepCopy(res.list.filter((rl) => !oids.includes(rl.id)));
      flist.push(...nlist);
      curData.finished = flist.length >= res.count;
    }
  }).finally(() => {
    curData.laoding = false;
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
    page: 0,
  };
  listItems();
};

const initList = () => {
  params = null;
  curData.finished = false;
  listItems();
};

const delItem = ({ id }) => {
  novelDel({
    id,
  }).then(() => {
    // console.log(res);
    initList();
  });
};

onMounted(initList);
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
  <section class="com-container">
    <com-list :finished="curData.finished" :laoding="curData.laoding" @load="listItems">
      <novel-detail v-for="(item, index) in curData.list" :key="`curData.list-${index}`" :detail="item" list>
        <template v-slot:controls>
          <button @click="delItem(item)">刪除 Novel</button>
        </template>
      </novel-detail>
    </com-list>
  </section>
  <new-novel v-model:show="idialog" @success="initList"></new-novel>
</template>

<style lang='less' scoped>
.novel-detail {
  padding-top: @small;
}
</style>
