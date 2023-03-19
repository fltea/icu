<script setup>
import { ref, reactive, onMounted } from 'vue';
import { list, upload, del } from '@/api/media';
import newMedia from '@/components/media/Media.vue';

const uploadFile = (file) => {
  const form = new FormData();
  form.append('file', file);
  return upload(form);
};

const curData = reactive({
  list: [],
  media: null,
});
const idialog = ref(false);
const ndialog = ref(false);
const listItems = () => {
  list().then((res) => {
    // console.log(res);
    curData.list = [...res.list];
  });
};
const delItem = (id) => {
  del({
    id,
  }).then(() => {
    listItems();
  });
};
const changFile = (event) => {
  const target = event.target || {};
  const files = target.files || [];
  if (files.length) {
    uploadFile(files[0]).then(() => {
      listItems();
    });
  }
};

const addUrl = () => {
  idialog.value = true;
};
const urlUpload = (url) => {
  upload({
    url,
  }).then(() => {
    listItems();
  });
};

const editMedia = (item) => {
  ndialog.value = true;
  curData.media = item || null;
};

onMounted(listItems);
</script>

<template>
  <h1>Media</h1>
  <section class="com-controls">
    <button @click="editMedia()">新增</button>
    <button @click="addUrl">网络下载</button>
    <com-upload-button @change="changFile">上传文件</com-upload-button>
  </section>
  <!-- 列表 -->
  <div class="list-item">
    <!-- 内容 -->
    <div class="item-inner" v-for="item in curData.list" :key="`list${item.id}`">
      <span>{{ item.title }}</span>
      <span>{{ item.utl }}</span>
      <span>{{ item.type }}</span>
      <button @click="editMedia(item)">修改</button>
      <button @click="delItem(item.id)">删除</button>
    </div>
  </div>
  <text-dialog title="Link" v-model:show="idialog" @save="urlUpload"></text-dialog>
  <new-media v-model:show="ndialog" :media="curData.media" @success="listItems"></new-media>
</template>

<style scoped lang="less">
.list-item {
  margin-top: 12px;
  .item-inner {
    margin-bottom: 12px;
  }
}
</style>
