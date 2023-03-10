<script setup>
import { ref, reactive } from 'vue';
import { durl } from '@/api/douban';
import { getComName } from '@/utils/tools';

import GroupDetail from '@/components/douban/GroupDetail.vue';
import DoulistDetail from '@/components/douban/DoulistDetail.vue';

const components = {
  GroupDetail,
  DoulistDetail,
};

const idialog = ref(false);
const curType = ref('');
const curCom = ref('');
const curData = reactive({
  list: [],
  detail: null,
});

// eslint-disable-next-line max-len
const cookie = 'ck=CKHW; __utmz=30149280.1677906420.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmc=30149280; bid=Gd0--ZvrYvw; ll="118282"; _pk_ses.100001.8cb4=*; ap_v=0,6.0; __yadk_uid=pjrYOz7QDMoOEa4q0JehbV1TJ2ALjvWL; push_noty_num=0; push_doumail_num=0; __utma=30149280.953509811.1677906420.1677906420.1677909127.2; __utmt=1; __utmv=30149280.13127; _pk_id.100001.8cb4=6285a9700fa815d2.1677906418.2.1677909129.1677906437.; __utmb=30149280.4.10.1677909127';

const linkItems = () => {
  idialog.value = true;
};
const newItems = (url) => {
  if (!url) {
    return;
  }
  durl({
    cookie,
    url,
  }).then((res) => {
    // console.log(res);
    if (res.data) {
      curData.detail = res.data;
      curData.list = [];
      curCom.value = getComName(res.data.type);
    } else if (res.list) {
      curData.list = res.list;
      curData.detail = null;
      curType.value = res.type;
    }
  });
};

const itemDetail = (url) => {
  if (!url) {
    return;
  }
  durl({
    url,
  }).then((res) => {
    if (res.data) {
      curData.detail = res.data;
      curCom.value = getComName(res.data.type);
    }
    console.log(res, curCom.value);
  });
};

// const addGroup = () => {};
</script>

<template>
  <h1>DOUBAN</h1>
  <div class="com-controls">
    <button @click="linkItems">新增收藏</button>
  </div>
  <section class="list-container">
    <section class="list-items" v-if="curData.list.length">
      <div v-for="(item, index) in curData.list" :key="`curData.list${index}`" class="list-item">
        <p><a :href="item.url" target="_blank">{{ item.name }}</a></p>
        <p>
          <button class="list-button" v-if="curType === 'group'" @click="itemDetail(item.url)">小组详情</button>
        </p>
      </div>
    </section>
    <section v-if="curData.detail">
      <component :is="components[curCom]" :detail="curData.detail"></component>
    </section>
  </section>
  <text-dialog title="Link" v-model:show="idialog" @save="newItems"></text-dialog>
</template>

<style scoped lang='less'>
.list-container {
  margin-top: 12px;
  display: flex;
  .list-items {
    min-width: 300px;
  }
}
.list-item {
  & + .list-item {
    margin-top: 12px;
  }
}
</style>
