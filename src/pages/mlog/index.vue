<script setup>
import { reactive, onMounted } from 'vue';
import { list } from '@/api/mlog';
import { deepCopy } from '@/utils/tools';
import Mlog from '@/components/mlog/Mlog.vue';

const search = reactive({
  text: '',
});
let params = null;
const mlog = reactive({
  list: [],
  finished: false,
  loading: false,
});

const listData = () => {
  mlog.loading = true;
  list(params).then((res) => {
    mlog.list.push(...deepCopy(res.list) || []);
    mlog.finished = mlog.list.length >= res.count;
  }).finally(() => {
    mlog.loading = false;
  });
};

const reloadList = () => {
  params = null;
  mlog.list = [];
  listData();
};

const resetSearch = () => {
  search.text = '';
  reloadList();
};
const searchList = () => {
  const { text } = search;
  params = {
    text,
  };
  mlog.list = [];
  listData();
};
const listMData = () => {
  const page = params?.page || 1;
  if (!params) {
    params = {};
  }
  params.page = page + 1;
  listData();
};

onMounted(listData);
</script>

<template>
  <h1>MLOG</h1>
  <Mlog @success="reloadList" />
  <section class="com-controls">
    <input type="text" v-model="search.text" placeholder="text">
    <button @click="searchList">查詢</button>
    <button @click="resetSearch">重設</button>
  </section>
  <com-list :finished="mlog.finished" :loading="mlog.loading" @load="listMData">
    <section>
      <div class="list-item" v-for="(item ,index) in mlog.list" :key="`mlog.list${index}`">
        <p>{{ item.createdAt }}</p>
        <pre>{{ item.text }}</pre>
        <template v-if="item.infos">
          <div class="pics-list" v-if="item.infos.pics && item.infos.pics.length">
            <div class="pics-item" v-for="(pic, index) in item.infos.pics" :key="`pics-index-${index}`" :style="`background-image: url(${pic.url});`"></div>
          </div>
          <div class="video-list" v-if="item.infos.video">
            <video controls :src="item.infos.video.url"></video>
          </div>
        </template>
      </div>
    </section>
  </com-list>
</template>

<style scoped lang='less'>
.pics-list {
  margin-top: @mini;
  display: flex;
  flex-wrap: wrap;
  max-height: 250px;
  overflow-y: auto;
  .pics-item {
    @picw: 90px;
    margin-bottom: @mini;
    margin-right: @mini;
    width: @picw;
    height: @picw;
    line-height: @picw;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 6px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
}
.video-list {
  margin-top: @tiny;
  width: 600px;
  height: 288px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, .3);
}
</style>
