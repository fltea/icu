<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { userSave } from '@/api/weibo';

import useWuserStore from '@/store/wuser';

const wuserStore = useWuserStore();

const props = defineProps({
  user: Object,
  nopic: Boolean,
  detail: Boolean,
  noactions: Boolean,
});
const { users: usersList } = storeToRefs(wuserStore);
// const user = computed(() => props.user);
// const emits = defineEmits(['saveUser']);
const saveBtn = computed(() => {
  const item = props.user;
  return !usersList.value.includes(`${item.id}`);
});
const saveUser = async () => {
  const item = props.user;
  const res = await userSave(item);
  if (res.id) {
    wuserStore.setUser(item.id);
  }
};

const linkUser = () => {
  if (!props.detail) {
    const item = props.user;
    console.log(item);
    window.open(`/weibo/user/${item.id}`);
  }
};

onMounted(() => {
  if (!usersList.value.length) {
    wuserStore.getUsers();
  }
});
</script>

<template>
  <section class="weibo-user" v-if="user">
    <img v-if="!nopic" class="user-pic" :src="user.profile_image_url" :alt="user.screen_name">
    <div class="user-content">
      <p>
        <span class="user-name" @click="linkUser">{{user.screen_name}}</span>
        <slot name="created_at"></slot>
      </p>
      <p class="user-desc">{{user.description}}</p>
    </div>
    <div class="user-act" v-if="!noactions">
      <button @click="saveUser" v-if="saveBtn">存ID</button>
      <slot name="acts"></slot>
    </div>
  </section>
</template>

<style lang='less' scoped>
.weibo-user {
  margin-bottom: 6px;
  padding-left: 70px;
  padding-top: 4px;
  position: relative;
  display: flex;
  height: 46px;
  &.no-act {
    padding-right: 8px;
  }
  .user-content {
    flex: 1;
    min-width: 50%;
  }
  .user-pic {
    position: absolute;
    left: 8px;
    top: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .user-name {
    margin-right: 12px;
    font-weight: bold;
  }
  :deep(.user-desc) {
    font-size: 12px;
    color: @subTextColor;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .user-act {
    margin-left: 12px;
    padding-top: 10px;
    padding-right: 8px;
    text-align: right;
    white-space: nowrap;
    :deep(button){
      min-width: 40px;
      font-size: 12px;
      line-height: 16px;
    }
  }
}
</style>
