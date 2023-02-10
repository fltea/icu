<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { dChapter } from '@/api/novel';

const router = useRouter();
const novel = ref({});

const getData = (id) => {
  dChapter({
    id,
  }).then((res) => {
    console.log(res);
    if (res.data) {
      novel.value = res.data;
    }
  });
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  console.log(value);
  getData(value.params.chapter);
}, { immediate: true });
</script>

<template>
<section>Chapter</section>
</template>

<style lang='less' scoped>
</style>
