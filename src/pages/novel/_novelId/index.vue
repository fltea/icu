<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { detail, novelDel, nurl, chapterSort } from '@/api/novel';

import Novel from '@/components/novel/Novel.vue';
import NovelDetail from '@/components/novel/NovelDetail.vue';
import WS from '@/utils/ws';

const router = useRouter();
const curItem = reactive({
  id: '',
  novel: null,
});
let chapters = null;
let server = null;
let sort;
const cdialog = ref(false);
const sortList = ref(false);

const loadItem = () => {
  detail({
    id: curItem.id,
  }).then((res) => {
    console.log(res);
    const result = res.data || {};
    const arrs = Object.keys(result);
    arrs.forEach((v) => {
      curItem[v] = result[v] || '';
    });
    curItem.chapters.forEach((c) => {
      c.loading = false;
      c.content = c.content || '';
    });
    curItem.novel = res.data;
  });
};
const delItem = () => {
  novelDel({
    id: curItem.id,
  }).then(() => {
    router.push('/novel');
  });
};
const wsServer = (datas) => {
  server = WS(`chapterList:${curItem.id}`);
  server.onopen = () => {
    server.send(JSON.stringify(datas));
  };
  server.onmessage = (evt) => {
    let msg = evt.data;
    msg = JSON.parse(msg);
    const { loading, url, content } = msg;
    const chapterList = curItem.chapters;
    const chapter = chapterList.find((v) => v.url === url);
    if (chapter) {
      chapter.loading = !!loading;
      if (content) {
        chapter.content = content;
      }
    }
  };
};

const loadChapters = () => {
  nurl({
    url: curItem.url,
    ...curItem.clutter,
  }).then((res) => {
    let { list } = res;
    if (list && list.length) {
      const olist = curItem.chapters.map((v) => v.url);
      list = list.filter((v) => !olist.includes(v.url));
      curItem.chapters.push(list);
      curItem.chapters.forEach((c) => {
        c.loading = false;
        c.content = c.content || '';
      });
    }
  });
};

const selectItems = (list) => {
  chapters = list;
};
const loadChapter = () => {
  if (!chapters || !chapters.length) {
    return;
  }
  const urls = chapters.map((v) => v.url);
  // console.log('loadChapter', urls.length);
  const datas = {
    novelId: curItem.id,
    urls,
  };
  if (server) {
    server.send(JSON.stringify(datas));
  } else {
    wsServer(datas);
  }
};
const modItem = () => {
  cdialog.value = true;
};
const loadSort = (result) => {
  sort = result || '';
};
const onSort = () => {
  sortList.value = !sortList.value;
};
const saveSort = () => {
  if (!sort) {
    return;
  }
  chapterSort({
    sort,
  }).then((res) => {
    console.log(res);
  });
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  curItem.id = value.params.novelid;
}, { immediate: true });

onMounted(loadItem);
</script>

<template>
<novel-detail v-if="curItem.title" :sortList="sortList" :detail="curItem" selction @selected="selectItems" @sort="loadSort">
  <template v-slot:controls>
    <button @click="modItem">修改 Novel</button>
    <button @click="delItem">刪除 Novel</button>
    <button @click="loadChapters">获取章节列表</button>
    <button @click="loadChapter">获取章节</button>
    <button @click="onSort">
      <span v-if="sortList">结束排序</span>
      <span v-else>开始排序</span>
    </button>
    <button v-if="sortList" @click="saveSort">保存排序</button>
  </template>
</novel-detail>
<novel v-model:show="cdialog" :novel="curItem.novel" @success="loadItem"></novel>
</template>

<style scoped lang='less'>
</style>
