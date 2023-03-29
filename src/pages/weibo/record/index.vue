<script setup>
import { reactive, onMounted } from 'vue';
import { record } from '@/api/weibo';

const list = reactive({
  datas: [],
});

const listData = () => {
  record().then((res) => {
    console.log(res);
    list.datas = res.list;
  });
};

onMounted(listData);
</script>

<template>
<section class="list-container">
  <div class="list-item" v-for="item in list.datas" :key="item.id">
    <a :href="item.authorLink" target="_blank">{{item.author}}</a>
    <a :href="`/weibo/record/${item.id}`" target="_blank">詳情</a>
    <div v-html="item.content"></div>
  </div>
</section>
</template>

<style lang='less' scoped>
.list-container {
  display: flex;
  flex-wrap: wrap;
  .list-item {
    margin-bottom: 12px;
    margin-right: 12px;
    padding: 3px 6px;
    background: #ccc;
    border-radius: 4px;
  }
  .list-del {
    margin-left: 12px;
    font-size: 12px;
  }
}
</style>
