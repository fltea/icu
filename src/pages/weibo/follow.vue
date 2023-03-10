<script setup>
import { ref, reactive, onMounted } from 'vue';
import { wfollow } from '@/api/weibo';
import { deepCopy } from '@/utils/tools';

import UserItem from '@/components/weibo/UserItem.vue';

const cdialog = ref(false);
let cookie = '';

const follow = reactive({
  finished: false,
  loading: false,
  list: [],
  page: 0,
});
const setCookie = () => {
  cdialog.value = true;
};
const getCookie = (str) => {
  if (str) {
    cookie = str || '';
  } else {
    cookie = localStorage.getItem('wcookie') || '';
  }
};

const listItems = () => {
  if (!cookie) {
    setCookie();
    return;
  }
  follow.laoding = true;
  const page = follow.page + 1;
  wfollow({
    cookie,
    page,
  }).then((res) => {
    if (res.list) {
      const flist = follow.list;
      const oids = flist.map((v) => v.id);
      const nlist = deepCopy(res.list.filter((rl) => !oids.includes(rl.id)));
      flist.push(...nlist);
      follow.page = page;
      follow.finished = res.finished;
    }
  }).finally(() => {
    follow.laoding = false;
  });
};

const initList = (str) => {
  getCookie(str);
  listItems();
};

onMounted(initList);
</script>

<template>
  <h1>WEIBO FOLLOW</h1>
  <button @click="setCookie">設置cookie</button>
  <section>
    <com-list :finished="follow.finished" :laoding="follow.laoding" @load="listItems">
      <div v-for="item in follow.list" :key="`list-${item.bid}`" class="list-user">
        <user-item :list="followList" :user="item" @succese="listItems"></user-item>
      </div>
    </com-list>
  </section>
  <text-dialog textarea v-model:show="cdialog" title="Cookie" @save="initList"></text-dialog>
</template>

<style lang='less' scoped>
.list-user {
  margin-top: 16px;
  padding: 8px;
  background: #f6f6f6;
  border-radius: 3px;
}
</style>
