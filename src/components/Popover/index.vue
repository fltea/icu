<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  trigger: String,
  content: String,
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'save']);

// 默认值
const popoverSection = ref(null);
const dshow = ref(false);
let setFO = false;
// click/focus/hover/manual
const tritype = computed(() => props.trigger || 'click');

const dialog = computed({
  get() {
    let val = props.modelValue;
    if (typeof val !== 'boolean') {
      val = dshow.value;
    }
    return val;
  },
  set(value) {
    dshow.value = value;
    return emit('update:modelValue', value);
  },
});
const toggle = (show) => {
  let value = !dialog.value;
  if (show !== undefined) {
    value = !!show;
  }
  dialog.value = value;
  // console.log('toogle', dialog.value);
};

const isFocusOut = (event) => {
  // console.log(event.type, event.target);
  if (event.type === 'blur') {
    toggle(false);
    return;
  }
  const isContains = popoverSection.value.contains(event.target);
  if (!isContains) {
    toggle(false);
  }
};
const setFoucsOut = () => {
  setFO = true;
  document.addEventListener('click', isFocusOut);
  document.addEventListener('focusin', isFocusOut);
  window.addEventListener('blur', isFocusOut);
};
const removeFoucsOut = () => {
  setFO = false;
  document.removeEventListener('click', isFocusOut);
  document.removeEventListener('focusin', isFocusOut);
  window.removeEventListener('blur', isFocusOut);
};

const handleFocusin = () => {
  if (tritype.value !== 'focus') {
    return;
  }
  toggle(true);
  setFoucsOut();
};
const handleOver = () => {
  if (tritype.value === 'hover') {
    toggle(true);
  }
};
const handleLeave = () => {
  if (tritype.value === 'hover') {
    toggle(false);
  }
};
const handleClick = () => {
  if (tritype.value === 'click') {
    toggle();
  }
};
watch(dialog, (val) => {
  if (!val && setFO) {
    removeFoucsOut();
  }
});
</script>

<template>
<span ref="popoverSection" class="popover-section" @focusin="handleFocusin" @mouseenter="handleOver" @mouseleave="handleLeave">
  <span @click="handleClick"><slot></slot></span>
  <section class="popover-container" v-show="dialog">
    <slot name="content">
      <p v-if="content">{{ content }}</p>
    </slot>
    <div class="popover-arrow"></div>
  </section>
</span>
</template>

<style scoped lang='less'>
.popover-section {
  position: relative;
}
.popover-container {
  position: absolute;
  margin-top: 6px;
  min-width: 150px;
  padding: 12px;
  line-height: 1.4;
  font-size: 14px;
  color: @norColor;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background: #fff;
  border-radius: 4px;
  z-index: 2000;
  .popover-arrow {
    position: absolute;
    top: -11px;
    left: 20px;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
    border-bottom-color: #ebeef5;
    z-index: 2;
    &::after{
      content:'';
      position: absolute;
      left: -6px;
      top: -5px;
      display: block;
      width: 0;
      height: 0;
      border-width: 6px;
      border-color: transparent;
      border-style: solid;
      border-bottom-color: #fff;
      z-index: 2;
    }
  }
}
</style>
