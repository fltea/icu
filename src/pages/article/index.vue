<script setup>
import { ref, reactive } from 'vue';

const curData = reactive({

});

const dialog = ref(false);

const newArticle = () => {

};
</script>

<template>
  <h1>ARTICLE</h1>
  <section class="com-controls">
    <button @click="newArticle">新增</button>
  </section>
  <section>

  </section>
</template>

<style scoped lang='less'>
</style>
