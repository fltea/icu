<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  title: String,
  text: String,
  textarea: Boolean,
});
const emit = defineEmits(['update:show', 'save']);

const dialog = computed({
  get() {
    return props.show;
  },
  set(value) {
    return emit('update:show', value);
  },
});
const textarea = computed(() => props.textarea);

const intext = ref('');

const hide = () => {
  dialog.value = false;
};
const saveText = () => {
  emit('save', intext.value);
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
  <section class="in-section">
    <textarea v-if="textarea" v-model="intext" class="text-area"></textarea>
    <input class="input-area" v-else v-model="intext" />
  </section>
  <template #footer>
    <button @click="hide">取消</button>
    <button @click="saveText">保存</button>
  </template>
</com-dialog>
</template>

<style scoped lang='less'>
.in-section {
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-area,
.input-area {
  display: block;
  width: 400px;
}
.text-area {
  height: 150px;
  resize: none;
}
</style>
