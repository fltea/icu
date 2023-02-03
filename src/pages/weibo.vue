<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { homelist, follows, userlist, detail, comments } from '@/api/weibo';
import ListItem from '@/components/weibo/ListItem.vue';
import { deepCopy, sleep } from '@/utils/tools';

const listData = reactive([]);
const cdialog = ref(false);
const incookie = ref('');
const timer = ref(0);

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

const commentDetail = async (id) => {
  const index = listData.findIndex((v) => v.id === id);
  if (index < 0) {
    return;
  }
  const item = deepCopy(listData[index]);
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

  listData.splice(index, 1, item);
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
      listData.unshift(...nlist);
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

const getFollows = (page) => {
  follows({
    cookie,
    page,
  }).then((res) => {
    console.log(res);
    if (res.list) {
      listData.unshift(...res.list);
    }
  });
};

onMounted(() => {
  getCookie();
  listItems();
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
  <section class="weibo-list">
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
.weibo-list {
  padding-top: 12px;
}
.weibo-cookie {
  margin: 12px auto;
  display: block;
  width: 96%;
  height: 150px;
  resize: none;
}
</style>
