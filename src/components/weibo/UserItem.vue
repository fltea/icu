<script setup>
// import { computed } from 'vue';
import { addClutter } from '@/api/common';

const props = defineProps({
  user: Object,
  noAct: Boolean,
  detail: Boolean,
});
// const user = computed(() => props.user);
const saveUser = () => {
  const item = props.user;
  addClutter({
    type: 'follow',
    content: JSON.stringify(item),
    phrase: item.id,
  });
};

const linkUser = () => {
  if (!props.detail) {
    const item = props.user;
    console.log(item);
    window.open(`/weibo/user/${item.id}`);
  }
};
</script>

<template>
  <section class="weibo-user" :class="{'no-act': noAct}" v-if="user" @click="linkUser">
    <img class="user-pic" :src="user.profile_image_url" :alt="user.screen_name">
    <p>{{user.screen_name}}  <slot name="created_at"></slot></p>
    <p class="user-desc">{{user.description}}</p>
    <div class="user-act" v-if="!noAct">
      <button @click="saveUser" v-if="!user.clutterId">存ID</button>
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
  &.no-act {
    padding-right: 8px;
  }
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
  }
}
</style>
