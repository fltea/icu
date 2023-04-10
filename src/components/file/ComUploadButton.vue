<script setup>
import { ref } from 'vue';

const props = defineProps({
  disabled: Boolean,
  multiple: Boolean,
  accept: String,
});
const file = ref(null);
const emit = defineEmits(['change']);
const changFile = (event) => {
  emit('change', event);
};
const clickhandle = () => {
  file.value.click();
};
</script>

<template>
<div class="com-upload-button" :class="{'is-disabled':disabled}">
  <button class="file-button" @click="clickhandle">
    <slot></slot>
    <input type="file" ref="file" @change="changFile" :disabled="disabled" :multiple="props.multiple" :accept="accept">
  </button>
</div>

</template>

<style lang='less' scoped>
.com-upload-button {
  display: inline-block;
  line-height: 1;
  &.is-disabled {
    button {
      background: @notAllowedBg;
      border-color: @notAllowedInBg;
      cursor: not-allowed;
    }
  }
}
.file-button {
  position: relative;
  overflow: hidden;
  input {
    position: absolute;
    left: 100%;
  }
}
</style>
