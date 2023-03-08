<script setup>
const emit = defineEmits(['change']);
const changFile = (event) => {
  emit('change', event);
};
</script>

<template>
<div class="com-upload-button">
  <button class="file-button"><slot></slot><input type="file" name="file" @change="changFile"></button>
</div>

</template>

<style lang='less' scoped>
.com-upload-button {
  display: inline-block;
  line-height: 1;
}
.file-button {
  position: relative;
  overflow: hidden;
  input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
