<script setup>
import { ref } from 'vue';
import Mlog from './Mlog.vue';

const emit = defineEmits(['success']);
const dialog = ref(false);

const show = () => {
  dialog.value = true;
};
const hide = () => {
  dialog.value = false;
};
const success = () => {
  emit('success');
  hide();
};
</script>

<template>
<div class="" @click="show">
  <slot>
    newMlog
  </slot>
</div>
<com-dialog title="Mlog" v-model="dialog">
  <mlog dialog @success="success"></mlog>
</com-dialog>
</template>

<style scoped lang='less'>
</style>
