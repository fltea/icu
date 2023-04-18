<script setup>
import { reactive, computed, watch } from 'vue';
import { add, modify } from '@/api/property';

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
  name: '',
  code: '',
  beginDate: '',
  endDate: '',
  scale: '',
  count: '',
  price: '',
  inDate: '',
  outDate: '',
  amount: '',
  content: '',
  remark: '',
});

watch(dialog, (val) => {
  if (val) {
    const item = props.means || {};
    Object.keys(form).forEach((v) => {
      form[v] = item[v] || '';
    });
  }
}, { immediate: true });

const hide = () => {
  dialog.value = false;
};
const save = () => {
  if (!form.name) {
    return;
  }
  const FN = form.id ? modify : add;
  FN(form).then((res) => {
    console.log(res);
    emit('success');
    hide();
  });
};
</script>

<template>
  <com-dialog v-model="dialog" title="Property">
    <section class="form-dialog">
      <div class="form-item">
        <span class="label-title">name</span>
        <input type="text" v-model="form.name" />
      </div>
      <div class="form-item">
        <span class="label-title">code </span>
        <input type="text" v-model="form.code" />
      </div>
      <div class="form-item">
        <span class="label-title">beginDate </span>
        <input type="text" v-model="form.beginDate" />
      </div>
      <div class="form-item">
        <span class="label-title">endDate </span>
        <input type="text" v-model="form.endDate" />
      </div>
      <div class="form-item">
        <span class="label-title">scale </span>
        <input type="text" v-model="form.scale" />
      </div>
      <div class="form-item">
        <span class="label-title">count </span>
        <input type="text" v-model="form.count" />
      </div>
      <div class="form-item">
        <span class="label-title">price </span>
        <input type="text" v-model="form.price" />
      </div>
      <div class="form-item">
        <span class="label-title">inDate </span>
        <input type="text" v-model="form.inDate" />
      </div>
      <div class="form-item">
        <span class="label-title">outDate </span>
        <input type="text" v-model="form.outDate" />
      </div>
      <div class="form-item">
        <span class="label-title">amount </span>
        <input type="text" v-model="form.amount" />
      </div>
      <div class="form-item">
        <span class="label-title">content </span>
        <textarea v-model="form.content"></textarea>
      </div>
      <div class="form-item">
        <span class="label-title">remark </span>
        <textarea v-model="form.remark"></textarea>
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
