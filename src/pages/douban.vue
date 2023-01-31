<script setup>
import { ref, onMounted } from 'vue';
import { doulist } from '@/api/douban';

const listData = ref([]);
// 128969215 学习

const listItem = (page) => {
  doulist({
    id: '128969215',
    page,
  }).then((res) => {
    if (res.list) {
      listData.value = [...res.list];
    }
  });
};

onMounted(() => {
  listItem();
});
</script>

<template>
  <h1>Douban</h1>
  <section>
    <div v-for="item in listData" :key="`list-${item.id}`" class="list-item">
      <p>{{item.title}}</p>
      <p>{{item.text}}</p>
    </div>
  </section>
</template>

<style scoped lang="less">
.list-item {
  margin-top: 12px;
}
</style>
