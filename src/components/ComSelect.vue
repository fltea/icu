<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  placeholder: String,
  modelValue: [String, Number],
  data: Array,
  options: Object,
});
const emit = defineEmits(['update:modelValue', 'query', 'select']);

const defaultOption = {
  nameFiled: 'name',
  valueFiled: 'value',
};
const sval = ref('');
const snam = ref('');
const popoverShow = ref(false);
const placestr = computed(() => props.placeholder || '');
const option = computed(() => Object.assign(defaultOption, props.options || {}));
const listData = computed(() => {
  if (Array.isArray(props.data)) {
    return props.data;
  }
  return [];
});

const inputValue = (event) => {
  console.log(event.target.value);
  emit('query', event.target.value);
};

const setValue = (val, update = true) => {
  const value = val || '';
  sval.value = value;
  const item = listData.value.find((v) => v[option.value.valueFiled] === value);
  snam.value = item ? (item[option.value.nameFiled] || '') : (value || '');
  if (update) {
    emit('update:modelValue', value);
  }
};

const isSelected = (item) => sval.value === item[option.value.valueFiled];

const clearValue = () => {
  setValue();
};
const selectItem = (item) => {
  const value = item ? item[option.value.valueFiled] : '';
  setValue(value);
  // console.log('selectItem', item, value);
  emit('select', item);
  popoverShow.value = false;
};
watch(() => props.modelValue, (val) => {
  setValue(val, false);
}, { immediate: true });
</script>

<template>
<div class="com-select">
  <div class="select-icon" v-if="sval" @click.prevent="clearValue">X</div>
  <popover v-model="popoverShow" trigger="focus">
    <input class="select-input" type="text" :placeholder="placestr" v-model="snam" @input="inputValue">
    <template #content>
      <div class="select-list">
        <div class="select-option" v-for="(item, index) in listData" :key="`listData-${index}-2323`" @click="selectItem(item)" :class="{'cur-item': isSelected(item)}">{{item[option.nameFiled]}}</div>
        <div class="no-options" v-if="!listData.length">
          <p>暂无数据</p>
        </div>
      </div>
    </template>
  </popover>
</div>
</template>

<style scoped lang='less'>
.com-select {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  &:hover {
    .select-icon {
      display: block;
    }
  }
  .select-input {
    width: 100%;
  }
  @iconw: 20px;
  .select-icon {
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

.select-list {
  margin-left: -12px;
  margin-right: -12px;
  min-width: 180px;
  max-height: 250px;
  overflow-y: auto;
  .no-options,
  .select-option {
    padding:  0 8px;
    line-height: 30px;
  }
  .select-option {
    cursor: pointer;
    &:hover {
      color: #fff;
      background: @HoverColor;
    }
    &.cur-item {
      color: @proColor;
      font-weight: bold;
    }
  }
  .no-options {
    color: @assColor;
  }
}
</style>
