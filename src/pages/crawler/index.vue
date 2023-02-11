<script setup>
import { ref, reactive, onMounted } from 'vue';
import { clutters, delClutter } from '@/api/common';
import { del } from '@/api/novel';
import Noveler from '@/components/crawler/Noveler.vue';
import Novel from '@/components/crawler/Novel.vue';

const crawler = reactive({
  list: [],
  novel: {},
  noverler: {
    // domain: 'https://www.tatajk.net', domainsearch: '', title: '#info h1', author: '#info h1 + p a', content: '#intro', lists: '#list dt:nth-child(n+2) ~ dd a', multlist: '.next', listSort: false, detailurl: 'https://www.tatajk.net', detail: '#content', multpage: null, detailex: '#center_tip', dstart: 0, dend: 0, encode: '',
  },
});
const novelerShow = ref(false);
const novelerItem = ref({});
const novelShow = ref(false);
const novelItem = ref({});

const listItems = () => {
  clutters({
    type: 'noveler',
    page: 0,
  }).then((res) => {
    const rlist = res.list;
    if (rlist) {
      // console.log(rlist);
      crawler.list = rlist.map((v) => {
        const item = JSON.parse(v.content);
        item.clutter = v.id;
        item.novels = v.Novels;
        return item;
      });
    }
  });
};

const addNoveler = (item) => {
  novelerItem.value = item || crawler.noverler;
  novelerShow.value = true;
};
const delNoveler = (id) => {
  delClutter({
    id,
  }).then(() => {
    listItems();
  });
};

const addNovel = (item, nitem) => {
  if (!item) {
    return;
  }
  novelItem.value = item;
  if (nitem) {
    novelItem.value.novel = nitem;
  }
  novelShow.value = true;
};
const delNovel = (item, index, id) => {
  del({
    id,
  }).then(() => {
    item.splice(index, 1);
  });
};

onMounted(listItems);
</script>

<template>
  <h1>CRAWLER</h1>
  <div class="com-controls">
    <button @click="addNoveler()">新增 Noveler</button>
  </div>
  <section class="list-container">
    <div v-for="item in crawler.list" :key="`listData-${item.clutter}`" class="list-item">
      <div class="list-line">
        <div>
          <p>domain: {{ item.domain }}</p>
          <p>search: {{ item.domainsearch }}</p>
        </div>
        <div>
          <button @click="addNoveler(item)">编辑</button>
          <button @click="delNoveler(item.clutter)">删除</button>
          <button @click="addNovel(item)">新增 Novel</button>
        </div>
      </div>
      <template v-if="item.novels">
      <div class="list-line" v-for="(nitem, index) in item.novels" :key="`item.Novels-${nitem.id}`">
        <div>
          <p><a :href="`/crawler/${nitem.id}`" target="_blank">{{ nitem.title }}</a></p>
        </div>
        <div>
          <button @click="addNovel(item, nitem)">编辑</button>
          <button @click="delNovel(item.novels, index, nitem.id)">删除</button>
        </div>
      </div>
    </template>
    </div>
  </section>
  <noveler v-model:show="novelerShow" :noveler="novelerItem" @success="listItems"></noveler>
  <novel v-model:show="novelShow" :noveler="novelItem" @success="listItems"></novel>
</template>

<style scoped lang='less'>
.list-container {
  margin-top: 12px;
  max-height: 400px;
  overflow: auto;
  .list-item {
    background-color: aliceblue;
    & +.list-item {
      margin-top: 12px;
    }
    .list-line {
      padding: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
