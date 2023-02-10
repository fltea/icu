<script setup>
import { ref, reactive, onMounted } from 'vue';
import { clutters, delClutter } from '@/api/common';
// import { deepCopy } from '@/utils/tools';
import Noveler from '@/components/crawler/Noveler.vue';
import Novel from '@/components/crawler/Novel.vue';

const novelerShow = ref(false);
const longstr = ref(false);
const novelShow = ref(false);
const crawler = reactive({
  // noveler: {
  // domain: 'https://www.tatajk.net', domainsearch: '', title: '#info h1', author: '#info h1 + p a', content: '#intro', lists: '#list dt:nth-child(n+2) ~ dd a', multlist: '.next', listSort: false, detailurl: 'https://www.tatajk.net', detail: '#content', multpage: null, detailex: '#center_tip', dstart: 0, dend: 0, encode: '',
  // },
  noveler: null,
  novel: null,
  novelEr: null,
  novelers: [],
  novels: [],
});

const getNovelers = () => {
  clutters({
    type: 'noveler',
    page: 0,
  }).then((res) => {
    const rlist = res.list;
    if (rlist) {
      console.log(rlist);
      crawler.novelers = rlist.map((v) => {
        const noveler = JSON.parse(v.content);
        noveler.clutterId = v.id;
        noveler.Novels = v.Novels;
        return noveler;
      });
    }
  });
};

const addNoveler = (item) => {
  crawler.noveler = item || null;
  novelerShow.value = true;
};
const delNoveler = (id) => {
  delClutter({
    id,
  }).then(() => {
    getNovelers();
  });
};
const addNovel = (item, novel) => {
  // console.log(item);
  crawler.novelEr = item;
  crawler.novel = novel || null;
  novelShow.value = true;
};
const addNovelSuccess = () => {
  console.log('addNovelSuccess');
};

onMounted(getNovelers);
</script>

<template>
<h1>CRAWLER</h1>
<div>
  <button @click="addNoveler()">設置Noveler</button>
</div>
<section class="list-container">
  <div v-for="item in crawler.novelers" :key="`listData-${item}`" class="list-item">
    <p>{{ item.domain }} <button @click="addNoveler(item)">修改Noveler</button> <button @click="delNoveler(item.clutterId)">删除Noveler</button> <button @click="addNovel(item)">新增Novel</button></p>
    <template v-if="item.Novels">
      <p v-for="novel in item.Novels" :key="`item.Novels-${novel.id}`" >{{ novel.title }} <button @click="addNovel(item, novel)">修改Novel</button></p>
    </template>
  </div>
</section>
<noveler v-model:show="novelerShow" :longstr="longstr" :noveler="crawler.noveler" @success="getNovelers"></noveler>
<novel v-model:show="novelShow" :novel="crawler.novel" :noveler="crawler.novelEr" @success="addNovelSuccess"></novel>
</template>

<style lang='less' scoped>
.list-container {
  margin-top: 12px;
  max-height: 400px;
  overflow: auto;
  .list-item {
    & +.list-item {
      margin-top: 12px;
    }
  }
}
</style>
