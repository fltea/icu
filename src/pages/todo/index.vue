<script setup>
import { ref, reactive, onMounted } from 'vue';
import { list, del } from '@/api/todo';
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
const editData = (item) => {
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
  <div class="list-controls">
    <input type="text" v-model="search.title" placeholder="title">
    <input type="text" v-model="search.content" placeholder="content">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="editData()">新增</button>
  </div>
  <com-list :finished="items.finished" :loading="items.loading" @load="listMData">
    <section class="mark-list">
      <a class="mark-item" v-for="(item ,index) in items.list" :key="`list-${index}`" :href="item.url" target="__blank">
        <div>
          <p>{{item.title}}</p>
          <div class="mark-desc">{{item.content || ''}}</div>
          <div class="mark-control">
            <button @click.stop.prevent="editData(item)">修改</button>
            <button @click.stop.prevent="delData(item.id)">删除</button>
          </div>
        </div>
      </a>
    </section>
  </com-list>
  <todo :todo="itemData" v-model:show="dialog" @success="listData"></todo>
</template>

<style scoped lang='less'>
.list-controls {
  input,
  button{
    margin-right: 10px;
    vertical-align: middle;
  }
}
</style>
