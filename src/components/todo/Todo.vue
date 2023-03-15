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
  <com-dialog v-model="dialog">
    <section class="form-dialog">
      <header>
        <p>TODO</p>
      </header>
      <main>
        <label>
          <span class="label-title">title:  </span>
          <input type="text" v-model="form.title" />
        </label>
        <label>
          <span class="label-title">content:  </span>
          <textarea v-model="form.content"></textarea>
        </label>
        <label>
          <span class="label-title">order: </span>
          <input type="text" v-model="form.order" />
        </label>
        <label>
          <span class="label-title">beginDate: </span>
          <input type="text" v-model="form.beginDate" />
        </label>
        <label>
          <span class="label-title">deadline: </span>
          <input type="text" v-model="form.deadline" />
        </label>
        <label>
          <span class="label-title">completeDate: </span>
          <input type="text" v-model="form.completeDate" />
        </label>
        <label>
          <span class="label-title">discarded: </span>
          <input type="text" v-model="form.discarded" />
        </label>
        <label>
          <span class="label-title">disuseTime: </span>
          <input type="text" v-model="form.disuseTime" />
        </label>
      </main>
      <footer>
        <button @click="hide">取消</button>
        <button @click="save">保存</button>
      </footer>
    </section>
  </com-dialog>
</template>

<style scoped lang='less'>
.form-dialog {
  margin: 0 auto;
  padding: 12px;
  label {
    margin-top: 12px;
    display: block;
    .label-title {
      margin-right: 8px;
      display: inline-block;
      width: 125px;
      text-align: right;
    }
    input,
    textarea {
      width: 400px;
    }
    textarea {
      height: 50px;
      resize: none;
      vertical-align:middle;
    }
  }
  header {
    padding: 6px;
  }
  footer {
    margin-top: 12px;
    padding: 6px;
    text-align: center;
  }
}
</style>
