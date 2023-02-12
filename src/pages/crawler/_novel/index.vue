<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { detail, dChapters, content } from '@/api/novel';
import WS from '@/utils/ws';

const router = useRouter();
const novel = ref({});
const novelId = ref('');
const chapters = ref([]);
let server;

const getData = () => {
  if (!novelId.value) {
    return;
  }
  detail({
    id: novelId.value,
  }).then((res) => {
    // console.log(res);
    if (res.data) {
      res.data.Chapters.forEach((v) => {
        v.checked = false;
      });
      novel.value = res.data;
    }
  });
};

const setEvent = (ws, datas) => {
  ws.onopen = () => {
    ws.send(JSON.stringify(datas));
  };
  ws.onmessage = (evt) => {
    let msg = evt.data;
    msg = JSON.parse(msg);
    const { loading, url, content: contentStr } = msg;
    const { Chapters } = novel.value;
    const chapter = Chapters.find((v) => v.url === url);
    if (chapter) {
      chapter.loading = !!loading;
      if (contentStr) {
        chapter.content = contentStr;
      }
    }
  };
};
const wsServer = (datas) => {
  server = WS('mulChapters');
  setEvent(server, datas);
};

const getChapters = () => {
  content({
    novel: novel.value.id,
  }).then((res) => {
    if (res.data) {
      // console.log(res.data);
      const { list } = res.data;
      const chapter = list.map((v) => {
        const item = novel.value.Chapters.find((c) => c.url === v.url);
        return item || v;
      });
      novel.value.Chapters = chapter;
    }
  });
};
const addChapters = () => {
  dChapters({
    novel: novel.value.id,
    url: novel.value.url,
  });
};
const addContents = () => {
  const urls = chapters.value;
  if (!urls.length) {
    return;
  }
  console.log('addContents', urls.length);
  const datas = {
    novel: novel.value.id,
    urls,
  };
  if (server) {
    server.send(JSON.stringify(datas));
  } else {
    wsServer(datas);
  }
};
const chapterHandle = (url) => {
  // console.log(url);
  if (chapters.value.includes(url)) {
    chapters.value = chapters.value.filter((v) => v !== url);
  } else {
    chapters.value.push(url);
  }
};
const addAll = () => {
  const datas = novel.value.Chapters;
  datas.forEach((v) => {
    v.checked = true;
  });
  chapters.value = datas.map((v) => v.url);
  // console.log(chapters.value);
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  // console.log(value.params);
  novelId.value = value.params.novel;
}, { immediate: true });

onMounted(getData);
</script>

<template>
  <h1>{{ novel.title }}</h1>
  <section class="novel-container">
    <pre class="novel-content">{{ novel.content }}</pre>
    <div v-if="novel.Chapters" class="chapter-controls">
      <button @click="getChapters">重新获取章节</button>
      <button @click="addChapters">保存章节</button>
      <button @click="addContents">批量获取内容</button>
      <button @click="addAll">全选</button>
    </div>
    <section class="chapter-container">
      <div class="chapter-item" v-for="item in novel.Chapters" :key="`novel.Chapters-${item.id}`">
        <p><label class="item-label"><input class="checkbox" v-model="item.checked" type="checkbox" @change="chapterHandle(item.url)" /><a :href="`/crawler/${novel.id}/${item.id}`" target="_balnk">{{ item.title }}</a></label></p>
        <p v-if="item.loading">
          <span>加载中……</span>
        </p>
        <p class="chapter-content">{{ item.content }}</p>
      </div>
    </section>
  </section>
</template>

<style scoped lang='less'>
.novel-content {
  margin-top: 12px;
  padding: 6px;
  height: 150px;
  overflow: auto;
}
.chapter-controls {
  margin-top: 12px;
}
.chapter-container {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
}
.chapter-item {
  margin-top: 12px;
  margin-right: 3%;
  width: 30%;
  .item-label {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
  }
  .checkbox {
    margin: 6px;
  }
}
.chapter-content {
  font-size: 12px;
  max-height: 36px;
  overflow: hidden;
}
</style>
