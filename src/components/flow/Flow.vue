<script setup>
import { reactive, computed, watch } from 'vue';
import { add, modify } from '@/api/flow';

const props = defineProps({
  modelValue: Boolean,
  flow: Object,
});
const emit = defineEmits(['update:modelValue', 'success']);
const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    return emit('update:modelValue', value);
  },
});
const form = reactive({
  id: '',
  type: '',
  createTime: '',
  fee: '',
  commission: '',
  amount: '',
  price: '',
  name: '',
  tag: '',
  property: '',
  inAccount: '',
  outAccount: '',
  tieRelation: '',
  remark: '',
});
watch(dialog, (val) => {
  if (val) {
    const item = props.flow || {};
    Object.keys(form).forEach((v) => {
      form[v] = item[v] || '';
    });
  }
}, { immediate: true });
const hide = () => {
  dialog.value = false;
};

const save = () => {
  const FN = form.id ? modify : add;
  FN(form).then((res) => {
    console.log(res);
    emit('success');
    hide();
  });
};
</script>

<template>
<com-dialog v-model="dialog" title="Flow">
  <section class="form-dialog">
    <div class="form-item">
      <p class="label-title">type</p>
      <input type="text" v-model="form.type" />
    </div>
    <div class="form-item">
      <p class="label-title">createTime </p>
      <date-picker v-model="form.createTime"></date-picker>
    </div>
    <div class="form-item">
      <p class="label-title">fee </p>
      <input type="text" v-model="form.fee" />
    </div>
    <div class="form-item">
      <p class="label-title">commission </p>
      <input type="text" v-model="form.commission" />
    </div>
    <div class="form-item">
      <p class="label-title">amount </p>
      <input type="text" v-model="form.amount" />
    </div>
    <div class="form-item">
      <p class="label-title">price </p>
      <input type="text" v-model="form.price" />
    </div>
    <div class="form-item">
      <p class="label-title">name </p>
      <input type="text" v-model="form.name" />
    </div>
    <div class="form-item">
      <p class="label-title">tag </p>
      <input type="text" v-model="form.tag" />
    </div>
    <div class="form-item">
      <p class="label-title">property </p>
      <input type="text" v-model="form.property" />
    </div>
    <div class="form-item">
      <p class="label-title">inAccount </p>
      <input type="text" v-model="form.inAccount" />
    </div>
    <div class="form-item">
      <p class="label-title">outAccount </p>
      <input type="text" v-model="form.outAccount" />
    </div>
    <div class="form-item">
      <p class="label-title">tieRelation </p>
      <input type="text" v-model="form.tieRelation" />
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
