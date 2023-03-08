<script setup>
import { computed, useSlots } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  title: String,
  modelClick: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const slots = useSlots();
const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    return emit('update:modelValue', value);
  },
});

const title = computed(() => props.title);
const header = computed(() => !!slots.header || title);
const footer = computed(() => !!slots.footer);

const close = () => {
  if (props.modelClick) {
    dialog.value = false;
  }
};
</script>

<template>
<dialog class="com-dialog" :open="dialog">
  <div class="dialog-model" @click="close"></div>
  <div class="dialog-body">
    <header class="dialog-header" v-if="header">
      <slot name="header">
        <p class="dialog-header-title" v-if="title">{{ title }}</p>
      </slot>
    </header>
    <main class="dialog-main">
      <slot></slot>
    </main>
    <footer class="dialog-footer" v-if="footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</dialog>
</template>

<style scoped lang="less">
.com-dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 2;
  padding: 0;
  border: none;
  max-width: 98%;
  max-height: 98%;
  border-radius: 6px;
  .dialog-model {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    background-color: @dialogModel;
  }
  .dialog-body {
    background-color: @bgf;
  }
}
.dialog-body {
  margin: 0 auto;
  min-width: 450px;
  border-radius: 6px;
}
.dialog-header {
  padding: 8px 12px;
  background: @proColor;
  border-radius: 6px 6px 0 0;
  .dialog-header-title {
    font-size: 27px;
    line-height: 32px;
    font-weight: bold;
    color: @linkrColor;
  }
}
.dialog-footer {
  padding: 8px 12px;
  text-align: center;
  background: @proColor;
  border-radius: 0 0 6px 6px ;
}
.dialog-main {
  padding: 2px;
  min-height: 50px;
}
</style>
