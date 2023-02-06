<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { homelist, follows, userlist, detail, comments } from '@/api/weibo';
import ListItem from '@/components/weibo/ListItem.vue';
import UserItem from '@/components/weibo/UserItem.vue';
import ComList from '@/components/ComList.vue';
import { deepCopy, sleep } from '@/utils/tools';

const listData = reactive([]);
const homeList = reactive([]);
const cdialog = ref(false);
const incookie = ref('');
const timer = ref(0);
const tabs = ['HOME', 'FOLLOWS', 'USERS', 'FAVORITE'];
const curtab = ref(1);
const follow = reactive({
  finished: false,
  loading: false,
  list: [],
  page: 0,
});

let cookie = '';
// const delIds = [];
// const curIds = [];

// 每次求情間隔
const interTime = 5 * 1000;
// 首頁刷新間隔
const homeTime = 10 * 60 * 1000;

const showDialog = () => {
  cdialog.value = true;
};
const hideDialog = () => {
  cdialog.value = false;
};
let listItems;

const getCookie = () => {
  cookie = localStorage.getItem('wcookie') || '';
};
const setCookie = () => {
  console.log('setCookie');
  if (timer.value) {
    clearTimeout(timer.value);
  }
  showDialog();
};
const saveCookie = () => {
  console.log('saveCookie');
  cookie = incookie.value;
  localStorage.setItem('wcookie', cookie);
  hideDialog();
  listItems();
};

const interList = () => {
  if (timer.value) {
    clearTimeout(timer.value);
  }

  timer.value = setTimeout(() => {
    listItems();
  }, homeTime);
};

// 請求列表詳情和評論
const commentDetail = async (id) => {
  const index = homeList.findIndex((v) => v.id === id);
  if (index < 0) {
    return;
  }
  const item = deepCopy(homeList[index]);
  const { isLongText, comments_count: isComment, retweeted_status: retweeted = {} } = item;

  const data = {
    cookie,
    id,
  };
  let result;

  // 詳情
  if (isLongText) {
    result = await detail(data);
    if (result.code === 200 && result.data) {
      item.text = result.data.detail;
    }
  } else if (retweeted.isLongText) {
    result = await detail({
      cookie,
      id: retweeted.id,
    });
    if (result.code === 200 && result.data) {
      retweeted.text = result.data.detail;
    }
  }
  // 評論
  if (isComment) {
    result = await comments(data);
    if (result.code === 200 && result.list) {
      item.comments = result.list;
    }
  }
  // 文章
  // if (infos.type === 'article') {
  //   await articles(data);
  // }
  // const Aid = '23041855dca46a0102vnwa';
  // await articles({
  //   id: Aid,
  //   type: 'p',
  // });
  // 2309404857621026045973
  // const Aid = '2309404857621026045973';
  // await articles({
  //   id: Aid,
  // });

  homeList.splice(index, 1, item);
  // console.log('commentDetail item:', item);
};

// 請求列表詳情和評論
const listDetails = async (datas) => {
  console.log('datas', datas);
  const temps = deepCopy(datas);
  while (temps.length) {
    const item = temps.shift();
    if (temps.length) {
      await sleep(interTime);
    }
    console.log('commentDetail item:', item);
    await commentDetail(item);
  }
  interList();
};

// home 列表
listItems = (maxId) => {
  if (!cookie) {
    setCookie();
    return;
  }
  homelist({
    cookie,
    maxId,
  }).then((res) => {
    if (res.list) {
      const oids = listData.map((v) => v.id);
      const nlist = deepCopy(res.list).filter((l) => !oids.includes(l.id));
      homeList.unshift(...nlist);
      listDetails(nlist.map((v) => v.id));
    } else {
      setCookie();
    }
  });
};

// 1571033823
const getUserList = (uid, sinceId) => {
  userlist({ sinceId, uid }).then((res) => {
    console.log(res);
    if (res.list) {
      const oids = listData.map((v) => v.id);
      const nlist = deepCopy(res.list).filter((l) => !oids.includes(l.id));
      listData.unshift(...nlist);
      listDetails(nlist.map((v) => v.id));
    }
  });
};

