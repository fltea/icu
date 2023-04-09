<script setup>
import { ref, reactive, onMounted } from 'vue';
import { list, del, actions } from '@/api/todo';
import { deepCopy } from '@/utils/tools';
import Todo from '@/components/todo/Todo.vue';

const items = reactive({
  list: [],
  finished: false,
  loading: false,
});
const dialog = ref(false);
const itemData = ref({});
const search = reactive({
  title: '',
  content: '',
});
let params = null;
const setParams = (data = null) => {
  if (data) {
    if (!params) {
      params = {};
    }
    Object.keys(data).forEach((key) => {
      params[key] = data[key];
    });
  } else {
    params = data;
  }
};

const listData = () => {
  items.loading = true;
  list(params).then((res) => {
    if (res.list) {
      const page = +(res.page || '');
      if (page > 1) {
        items.list.push(...res.list);
      } else {
        items.list = res.list;
      }
      setParams({
        page,
      });
      items.finished = items.list.length >= res.count;
    }
  }).finally(() => {
    items.loading = false;
  });
};
const listMData = () => {
  const page = params.page + 1;
  setParams({
    page,
  });
  listData();
};
const actData = (item, type) => {
  actions({
    id: item.id,
    type,
  }).then(() => {
    listData();
  });
};
const editData = (item, type) => {
  if (type) {
    actData(item, type);
    return;
  }
  itemData.value = deepCopy(item) || {};
  dialog.value = true;
};
const delData = (id) => {
  del({
    id,
  }).then(() => {
    // console.log(res);
    listData();
  });
};

const resetSearch = () => {
  search.title = '';
  search.content = '';
  params = null;
  listData();
};

const searchList = () => {
  const { title, content } = search;
  params = {
    title,
    content,
  };
  listData();
};

onMounted(listData);
</script>

<template>
  <h1>TODO</h1>
  <div class="com-controls">
    <input type="text" v-model="search.title" placeholder="title">
    <input type="text" v-model="search.content" placeholder="content">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="editData()">新增</button>
  </div>
  <com-list :finished="items.finished" :loading="items.loading" @load="listMData">
    <section class="mark-list">
      <div class="list-item" v-for="(item ,index) in items.list" :key="`list-${index}`">
        <p class="list-title"><a :href="item.url" target="__blank">{{item.title}}</a></p>
        <pre class="list-content">{{item.content || ''}}</pre>
        <p><span>beginDate:</span> {{ item.beginDate }}</p>
        <p><span>deadline:</span> {{ item.deadline }}</p>
        <p><span>completeDate:</span> {{ item.completeDate }}</p>
        <p><span>disuseTime:</span> {{ item.disuseTime }}</p>
        <div class="com-controls">
          <button @click="editData(item,'complete')">完成</button>
          <button @click="editData(item,'discarded')">放弃</button>
          <button @click="editData(item)">修改</button>
          <button @click="delData(item.id)">删除</button>
        </div>
      </div>
    </section>
  </com-list>
  <todo :todo="itemData" v-model:show="dialog" @success="listData"></todo>
</template>

<style scoped lang='less'>

</style>
