<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { recordDetail } from '@/api/weibo';
import ListItem from '@/components/weibo/ListItem.vue';

const router = useRouter();
const detail = ref({});
let id = '';

const detailData = () => {
  if (!id) {
    return;
  }
  recordDetail(id).then((res) => {
    console.log(res);
    const item = res.data || {};
    if (item.infos) {
      item.infos = JSON.parse(item.infos);
    }
    detail.value = item;
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
  <section class="com-container">
    <list-item v-if="detail.infos" :weibo="detail.infos" detail noactions>
      <list-item v-if="detail.infos.retweeted_status" :weibo="detail.infos.retweeted_status" retweeted detail noactions></list-item>
    </list-item>
  </section>
</template>

<style lang='less' scoped>
</style>
