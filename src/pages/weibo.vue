<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { homelist, follows, userlist, detail, comments } from '@/api/weibo';
import { clutters } from '@/api/common';
import ListItem from '@/components/weibo/ListItem.vue';
import UserItem from '@/components/weibo/UserItem.vue';
import ComList from '@/components/ComList.vue';
import { deepCopy, sleep } from '@/utils/tools';

const listData = reactive([]);
const homeList = reactive([]);
const followList = ref([]);
const cdialog = ref(false);
const incookie = ref('');
const timer = ref(0);
const tabs = ['HOME', 'FOLLOWS', 'USERS'];
const curtab = ref(0);
const follow = reactive({
  finished: false,
  loading: false,
  list: [],
  page: 0,
});
const users = reactive({
  finished: false,
  loading: false,
  curuser: null,
  sinceId: null,
  list: [],
  data: [],
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
const commentDetail = async (id, curlist) => {
  const index = curlist.findIndex((v) => v.id === id);
  if (index < 0) {
    return;
  }
  const item = deepCopy(curlist[index]);
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

  curlist.splice(index, 1, item);
  // console.log('commentDetail item:', item);
};

// 請求列表詳情和評論
const listDetails = async (datas, curlist) => {
  console.log('datas', datas);
  const temps = deepCopy(datas);
  while (temps.length) {
    const item = temps.shift();
    if (temps.length) {
      await sleep(interTime);
    }
    console.log('commentDetail item:', item);
    await commentDetail(item, curlist);
  }
  // if (curtab.value === 1) {
  interList();
  // }
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
      listDetails(nlist.map((v) => v.id), homeList);
    } else {
      setCookie();
    }
  });
};

// getUserList
const getUserList = () => {
  users.laoding = true;
  const { curuser, data } = users;
  if (!curuser) {
    return;
  }
  const uid = curuser.id;
  let sinceId;
  if (data.length) {
    sinceId = data.slice(-1).pop().id;
  }
  userlist({ sinceId, uid }).then((res) => {
    console.log(res);
    if (res.list) {
      const oids = users.data.map((v) => v.id);
      const nlist = deepCopy(res.list).filter((l) => !oids.includes(l.id));
      users.data.push(...nlist);
      // listDetails(nlist.map((v) => v.id), users.data);
    }
  }).finally(() => {
    users.laoding = false;
  });
};

// follow 列表
const getFollows = () => {
  follow.laoding = true;
  const page = follow.page + 1;
  follows({
    cookie,
    page,
  }).then((res) => {
    if (res.list) {
      const flist = follow.list;
      const oids = flist.map((v) => v.id).concat();
      const nlist = deepCopy(res.list.filter((rl) => !oids.includes(rl.id)));
      nlist.forEach((item) => {
        const clutter = followList.value.find((c) => +c.phrase === item.id);
        if (clutter) {
          item.clutterId = clutter.id;
        }
      });
      flist.push(...nlist);
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
    case 2: getUserList(); break;
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

// clutter follow followList
const getCFollows = () => {
  clutters({
    type: 'follow',
    page: 0,
  }).then((res) => {
    const rlist = deepCopy(res.list);
    if (rlist) {
      followList.value = rlist;
      // console.log(followList.value);
      const ulist = rlist.map((v) => {
        const user = JSON.parse(v.content);
        user.clutterId = v.id;
        return user;
      });
      // console.log(ulist);
      users.list = deepCopy(ulist);
      if (!users.curuser) {
        users.curuser = ulist.shift();
      }
      getCookie();
      loadData();
    }
  });
};

const selectUser = (user) => {
  users.curuser = user;
  users.data = [];
  getUserList();
};

onMounted(() => {
  getCFollows();
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
    <div v-for="item in homeList" :key="`list-${item.bid}`" class="list-item">
      <list-item :weibo="item">
        <list-item v-if="item.retweeted_status" :weibo="item.retweeted_status" retweeted></list-item>
      </list-item>
      <!-- <div>
        <p>{{ item.screen_name }}</p>
        <p>{{ item.description }}</p>
      </div> -->
    </div>
  </section>
  <!-- FOLLOWS -->
  <section class="weibo-list" v-show="curtab === 1">
    <com-list :finished="follow.finished" :laoding="follow.laoding" @load="getFollows">
      <div v-for="item in follow.list" :key="`list-${item.bid}`" class="list-item list-user">
        <user-item :list="followList" :user="item" @succese="getCFollows"></user-item>
      </div>
    </com-list>
  </section>
  <!-- USERS -->
  <section class="users-list" v-show="curtab === 2">
    <div class="list-users">
      <div v-for="item in users.list" :key="`list-${item.id}`" class="list-item list-user" :class="{active: users.curuser.id === item.id}" @click="selectUser(item)">
        <user-item :user="item" :no-act="true"></user-item>
      </div>
    </div>
    <div class="list-data">
      <com-list :finished="users.finished" :laoding="users.laoding" @load="getUserList">
        <div v-for="item in users.data" :key="`list-${item.bid}`" class="list-item">
          <list-item :weibo="item">
            <list-item v-if="item.retweeted_status" :weibo="item.retweeted_status" retweeted></list-item>
          </list-item>
        </div>
      </com-list>
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
.comtab,
.list-item {
  margin-top: 12px;
}
.list-user {
  padding: 8px;
  background: #f6f6f6;
  border-radius: 3px;
}
.users-list {
  min-width: 900px;
  height: calc(100vh - 190px);
  display: flex;
  overflow: hidden;
  .list-users {
    margin-right: 12px;
    min-width: 250px;
    width: 250px;
    overflow: auto;
  }
  .list-user {
    cursor: pointer;
  }
  .list-data {
    overflow: auto;
  }
}
</style>
