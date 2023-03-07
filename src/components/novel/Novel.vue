<script setup>
import { ref, computed, reactive, watch } from 'vue';

import { nurl, noveler, novelAdd, novelMod } from '@/api/novel';

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
const loading = ref(false);
const cloading = ref(false);
const crawler = ref(false);
const clutter = reactive({
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
});
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

const setForm = (target, data) => {
  const val = data || {};
  const keys = Object.keys(target);
  keys.forEach((key) => {
    target[key] = val[key];
  });
};

// 請求後台獲取數據
const getNoveler = (domain) => {
  cloading.value = true;
  noveler({
    domain,
  }).then((res) => {
    // console.log(res);
    if (res.data) {
      setForm(clutter, res.data);
    }
  }).finally(() => {
    cloading.value = false;
  });
};

const getDomain = (url) => {
  if (url && url.includes('http')) {
    const vals = url.split('://');
    const links = vals.pop().split('/').shift();
    vals.push(links);
    const domain = vals.join('://');
    if (domain !== clutter.domain) {
      getNoveler(domain);
    }
  }
};

// 請求爬蟲數據
const getContent = () => {
  loading.value = true;
  const item = { url: form.url, ...clutter, nolist: true };
  console.log(item);
  nurl(item).then((res) => {
    // console.log(res);
    setForm(form, res.data);
  }).finally(() => {
    loading.value = false;
  });
};

const hide = () => {
  dialog.value = false;
  setForm(form);
};

const saveNovel = () => {
  const FN = form.id ? novelMod : novelAdd;
  if (!form.id && clutter.domain) {
    form.clutter = JSON.stringify(clutter);
  }
  FN(form).then((res) => {
    console.log(res);
    emit('success');
    hide();
  });
};

watch(() => props.novel, (val) => {
  setForm(form, val);
  if (form.id) {
    setForm(clutter);
  }
}, { immediate: true });

watch(crawler, (val) => {
  if (val) {
    if (form.url) {
      getDomain(form.url);
    }
  } else {
    setForm(clutter);
  }
});
watch(() => form.url, (val) => {
  if (val && crawler) {
    getDomain(val);
  }
});

</script>

<template>
  <com-dialog :show="dialog">
    <section class="noveler-dialog">
      <header>
        <p>NOVEL</p>
      </header>
      <main>
        <label>
          <span class="label-title">url: </span>
          <input type="text" v-model="form.url" />
        </label>
        <input type="checkbox" v-model="crawler" />
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
      </main>
      <section class="label-section" v-if="clutter.domain">
        <label>
          <span class="label-title">domain: </span>
          <input type="text" v-model="clutter.domain" />
        </label>
        <label>
          <span class="label-title">encode:  </span>
          <input type="text" v-model="clutter.encode" />
        </label>
        <label>
          <span class="label-title">title:  </span>
          <input type="text" v-model="clutter.title" />
        </label>
        <label>
          <span class="label-title">author:  </span>
          <input type="text" v-model="clutter.author" />
        </label>
        <label>
          <span class="label-title">content:  </span>
          <input type="text" v-model="clutter.content" />
        </label>
        <label>
          <span class="label-title">lists:  </span>
          <input type="text" v-model="clutter.lists" />
        </label>
        <label>
          <span class="label-title">listSort:  </span>
          <input type="text" v-model="clutter.listSort" />
        </label>
        <label>
          <span class="label-title">multlist:  </span>
          <input type="text" v-model="clutter.multlist" />
        </label>
        <label>
          <span class="label-title">detailurl: </span>
          <input type="text" v-model="clutter.detailurl" />
      </label>
        <label>
          <span class="label-title">detail:  </span>
          <input type="text" v-model="clutter.detail" />
        </label>
        <label>
          <span class="label-title">detailex:  </span>
          <input type="text" v-model="clutter.detailex" />
        </label>
        <label>
          <span class="label-title">domainsearch:  </span>
          <input type="text" v-model="clutter.domainsearch" />
      </label>
        <label>
          <span class="label-title">dstart:  </span>
          <input type="text" v-model="clutter.dstart" />
        </label>
        <label>
          <span class="label-title">dend:  </span>
          <input type="text" v-model="clutter.dend" />
        </label>
        <label>
          <span class="label-title">multpage:  </span>
          <input type="text" v-model="clutter.multpage" />
        </label>
      </section>
      <footer>
        <button @click="hide">取消</button>
        <button v-if="clutter.domain" @click="getContent">从url获取数据</button>
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
