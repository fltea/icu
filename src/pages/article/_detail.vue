<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup>
import { reactive, watch, onMounted } from 'vue';
import { detail } from '@/api/article';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRouter } from 'vue-router';

const router = useRouter();
const article = reactive({
  id: null,
  title: '',
  content: '',
});

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
  const id = value.params.detail;
  if (id !== 'new') {
    article.id = id;
  } else {
    article.id = null;
  }
}, { immediate: true });

onMounted(loadItem);
</script>

<template>
<h1 class="main-title">{{ article.title }}</h1>
<section>
  <md-editor v-model="article.content" previewOnly />
</section>
</template>

<style scoped lang='less'>

</style>
