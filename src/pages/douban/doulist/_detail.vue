<script setup>
import { reactive, watch, onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { durl, durlDetail, doulistId, doubanDel, recordSave } from '@/api/douban';

import NewDoulist from '@/components/douban/Doulist.vue';
import DoulistDetail from '@/components/douban/DoulistDetail.vue';

const router = useRouter();
const curItem = reactive({
  clutter: '',
  item: null,
  adialog: false,
  topics: [],
  activeName: 'record',
});

const detail = ref(null);

const curList = computed(() => {
  const type = curItem.activeName;
  if (type === 'record') {
    return curItem.item?.records || [];
  }

  return curItem.topics;
});
const modDoulist = () => {
  curItem.adialog = true;
};
const delDoulist = () => {
  doubanDel({
    clutter: curItem.clutter,
  }).then(() => {
    location.href = '/douban/doulist';
  });
};

const getDoulist = () => {
  durl({
    url: `https://www.douban.com/doulist/${curItem.item.id}/`,
  }).then((res) => {
    console.log(res);
    curItem.topics = res.data?.topics || [];
  });
};

const handelList = () => {
  curItem.activeName = 'record';
};

const handleTopics = () => {
  curItem.activeName = 'topices';
  if (!curItem.topics.length) {
    getDoulist();
  }
};

const loadItem = () => {
  doulistId(curItem.clutter).then((res) => {
    curItem.item = res.data || null;
    if (!curList.value.length) {
      handleTopics();
    }
  });
};

const getRecord = ({ url }) => {
  durlDetail({
    url,
  }).then((res) => {
    // console.log(res);
    const ditem = res.data || null;
    if (ditem) {
      const list = ditem.comments || [];
      const plist = ditem.pcomments || [];
      const results = [];
      results.push(...plist, ...list);
      results.forEach((v) => {
        v.selected = false;
      });
      ditem.comments = results;
    }
    detail.value = ditem;
  });
};

const saveRecord = () => {
  recordSave({
    detail: JSON.stringify(detail.value),
  }).then((res) => {
    console.log(res);
  });
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  curItem.clutter = value.params.detail;
}, { immediate: true });

onMounted(loadItem);
</script>

<template>
<new-doulist :doulist="curItem.item" v-model:show="curItem.adialog" @success="loadItem"></new-doulist>
<section v-if="curItem.item">
  <doulist-detail :detail="curItem.item">
    <template v-slot:controls>
      <button @click="modDoulist">修改</button>
      <button @click="delDoulist">删除</button>
    </template>
  </doulist-detail>
  <div class="detail-tabs">
    <div class="tabs-item" :class="{'is-current': curItem.activeName === 'record'}" @click="handelList">已存数据</div>
    <div class="tabs-item" :class="{'is-current': curItem.activeName === 'topices'}" @click="handleTopics">获取数据</div>
  </div>
  <div class="topics-container">
    <div class="list-cont">
      <div class="list-item" v-for="(item, index) in curList" :key="`item.url${index}`">
        <div class="item-title">
          <p class="title">{{ item.title }}</p>
          <p class="item-action"><a class="item-link" href="javascript:;" @click="getRecord(item)">获取数据</a><a class="item-link" :href="item.url" target="_blank">原文</a></p>
        </div>
        <pre v-html="item.text"></pre>
      </div>
    </div>
    <div v-if="detail" class="topic-cont">
      <button @click="saveRecord">保存详情</button>
      <p>{{ detail.title }}</p>
      <p>{{ detail.author }}  {{ detail.createTime }}  {{ detail.authorIp }}</p>
      <pre v-html="detail.content"></pre>
      <template v-if="detail.repost">
        <pre v-html="detail.repost.content"></pre>
        <!-- <a :href="detail.repost.url"></a> -->
      </template>
      <template v-if="detail.comments">
        <div class="list-item" v-for="(item, index) in detail.comments" :key="`topic-comments${index}`">
          <p><label><input type="checkbox" v-model="item.selected">{{ item.userName }}</label></p>
          <pre v-html="item.content"></pre>
        </div>
      </template>
    </div>
  </div>
</section>
</template>

<style scoped lang='less'>
.detail-tabs {
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  .tabs-item {
    padding: @tiny @small;
    background-color: @tableHeadBg;
    cursor: pointer;
    &:first-child {
      border-radius: 4px 0 0 4px;
    }
    &:last-child {
      border-radius: 0 4px 4px 0;
    }
    &.is-current {
      color: #fff;
      background-color: @proColor;
    }
  }
}
.topics-container {
  display: flex;
  .list-cont {
    min-width: 250px;
    flex-shrink: 1;
  }
  .topic-cont {
    margin-left: @small;
    flex: 1;
    min-width: 65%;
  }
  .list-item {
    padding-top: @mini;
    border-top: 1px solid @splitColor;
    &:nth-child(n+2){
      margin-top: @base;
    }
  }
}
.list-cont {
  .list-item {
    position: relative;
    &:hover {
      .item-title {
        padding-right: 120px;
      }
      .item-action {
        display: block;
      }
    }
    .item-title {
      margin-bottom: @mini;
      .title {
        width: 100%;
        .largeFont();
        .ellipsis();
      }
    }
    .item-action {
      display: none;
      position: absolute;
      top: 7px;
      right: 0;
    }
    .item-link {
      margin-left: @tiny;
    }
  }
}
</style>
