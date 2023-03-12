<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { chapter, noveler, nurlchapter, chapterMod } from '@/api/novel';
import { getDomain } from '@/utils/tools';

import ChapterDetail from '@/components/chapter/Detail.vue';

const router = useRouter();
const curItem = reactive({
  id: '',
  newcontent: null,
});
const cloading = ref(false);
let nItem = null;

const loadItem = () => {
  chapter({
    id: curItem.id,
  }).then((res) => {
    console.log(res);
    const result = res.data || {};
    const arrs = Object.keys(result);
    arrs.forEach((v) => {
      curItem[v] = result[v] || '';
    });
    if (curItem.prev) {
      curItem.prev.link = `/novel/${curItem.id}/${curItem.prev.id}`;
    }
    if (curItem.next) {
      curItem.next.link = `/novel/${curItem.id}/${curItem.next.id}`;
    }
    curItem.chapter = res.data;
  });
};

const loadContent = () => {
  cloading.value = true;
  const item = { url: curItem.url, ...nItem, title: curItem.title };
  nurlchapter(item).then((res) => {
    if (res.data) {
      curItem.newcontent = res.data.detail;
    }
  }).finally(() => {
    cloading.value = false;
  });
};
const loadNoveler = () => {
  cloading.value = true;
  noveler({
    domain: getDomain(curItem.url),
  }).then((res) => {
    // console.log(res);
    if (res.data) {
      nItem = res.data;
      loadContent();
    } else {
      cloading.value = false;
    }
  }).catch(() => {
    cloading.value = false;
  });
};

const newContent = () => {
  if (!curItem.url) {
    return;
  }
  if (nItem) {
    loadContent();
  } else {
    loadNoveler();
  }
};

const saveContent = () => {
  chapterMod({
    id: curItem.id,
    content: curItem.newcontent,
  }).then((res) => {
    if (res.data) {
      curItem.content = curItem.newcontent;
      curItem.newcontent = null;
    }
  });
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  curItem.id = value.params.chapter;
}, { immediate: true });

onMounted(loadItem);
</script>

<template>
<chapter-detail v-if="curItem.title" :detail="curItem">
  <template v-slot:controls>
    <button @click="newContent">获取最新内容</button>
    <button @click="saveContent" v-if="curItem.newcontent">保存最新内容</button>
  </template>
</chapter-detail>
</template>

<style scoped lang='less'>
</style>
