<script setup>
import { reactive, computed, watch } from 'vue';
import { add, modify } from '@/api/todo';

const props = defineProps({
  show: Boolean,
  todo: Object,
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
  title: '',
  content: '',
  order: '',
  beginDate: '',
  deadline: '',
  completeDate: '',
  discarded: '',
  disuseTime: '',
});

watch(dialog, (val) => {
  if (val) {
    const item = props.todo || {};
    Object.keys(form).forEach((v) => {
      form[v] = item[v] || '';
    });
  }
}, { immediate: true });

const hide = () => {
  dialog.value = false;
};
const save = () => {
  if (!form.title) {
    return;
  }

  if (form.id) {
    modify(form).then(() => {
      emit('success');
      hide();
    });
  } else {
    add(form).then(() => {
      emit('success');
      hide();
    });
  }
};
</script>

<template>
  <com-dialog v-model="dialog" title="TODO">
    <section class="form-dialog">
      <div class="form-item">
        <p class="label-title">title</p>
        <input type="text" v-model="form.title" />
      </div>
      <div class="form-item">
        <p class="label-title">content</p>
        <textarea v-model="form.content"></textarea>
      </div>
      <div class="form-item">
        <p class="label-title">order</p>
        <input type="text" v-model="form.order" />
      </div>
      <div class="form-item">
        <p class="label-title">beginDate</p>
        <date-picker v-model="form.beginDate"></date-picker>
      </div>
      <div class="form-item">
        <p class="label-title">deadline</p>
        <date-picker v-model="form.deadline"></date-picker>
      </div>
      <div class="form-item">
        <p class="label-title">completeDate</p>
        <date-picker v-model="form.completeDate"></date-picker>
      </div>
      <div class="form-item">
        <p class="label-title">discarded</p>
        <input type="text" v-model="form.discarded" />
      </div>
      <div class="form-item">
        <p class="label-title">disuseTime</p>
        <date-picker v-model="form.disuseTime"></date-picker>
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
