<script setup>
import { reactive, computed, watch } from 'vue';
import { durl, groupAdd, groupMod } from '@/api/douban';

const props = defineProps({
  show: Boolean,
  group: Object,
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
  clutter: '',
  id: '',
  content: '',
  info: '',
  name: '',
  tags: '',
});

const setForm = (data) => {
  const val = data || {};
  const keys = Object.keys(form);
  keys.forEach((key) => {
    form[key] = val[key] || '';
  });
};

const getContent = () => {
  durl({
    url: `https://www.douban.com/group/${form.id}/`,
    nolist: true,
  }).then((res) => {
    console.log(res);
    if (res.data) {
      setForm(res.data);
    }
  });
};

watch(dialog, (val) => {
  if (val) {
    setForm(props.group);
  }
}, { immediate: true });

const hide = () => {
  dialog.value = false;
};

const save = () => {
  if (!(form.id && form.name)) {
    return;
  }

  const FN = form.clutter ? groupMod : groupAdd;
  FN(form).then((res) => {
    console.log(res);
    emit('success');
    hide();
  });
};
</script>

<template>
<com-dialog v-model="dialog" title="Group">
  <section class="form-dialog">
    <div class="form-item">
      <span class="label-title">id</span>
      <input type="text" :disabled="!!form.clutter" v-model="form.id" />
    </div>
    <div class="form-item">
      <span class="label-title">name </span>
      <input type="text" v-model="form.name" />
    </div>
    <div class="form-item">
      <span class="label-title">info </span>
      <textarea v-model="form.info"></textarea>
    </div>
    <div class="form-item">
      <span class="label-title">content </span>
      <textarea v-model="form.content"></textarea>
    </div>
    <div class="form-item">
      <span class="label-title">tags </span>
      <input type="text" v-model="form.tags" />
    </div>
  </section>
  <template #footer>
    <button @click="hide">取消</button>
    <button v-if="form.id" @click="getContent">获取数据</button>
    <button @click="save">保存</button>
  </template>
</com-dialog>
</template>

<style scoped lang='less'>
.common-dialog {
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
