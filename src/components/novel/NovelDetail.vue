<script setup>
import { computed } from 'vue';

const props = defineProps({
  detail: Object,
});
const item = computed(() => props.detail);

</script>

<template>
  <section>
    <h1>{{ item.title }}</h1>
    <div>
      <slot name="controls"></slot>
    </div>
    <p>{{ item.author }}</p>
    <p>{{ item.createdAt }} {{ item.updatedAt }}</p>
    <p>{{ item.chapterCount }}</p>
    <div v-html="item.content"></div>
    <template v-if="item.chapters">
    <div v-for="(chapter, index) in item.chapters" :key="`item.chapters${index}`">
      <p>{{ chapter }}</p>
    </div>
  </template>
  </section>
</template>

<style lang='less' scoped>
</style>
