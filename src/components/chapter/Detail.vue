<script setup>
import { computed } from 'vue';

const props = defineProps({
  detail: Object,
});
const item = computed(() => props.detail);
</script>

<template>
<section class="chapter-detail">
  <h1>
    <span>{{ item.title }}</span>
  </h1>
  <div class="com-controls">
    <slot name="controls"></slot>
    <a class="controls-link" v-if="item.prev" :href="item.prev.link">上一章</a>
    <a class="controls-link" v-if="item.next" :href="item.next.link">下一章</a>
  </div>
  <section class="com-container">
    <p>{{ item.author }}</p>
    <p>{{ item.createdAt }} {{ item.updatedAt }}</p>
    <p>{{ item.chapterCount }}</p>
    <div class="chapter-contents">
      <pre class="chapter-content" v-html="item.content"></pre>
      <pre class="chapter-content" v-if="item.newcontent" v-html="item.newcontent"></pre>
    </div>
  </section>
  <footer class="footer-contorls">
    <a class="controls-link" v-if="item.prev" :href="item.prev.link">上一章</a>
    <a class="controls-link" v-if="item.next" :href="item.next.link">下一章</a>
  </footer>
</section>
</template>

<style scoped lang='less'>
.chapter-contents {
  display: flex;
  .chapter-content {
    min-width: 49%;
    + .chapter-content {
      margin-left: 2%;
      width: 49%;
    }
  }
}
</style>
