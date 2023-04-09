<script setup>
import { reactive, computed, watch } from 'vue';
import { add, modify } from '@/api/account';

const props = defineProps({
  show: Boolean,
  account: Object,
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
  name: '',
  nickName: '',
  balance: '',
  pic: '',
  desc: '',
  platform: '',
  platformURL: '',
  paswd: '',
  phone: '',
  email: '',
  verify: '',
  IDCard: '',
  beginDate: '',
  endDate: '',
  remark: '',
});

watch(dialog, (val) => {
  if (val) {
    const item = props.account || {};
    Object.keys(form).forEach((v) => {
      form[v] = item[v] || '';
    });
  }
}, { immediate: true });
const hide = () => {
  dialog.value = false;
};

const save = () => {
  if (!(form.name && form.nickName)) {
    return;
  }

  if (form.id) {
    modify(form).then((res) => {
      console.log(res);
      emit('success');
      hide();
    });
  } else {
    add(form).then((res) => {
      console.log(res);
      emit('success');
      hide();
    });
  }
};
</script>

<template>
<com-dialog v-model="dialog" title="ACCOUNT">
  <section class="form-dialog">
    <div class="form-item">
      <p class="label-title">name</p>
      <input type="text" v-model="form.name" />
    </div>
    <div class="form-item">
      <p class="label-title">nickName</p>
      <input type="text" v-model="form.nickName" />
    </div>
    <div class="form-item">
      <p class="label-title">balance</p>
      <input type="text" v-model="form.balance" />
    </div>
    <div class="form-item">
      <p class="label-title">pic</p>
      <input type="text" v-model="form.pic" />
    </div>
    <div class="form-item">
      <p class="label-title">desc</p>
      <input type="text" v-model="form.desc" />
    </div>
    <div class="form-item">
      <p class="label-title">platform</p>
      <input type="text" v-model="form.platform" />
    </div>
    <div class="form-item">
      <p class="label-title">platformURL</p>
      <input type="text" v-model="form.platformURL" />
    </div>
    <div class="form-item">
      <p class="label-title">paswd</p>
      <input type="text" v-model="form.paswd" />
    </div>
    <div class="form-item">
      <p class="label-title">phone</p>
      <input type="text" v-model="form.phone" />
    </div>
    <div class="form-item">
      <p class="label-title">email</p>
      <input type="text" v-model="form.email" />
    </div>
    <div class="form-item">
      <p class="label-title">verify</p>
      <input type="text" v-model="form.verify" />
    </div>
    <div class="form-item">
      <p class="label-title">IDCard</p>
      <input type="text" v-model="form.IDCard" />
    </div>
    <div class="form-item">
      <p class="label-title">beginDate</p>
      <date-picker v-model="form.beginDate"></date-picker>
    </div>
    <div class="form-item">
      <p class="label-title">endDate</p>
      <date-picker v-model="form.endDate"></date-picker>
    </div>
    <div class="form-item">
      <p class="label-title">remark</p>
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
