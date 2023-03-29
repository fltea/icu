<script setup>
import { ref, reactive, onMounted } from 'vue';
import { whome, block, saveBlock } from '@/api/weibo';
import { deepCopy } from '@/utils/tools';
import { loadUsers } from '@/utils/localData';

import ListItem from '@/components/weibo/ListItem.vue';

const listData = reactive({
  finished: false,
  loading: false,
  list: [],
  page: 0,
});
const cdialog = ref(false);
const text = reactive({
  title: 'Cookie',
  text: '',
});
let bItem = null;

let cookie = '';
// const timer = '';
// // 每次求情間隔
// const interTime = 5 * 1000;
// // 首頁刷新間隔
// const homeTime = 10 * 60 * 1000;

const setBlock = () => {
  text.title = 'Block';
  if (bItem) {
    text.text = bItem.content || '';
  } else {
    text.text = '';
  }
  cdialog.value = true;
};

const setCookie = () => {
  text.title = 'Cookie';
  text.text = '';
  cdialog.value = true;
};
const getCookie = (str) => {
  if (str) {
    cookie = str || '';
    localStorage.setItem('wcookie', cookie);
  } else {
    cookie = localStorage.getItem('wcookie') || '';
  }
};

const listItems = () => {
  if (!cookie) {
    setCookie();
    listData.maxId = null;
    listData.finished = true;
    return;
  }
  listData.loading = true;
  const params = {
    cookie,
  };
  if (listData.maxId) {
    params.maxId = listData.maxId;
  }
  whome(params).then((res) => {
    console.log(res);
    if (res.list) {
      const oids = listData.list.map((v) => v.id);
      const nlist = deepCopy(res.list).filter((l) => !oids.includes(l.id));
      listData.list.push(...nlist);
      listData.maxId = nlist.slice(-1).pop().id;
      listData.finished = listData.list.length === res.count;
    }
  }).finally(() => {
    listData.loading = false;
  });
};
const initList = (str) => {
  getCookie(str);
  listItems();
};

const getBlock = () => {
  block().then((res) => {
    if (res.data) {
      bItem = res.data;
    }
    initList();
  });
};
const setBlocks = (content) => {
  const params = {
    content,
  };
  if (bItem) {
    params.id = bItem.id;
  }
  saveBlock(params).then((res) => {
    console.log(res);
  });
};

const getText = (str) => {
  if (text.title === 'Block') {
    setBlocks(str);
  } else {
    initList(str);
  }
};

onMounted(() => {
  getBlock();
  loadUsers();
});
</script>

<template>
  <h1>Weibo</h1>
  <section class="com-controls">
    <button @click="setCookie">設置cookie</button>
    <button @click="setBlock">設置屏蔽關鍵詞</button>
  </section>
  <section class="weibo-list">
    <com-list :finished="listData.finished" :laoding="listData.laoding" @load="listItems">
      <div v-for="item in listData.list" :key="`list-${item.bid}`" class="list-item">
        <list-item :weibo="item">
          <list-item v-if="item.retweeted_status" :weibo="item.retweeted_status" retweeted></list-item>
        </list-item>
      </div>
    </com-list>
  </section>
  <text-dialog textarea v-model:show="cdialog" :text="text.text" :title="text.title" @save="getText"></text-dialog>
<section>

</section>
</template>

<style lang='less' scoped>
.list-item {
  margin-top: 16px;
}
</style>
