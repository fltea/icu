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
<com-dialog v-model="dialog">
  <section class="noveler-dialog">
    <header>
      <p>书签</p>
    </header>
    <main>
      <label>
        <span class="label-title">url: </span>
        <input type="text" v-model="form.url" />
      </label>
      <label>
        <span class="label-title">title:  </span>
        <input type="text" v-model="form.title" />
      </label>
      <label>
        <span class="label-title">icons:  </span>
        <textarea v-model="form.icons"></textarea>
      </label>
      <label>
        <span class="label-title">description:  </span>
        <textarea v-model="form.description"></textarea>
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
.noveler-dialog {
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
