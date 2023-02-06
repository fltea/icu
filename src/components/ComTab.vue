<script setup>
import { ref, computed, watch } from 'vue';
import { deepCopy } from '@/utils/tools';

const curIndex = ref(0);

const props = defineProps({
  tabs: Array,
  defaultIndex: Number,
});
const emit = defineEmits(['select']);

const tabs = computed(() => {
  const list = props.tabs;
  return list.map((v) => {
    if (typeof v === 'string') {
      return {
        name: v,
      };
    }
    return deepCopy(v);
  });
});

// { deep: true , immediate: true }
watch(() => props.defaultIndex, (val) => {
  if (typeof val === 'number') {
    curIndex.value = val;
  }
}, { immediate: true });

const selectItem = (index) => {
  curIndex.value = index;
  emit('select', props.tabs[index], index);
};
</script>

<template>
<section class="comtab">
  <div class="comtab-item" v-for="(item, index) in tabs" :key="`tabs-${index}`" :class="{curtab: index === curIndex}" @click="selectItem(index)">
    {{ item.name }}
  </div>
</section>
</template>

<style lang='less' scoped>
// tab
.comtab {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 3px solid #eee;
  .comtab-item {
    padding: 6px 12px;
    cursor: pointer;
    &.curtab {
      color: #fff;
      background: #ccc;
    }
  }
}
</style>
