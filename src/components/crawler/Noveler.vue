<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { addClutter, modClutter } from '@/api/common';

const props = defineProps({
  show: Boolean,
  longstr: Boolean,
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
const form = reactive({
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
const longstr = ref(false);
const string = ref('');

// props.noveler
const setForm = (data) => {
  // console.log('setForm');
  const val = data || {};
  const keys = Object.keys(form);
  keys.forEach((key) => {
    form[key] = val[key] || '';
  });
};

watch(() => props.noveler, (val) => {
  setForm(val);
}, { immediate: true });

const changeHandle = () => {
  // console.log(longstr.value);
  if (longstr.value && form.domain) {
    string.value = JSON.stringify(form);
  }
};

const hide = () => {
  dialog.value = false;
  setForm();
};

const stringToForm = () => {
  // console.log(string.value);
  try {
    const data = JSON.parse(string.value);
    setForm(data);
    return true;
  } catch (error) {
    console.error('string.value is error');
    return false;
  }
};

const saveNoveler = () => {
  if (longstr.value) {
    const result = stringToForm();
    if (!result) {
      return;
    }
  }
  if (!form.domain) {
    return;
  }
  const content = JSON.stringify(form);
  console.log(content);
  const params = {
    type: 'noveler',
    content,
  };
  const val = props.noveler || {};
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

</script>

<template>
<com-dialog :show="dialog">
  <section class="noveler-dialog">
    <header>
      <p>NOVELER</p>
    </header>
    <main>
      <label>
        <span class="label-title">longstr: </span>
        <input type="checkbox" v-model="longstr" @change="changeHandle">
      </label>
      <div v-if="longstr">
        <label>
          <span class="label-title">string: </span>
          <textarea v-model="string"></textarea>
        </label>
      </div>
      <div v-else>
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
      </div>
    </main>
    <footer>
      <button @click="hide">取消</button>
      <button @click="saveNoveler">保存</button>
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
