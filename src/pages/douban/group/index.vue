<script setup>
import { reactive, onMounted } from 'vue';
import { group, doubanDel } from '@/api/douban';
import GroupDetail from '@/components/douban/GroupDetail.vue';
import NewGroup from '@/components/douban/Group.vue';

const curData = reactive({
  list: [],
  gdialog: false,
  gitem: null,
});
const search = reactive({
  name: '',
});
let params = null;

const listData = () => {
  group(params).then((res) => {
    console.log(res);
    if (res.list) {
      curData.list = res.list;
    }
  });
};
const searchList = () => {
  const { name } = search;
  params = {
    name,
  };
  listData();
};
const resetSearch = () => {
  search.name = '';
  params = null;
  listData();
};

const modGroup = (item) => {
  // console.log(item);
  const value = item.clutter ? item : null;
  curData.gdialog = true;
  curData.gitem = value;
};

const delGroup = ({ clutter }) => {
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
  <h1>GROUP</h1>
  <section class="com-controls">
    <input type="text" v-model="search.name" placeholder="name">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="modGroup">新增小组</button>
  </section>
  <section>
    <div v-for="(item, index) in curData.list" :key="`curData.list${index}`" class="list-item">
      <group-detail :detail="item" >
        <template v-slot:controls>
          <button @click="modGroup(item)">修改</button>
          <button @click="delGroup(item)">删除</button>
        </template>
      </group-detail>
    </div>
  </section>
  <new-group :group="curData.gitem" v-model:show="curData.gdialog" @success="listData"></new-group>
</template>

<style scoped lang='less'>
.list-item {
  margin-top: 12px;
}
</style>
