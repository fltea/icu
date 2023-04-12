<script setup>
import { ref } from 'vue';
import { add } from '@/api/mlog';

const props = defineProps({
  dialog: Boolean,
});
const emit = defineEmits(['success']);
const text = ref('');
const pics = ref([]);
const video = ref(null);
const files = [];
const loading = ref(false);
const addMlog = () => {
  const data = text.value;
  if (!data && !files.length) {
    return;
  }
  loading.value = true;
  const form = new FormData();
  form.append('text', data);
  if (video.value) {
    form.append('video', video.value);
  } else if (files.length) {
    files.forEach((v) => {
      form.append('pics', v);
    });
  }
  add(form).then(() => {
    files.length = 0;
    pics.value = [];
    text.value = '';
    video.value = null;
    emit('success');
  }).finally(() => {
    loading.value = false;
  });
};
const changFile = (event) => {
  const filelist = files.map((v) => v.name);
  event.target.files.forEach((v) => {
    if (!filelist.includes(v.name)) {
      files.push(v);
      pics.value.push(window.URL.createObjectURL(v));
    }
  });
};
const changVideo = (event) => {
  const vfiles = [...event.target.files];
  const videoval = vfiles.pop();
  if (videoval) {
    video.value = videoval;
  }
};
</script>

<template>
  <section class="new-mlog" v-loading="loading" :class="{'is-dialog': props.dialog}">
    <div>
      <textarea class="mlog-text" v-model="text"></textarea>
    </div>
    <div class="pics-list" v-if="pics.length">
      <div class="pics-item" v-for="(item, index) in pics" :key="`pics-index-${index}`" :style="`background-image: url(${item});`"></div>
    </div>
    <div class="video-list" v-if="video">
      <div class="video-item">{{video.name}}</div>
    </div>
    <div class="com-controls">
      <com-upload-button :disabled="!!video" multiple accept="image/*" @change="changFile">新增图片</com-upload-button>
      <com-upload-button :disabled="!!pics.length" accept="video/*" @change="changVideo">新增视频</com-upload-button>
      <button @click="addMlog">提交</button>
    </div>
  </section>
</template>

<style scoped lang='less'>
@picw: 90px;
.new-mlog {
  padding-top: @small;
  &.is-dialog {
    padding-left: @tiny;
    padding-right: @tiny;
    padding-bottom: @tiny;
    .com-controls {
      text-align: right;
    }
    .mlog-text {
      height: 150px;
    }
    .pics-list {
      max-height: @picw + @mini;
    }
  }
}
.video-list {
  margin-top: @mini;
}
.pics-list {
  margin-top: @mini;
  display: flex;
  flex-wrap: wrap;
  max-height: 250px;
  overflow-y: auto;
  .pics-item {
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
.new-mlog {
  max-width: 500px;
}
.mlog-text {
  width: 100%;
}
</style>
