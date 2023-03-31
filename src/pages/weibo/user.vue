<script setup>
import { reactive, onMounted } from 'vue';
import { user } from '@/api/weibo';

const list = reactive({
  datas: [],
});

const listData = () => {
  user().then((res) => {
    console.log(res);
    list.datas = res.list;
  });
};

onMounted(listData);
</script>

<template>
<section class="list-container">
  <div class="list-item" v-for="item in list.datas" :key="item.id">
    <a :href="`/weibo/user/${item.id}`" target="_blank">{{item.screen_name}}</a>
    <!-- <span class="list-del">刪除</span> -->
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
