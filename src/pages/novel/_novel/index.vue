<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { detail } from '@/api/novel';
// import { getRoute } from '@/utils/tools';

const router = useRouter();
const novel = ref({});
// getRoute(router);
// console.log(router, router.getRoutes());

const getData = (id) => {
  detail({
    id,
  }).then((res) => {
    console.log(res);
    if (res.data) {
      novel.value = res.data;
    }
  });
};

const addContent = (item) => {
  console.log(item);
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  console.log(value.params);
  getData(value.params.novel);
}, { immediate: true });
</script>

<template>
  <h1>{{ novel.title }}</h1>
  <pre>{{ novel.content }}</pre>
  <section>
    <div v-for="item in novel.Chapters" :key="`novel.Chapters-${item.id}`">
      <p><a :href="`/novel/${novel.id}/${item.id}`" target="_balnk">{{ item.title }}</a></p>
      <button @click="addContent(item)">获取内容</button>
      <p v-if="item.content">{{ item.content }}</p>
      <p v-else>内容</p>
    </div>
  </section>
</template>

<style scoped lang='less'>
</style>
