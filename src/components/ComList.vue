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
let loadDom = null;

const loadData = () => {
  // console.log('isInvisible', isInvisible.value);
  let nextLoad = isInvisible.value;
  if (loadDom && nextLoad) {
    // 判断是否一致
    nextLoad = nextLoad && (loadDom.offsetTop !== loadDom.parentNode.offsetTop);
    // 不在加载中
    nextLoad = nextLoad && !loading.value;
    // 不在已结束
    nextLoad = nextLoad && !finished.value;
    if (nextLoad) {
      emit('load');
    }
  }
};

watch(loading, (val) => {
  if (!val) {
    setTimeout(() => {
      if (loadDom && isInvisible.value) {
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
  loadDom = loadMain.value;
  if (IntersectionObserver) {
    observer = new IntersectionObserver(observerHandle);
    observer.observe(loadDom);
  }
});
onBeforeUnmount(() => {
  if (observer) {
    observer.unobserve(loadDom);
    observer.disconnect();
  }
});
</script>

<template>
<section class="com-list">
  <slot></slot>
  <div class="load-item" ref="loadMain">
    <div class="list-loading" v-if="!finished"></div>
  </div>
</section>
</template>

<style lang='less' scoped>
.com-list {
  .list-loading {
    margin: 0 auto;
  }
}
</style>
