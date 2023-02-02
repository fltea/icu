<script setup>
import { computed } from 'vue';
import { formatTime } from '@/utils/tools';

const props = defineProps({
  comment: Object,
});
const comment = computed(() => props.comment);
</script>

<template>
  <section class="comment-item" v-if="comment">
    <header class="comment-header"><span class="header-name">{{comment.user.screen_name}}</span> <span class="header-desc">{{comment.user.description}}</span> <span class="header-desc">{{formatTime(comment.created_at)}}</span></header>
    <div v-html="comment.text"></div>
    <slot></slot>
  </section>
</template>

<style lang='less' scoped>
.comment-item {
  padding-bottom: 8px;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 14px;

}
.comment-header {
  line-height: 21px;
  .header-name,
  .header-desc {
    margin-right: 12px;
    display: inline-block;
    vertical-align: middle;
  }
  .header-desc {
    max-width: 30%;
    font-size: 12px;
    color: #939393;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

</style>
