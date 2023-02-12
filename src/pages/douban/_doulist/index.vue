<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { dDoulist, doulist, dArticles } from '@/api/douban';
import WS from '@/utils/ws';

const router = useRouter();
const curItem = ref({});
const curPage = ref(0);
const articles = ref([]);
let server;

const listItems = () => {
  dDoulist(curItem.value.doulist).then((res) => {
    console.log(res);
    if (res.data) {
      const data = JSON.parse(res.data.content);
      data.clutter = res.data.id;
      data.Articles = res.data.Articles;
      // console.log(data);
      curItem.value = data;
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
    const { loading, url, content } = msg;
    const { Articles } = curItem.value;
    const item = Articles.find((v) => v.link === url);
    if (item) {
      item.loading = !!loading;
      if (content) {
        item.content = content;
      }
    }
  };
};
const wsServer = (datas) => {
  server = WS('doulistArticles');
  setEvent(server, datas);
};

const getArticles = () => {
  const page = curPage.value + 1;
  doulist({
    id: curItem.value.id,
    page,
  }).then((res) => {
    if (res.data) {
      // console.log(res);
      curPage.value = page;
      const data = res.data.pages;
      const { Articles } = curItem.value;
      const max = data.length;
      if (!max) {
        curPage.value = 0;
        return;
      }
      for (let i = 0; i < max; i++) {
        const curpage = data[i];
        const item = Articles.find((c) => c.link === curpage.url);
        // console.log(Articles, item, curpage);
        if (!item) {
          curpage.checked = false;
          curpage.link = curpage.url;
          Articles.push(curpage);
        }
      }
    }
  });
};
const addArticles = () => {
  dArticles({
    id: curItem.value.id,
    clutter: curItem.value.clutter,
  }).then((res) => {
    console.log(res);
    if (res.data) {
      const { Articles } = curItem.value;
      res.data.forEach((v) => {
        const item = Articles.find((c) => c.link === v.link);
        if (item) {
          item.id = v.id;
        }
      });
    }
  });
};
const addContents = () => {
  const datas = {
    clutter: curItem.value.clutter,
    list: articles.value,
  };
  if (server) {
    server.send(JSON.stringify(datas));
  } else {
    wsServer(datas);
  }
};
const addAll = () => {
  const datas = curItem.value.Articles;
  datas.forEach((v) => {
    v.checked = true;
  });
  articles.value = datas.map((v) => v.link);
};
const articleHandle = (link) => {
  if (articles.value.includes(link)) {
    articles.value = articles.value.filter((v) => v !== link);
  } else {
    articles.value.push(link);
  }
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  console.log(value.params);
  curItem.value = value.params;
}, { immediate: true });

onMounted(listItems);
</script>

<template>
  <h1>{{ curItem.title }}</h1>
  <section>
    <p><a :href="curItem.aurthorLink" target="_blank">{{ curItem.aurthor }}</a></p>
    <pre class="article-content" v-if="curItem.content">{{ curItem.content }}</pre>
    <div v-if="curItem.Articles" class="article-controls">
      <button @click="getArticles">获取下一页列表</button>
      <button @click="addArticles" v-if="curPage">保存第{{ curPage }}页内容</button>
      <button @click="addContents">批量获取内容</button>
      <button @click="addAll">全选</button>
    </div>
    <section class="article-container">
      <div class="article-item" v-for="item in curItem.Articles" :key="`curItem.Articles-${item.id}`">
        <p>
          <label class="item-label">
            <input class="checkbox" v-model="item.checked" type="checkbox" @change="articleHandle(item.link)" />
            <!-- <a v-if="item.id" :href="`/article/${item.id}`" target="_balnk">{{ item.title }}</a> -->
            <span>{{ item.title }}</span>
          </label>
        </p>
        <p v-if="item.loading">
          <span>加载中……</span>
        </p>
        <pre class="item-content">{{ item.content }}</pre>
      </div>
    </section>
  </section>
</template>

<style scoped lang='less'>
.article-content {
  margin-top: 12px;
  padding: 6px;
  height: 150px;
  overflow: auto;
}
.article-controls {
  margin-top: 12px;
}
.article-container {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
}
.article-item {
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
.item-content {
  font-size: 12px;
  max-height: 36px;
  overflow: hidden;
}
</style>
