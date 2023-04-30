<script setup>
import { computed, reactive } from 'vue';
import { add, modify } from '@/api/statistic';

const props = defineProps({
  show: Boolean,
  means: Object,
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
  type: '',
  date: '',
  income: '',
  expense: '',
  found: '',
  stock: '',
  deposit: '',
  bank: '',
  cash: '',
  remark: '',
});

const hide = () => {
  dialog.value = false;
};
const save = () => {
  if (!form.type) {
    return;
  }
  const FN = form.id ? modify : add;

  FN(form).then(() => {
    emit('success');
    hide();
  });
};
</script>

<template>
  <com-dialog v-model="dialog" title="Statistic">
    <section class="form-dialog">
      <div class="form-item">
        <span class="label-title">type</span>
        <input type="text" v-model="form.type" />
      </div>
      <div class="form-item">
        <span class="label-title">date</span>
        <date-picker v-model="form.date"></date-picker>
      </div>
      <div class="form-item">
        <span class="label-title">income</span>
        <input type="text" v-model="form.income" />
      </div>
      <div class="form-item">
        <span class="label-title">expense</span>
        <input type="text" v-model="form.expense" />
      </div>
      <div class="form-item">
        <span class="label-title">found</span>
        <input type="text" v-model="form.found" />
      </div>
      <div class="form-item">
        <span class="label-title">stock</span>
        <input type="text" v-model="form.stock" />
      </div>
      <div class="form-item">
        <span class="label-title">deposit</span>
        <input type="text" v-model="form.deposit" />
      </div>
      <div class="form-item">
        <span class="label-title">bank</span>
        <input type="text" v-model="form.bank" />
      </div>
      <div class="form-item">
        <span class="label-title">cash</span>
        <input type="text" v-model="form.cash" />
      </div>
      <div class="form-item">
        <span class="label-title">remark</span>
        <input type="text" v-model="form.remark" />
      </div>
    </section>
    <template #footer>
      <button @click="hide">取消</button>
      <button @click="save">保存</button>
    </template>
  </com-dialog>
</template>

<style scoped lang='less'>
</style>
