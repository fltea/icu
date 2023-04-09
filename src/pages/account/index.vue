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
  <section class="com-controls">
    <input type="text" v-model="search.phone" placeholder="phone">
    <input type="text" v-model="search.email" placeholder="email">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="editAccount()">新增</button>
  </section>
  <com-list :finished="accounts.finished" :loading="accounts.loading" @load="moreData">
    <section class="list-container">
      <div class="list-item" v-for="(item, index) in accounts.list" :key="`account-list-${index}`">
        <div class="item-icons" v-if="item.pic">
          <img :src="item.pic" :alt="item.title">
        </div>
        <div>
          <p class="list-title"><a :href="`/account/${item.id}`" target="__blank">{{ item.name }}</a></p>
          <p class="item-desc">{{ item.nickName || '' }}</p>
        </div>
        <div class="item-controls">
          <button @click="tieAccount(item)">绑定</button>
          <button @click="editAccount(item)">修改</button>
          <button @click="deleteAccount(item.id)">删除</button>
        </div>
      </div>
    </section>
  </com-list>
  <account :account="accountData" v-model:show="dialog" @success="listData"></account>
  <tie :atie="atieData" v-model:show="dialogTie" @success="listData"></tie>
</template>

<style scoped lang="less">
.list-item {
  display: flex;
  .item-icons {
    margin-right: 8px;
    width: 48px;
    height: 48px;
    text-align: center;
    background: #eee;
    border-radius: 3px;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .item-controls {
    margin-left: auto;
  }
}
</style>
