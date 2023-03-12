<script setup>
import { computed, reactive, watch } from 'vue';
import { durlDetail, doulistAdd, doulistMod } from '@/api/douban';

const props = defineProps({
  show: Boolean,
  doulist: Object,
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
  clutter: '',
  title: '',
  author: '',
  authorIp: '',
  authorLink: '',
  count: '',
  createTime: '',
  updateTime: '',
  content: '',
});

const setForm = (data) => {
  // console.log('setForm');
  const val = data || {};
  const keys = Object.keys(form);
  keys.forEach((key) => {
    form[key] = val[key] || '';
  });
};

const getContent = () => {
  durlDetail({
    id: form.id,
    nolist: true,
  }).then((res) => {
    console.log(res);
    if (res.data) {
      setForm(res.data);
    }
  });
};

const hide = () => {
  dialog.value = false;
  setForm();
};
const saveDoulist = () => {
  if (!(form.id && form.title)) {
    return;
  }
  const FN = form.clutter ? doulistMod : doulistAdd;
  FN(form).then((res) => {
    console.log(res);
    emit('success');
    hide();
  });
};

watch(() => props.doulist, (val) => {
  setForm(val);
}, { immediate: true });
</script>

<template>
<com-dialog :show="dialog">
  <section class="doulist-dialog">
    <header>
      <p>DOULIST</p>
    </header>
    <main>
      <label>
        <span class="label-title">id: </span>
        <input type="text" v-model="form.id" />
      </label>
      <label>
        <span class="label-title">title: </span>
        <input type="text" v-model="form.title" />
      </label>
      <label>
        <span class="label-title">author: </span>
        <input type="text" v-model="form.author" />
      </label>
      <label>
        <span class="label-title">authorLink: </span>
        <input type="text" v-model="form.authorLink" />
      </label>
      <label>
        <span class="label-title">authorIp: </span>
        <input type="text" v-model="form.authorIp" />
      </label>
      <label>
        <span class="label-title">count: </span>
        <input type="text" v-model="form.count" />
      </label>
      <label>
        <span class="label-title">createTime: </span>
        <input type="text" v-model="form.createTime" />
      </label>
      <label>
        <span class="label-title">updateTime: </span>
        <input type="text" v-model="form.updateTime" />
      </label>
      <label>
        <span class="label-title">content: </span>
        <textarea v-model="form.content"></textarea>
      </label>
    </main>
    <footer>
      <button @click="hide">取消</button>
      <button v-if="form.id" @click="getContent">从doulist获取数据</button>
      <button @click="saveDoulist">保存</button>
    </footer>
  </section>
</com-dialog>
</template>

<style scoped lang='less'>
.doulist-dialog {
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
      vertical-align: text-top;
      resize: none;
    }
    textarea {
      height: 150px;
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
