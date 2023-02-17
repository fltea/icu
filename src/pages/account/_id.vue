<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { detail } from '@/api/account';

const router = useRouter();
const curItem = reactive({
  id: '',
});

const loadItem = () => {
  detail({
    id: curItem.id,
  }).then((res) => {
    console.log(res);
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
<h1>ACCOUNT</h1>
<section></section>
</template>

<style lang='less' scoped>
</style>
