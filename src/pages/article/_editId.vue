<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup>
import { reactive, watch, onMounted } from 'vue';
import { upload, add, detail, modify } from '@/api/article';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRouter } from 'vue-router';

const router = useRouter();
const article = reactive({
  id: null,
  title: '',
  content: '',
});
const toobars = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog',
  // 'github',
  // 'save',
];

const uploadFile = (files) => {
  const form = new FormData();
  files.forEach((file) => {
    form.append('file', file);
  });

  return upload(form);
};
const onUploadImg = (files, callback) => {
  uploadFile(files).then((res) => {
    console.log(res);
    const list = res.list || [];
    callback(list.map((v) => v.url));
  });
};

const save = () => {
  // console.log(article);
  if (!article.title || !article.content) {
    return;
  }
  const FN = article.id ? modify : add;
  FN(article).then((res) => {
    console.log(res);
  });
};

const loadItem = () => {
  if (article.id) {
    detail(article.id).then((res) => {
      console.log(res);
      if (res.data) {
        Object.keys(res.data).forEach((key) => {
          if (!key.includes('At')) {
            article[key] = res.data[key];
          }
        });
      }
    });
  }
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  console.log(value.params);
  const id = value.params.editid;
  if (id !== 'new') {
    article.id = id;
  } else {
    article.id = null;
  }
}, { immediate: true });

onMounted(loadItem);
</script>

<template>
<section>
  <input class="title-input" type="text" v-model="article.title" />
  <md-editor v-model="article.content" :toolbars="toobars" :preview="false" @onUploadImg="onUploadImg"/>

  <footer>
    <button class="save-btn" @click="save">保存</button>
  </footer>
</section>
</template>

<style scoped lang='less'>
.title-input {
  margin: @tiny 0;
  width: 100%;
  height: 36px;
  line-height: 34px;
  font-size: 18px;
}
footer {
  text-align: right;
}
.save-btn {
  margin-top: @small;
  width: 150px;
}
.md-editor {
  height: calc(100vh - 230px);
}
</style>
