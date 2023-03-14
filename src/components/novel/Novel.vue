<script setup>
import { ref, computed, reactive, watch } from 'vue';
import { novelAdd, novelMod } from '@/api/novel';

import Noveler from './Noveler.vue';

const props = defineProps({
  show: Boolean,
  novel: Object,
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
const cdialog = ref(false);
// https://www.tatajk.net/book/40857/
const form = reactive({
  id: '',
  url: '',
  title: '',
  author: '',
  content: '',
  clutter: '',
  platform: '',
  tag: '',
});

const setForm = (data) => {
  const val = data || {};
  const keys = Object.keys(form);
  const Id = form.id;
  keys.forEach((key) => {
    form[key] = val[key] || '';
  });
  form.id = Id || form.id;
};

const setNovel = (data) => {
  const val = data || {};
  if (val.title) {
    setForm(val);
  } else if (val.clutter) {
    form.clutter = val.clutter;
  }
};

const hide = () => {
  dialog.value = false;
  setForm();
};

const saveNovel = () => {
  const FN = form.id ? novelMod : novelAdd;
  const params = { ...form };
  if (params.clutter) {
    params.clutter = JSON.stringify(params.clutter);
  }
  FN(params).then(() => {
    // console.log(res);
    emit('success');
    hide();
  });
};

watch(dialog, (val) => {
  if (val) {
    setForm(props.novel);
  }
});

const getContent = () => {
  cdialog.value = true;
};

</script>

<template>
  <com-dialog v-model="dialog" title="NOVEL">
    <section class="noveler-dialog">
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
        <span class="label-title">platform: </span>
        <input type="text" v-model="form.platform" />
      </label>
      <label>
        <span class="label-title">tag: </span>
        <input type="text" v-model="form.tag" />
      </label>
    </section>
    <template #footer>
      <button @click="hide">取消</button>
      <button v-if="form.url" @click="getContent">从url获取数据</button>
      <button v-if="form.url" @click="saveNovel">保存</button>
    </template>
  </com-dialog>
  <noveler v-model:show="cdialog" :noveler="form.clutter" :url="form.url" @success="setNovel"></noveler>
</template>

<style lang='less' scoped>
.noveler-dialog {
  width: 650px;
  max-height: 600px;
  padding: 12px;
  overflow: auto;
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
    input[type='checkbox'] {
      width: auto;
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
  .label-section {
    display: flex;
    flex-wrap: wrap;
    label {
      width: 50%;
      .label-title {
        width: 120px;
      }
      input,
      textarea {
        width: 200px;
      }
    }
  }
}
</style>
