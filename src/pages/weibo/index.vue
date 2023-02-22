<script setup>
import { ref, reactive, onMounted } from 'vue';
import { whome } from '@/api/weibo';
import { deepCopy } from '@/utils/tools';

import WCookie from '@/components/weibo/WCookie.vue';
import ListItem from '@/components/weibo/ListItem.vue';

const listData = reactive([]);
const cdialog = ref(false);

let cookie = '';
// const timer = '';
// // 每次求情間隔
// const interTime = 5 * 1000;
// // 首頁刷新間隔
// const homeTime = 10 * 60 * 1000;

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
  whome({
    cookie,
  }).then((res) => {
    console.log(res);
    if (res.list) {
      const oids = listData.map((v) => v.id);
      const nlist = deepCopy(res.list).filter((l) => !oids.includes(l.id));
      listData.unshift(...nlist);
      // listDetails(nlist.map((v) => v.id), homeList);
    }
  });
};
const initList = (str) => {
  getCookie(str);
  listItems();
};

onMounted(initList);
</script>

<template>
  <h1>Weibo</h1>
  <button @click="setCookie">設置cookie</button>
  <section class="weibo-list">
    <div v-for="item in listData" :key="`list-${item.bid}`" class="list-item">
      <list-item :weibo="item">
        <list-item v-if="item.retweeted_status" :weibo="item.retweeted_status" retweeted></list-item>
      </list-item>
    </div>
  </section>
  <w-cookie v-model:show="cdialog" @success="initList"></w-cookie>
<section>

</section>
</template>

<style lang='less' scoped>
.list-item {
  margin-top: 16px;
}
</style>
