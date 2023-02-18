<script setup>
import { ref, reactive, onMounted } from 'vue';
import { list, del } from '@/api/account';
import { deepCopy } from '@/utils/tools';
import Account from '@/components/account/Account.vue';
import Tie from '@/components/account/Tie.vue';

const accounts = reactive({
  list: [],
  finished: false,
  loading: false,
});
const accountData = ref({});
const atieData = ref({});
const dialog = ref(false);
const dialogTie = ref(false);
const search = reactive({
  phone: '',
  email: '',
});
let params = null;

const listData = (page = 1) => {
  accounts.loading = true;
  if (params) {
    params.page = page;
  }
  list(params).then((res) => {
    if (page === 1) {
      accounts.list = [];
    }
    accounts.list.push(...deepCopy(res.list) || []);
    if (!params) {
      params = {};
    }
    params.page = +(res.page || '');
    accounts.finished = accounts.list.length >= res.count;
  }).finally(() => {
    accounts.loading = false;
  });
};

const moreData = () => {
  let { page } = params;
  if (page) {
    page += 1;
    listData(page);
  }
};

const tieAccount = (item) => {
  atieData.value = {
    tied: item.id,
    tiedName: item.name,
  };
  dialogTie.value = true;
};
const editAccount = (item) => {
  accountData.value = deepCopy(item) || {};
  dialog.value = true;
};
const deleteAccount = (id) => {
  del({
    id,
  }).then((res) => {
    console.log(res);
    listData();
  });
};
const resetSearch = () => {
  search.phone = '';
  search.email = '';
  params = null;
  listData();
};
const searchList = () => {
  const { phone, email } = search;
  params = {
    phone,
    email,
  };
  listData();
};

onMounted(listData);
</script>

<template>
  <h1>ACCOUNT</h1>
  <section class="list-controls">
    <input type="text" v-model="search.phone" placeholder="phone">
    <input type="text" v-model="search.email" placeholder="email">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="editAccount()">新增</button>
  </section>
  <com-list :finished="accounts.finished" :loading="accounts.loading" @load="moreData">
    <section class="mark-list">
      <a class="mark-item" v-for="(item, index) in accounts.list" :key="`list-${index}`" :href="`/account/${item.id}`" target="__blank">
        <div class="mark-icons" v-if="item.pic">
          <img :src="item.pic" :alt="item.title">
        </div>
        <div>
          <p>{{item.name}}</p>
          <div class="mark-desc">{{item.nickName || ''}}</div>
          <div class="list-controls">
            <button @click.stop.prevent="tieAccount(item)">绑定</button>
            <button @click.stop.prevent="editAccount(item)">修改</button>
            <button @click.stop.prevent="deleteAccount(item.id)">删除</button>
          </div>
        </div>
      </a>
    </section>
  </com-list>
  <account :account="accountData" v-model:show="dialog" @success="listData"></account>
  <tie :atie="atieData" v-model:show="dialogTie" @success="listData"></tie>
</template>

<style scoped lang="less">
.list-controls {
  input,
  button {
    margin-right: 10px;
    vertical-align: middle;
  }
}
.mark-list {
  margin-left: -12px;
  display: flex;
  flex-wrap: wrap;
}
.mark-item {
  margin-top: 12px;
  margin-left: 12px;
  padding: 6px;
  width: 220px;
  display: flex;
  align-items: center;
  font-size: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  .mark-icons {
    margin-right: 8px;
    width: 48px;
    height: 48px;
    text-align: center;
    background: #eee;
    border-radius: 3px;
    overflow: hidden;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .mark-desc {
    max-height: 30px;
  }
  .mark-control {
    margin-top: 3px;
  }
}
</style>
