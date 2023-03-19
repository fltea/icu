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
const cookie = 'push_doumail_num=0; __utmv=30149280.13127; douban-fav-remind=1; gr_user_id=24a9c2e5-a767-4e2b-9901-e8a5f83da0ed; Hm_lvt_19fc7b106453f97b6a84d64302f21a04=1663477434; push_noty_num=0; bid=KJ9_esXKCRQ; __yadk_uid=oBu2WVliLYXCqj6SdSR6gUln4gXwy06V; ll="118282"; dbcl2="131278996:nVCDmpLC6xI"; __gads=ID=c3d35a1e5b88a1cf-227756a803da00de:T=1677068513:RT=1677068513:S=ALNI_MY893Op78ab2d3uY7rbS5uvWVTfzA; _ga_RXNMP372GL=GS1.1.1677678442.5.0.1677678446.56.0.0; _ga=GA1.2.1540038648.1643368021; __utmz=30149280.1678802750.486.20.utmcsr=cn.bing.com|utmccn=(referral)|utmcmd=referral|utmcct=/; ct=y; _pk_ref.100001.8cb4=["","",1679136459,"https://cn.bing.com/"]; _pk_id.100001.8cb4=39d4ceef2c12c115.1643368019.535.1679136459.1679122374.; __gpi=UID=00000484bdd2b501:T=1649163901:RT=1679136460:S=ALNI_MZM5ovW_sVJQUr8tnYTWFe56RmW6Q; __utma=30149280.1540038648.1643368021.1679122377.1679136460.490';

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
