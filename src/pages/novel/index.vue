<script setup>
import { ref, reactive, onMounted } from 'vue';
import { list } from '@/api/novel';
import Novel from '@/components/crawler/Novel.vue';

const novelShow = ref(false);
const myNovel = reactive({
  list: [],
  curItem: null,
});

const listItems = () => {
  list().then((res) => {
    console.log(res);
    myNovel.list = [...res.list];
  });
};
// await listItems();

const addNovel = (item) => {
  console.log(item);
  myNovel.curItem = item;
  novelShow.value = true;
};
const addNovelSuccess = () => {
  console.log('addNovelSuccess');
};

onMounted(listItems);
</script>

<template>
  <h1>NOVEL</h1>
  <section>
    <div v-for="item in myNovel.list" :key="`item.Novels-${item.id}`" >
      <button @click="addNovel(item)">修改Novel</button>
      <p><a :href="`./novel/${item.id}`" target="_balnk">{{ item.title }} (总计 {{ item.Chapters.length }} 章)</a></p>
    </div>
  </section>
  <novel v-model:show="novelShow" :novel="myNovel.curItem" @success="addNovelSuccess"></novel>
</template>

<style scoped lang='less'>
</style>
