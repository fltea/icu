<script setup>
import { ref, reactive, onMounted } from 'vue';
import { list } from '@/api/mark';
import { deepCopy } from '@/utils/tools';
import Flow from '@/components/flow/Flow.vue';

const dialog = ref(false);
const flows = reactive({
  list: [],
  finished: false,
  loading: false,
  curItem: null,
});
let params = null;

const newItem = (item) => {
  flows.curItem = item || null;
  dialog.value = true;
};

const listData = () => {
  flows.loading = true;
  list(params).then((res) => {
    flows.list.push(...deepCopy(res.list) || []);
    flows.finished = flows.list.length >= res.count;
  }).finally(() => {
    flows.loading = false;
  });
};

const listMData = () => {
  const page = params?.page || 1;
  if (!params) {
    params = {};
  }
  params.page = page + 1;
  listData();
};

const reloadList = () => {
  params = null;
  flows.list = [];
  listData();
};
onMounted(listData);
</script>

<template>
<h1>Flow</h1>
<section class="com-controls">
  <input type="text" placeholder="name">
  <button>查詢</button>
  <button>重設</button>
  <button @click="newItem()">新增</button>
</section>
  <com-list :finished="flows.finished" :loading="flows.loading" @load="listMData">
    <section>
      <div class="list-item" v-for="(item ,index) in flows.list" :key="`list-${index}`">
        <p>{{ item.name }}</p>
      </div>
    </section>
  </com-list>

<Flow v-model="dialog" :flow="flows.curItem" @success="reloadList" />
</template>

<style scoped lang='less'>
</style>
