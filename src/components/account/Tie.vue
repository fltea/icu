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
const soption = {
  nameFiled: 'name',
  valueFiled: 'id',

};

const getAccounts = (query) => {
  console.log(query);
  list({
    name: query,
  }).then((res) => {
    console.log(res);
    accounts.value = res.list;
  });
};
const selectItem = (item) => {
  console.log('item', item);
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
<com-dialog v-model="dialog" title="ATIE">
  <section class="form-dialog">
    <div class="form-item">
      <p class="label-title">tiedName</p>
      <input type="text" v-model="form.tiedName" />
    </div>
    <div class="form-item">
      <p class="label-title">account</p>
      <com-select :options="soption" :data="accounts" v-model="form.account" @query="getAccounts" @select="selectItem"></com-select>
    </div>
    <div class="form-item">
      <p class="label-title">tieDate</p>
      <date-picker v-model="form.tieDate"></date-picker>
    </div>
    <div class="form-item">
      <p class="label-title">untieDate</p>
      <date-picker v-model="form.untieDate"></date-picker>
    </div>
    <div class="form-item">
      <p class="label-title">remark </p>
      <textarea v-model="form.remark"></textarea>
    </div>
  </section>
  <template #footer>
    <button @click="hide">取消</button>
    <button @click="save">保存</button>
  </template>
</com-dialog>
</template>

<style lang='less' scoped>
</style>
