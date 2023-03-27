<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup>
import { ref } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('');
const title = ref('');
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
  'save',
];
</script>

<template>
<section>
  <input class="title-input" type="text" v-model="title" />
  <md-editor v-model="text" :toolbars="toobars" :preview="false"/>
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
.md-editor {
  height: calc(100vh - 200px);
}
</style>
