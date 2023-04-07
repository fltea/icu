<script setup>
import { ref, computed } from 'vue';
// import { computed } from 'vue';
import { formatDate } from '@/utils/tools';
import Panel from './Panel.vue';

const props = defineProps({
  placeholder: String,
  format: String,
  modelValue: String,
});
const emit = defineEmits(['update:modelValue', 'change']);

const popoverShow = ref(false);
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

const selectDate = (date) => {
  const value = formatDate(date, props.format || 'YYYY-mm-dd');
  console.log(value);
  datestr.value = value;
  popoverShow.value = false;
};
</script>

<template>
<section class="date-picker">
  <!-- <popover content="date-picker" trigger="manual" v-model="popoverShow"> -->
  <popover content="date-picker" v-model="popoverShow" trigger="focus">
    <input type="text" :placeholder="placestr" v-model="datestr" class="date-input" readonly>
    <template #content>
      <panel @selected="selectDate" v-model="datestr"></panel>
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
