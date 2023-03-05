<script setup>
import { ref, onMounted } from 'vue';
import { upload } from '@/api/common';
import { list, add, del } from '@/api/pic';

const uploadFile = (file) => {
  const form = new FormData();
  form.append('file', file);
  return upload(form);
};

const listData = ref([]);
const listItems = () => {
  list().then((res) => {
    console.log(res);
    listData.value = [...res.list];
  });
};
// const newItem = (item) => {
//   console.log(item);
//   modify(item).then(() => {
//     listItems();
//   });
// };
const delItem = (id) => {
  del({
    id,
  }).then(() => {
    listItems();
  });
};
const changFile = (event) => {
  // console.log(event);
  const target = event.target || {};
  const files = target.files || [];
  // console.log(files);
  if (files.length) {
    // console.log(Array.from(list).map(v => v.size))
    uploadFile(files[0]).then((res) => {
      add(res.data).then(() => {
        listItems();
      });
    });
  }
};

onMounted(listItems);
</script>

<template>
  <h1>Pic</h1>
  <section>
    <!-- <button @click="newItem">新增</button> -->
    <button class="file-button">上传Pic<input type="file" name="file" id="myFile" @change="changFile"></button>
  </section>
  <!-- 列表 -->
  <div class="list-item">
    <!-- 内容 -->
    <div class="item-inner" v-for="item in listData" :key="`list${item.id}`">
      <img class="item-img" :src="item.url" alt="">
      <div class="item-tools">
        <span>{{ item.creator }}</span>
        <!-- <input type="text" placeholder="link" v-model="item.link"> -->
        <!-- <input type="text" placeholder="creator" v-model="item.creator"> -->
        <!-- <input type="text" placeholder="remark" v-model="item.remark"> -->
      <!-- <button @click="newItem(item)">修改</button> -->
      <button @click="delItem(item.id)">删除</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.list-item {
  margin-top: 12px;
  margin-right: -12px;
  display: flex;
  flex-wrap: wrap;
  .item-inner {
    margin-right: 12px;
    margin-bottom: 12px;
    position: relative;
    width: 300px;
    height: 250px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #ccc;
    overflow: hidden;
    .item-img {
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .item-tools {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 50px;
    }
  }
}
</style>
