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
}
</style>
