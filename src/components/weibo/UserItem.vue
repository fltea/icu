<script setup>
import { computed } from 'vue';
import { addClutter } from '@/api/common';

const props = defineProps({
  user: Object,
});
const user = computed(() => props.user);
const saveUser = () => {
  const item = user.value;
  addClutter({
    type: 'follow',
    content: JSON.stringify(item),
    phrase: item.id,
  });
};
</script>

<template>
  <section class="weibo-user">
    <img class="user-pic" :src="user.profile_image_url" :alt="user.screen_name">
    <p>{{user.screen_name}}  <slot name="created_at"></slot></p>
    <p class="user-desc">{{user.description}}</p>
    <div class="user-act">
      <button @click="saveUser">存ID</button>
      <slot name="acts"></slot>
    </div>
  </section>
</template>

<style lang='less' scoped>
.weibo-user {
  margin-bottom: 6px;
  position: relative;
  padding-left: 70px;
  padding-right: 110px;
  padding-top: 4px;
  height: 46px;
  .user-pic {
    position: absolute;
    left: 8px;
    top: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .user-desc {
    font-size: 14px;
    color: #939393;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .user-act {
    position: absolute;
    top: 0;
    right: 10px;
    width: 100px;
    ::v-deep(button) {
      margin-right: 6px;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
