<script setup>
import { reactive, computed, watch } from 'vue';
import { add, modify } from '@/api/media';

const props = defineProps({
  show: Boolean,
  media: Object,
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
  abstract: '',
  clutter: '',
  type: '',
  creator: '',
  staff: '',
  isbn: '',
  finished: '',
  price: '',
  channel: '',
  publishDate: '',
  tag: '',
  remark: '',
});

const setForm = (data) => {
  const val = data || {};
  const keys = Object.keys(form);
  keys.forEach((key) => {
    form[key] = val[key] || '';
  });
};

const hide = () => {
  dialog.value = false;
};
const save = () => {
  const FN = form.id ? modify : add;
  const params = { ...form };
  FN(params).then(() => {
    emit('success');
    hide();
  });
};

watch(dialog, (val) => {
  if (val) {
    setForm(props.media);
  }
});
</script>

<template>
  <com-dialog v-model="dialog" title="MEDIA">
    <section>
      <label>
        <span class="label-title">title: </span>
        <input type="text" v-model="form.title" />
      </label>
      <label>
        <span class="label-title">abstract: </span>
        <textarea v-model="form.abstract"></textarea>
      </label>
      <label>
        <span class="label-title">url: </span>
        <input type="text" v-model="form.url" />
      </label>
      <label>
        <span class="label-title">type: </span>
        <input type="text" v-model="form.type" />
      </label>
      <label>
        <span class="label-title">creator: </span>
        <input type="text" v-model="form.creator" />
      </label>
      <label>
        <span class="label-title">staff: </span>
        <textarea v-model="form.staff"></textarea>
      </label>
      <label>
        <span class="label-title">ISBN: </span>
        <input type="text" v-model="form.isbn" />
      </label>
      <label>
        <span class="label-title">finished: </span>
        <input type="text" v-model="form.finished" />
      </label>
      <label>
        <span class="label-title">price: </span>
        <input type="text" v-model="form.price" />
      </label>
      <label>
        <span class="label-title">tag: </span>
        <input type="text" v-model="form.tag" />
      </label>
      <label>
        <span class="label-title">remark: </span>
        <textarea v-model="form.remark"></textarea>
      </label>
    </section>
    <template #footer>
      <button @click="hide">取消</button>
      <button @click="save">保存</button>
    </template>
  </com-dialog>
</template>

<style scoped lang='less'>
label {
  padding-right: 24px;
  margin-top: 12px;
  margin-bottom: 12px;
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
}
</style>
