<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  text: String,
  title: {
    type: String,
    default: 'text',
  },
  nameFile: {
    type: String,
    default: 'text',
  },
});
const emit = defineEmits(['update:modelValue', 'save']);

const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    return emit('update:modelValue', value);
  },
});

const text = ref('');

const hide = () => {
  dialog.value = false;
};
const save = () => {
  emit('save', text.value);
  dialog.value = false;
};
</script>

<template>
  <com-dialog :show="dialog">
    <section class="input-dialog">
      <header>
        <p>{{ props.title }}</p>
      </header>
      <main class="dialog-content">
        <label>
          <p class="label-title">{{ props.nameFile }}: </p>
          <input v-model="text" />
        </label>
      </main>
      <footer>
        <button @click="hide">取消</button>
        <button @click="save">确定</button>
      </footer>
    </section>
  </com-dialog>
</template>

<style scoped lang='less'>
.input-dialog {
  padding: 12px;
  height: 100%;
  .dialog-content {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  input {
    width: 420px;
  }
  footer {
    margin-top: 12px;
    padding: 6px;
    text-align: center;
  }
}
</style>
