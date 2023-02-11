<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { add, modify, content } from '@/api/novel';

const props = defineProps({
  show: Boolean,
  noveler: Object,
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
const domain = ref('');
// https://www.tatajk.net/book/40857/
const form = reactive({
  id: '',
  url: '',
  title: '',
  author: '',
  content: '',
  origin: '',
  finish: false,
});

const setForm = (data) => {
  const val = data || {};
  const keys = Object.keys(form);
  keys.forEach((key) => {
    form[key] = val[key] || '';
  });
};

watch(() => props.noveler, (val) => {
  domain.value = val.domain;
  setForm(val.novel);
}, { immediate: true });

const hide = () => {
  dialog.value = false;
  setForm();
};
const getContent = () => {
  if (!domain.value || !form.url) {
    return;
  }
  const params = { ...props.noveler };
  params.url = form.url;
  params.nolist = true;
  delete params.novel;
  content(params).then((res) => {
    if (res.data) {
      const data = { ...res.data };
      data.id = form.id;
      setForm(data);
    }
  });
};

const saveNovel = () => {
  if (!domain.value || !form.url || !form.url.includes(domain.value)) {
    return;
  }
  let FN = add;
  if (form.id) {
    FN = modify;
  }
  let clutter;
  if (props.noveler) {
    clutter = props.noveler.clutter;
  }
  form.finish = !!form.finish;
  const params = { ...form, clutter };
  FN(params).then((res) => {
    if (res.code === 200) {
      emit('success');
      hide();
    }
  });
};

</script>

<template>
  <com-dialog :show="dialog">
    <section class="noveler-dialog">
      <header>
        <p>NOVEL</p>
      </header>
      <main>
        <label>
          <span class="label-title">domain: </span>
          <span>{{ domain }}</span>
        </label>
        <label>
          <span class="label-title">url: </span>
          <input type="text" v-model="form.url" />
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
          <span class="label-title">content: </span>
          <textarea v-model="form.content"></textarea>
        </label>
        <label>
          <span class="label-title">origin: </span>
          <input type="text" v-model="form.origin" />
        </label>
        <label>
          <span class="label-title">finish: </span>
          <input type="checkbox" v-model="form.finish">
        </label>
      </main>
      <footer>
        <button @click="hide">取消</button>
        <button v-if="form.url" @click="getContent">从url获取数据</button>
        <button v-if="form.url" @click="saveNovel">保存</button>
      </footer>
    </section>
  </com-dialog>
</template>

<style lang='less' scoped>
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
