<script setup>
import { ref, computed } from 'vue';

import draggable from 'vuedraggable';

const props = defineProps({
  detail: Object,
  list: Boolean,
  selction: Boolean,
  sortList: Boolean,
});
const emit = defineEmits(['selected', 'sort']);
const item = computed(() => props.detail);
const checkedAll = ref(false);
const isSort = computed(() => props.sortList);

const chapterList = computed({
  get: () => {
    const { selction } = props;
    const { chapters } = item.value;
    if (Array.isArray(chapters)) {
      if (selction) {
        chapters.forEach((v) => {
          v.selected = false;
          v.loading = false;
          v.content = v.content || '';
        });
      }
      return chapters;
    }
    return [];
  },
  set: (val) => {
    item.value.chapters = val;
  },
});

const sortList = () => {
  let list = chapterList.value.filter((v) => !!v.id);
  list = list.map((v, i) => `${v.id}:${i}`);
  emit('sort', list.join(','));
};

const select = () => {
  const { selction } = props;
  if (selction) {
    let list = chapterList.value;
    list = list.filter((v) => v.selected);
    emit('selected', list);
  }
};

const selectAll = () => {
  const isAll = checkedAll.value;
  // console.log(isAll);
  chapterList.value.forEach((v) => {
    if (!v.id) {
      v.selected = isAll;
    }
  });
  select();
};

const clickChapter = (chapter) => {
  if (chapter.id) {
    window.open(`/novel/${item.value.id}/${chapter.id}`);
  }
};
</script>

<template>
<section class="novel-detail">
  <h1>
    <a v-if="props.list" :href="`/novel/${item.id}`" target="_blank">{{ item.title }}</a>
    <span v-else>{{ item.title }}</span>
  </h1>
  <div class="com-controls">
    <slot name="controls"></slot>
  </div>
  <section class="com-container">
    <p>{{ item.author }}</p>
    <p>{{ item.createdAt }} {{ item.updatedAt }}</p>
    <p>{{ item.chapterCount }}</p>
    <div v-html="item.content"></div>
    <template v-if="chapterList.length">
    <div>
      <label v-if="selction" class="chapter-item">
        <div>
          <input type="checkbox" v-model="checkedAll" @change="selectAll" />
        </div>
        <span class="chapter-contents">全选</span>
      </label>
    </div>
    <draggable v-if="isSort" tag="section" class="chapter-list" v-model="chapterList" item-key="index" chosenClass="sortable-chosen" @end="sortList">
      <template #item="{ element }">
        <label class="chapter-item">
          <div class="chapter-checkbox">
            <input v-if="selction && !element.id" type="checkbox" v-model="element.selected" @change="select" />
          </div>
          <div class="chapter-contents">
            <p class="chapter-content" @click="clickChapter(element)">{{ element.title }}</p>
            <pre class="chapter-content" v-if="element.content" v-html="element.content"></pre>
          </div>
        </label>
      </template>
    </draggable>
    <section class="chapter-list" v-else>
      <label class="chapter-item" v-for="(element,index) in chapterList" :key="`chapterList-${index}`">
        <div class="chapter-checkbox">
          <input v-if="selction && !element.id" type="checkbox" v-model="element.selected" @change="select" />
        </div>
        <div class="chapter-contents">
          <p class="chapter-content" @click="clickChapter(element)">{{ element.title }}</p>
          <pre class="chapter-content" v-if="element.content" v-html="element.content"></pre>
        </div>
      </label>
    </section>
    </template>
  </section>
</section>
</template>

<style lang='less' scoped>
.chapter-list {
  display: flex;
  flex-wrap: wrap;
  .chapter-item {
    margin-right: 1%;
    width: 32%;
    min-width: 300px;
  }
}
.chapter-item {
  margin-top: @small;
  display: flex;
  width: 100%;
  align-items: flex-start;
  .chapter-checkbox {
    width: 16px;
  }
  .chapter-contents {
    margin-left: @small;
    flex: 1;
    overflow: hidden;
  }
  .chapter-content {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.sortable-chosen {
  background: @HoverColor;
}
</style>
