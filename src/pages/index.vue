<script setup>
import { ref } from 'vue';

const loading = ref(false);

const changValue = () => {
  loading.value = !loading.value;
};
</script>

<template>
<h1>INDEX</h1>
<section class="com-controls">
  <button @click="changValue">修改值</button>
</section>
<section style="height:300px;" v-loading="loading"></section>
</template>

<style scoped lang='less'>
</style>
