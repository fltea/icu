<script setup>
import { reactive, computed, watch } from 'vue';
import { tied, tiedMod } from '@/api/account';

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
  account: '',
  tieDate: '',
  untieDate: '',
  remark: '',
});

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
<com-dialog :show="dialog">
  <section class="noveler-dialog">
    <header>
      <p>ATIE</p>
    </header>
    <main>
      <label>
        <span class="label-title">tied: </span>
        <input type="text" v-model="form.tied" />
      </label>
      <label>
        <span class="label-title">account:  </span>
        <input type="text" v-model="form.account" />
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
</style>
