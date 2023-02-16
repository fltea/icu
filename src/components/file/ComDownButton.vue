<script setup>
import { computed } from 'vue';

const props = defineProps({
  action: String,
});
const action = computed(() => props.action);
</script>

<template>
<div class="com-down-button">
  <form class="down-form" :action="action" method="post" target="actionFrame">
    <button type="submit"><slot></slot></button>
    <iframe class="down-frame" name="actionFrame"></iframe>
  </form>
</div>
</template>

<style lang='less' scoped>
.com-down-button {
  display: inline-block;
  line-height: 1;
}
.down-form {
  position: relative;
}
.down-frame {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
}
</style>
