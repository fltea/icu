<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { doulistId } from '@/api/douban';

import DoulistDetail from '@/components/douban/DoulistDetail.vue';

const router = useRouter();
const curItem = reactive({
  clutter: '',
});

const loadItem = () => {
  doulistId(curItem.clutter).then((res) => {
    console.log(res);
    if (res.data) {
      Object.keys(res.data).forEach((key) => {
        curItem[key] = res.data[key];
      });
    }
  });
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  curItem.clutter = value.params.detail;
}, { immediate: true });

onMounted(loadItem);
</script>

<template>
<section v-if="curItem.id">
  <doulist-detail :detail="curItem"></doulist-detail>
</section>
</template>

<style scoped lang='less'>
</style>
