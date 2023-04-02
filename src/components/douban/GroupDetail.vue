<script setup>
import { computed } from 'vue';
import { groupAdd } from '@/api/douban';

const props = defineProps({
  detail: Object,
});

const item = computed(() => props.detail);

const addItems = () => {
  const { id, name, info, content, tabs, tags } = item.value;
  console.log(id, name, info, content, tabs, tags, item);
  groupAdd({
    id,
    name,
    info,
    content,
    tabs: JSON.stringify(tabs),
    tags: JSON.stringify(tags),
  }).then((res) => {
    console.log(res);
  });
};
</script>

<template>
<section>
  <h1><a :href="`/douban/group/${item.clutter}`" target="_blank">{{ item.name }}</a></h1>
  <div class="com-controls">
    <slot name="controls">
      <button @click="addItems">收藏小组</button>
    </slot>
  </div>
  <div v-html="item.info"></div>
  <div v-html="item.content"></div>
  <div>
    <span class="tags" v-for="(tag, index) in item.tags" :key="`item.tags${index}`"> {{ tag.title }}</span>
  </div>
</section>
</template>

<style scoped lang='less'>
.tags {
  & +.tags{
    margin-left: 12px;
  }
}
</style>
