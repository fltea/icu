<script setup>
import { ref, onMounted } from 'vue';
import { list, add, modify, del } from '@/api/pic';

const uploadFile = (file) => {
  const form = new FormData();
  form.append('file', file);
  return add(form);
};
const uploadFiles = (files) => {
  if (Array.isArray(files) && files.length) {
    const requests = files.map((v) => uploadFile(v));
    // console.log(requests)
    Promise.all(requests).then((reses) => {
      console.log(reses);
    });
  }
};

const listData = ref([]);
const newItem = (item) => {
  console.log(item);
  modify(item).then((res) => {
    console.log(res);
  });
};
const delItem = (id) => {
  del({
    id,
  }).then((res) => {
    console.log(res);
  });
};
const changFile = (event) => {
  console.log(event);
  const target = event.target || {};
  const files = target.files || [];
  console.log(files);
  if (files.length) {
    // console.log(Array.from(list).map(v => v.size))
    uploadFiles(Array.from(files));
  }
};

onMounted(() => {
  list().then((res) => {
    console.log(res);
    listData.value.push(...res.list);
  });
});
</script>

<template>
  <h1>Pic</h1>
  <section>
    <!-- <button @click="newItem">新增</button> -->
    <button class="file-button">上传Pic<input type="file" name="file" id="myFile" @change="changFile"></button>
  </section>
  <section>
    <!-- 列表 -->
    <div v-for="item in listData" :key="`list${item.id}`">
      <!-- icon -->
      <div></div>
      <!-- 内容 -->
      <div>
        <img :src="item.url" alt="">
        <div>
          <input type="text" placeholder="link" v-model="item.link">
          <input type="text" placeholder="creator" v-model="item.creator">
          <input type="text" placeholder="remark" v-model="item.remark">
        </div>
      </div>
      <!-- 操作 -->
      <div>
        <button @click="newItem(item)">修改</button>
        <button @click="delItem(item.id)">删除</button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">

</style>
