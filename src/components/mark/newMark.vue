<script setup>
import { reactive, computed, watch } from 'vue';
import { add, modify } from '@/api/mark';

const props = defineProps({
  show: Boolean,
  mark: Object,
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
const form = reactive({
  id: '',
  url: '',
  title: '',
  icons: '',
  description: '',
});
watch(dialog, (val) => {
  if (val) {
    const item = props.mark || {};
    Object.keys(form).forEach((v) => {
      form[v] = item[v] || '';
    });
  }
}, { immediate: true });
const hide = () => {
  dialog.value = false;
};

const save = () => {
  if (!(form.title && form.url)) {
    return;
  }

  if (form.id) {
    modify(form).then((res) => {
      console.log(res);
      emit('success');
      hide();
    });
  } else {
    add(form).then((res) => {
      console.log(res);
      emit('success');
      hide();
    });
  }
};
</script>

<template>
<com-dialog v-model="dialog" title="书签">
  <section class="form-dialog">
    <div class="form-item">
      <p class="label-title">url: </p>
      <input type="text" v-model="form.url" />
    </div>
    <div class="form-item">
      <p class="label-title">title:  </p>
      <input type="text" v-model="form.title" />
    </div>
    <div class="form-item">
      <p class="label-title">icons:  </p>
      <textarea v-model="form.icons"></textarea>
    </div>
    <div class="form-item">
      <p class="label-title">description:  </p>
      <textarea v-model="form.description"></textarea>
    </div>
  </section>
  <template #footer>
    <button @click="hide">取消</button>
    <button @click="save">保存</button>
  </template>
</com-dialog>
</template>

<style scoped lang='less'>
</style>
