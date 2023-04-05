<script setup>
import { computed } from 'vue';

const props = defineProps({
  placeholder: String,
  format: String,
  modelValue: String,
});
const emit = defineEmits(['update:modelValue', 'change']);

const placestr = computed(() => props.placeholder || '');
const datestr = computed({
  get() {
    const val = props.modelValue;
    return val || '';
  },
  set(value) {
    return emit('update:modelValue', value);
  },
});
</script>

<template>
<section class="date-picker">
  <popover content="date-picker" trigger="focus">
    <input type="text" :placeholder="placestr" v-model="datestr" class="date-input" readonly>
    <template #content>
      <p>content</p>
    </template>
  </popover>
</section>
</template>

<style scoped lang='less'>
.date-picker {
  .date-input {
    width: 100%;
  }
}
</style>
