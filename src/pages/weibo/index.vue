<script setup>
import { reactive, onMounted } from 'vue';
import { user, wuser } from '@/api/weibo';
import ListItem from '@/components/weibo/ListItem.vue';

const list = reactive({
  datas: [],
  users: [],
  finished: false,
  loading: false,
  user: '',
});
let timer = null;
let index = 0;
let timeinter = 10 * 1000;
let userUpdate;

const userData = () => {
  list.loading = true;
  wuser({
    id: list.user.id,
    sinceId: list.user.sinceId,
  }).then((res) => {
    const listdata = res.list || [];
    if (!listdata.length) {
      list.user.finished = true;
    } else {
      list.users.unshift(...listdata);
      list.user.sinceId = res.sinceId;
    }
    userUpdate();
  }).finally(() => {
    list.loading = false;
  });
};

const addIndex = () => {
  index += 1;
  const max = list.datas.length;
  if (index >= max) {
    index = 0;
  }
};

const setUser = () => {
  list.user = list.datas[index];
  if (list.user.finished) {
    addIndex();
    list.user = list.datas[index];
  }
  userData();
};

userUpdate = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  addIndex();

  timer = setTimeout(setUser, timeinter);
};

const listData = () => {
  user().then((res) => {
    console.log(res);
    list.datas = res.list;
    const max = list.datas.length;
    if (max) {
      if (max < 6) {
        timeinter = 30 * 1000;
      }
      setUser();
    }
  });
};

onMounted(listData);
</script>

<template>
<div class="list-container">
  <section class="list-items">
    <div class="list-item" v-for="item in list.datas" :key="item.id">
      <a :href="`/weibo/user/${item.id}`" target="_blank">{{item.screen_name}}</a>
    </div>
  </section>
  <section class="list-weibos">
    <list-item :weibo="item" v-for="item in list.users" :key="`list-${item.bid}`">
      <list-item v-if="item.retweeted_status" :weibo="item.retweeted_status" retweeted></list-item>
    </list-item>
  </section>
</div>
</template>

<style scoped lang='less'>
.list-container {
  width: 100%;
  display: flex;
  height: calc(100vh - 130px);
  overflow: hidden;
  .list-items {
    width: 250px;
    flex-shrink: 1;
    overflow-y: auto;
  }
  .list-weibos {
    margin-left: @small;
    width: calc(100% - 250px - @small);
    overflow-y: auto;
  }
}
.list-item {
  margin-bottom: 12px;
  padding: 3px 6px;
  background: #ccc;
  border-radius: 4px;
}
.weibo-item {
  margin-bottom: 12px;
  width: 100%;
}
</style>
