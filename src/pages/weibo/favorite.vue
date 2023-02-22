<script setup>
import { ref, reactive, onMounted } from 'vue';
import { wfavorite } from '@/api/weibo';
import { deepCopy } from '@/utils/tools';

import WCookie from '@/components/weibo/WCookie.vue';
import ListItem from '@/components/weibo/ListItem.vue';

const cdialog = ref(false);
let cookie = '';

const favorite = reactive({
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
  favorite.laoding = true;
  const page = favorite.page + 1;
  wfavorite({
    cookie,
    page,
  }).then((res) => {
    console.log(res);
    const flist = favorite.list;
    const oids = flist.map((v) => v.id);
    const nlist = deepCopy(res.list.filter((rl) => !oids.includes(rl.id)));
    flist.push(...nlist);
    favorite.page = page;
    favorite.finished = res.finished;
  }).finally(() => {
    favorite.laoding = false;
  });
};

const initList = (str) => {
  getCookie(str);
  favorite.page = 0;
  listItems();
};

onMounted(initList);
</script>

<template>
<h1>WEIBO FAVORITE</h1>
  <button @click="setCookie">設置cookie</button>
  <section>
    <com-list :finished="favorite.finished" :laoding="favorite.laoding" @load="listItems">
      <div v-for="item in favorite.list" :key="`list-${item.bid}`" class="list-item">
      <list-item :weibo="item">
        <list-item v-if="item.retweeted_status" :weibo="item.retweeted_status" retweeted></list-item>
      </list-item>
    </div>
    </com-list>
  </section>
  <w-cookie v-model:show="cdialog" @success="initList"></w-cookie>
</template>

<style lang='less' scoped>
.list-item {
  margin-top: 16px;
}
</style>
