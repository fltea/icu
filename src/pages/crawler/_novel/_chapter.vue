<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { dChapter } from '@/api/novel';

const router = useRouter();
const chapterId = ref('');
const chapter = ref({});

const getData = () => {
  dChapter({
    id: chapterId.value,
  }).then((res) => {
    // console.log(res);
    if (res.data) {
      chapter.value = res.data;
    }
  });
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  // console.log(value);
  chapterId.value = value.params.chapter;
}, { immediate: true });

onMounted(getData);
</script>

<template>
<h1>{{ chapter.title }}</h1>
<section>
  <pre>{{ chapter.content }}</pre>
</section>
</template>

<style lang='less' scoped>
</style>
