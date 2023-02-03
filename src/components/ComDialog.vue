<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(['update:show']);
const dialog = computed({
  get() {
    // console.log(props.show)
    return props.show;
  },
  set(value) {
    return emit('update:show', value);
  },
});
</script>

<template>
  <dialog class="dialog" :open="dialog">
    <div class="dialog-body">
      <slot></slot>
    </div>
  </dialog>
</template>

<style scoped lang="less">
.dialog-body {
  min-width: 450px;
  min-height: 280px;
}
</style>
