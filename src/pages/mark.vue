<script setup>
import { ref, onMounted } from 'vue';
import { list, upload, del } from '@/api/mark';
import { deepCopy } from '@/utils/tools';
import newMark from '@/components/mark/newMark.vue';

const marks = ref([]);
const markData = ref({});
const dialog = ref(false);

const listData = () => {
  list().then((res) => {
    console.log(res);
    marks.value = deepCopy(res.list) || [];
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

onMounted(listData);
</script>

<template>
  <h1>MARK</h1>
  <section>
    <button @click="editMark()">新增</button>
    <button class="file-button">批量导入<input type="file" name="file" id="myFile" @change="changFile"></button>
    <form class="down-form" action="/api/mark/exports" method="post" target="actionFrame">
      <button type="submit">批量导出</button>
      <iframe class="down-frame" name="actionFrame"></iframe>
    </form>
  </section>
  <section class="mark-list">
    <div class="mark-item" v-for="(item ,index) in marks" :key="`list-${index}`">
      <div class="mark-control">
        <button @click="editMark(item)">修改</button>
        <button @click="deleteMark(item.id)">删除</button>
      </div>
      <div class="mark-icons">
        <img :src="item.icons" :alt="item.title">
      </div>
      <p><a :href="item.url" target="__blank">{{item.title}}</a></p>
      <div>{{item.description || ''}}</div>
    </div>
  </section>
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
  padding: 8px;
  width: 300px;
  position: relative;
  border: 1px solid;
  .mark-control {
    position: absolute;
    right: 12px;
  }
  .mark-icons {
    margin-bottom: 12px;
    height: 60px;
    text-align: center;
    img {
      width: 60px;
      height: 100%;
      // border-radius: 50%;
      border: 1px solid #ccc;
    }
  }
}
.down-form {
  display: inline-block;
  margin-left: 10px;
}
.down-frame {
  position: absolute;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