const getFollows = () => {
  follow.laoding = true;
  const page = follow.page + 1;
  follows({
    cookie,
    page,
  }).then((res) => {
    if (res.list) {
      const followlist = follow.list;
      const oids = followlist.map((v) => v.id);
      const nlist = deepCopy(res.list.filter((rl) => !oids.includes(rl.id)));
      followlist.push(...nlist);
      follow.page = page;
      follow.finished = res.finished;
    }
  }).finally(() => {
    follow.laoding = false;
  });
};

const loadData = () => {
  listData.length = 0;
  const curIndex = curtab.value;
  switch (curIndex) {
    case 1: getFollows(); break;
    case 2: getUserList(1571033823); break;
    // case 3: getFollows(); break;
    default: listItems();
  }
};

const selectItem = (item, index) => {
  console.log(item, index);
  // const index = tabs.findIndex((v) => v === item)
  curtab.value = index;
  loadData();
};

onMounted(() => {
  getCookie();
  loadData();
  // getUserList(1571033823);
  // getFollows();
});
onBeforeUnmount(() => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
});
</script>

<template>
  <h1>Weibo</h1>
  <button @click="setCookie">設置cookie</button>
  <com-tab :tabs="tabs" :defaultIndex="curtab" @select="selectItem"></com-tab>
  <!-- HOME -->
  <section class="weibo-list" v-show="!curtab">
    <div v-for="(item, index) in homeList" :key="`list-${item.bid}`" class="list-item">
      <list-item :weibo="item" @save="saveWeibo(index)" @delete="delWeibo(index)">
        <list-item v-if="item.retweeted_status" :weibo="item.retweeted_status" retweeted></list-item>
      </list-item>
      <!-- <div>
        <p>{{ item.screen_name }}</p>
        <p>{{ item.description }}</p>
      </div> -->
    </div>
  </section>
  <!-- FOLLOWS -->
  <section class="weibo-list" v-if="curtab === 1">
    <com-list :finished="follow.finished" :laoding="follow.laoding" @load="getFollows">
      <div v-for="item in follow.list" :key="`list-${item.bid}`" class="list-item list-user">
        <user-item :user="item"></user-item>
      </div>
    </com-list>
  </section>
  <!-- USERS -->
  <section class="weibo-list" v-if="curtab === 2">
    <div v-for="(item, index) in listData" :key="`list-${item.bid}`" class="list-item">
      <list-item :weibo="item" @save="saveWeibo(index)" @delete="delWeibo(index)">
        <list-item v-if="item.retweeted_status" :weibo="item.retweeted_status" retweeted></list-item>
      </list-item>
      <!-- <div>
        <p>{{ item.screen_name }}</p>
        <p>{{ item.description }}</p>
      </div> -->
    </div>
  </section>
  <!-- FAVORITE -->
  <section class="weibo-list" v-if="curtab === 3">
    <div v-for="(item, index) in listData" :key="`list-${item.bid}`" class="list-item">
      <list-item :weibo="item" @save="saveWeibo(index)" @delete="delWeibo(index)">
        <list-item v-if="item.retweeted_status" :weibo="item.retweeted_status" retweeted></list-item>
      </list-item>
      <!-- <div>
        <p>{{ item.screen_name }}</p>
        <p>{{ item.description }}</p>
      </div> -->
    </div>
  </section>
  <com-dialog :show="cdialog">
    <h1>Cookie</h1>
    <textarea v-model="incookie" class="weibo-cookie"></textarea>
    <div class="layout-control">
      <button @click="saveCookie">保存</button>
      <button @click="hideDialog">取消</button>
    </div>
  </com-dialog>
</template>

<style scoped lang="less">
.weibo-cookie {
  margin: 12px auto;
  display: block;
  width: 96%;
  height: 150px;
  resize: none;
}
.comtab {
  margin-top: 12px;
}
.list-item {
  margin-top: 12px;
}
.list-user {
  padding: 8px;
  background: #f6f6f6;
  border-radius: 3px;
}
</style>
