<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  show: Boolean,
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

const incookie = ref('');

let cookie = '';

const hide = () => {
  dialog.value = false;
};

const saveCookie = () => {
  cookie = incookie.value;
  localStorage.setItem('wcookie', cookie);
  emit('success', cookie);
  hide();
};
</script>

<template>
  <com-dialog :show="dialog">
    <h1>Cookie</h1>
    <textarea v-model="incookie" class="weibo-cookie"></textarea>
    <div class="layout-control">
      <button @click="hide">取消</button>
      <button @click="saveCookie">保存</button>
    </div>
  </com-dialog>
</template>

<style lang='less' scoped>
.weibo-cookie {
  margin: 12px auto;
  display: block;
  width: 96%;
  height: 150px;
  resize: none;
}
.layout-control {
  text-align: center;
}
</style>
