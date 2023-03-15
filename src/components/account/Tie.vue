<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { list, tied, tiedMod } from '@/api/account';

const props = defineProps({
  show: Boolean,
  atie: Object,
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
  tied: '',
  tiedName: '',
  account: '',
  accountName: '',
  tieDate: '',
  untieDate: '',
  remark: '',
});
const accounts = ref([]);

const getAccounts = () => {
  console.log(form.accountName);
  list({
    name: form.accountName,
  }).then((res) => {
    console.log(res);
    accounts.value = res.list;
  });
};
const selectItem = (item) => {
  form.account = item.id;
  form.accountName = item.name;
};

watch(dialog, (val) => {
  if (val) {
    const item = props.atie || {};
    Object.keys(form).forEach((v) => {
      form[v] = item[v] || '';
    });
  }
}, { immediate: true });
const hide = () => {
  dialog.value = false;
};
const save = () => {
  if (!(form.tied && form.account)) {
    return;
  }

  delete form.tieDate;
  delete form.untieDate;

  if (form.id) {
    tiedMod(form).then((res) => {
      console.log(res);
      emit('success');
      hide();
    });
  } else {
    tied(form).then((res) => {
      console.log(res);
      emit('success');
      hide();
    });
  }
};
</script>

<template>
<com-dialog v-model="dialog">
  <section class="tie-dialog">
    <header>
      <p>ATIE</p>
    </header>
    <main>
      <label>
        <span class="label-title">tiedName: </span>
        <input type="text" v-model="form.tiedName" />
      </label>
      <label>
        <span class="label-title">accountName:  </span>
        <input type="text" v-model="form.accountName" @input="getAccounts"/>
        <div class="input-list">
          <div class="inputs-item" v-for="(item, index) in accounts" :key="`accounts${index}`" @click="selectItem(item)">{{ item.name }}</div>
        </div>
      </label>
      <label>
        <span class="label-title">tieDate:  </span>
        <input type="text" v-model="form.tieDate" />
      </label>
      <label>
        <span class="label-title">untieDate:  </span>
        <input type="text" v-model="form.untieDate" />
      </label>
      <label>
        <span class="label-title">remark:  </span>
        <textarea v-model="form.remark"></textarea>
      </label>
    </main>
    <footer>
      <button @click="hide">取消</button>
      <button @click="save">保存</button>
    </footer>
  </section>
</com-dialog>
</template>

<style lang='less' scoped>
.tie-dialog {
  margin: 0 auto;
  padding: 12px;
  label {
    position: relative;
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
    .input-list {
      position: absolute;
      left: 133px;
      right: 0;
      z-index: 2;
      background: #f8f8f8;
      .inputs-item {
        &:hover {
          background: red;
        }
      }
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
