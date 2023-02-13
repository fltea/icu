<script setup>
import { ref, reactive, onMounted } from 'vue';
import { list, upload, del } from '@/api/mark';
import { deepCopy } from '@/utils/tools';
import newMark from '@/components/mark/newMark.vue';

const marks = reactive({
  list: [],
  finished: false,
  loading: false,
});
const markData = ref({});
const dialog = ref(false);
const search = reactive({
  title: '',
  url: '',
});
let params = null;

const listData = () => {
  marks.loading = true;
  if (params && params.page) {
    params.page += 1;
  }
  list(params).then((res) => {
    const page = +res.page;
    if (page === 1) {
      marks.list = [];
    }
    marks.list.push(...deepCopy(res.list) || []);
    if (!params) {
      params = {};
    }
    params.page = page;
    marks.finished = marks.list.length >= res.count;
  }).finally(() => {
    marks.loading = false;
  });
};
const uploadFile = (file) => {
  const form = new FormData();
  form.append('file', file);
  upload(form).then((res) => {
    console.log(res);
    listData();
  });
};

const editMark = (item) => {
  markData.value = deepCopy(item) || {};
  dialog.value = true;
};
const deleteMark = (id) => {
  del({
    id,
  }).then((res) => {
    console.log(res);
    listData();
  });
};
const changFile = (event) => {
  const target = event.target || {};
  const files = target.files || [];
  // console.log(list)
  uploadFile(files[0]);
};

const resetSearch = () => {
  search.title = '';
  search.url = '';
  params = null;
  listData();
};
const searchList = () => {
  const { title, url } = search;
  params = {
    title,
    url,
  };
  listData();
};

onMounted(listData);
</script>

<template>
  <h1>MARK</h1>
  <section>
    <input type="text" v-model="search.title" placeholder="title">
    <input type="text" v-model="search.url" placeholder="url">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
    <button @click="editMark()">新增</button>
    <com-upload-button  @change="changFile">批量导入</com-upload-button>
    <com-down-button action="/api/mark/exports">批量导出</com-down-button>
  </section>
  <com-list :finished="marks.finished" :loading="marks.loading" @load="listData">
    <section class="mark-list">
      <a class="mark-item" v-for="(item ,index) in marks.list" :key="`list-${index}`" :href="item.url" target="__blank">
        <div class="mark-icons" v-if="item.icons">
          <img :src="item.icons" :alt="item.title">
        </div>
        <div>
          <p>{{item.title}}</p>
          <div class="mark-desc">{{item.description || ''}}</div>
          <div class="mark-control">
            <button @click.stop.prevent="editMark(item)">修改</button>
            <button @click.stop.prevent="deleteMark(item.id)">删除</button>
          </div>
        </div>
      </a>
    </section>
  </com-list>
  <new-mark :mark="markData" v-model:show="dialog" @success="listData"></new-mark>
</template>

<style scoped lang="less">
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
