<script setup>
import { watch, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { wuser } from '@/api/weibo';
import { deepCopy } from '@/utils/tools';

import ListItem from '@/components/weibo/ListItem.vue';
import UserItem from '@/components/weibo/UserItem.vue';

const router = useRouter();
let id = '';
let cookie = '';
let nextId;
const userData = reactive({
  detail: {},
  list: [],
  finished: false,
  loading: false,
  page: 0,
});

const detailData = (sinceId) => {
  cookie = localStorage.getItem('wcookie') || '';
  if (!id) {
    return;
  }
  userData.loading = true;
  wuser({
    id,
    cookie,
    sinceId,
  }).then((res) => {
    // console.log(res);
    const list = res.list || [];
    if (!userData.detail.id && list.length) {
      const { user } = list[0];
      if (user) {
        userData.detail = deepCopy(user);
      }
    }
    if (sinceId) {
      userData.list.push(...list);
    } else {
      userData.list = list;
    }
    nextId = res.sinceId;
  }).finally(() => {
    userData.loading = false;
  });
};
const listItems = () => {
  detailData(nextId);
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  // console.log(value);
  id = value.params.id;
}, { immediate: true });

onMounted(detailData);
</script>

<template>
<h1>USER</h1>
<user-item :user="userData.detail" detail class="list-item"></user-item>
<section class="weibo-list">
  <com-list :finished="userData.finished" :laoding="userData.loading" @load="listItems">
    <div v-for="item in userData.list" :key="`list-${item.bid}`" class="list-item">
      <list-item :weibo="item">
        <list-item v-if="item.retweeted_status" :weibo="item.retweeted_status" retweeted></list-item>
      </list-item>
    </div>
  </com-list>
</section>
</template>

<style lang='less' scoped>
.list-item {
  margin-top: 16px;
}
</style>
