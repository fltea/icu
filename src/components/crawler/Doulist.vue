<script setup>
import { computed, reactive, watch } from 'vue';
import { addClutter, modClutter } from '@/api/common';
import { doulist as getDoulist } from '@/api/douban';

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
  title: '',
  aurthor: '',
  aurthorLink: '',
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
  getDoulist({
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
  if (!form.id) {
    return;
  }
  const content = JSON.stringify(form);
  // console.log(content);
  const params = {
    type: 'doulist',
    phrase: form.id,
    content,
  };

  const val = props.doulist || {};
  let FN = addClutter;
  if (val.clutter) {
    params.id = val.clutter;
    FN = modClutter;
  }
  FN(params).then(() => {
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
        <span class="label-title">aurthor: </span>
        <input type="text" v-model="form.aurthor" />
      </label>
      <label>
        <span class="label-title">aurthorLink: </span>
        <input type="text" v-model="form.aurthorLink" />
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
