<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { wdetail, wcomment } from '@/api/weibo';

import ListItem from '@/components/weibo/ListItem.vue';

const router = useRouter();
const detail = ref({});
let id = '';
let cookie = '';

const detailComment = () => {
  wcomment({
    cookie,
    id,
  }).then((res) => {
    // console.log(res);
    detail.value.comments = res.list;
  });
};

const detailData = () => {
  cookie = localStorage.getItem('wcookie') || '';
  if (!id) {
    return;
  }
  wdetail({
    id,
    cookie,
  }).then((res) => {
    console.log(res);
    detail.value = res.data || {};
    detailComment();
  });
};
watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  // console.log(value);
  id = value.params.detail;
}, { immediate: true });

onMounted(detailData);
</script>

<template>
<h1>WEIBO</h1>
<section>
  <list-item v-if="detail.id" :weibo="detail" detail>
    <list-item v-if="detail.retweeted_status" :weibo="detail.retweeted_status" retweeted detail></list-item>
  </list-item>
</section>
</template>

<style lang='less' scoped>
</style>
