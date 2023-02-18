<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { detail } from '@/api/account';

const router = useRouter();
const curItem = reactive({
  id: '',
});
const keys = ref([]);

const loadItem = () => {
  detail({
    id: curItem.id,
  }).then((res) => {
    console.log(res);
    const result = res.data;
    const arrs = Object.keys(result);
    arrs.forEach((v) => {
      curItem[v] = result[v] || '';
    });
    keys.value = arrs;
  });
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  console.log(value.params);
  curItem.id = value.params.id;
}, { immediate: true });

onMounted(loadItem);
</script>

<template>
<h1>{{ curItem.name }}</h1>
<section>
  <div v-for="(item, index) in keys" :key="`keys${index}`">{{ item }} : {{ curItem[item] }}</div>
</section>
</template>

<style lang='less' scoped>
</style>
