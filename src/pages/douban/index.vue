<script setup>
import { ref, onMounted } from 'vue';
import { clutters, delClutter } from '@/api/common';
import doulists from '@/assets/data/doulists';
import Doulist from '@/components/crawler/Doulist.vue';

const show = ref(false);
const doulistItem = ref(null);
const doulistItems = ref([]);

const listItems = () => {
  clutters({
    type: 'doulist',
    page: 0,
  }).then((res) => {
    const rlist = res.list;
    if (rlist) {
      // console.log(rlist);
      doulistItems.value = rlist.map((v) => {
        const item = JSON.parse(v.content);
        item.clutter = v.id;
        // item.novels = v.Novels;
        return item;
      });
    }
  });
};

const addDoulist = (item) => {
  console.log(item);
  show.value = true;
  doulistItem.value = item;
};
const delDoulist = (id) => {
  delClutter({
    id,
  }).then(() => {
    listItems();
  });
};

onMounted(listItems);
</script>

<template>
  <h1>DOUBAN</h1>
  <div class="com-controls">
    <button @click="addDoulist()">新增豆列</button>
  </div>
  <section class="doulist-container">
    <div v-for="dou in doulists" :key="`doulists-${dou.id}`" class="doulist-item">
      <p :title="dou.text">{{ dou.text }}</p>
      <button @click="addDoulist(dou)">新增豆列</button>
    </div>
  </section>
  <section class="doulist-container">
    <div v-for="dou in doulistItems" :key="`doulists-${dou.id}`" class="doulist-item">
      <p :title="dou.title"><a :href="`/douban/${dou.id}`" target="_blank">{{ dou.title }}</a></p>
      <button @click="addDoulist(dou)">修改豆列</button>
      <button @click="delDoulist(dou.clutter)">删除豆列</button>
    </div>
  </section>
  <doulist v-model:show="show" :doulist="doulistItem" @success="listItems"></doulist>
</template>

<style scoped lang='less'>
.doulist-container {
  display: flex;
  flex-wrap: wrap;
}
.doulist-item {
  margin-top: 12px;
  margin-right: 12px;
  padding: 6px;
  background-color: aliceblue;
}
</style>
