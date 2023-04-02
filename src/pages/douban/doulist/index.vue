<script setup>
import { reactive, onMounted } from 'vue';
import { doulist, doubanDel } from '@/api/douban';
import NewDoulist from '@/components/douban/Doulist.vue';
import DoulistDetail from '@/components/douban/DoulistDetail.vue';

const curData = reactive({
  list: [],
  adialog: false,
  item: null,
});
let params = null;
const search = reactive({
  title: '',
  author: '',
});

const listData = () => {
  doulist(params).then((res) => {
    console.log(res);
    if (res.list) {
      curData.list = res.list;
    }
  });
};
const searchList = () => {
  const { title, author } = search;
  params = {
    title,
    author,
  };
  listData();
};
const resetSearch = () => {
  search.title = '';
  search.author = '';
  params = null;
  listData();
};

const modDoulist = (item) => {
  const value = item.clutter ? item : null;
  curData.adialog = true;
  curData.item = value;
};

const delDoulist = ({ clutter }) => {
  if (clutter) {
    doubanDel({
      clutter,
    }).then(() => {
      listData();
    });
  }
};
onMounted(listData);
</script>

<template>
  <h1>DOULIST</h1>
  <section class="com-controls">
    <input type="text" v-model="search.title" placeholder="title">
    <input type="text" v-model="search.author" placeholder="author">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="modDoulist">新增</button>
  </section>
  <section>
    <div v-for="(item, index) in curData.list" :key="`curData.list${index}`" class="list-item">
      <!-- {{ item }}<button @click="modDoulist(item)">修改</button><button @click="delDoulist(item)">删除</button> -->
      <doulist-detail :detail="item" >
        <template v-slot:controls>
          <button @click="modDoulist(item)">修改</button>
          <button @click="delDoulist(item)">删除</button>
        </template>
      </doulist-detail>
    </div>
  </section>
  <new-doulist :doulist="curData.item" v-model:show="curData.adialog" @success="listData"></new-doulist>
</template>

<style scoped lang='less'>
.list-item {
  margin-top: @small;
}
</style>
