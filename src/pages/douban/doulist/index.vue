<script setup>
import { ref, reactive } from 'vue';
import { durl, detail } from '@/api/douban';

import InputDialog from '@/components/InputDialog.vue';
import Doulist from '@/components/douban/Doulist.vue';

const idialog = ref(false);
const ddialog = ref(false);
const curData = reactive({
  list: [],
  detail: null,
});
// eslint-disable-next-line max-len
const cookie = 'push_doumail_num=0; __utmv=30149280.13127; douban-fav-remind=1; gr_user_id=24a9c2e5-a767-4e2b-9901-e8a5f83da0ed; Hm_lvt_19fc7b106453f97b6a84d64302f21a04=1663477434; _ga=GA1.1.1540038648.1643368021; push_noty_num=0; _ga_RXNMP372GL=GS1.1.1673765686.4.1.1673765747.60.0.0; bid=KJ9_esXKCRQ; __yadk_uid=oBu2WVliLYXCqj6SdSR6gUln4gXwy06V; ct=y; __utmz=30149280.1676183765.450.17.utmcsr=cn.bing.com|utmccn=(referral)|utmcmd=referral|utmcct=/; ll="118282"; dbcl2="131278996:nVCDmpLC6xI"; __gads=ID=c3d35a1e5b88a1cf-227756a803da00de:T=1677068513:RT=1677068513:S=ALNI_MY893Op78ab2d3uY7rbS5uvWVTfzA; ck=CKHW; __utmc=30149280; __gpi=UID=00000484bdd2b501:T=1649163901:RT=1677326056:S=ALNI_MZM5ovW_sVJQUr8tnYTWFe56RmW6Q; _pk_ref.100001.8cb4=["","",1677330439,"https://cn.bing.com/"]; _pk_ses.100001.8cb4=*; __utma=30149280.1540038648.1643368021.1677327921.1677330439.468; frodotk_db="829422762cad886487bc67628608992c"; ap_v=0,6.0; _pk_id.100001.8cb4=39d4ceef2c12c115.1643368019.514.1677334307.1677327921.; __utmb=30149280.70.8.1677334311162';

const linkItems = () => {
  idialog.value = true;
};
const newItems = (url) => {
  console.log('url', url);
  if (!url) {
    return;
  }
  durl({
    cookie,
    url,
  }).then((res) => {
    // console.log(res);
    if (res.title) {
      curData.detail = res;
      curData.list = [];
    } else if (res.list) {
      curData.list = res.list;
      curData.detail = null;
    }
  });
};
const newItem = () => {
  detail({
    cookie,
    url: 'https://movie.douban.com/subject/26213252/',
  }).then((res) => {
    console.log(res);
  });
};

const listData = () => {
  newItems();
};
</script>

<template>
  <h1>DOULIST</h1>
  <div class="com-controls">
    <button @click="linkItems">链接豆列</button>
    <button @click="newItem">链接详情</button>
    <button @click="newItem">新增豆列</button>
  </div>
  <section v-if="curData.detail">
    <header>
      <h1>{{ curData.detail.title }}</h1>
      <p><a :href="curData.detail.aurthorLink">{{ curData.detail.aurthor }}</a></p>
      <pre>{{ curData.detail.content }}</pre>
      <p>{{ curData.detail.count }}</p>
      <p>{{ curData.detail.createTime }} {{ curData.detail.updateTime }}</p>
    </header>
    <div v-for="(item, index) in curData.detail.list" :key="`curData.list${index}`">
      <p>{{ item.title }}</p>
      <p>{{ item.source }}</p>
      <p>{{ item.text }}</p>
      <p>{{ item.comment }}</p>
    </div>
  </section>
  <section v-else>
    <div v-for="(item, index) in curData.list" :key="`curData.list${index}`">
      <p><a :href="item.link">{{ item.name }}</a></p>
    </div>
  </section>
  <InputDialog v-model="idialog" @save="newItems"></InputDialog>
  <doulist v-model:show="ddialog" @success="listData"></doulist>
</template>

<style scoped lang='less'>
</style>
