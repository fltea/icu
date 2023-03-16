<!-- eslint-disable import/no-extraneous-dependencies -->
<script setup>
import { ref } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('');
</script>

<template>
<section>
  <md-editor v-model="text" />
</section>
</template>

<style scoped lang='less'>
.md-editor {
  height: 600px;
}
</style>
