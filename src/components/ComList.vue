<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  finished: Boolean,
  loading: Boolean,
});
const emit = defineEmits(['load']);
const finished = computed(() => props.finished);
const loading = computed(() => props.loading);

const loadMain = ref(null);
const isInvisible = ref(false);
const loadData = () => {
  // console.log('isInvisible', isInvisible.value);
  let nextLoad = isInvisible.value;
  const Dom = loadMain.value;
  // 判断是否一致
  nextLoad = nextLoad && (Dom.offsetTop !== Dom.parentNode.offsetTop);
  // 不在加载中
  nextLoad = nextLoad && !loading.value;
  // 不在已结束
  nextLoad = nextLoad && !finished.value;
  if (nextLoad) {
    emit('load');
  }
};

watch(loading, (val) => {
  if (!val) {
    const Dom = loadMain.value;
    setTimeout(() => {
      if (Dom && isInvisible.value) {
        loadData();
      }
    }, 100);
  }
});

const observerHandle = (entries) => {
  isInvisible.value = entries[0].isIntersecting;
  loadData();
};
let observer;

onMounted(() => {
  // console.log('onMounted', loadMain.value);
  if (IntersectionObserver) {
    observer = new IntersectionObserver(observerHandle);
    observer.observe(loadMain.value);
  }
});
onBeforeUnmount(() => {
  // console.log('onMounted', loadMain.value);
  if (observer) {
    observer.unobserve(loadMain.value);
    observer.disconnect();
  }
});
</script>

<template>
<section class="com-list">
  <slot></slot>
  <div class="list-loading" ref="loadMain" v-if="!finished"></div>
</section>
</template>

<style lang='less' scoped>
.com-list {
  overflow: auto;
}
.list-loading {
  height: 30px;
}
</style>
