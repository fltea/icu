<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { groupId } from '@/api/douban';

import GroupDetail from '@/components/douban/GroupDetail.vue';

const router = useRouter();
const curItem = reactive({
  clutter: '',
});

const loadItem = () => {
  groupId(curItem.clutter).then((res) => {
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
  <group-detail :detail="curItem"></group-detail>
</section>
</template>

<style scoped lang='less'>
</style>
