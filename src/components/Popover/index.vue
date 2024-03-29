<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { getOffsetTop } from '@/utils/tools';

const props = defineProps({
  trigger: String,
  content: String,
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'save']);

// 默认值
const popoverSection = ref(null);
const popoverContainer = ref(null);
const dshow = ref(false);
const position = ref(0);
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
const styles = computed(() => {
  if (position.value) {
    return `top: -${position.value}px;`;
  }
  return '';
});
const show = async () => {
  // console.log('show');
  await nextTick();
  const showDom = popoverContainer.value;
  let spanDom = popoverSection.value;
  const height = window.innerHeight;
  const otop = getOffsetTop(spanDom);
  spanDom = spanDom.firstChild;
  // console.log(spanDom);
  const bheight = height - otop - spanDom.offsetHeight;
  if (bheight < showDom.clientHeight) {
    position.value = showDom.clientHeight + spanDom.offsetHeight + 6;
  } else {
    position.value = 0;
  }
  // console.log('popoverContainer', height, showDom.clientHeight, bheight, spanDom.offsetHeight, position.value);
};
watch(dialog, (val) => {
  if (val) {
    show();
  } else if (setFO) {
    removeFoucsOut();
  }
});
</script>

<template>
<span ref="popoverSection" class="popover-section" @focusin="handleFocusin" @mouseenter="handleOver" @mouseleave="handleLeave">
  <span @click="handleClick"><slot></slot></span>
  <section ref="popoverContainer" class="popover-container" :style="styles" :align="position?'top':'bottom'" v-show="dialog" tabindex="-1">
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
  margin-bottom: 6px;
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
  &[align='bottom'] {
    .popover-arrow {
      top: unset;
      top: -11px;
      border-bottom-color: #ebeef5;
      &::after{
        top: -5px;
        border-bottom-color: #fff;
      }
    }
  }
  &[align='top'] {
    .popover-arrow {
      bottom: -11px;
      border-top-color: #ebeef5;
      &::after{
        top: -7px;
        border-top-color: #fff;
      }
    }
  }
  .popover-arrow {
    position: absolute;
    left: 20px;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
    z-index: 2;
    &::after{
      content:'';
      position: absolute;
      left: -6px;
      display: block;
      width: 0;
      height: 0;
      border-width: 6px;
      border-color: transparent;
      border-style: solid;
      z-index: 3;
    }
  }
}
</style>
