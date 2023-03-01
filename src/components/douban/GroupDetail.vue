<script setup>
import { computed } from 'vue';
import { groupAdd } from '@/api/douban';

const props = defineProps({
  detail: Object,
});

const item = computed(() => props.detail);

const addItems = () => {
  const { id, title, info, content, tags } = item.value;
  console.log(id, title, info, content, tags);
  groupAdd({
    id,
    name: title,
    info,
    content,
    tags: tags.map((v) => v.name).join(),
  }).then((res) => {
    console.log(res);
  });
};
</script>

<template>
<section>
  <h1>{{ item.title }}</h1>
  <div>
    <button @click="addItems">收藏小组</button>
  </div>
  <div v-html="item.info"></div>
  <div v-html="item.content"></div>
  <div>
    <span class="tags" v-for="(tag, index) in item.tags" :key="`item.tags${index}`"> {{ tag.name }}</span>
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
