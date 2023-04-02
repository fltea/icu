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
const cookie = 'douban-fav-remind=1; gr_user_id=d952d8e1-4c94-4a0f-85a6-490602a01830; bid=sGzzesrzR8E; __yadk_uid=2tgceX4XwgQlaNL0gfZpxOjk76Mbgitp; push_doumail_num=0; __gads=ID=0b674c3fdcc0edfc-22d65fc651d70030:T=1662346158:RT=1664342376:S=ALNI_MbK9TYegXLdmkHPHxEkK83SEaLWRw; __utmv=30149280.13127; _ga_RXNMP372GL=GS1.1.1669346365.38.1.1669348395.27.0.0; _ga=GA1.2.59920987.1629339426; __utmz=30149280.1677034364.212.11.utmcsr=cn.bing.com|utmccn=(referral)|utmcmd=referral|utmcct=/; dbcl2="131278996:4V01cmtw1Vk"; ct=y; ck=8yXD; __utmc=30149280; frodotk_db="9577d63424818f73c067829c6d84ae59"; push_noty_num=0; __gpi=UID=00000497fdd48c5d:T=1649325353:RT=1680225213:S=ALNI_MaFZ3dNZtn3hazPPqcfFdAbnigL3A; _pk_ref.100001.8cb4=["","",1680233168,"https://cn.bing.com/"]; __utma=30149280.59920987.1629339426.1680228144.1680233168.256; _pk_id.100001.8cb4=e66e4702929ba5e6.1679655305.1.1680233377.undefined.';

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
    if (res.data && res.data.type) {
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
        <p><a :href="item.url" target="_blank">{{ item.title }}</a></p>
        <p>
          <button class="list-button" @click="itemDetail(item.url)">详情</button>
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
