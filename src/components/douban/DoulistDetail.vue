<script setup>
import { computed } from 'vue';
import { doulistAdd } from '@/api/douban';

const props = defineProps({
  detail: Object,
});
const item = computed(() => props.detail);

const addItems = () => {
  const {
    id,
    title,
    author,
    authorIp,
    authorLink,
    count,
    createTime,
    updateTime,
    content,
  } = item.value;
  // console.log(id, name, info, content, tags);
  doulistAdd({
    id,
    title,
    author,
    authorIp,
    authorLink,
    count,
    createTime,
    updateTime,
    content,
  }).then((res) => {
    console.log(res);
  });
};
</script>

<template>
  <section>
    <h1><a :href="`/douban/doulist/${item.clutter}`" target="_blank">{{ item.title }}</a></h1>
    <div class="com-controls">
      <slot name="controls">
        <button @click="addItems">收藏豆列</button>
      </slot>
    </div>
    <p>{{ item.author }}</p>
    <p>{{ item.createTime }} {{ item.updateTime }}</p>
    <p>{{ item.count }}</p>
    <div v-html="item.content"></div>
    <template v-if="item.topics">
    <div v-for="(topic, index) in item.topics" :key="`item.topics${index}`">
      <p>source: {{ topic.source }}</p>
      <p>{{ topic.title }}</p>
      <div v-html="topic.text"></div>
    </div>
  </template>
  </section>
</template>

<style scoped lang='less'>
</style>
