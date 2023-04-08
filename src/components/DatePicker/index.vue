<script setup>
import { ref, computed, watch } from 'vue';
// import { computed } from 'vue';
import { formatDate } from '@/utils/tools';
import Panel from './Panel.vue';

const props = defineProps({
  placeholder: String,
  format: String,
  modelValue: String,
});
const emit = defineEmits(['update:modelValue', 'change']);

const dateValue = ref('');
const popoverShow = ref(false);
const placestr = computed(() => props.placeholder || '');

const selectDate = (date) => {
  const value = formatDate(date, props.format || 'YYYY-mm-dd');
  dateValue.value = value;
  popoverShow.value = false;
  emit('update:modelValue', value);
};

const clearValue = () => {
  dateValue.value = '';
  emit('update:modelValue', '');
};

watch(() => props.modelValue, (val) => {
  if (val) {
    dateValue.value = formatDate(val, props.format || 'YYYY-mm-dd');
  } else {
    dateValue.value = '';
  }
}, { immediate: true });
</script>

<template>
<section class="date-picker">
  <!-- <popover content="date-picker" trigger="manual" v-model="popoverShow"> -->
  <div class="date-icon" v-if="dateValue" @click.prevent="clearValue">X</div>
  <popover content="date-picker" v-model="popoverShow" trigger="focus">
    <input type="text" :placeholder="placestr" v-model="dateValue" class="date-input" readonly>
    <template #content>
      <panel @selected="selectDate" v-model="dateValue"></panel>
    </template>
  </popover>
</section>
</template>

<style scoped lang='less'>
.date-picker {
  position: relative;
  &:hover {
    .date-icon {
      display: block;
    }
  }
  .date-input {
    width: 100%;
  }
  @iconw: 20px;
  .date-icon {
    display: none;
    position: absolute;
    z-index: 2;
    top: 50%;
    right: @tiny;
    width: @iconw;
    height: @iconw;
    margin-top: -@iconw * 0.5;
    border-radius: 50%;
    background-color: @inColor;
    text-align: center;
    line-height: @iconw;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
