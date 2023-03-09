<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  title: String,
  text: String,
});
const emit = defineEmits(['update:show', 'success']);

const dialog = computed({
  get() {
    return props.show;
  },
  set(value) {
    return emit('update:show', value);
  },
});

const intext = ref('');

const hide = () => {
  dialog.value = false;
};
const saveText = () => {
  emit('success', intext.value);
  hide();
};

watch(() => props.show, (val) => {
  if (val) {
    intext.value = props.text || '';
  }
});
</script>

<template>
<com-dialog v-model="dialog" :title="props.title">
  <textarea v-model="intext" class="text-area"></textarea>
  <template #footer>
    <button @click="hide">取消</button>
    <button @click="saveText">保存</button>
  </template>
</com-dialog>
</template>

<style scoped lang='less'>
.text-area {
  margin: 12px auto;
  display: block;
  width: 400px;
  height: 150px;
  resize: none;
}
</style>
