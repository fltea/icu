<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { nurl, noveler } from '@/api/novel';
import { getDomain } from '@/utils/tools';

import TextDialog from '../TextDialog.vue';

const props = defineProps({
  show: Boolean,
  noveler: [Object, String],
  url: String,
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
  domain: '',
  encode: '',
  title: '',
  author: '',
  content: '',
  // loadpage:'',
  lists: '',
  listSort: '',
  multlist: '',
  detailurl: '',
  detail: '',
  detailex: '',
  domainsearch: '',
  dstart: '',
  dend: '',
  multpage: '',
  issleep: '',
  puppeteer: '',
});

const ndialog = ref(false);
const cloading = ref(false);
let ntext = '';
let domain = '';

const hide = () => {
  dialog.value = false;
};

const setForm = (data, init = true) => {
  const val = data || {};
  const keys = Object.keys(form);
  keys.forEach((key) => {
    let item = val[key];
    if (!init && item === undefined) {
      item = val[`${key}s`];
    }
    form[key] = item;
  });
  if (!init) {
    form.id = '';
  } else {
    form.id = data.clutter || '';
  }
  if (domain) {
    form.domain = domain;
  }
};

const save = (data = {}) => {
  const result = {
    clutter: { ...form },
    ...data,
    abstract: data.content,
    creator: data.author,
  };
  emit('success', result);
  hide();
};

// 請求爬蟲數據
const getContent = () => {
  cloading.value = true;
  const item = { url: props.url, ...form, nolist: true };
  nurl(item).then((res) => {
    if (res.data) {
      save(res.data);
    }
  }).finally(() => {
    cloading.value = false;
  });
};

// 請求後台獲取數據
const getNoveler = () => {
  cloading.value = true;
  noveler({
    domain,
  }).then((res) => {
    // console.log(res);
    if (res.data) {
      setForm(res.data);
    }
  }).finally(() => {
    cloading.value = false;
  });
};

watch(() => props.show, (val) => {
  if (val) {
    domain = '';
    let item = props.noveler;
    const { url } = props;
    if (item && typeof item !== 'object') {
      item = null;
    }
    if (url) {
      domain = getDomain(url);
      if (!item) {
        item = {
          domain,
        };
      }
    }
    setForm(item);
    if (!form.detail && domain) {
      getNoveler();
    }
  }
});

const setNFStr = () => {
  ndialog.value = true;
};
const getText = (text) => {
  ntext = `{${text}}`;
  setForm(JSON.parse(ntext), false);
};
</script>

<template>
<com-dialog v-model="dialog" title="Clutter">
  <section class="noveler-dialog">
    <label>
      <span class="label-title">domain: </span>
      <input type="text" v-model="form.domain" />
    </label>
    <label>
      <span class="label-title">encode:  </span>
      <input type="text" v-model="form.encode" />
    </label>
    <label>
      <span class="label-title">title:  </span>
      <input type="text" v-model="form.title" />
    </label>
    <label>
      <span class="label-title">author:  </span>
      <input type="text" v-model="form.author" />
    </label>
    <label>
      <span class="label-title">content:  </span>
      <input type="text" v-model="form.content" />
    </label>
    <label>
      <span class="label-title">lists:  </span>
      <input type="text" v-model="form.lists" />
    </label>
    <label>
      <span class="label-title">listSort:  </span>
      <input type="text" v-model="form.listSort" />
    </label>
    <label>
      <span class="label-title">multlist:  </span>
      <input type="text" v-model="form.multlist" />
    </label>
    <label>
      <span class="label-title">detailurl: </span>
      <input type="text" v-model="form.detailurl" />
  </label>
    <label>
      <span class="label-title">detail:  </span>
      <input type="text" v-model="form.detail" />
    </label>
    <label>
      <span class="label-title">detailex:  </span>
      <input type="text" v-model="form.detailex" />
    </label>
    <label>
      <span class="label-title">domainsearch:  </span>
      <input type="text" v-model="form.domainsearch" />
  </label>
    <label>
      <span class="label-title">dstart:  </span>
      <input type="text" v-model="form.dstart" />
    </label>
    <label>
      <span class="label-title">dend:  </span>
      <input type="text" v-model="form.dend" />
    </label>
    <label>
      <span class="label-title">multpage:  </span>
      <input type="text" v-model="form.multpage" />
    </label>
    <label>
      <span class="label-title">issleep:  </span>
      <input type="text" v-model="form.issleep" />
    </label>
    <label>
      <span class="label-title">puppeteer:  </span>
      <input type="text" v-model="form.puppeteer" />
    </label>
  </section>
  <template #footer>
    <button @click="hide">取消</button>
    <button @click="setNFStr" :disabled="cloading">快速填充</button>
    <button v-if="form.detail" @click="getContent">从url获取数据</button>
    <button v-if="form.id" @click="save">保存</button>
  </template>
</com-dialog>
<text-dialog title="Clutter String" textarea v-model:show="ndialog" @save="getText"></text-dialog>
</template>

<style scoped lang='less'>
.noveler-dialog {
  display: flex;
  flex-wrap: wrap;
  width: 650px;
  max-height: 600px;
  padding: 12px;
  overflow: auto;
  label {
    margin-top: 12px;
    display: block;
    width: 50%;
    .label-title {
      margin-right: 8px;
      display: inline-block;
      width: 95px;
      text-align: right;
    }
    input,
    textarea {
      width: calc(100% - 115px);
    }
    input[type='checkbox'] {
      width: auto;
    }
  }
}
</style>
