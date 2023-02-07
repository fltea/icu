<script setup>
import { ref, onMounted } from 'vue';
import { doulist, details, save } from '@/api/douban';
import doulists from '@/assets/data/doulists';

const listData = ref([]);
// 128969215 学习
const detail = ref({});
const douId = ref('128969215');
const itemId = ref('');

const listItem = (page) => {
  doulist({
    id: '128969215',
    page,
  }).then((res) => {
    if (res.list) {
      listData.value = [...res.list];
    }
  });
};

const showCont = (item) => {
  console.log(item);
  itemId.value = item.id;
  details({
    url: item.url,
  }).then((res) => {
    console.log(res);
    detail.value = res.data;
  });
};

const saveItem = () => {
  save(detail.value);
};

onMounted(() => {
  listItem();
});
</script>

<template>
  <h1>Douban</h1>
  <section class="doulist-container">
    <div class="doulist-list">
      <p class="doulist-item" v-for="dou in doulists" :key="`doulists-${dou.id}`" :class="{active: dou.id === douId}" :title="dou.text">{{ dou.text.substr(0, 8) }} <a href="javascript:;">查看</a></p>
    </div>
    <div class="dou-list">
      <div class="list-items">
        <div v-for="item in listData" :key="`list-${item.id}`" class="list-item" :class="{active: item.id === itemId}">
          <p>{{item.title.substr(0, 15)}}</p>
          <p>{{item.text.substr(0, 30)}} <a href="javascript:;" @click="showCont(item)">查看内容</a></p>
        </div>
      </div>
      <div class="list-content">
        <template v-if="detail.title">
        <p><a href="javascript:;" @click="saveItem">保存</a></p>
        <p>{{ detail.title }}</p>
        <pre v-html="detail.content"></pre>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.doulist-container {
  display: flex;
  height: 86vh;
  overflow: hidden;
  .doulist-list {
    width: 200px;
    min-width: 200px;
    overflow: auto;
  }
  .dou-list {
    flex: 1;
    margin-left: 24px;
    height: 100%;
  }
  .active {
    background: #eee;
  }
}
.doulist-item {
  padding: 3px;
}
.list-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-height: 300px;
  overflow: auto;
  .list-item {
    margin-bottom: 12px;
    padding: 3px;
    width: 260px;
  }
}
.list-content {
  padding: 6px;
  height: calc(86vh - 300px);
  background-color: #f2f2f2;
  overflow: auto;
}
</style>
