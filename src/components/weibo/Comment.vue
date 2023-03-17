<script setup>
import { computed } from 'vue';
import { formatTime } from '@/utils/tools';

import UserItem from './UserItem.vue';

const props = defineProps({
  comment: Object,
});
const comment = computed(() => props.comment);
</script>

<template>
  <section class="comment-item" v-if="comment">
    <user-item :user="comment.user" nopic>
      <template #created_at>
        <span class="user-desc">{{formatTime(comment.created_at)}}</span>
      </template>
    </user-item>
    <div v-html="comment.text"></div>
    <slot></slot>
  </section>
</template>

<style lang='less' scoped>
.comment-item {
  padding-top: 4px;
  padding-bottom: 4px;
  padding-right: 8px;
  font-size: 14px;
  border-top: 1px dashed @splitColor;
  .weibo-user {
    padding-left: 0;
  }
}
</style>
