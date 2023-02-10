<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { add, content } from '@/api/novel';
import WS from '@/utils/ws';

const props = defineProps({
  show: Boolean,
  novel: Object,
  noveler: Object,
});
const emit = defineEmits(['update:show', 'success']);
const dialog = computed({
  get() {
    return props.show;
  },
  set(value) {
    return emit('update:show', value);
  },
});
const domain = computed(() => (props.noveler ? props.noveler.domain : ''));
// https://www.tatajk.net/book/40857/
const form = reactive({
  id: '',
  url: '',
  title: '',
  author: '',
  content: '',
  origin: '',
  finish: '',
});
const novel = ref({});

const setForm = (data) => {
  const val = data || props.novel || {};
  const keys = Object.keys(form);
  keys.forEach((key) => {
    form[key] = val[key] || '';
  });
};

watch(() => props.novel, () => {
  setForm();
}, { immediate: true });

const hide = () => {
  dialog.value = false;
  setForm();
};
const getNovel = () => {
  if (!domain.value || !form.url) {
    return;
  }
  // console.log(content);

  const params = { ...props.noveler };
  params.url = form.url;
  content(params).then((res) => {
    // console.log(res);
    // setForm()
    const resutl = { ...res };
    resutl.list.forEach((v) => {
      v.loading = false;
      v.loaded = false;
      v.downed = false;
      v.download = false;
      v.add = false;
    });
    novel.value = resutl;
  });
};

let server;
const setEvent = (ws, datas) => {
  ws.onopen = () => {
    server.send(JSON.stringify(datas));
  };
  ws.onmessage = (evt) => {
    let msg = evt.data;
    msg = JSON.parse(msg);
    // console.log(new Date(), '数据已接收...', msg);
    const { loading, download, add: addResult, url, finished } = msg;
    const nNovel = novel.value;
    const chapter = nNovel.list.find((v) => v.url === url);
    // console.log(loading, download, `${download}`, addResult, url);
    if (chapter) {
      if (loading) {
        chapter.loading = !!loading;
      }
      if (download !== undefined && `${download}`) {
        chapter.loaded = true;
        chapter.download = download;
      }
      if (addResult !== undefined && `${addResult}`) {
        chapter.downed = true;
        chapter.add = addResult;
      }
    } else if (finished) {
      emit('success');
      hide();
    }
  };
};

const wsServer = (listId, novelId, loaded) => {
  // console.log('saveNovel', listId, novelId);
  server = WS('saveNovel');
  const datas = {
    listId,
    novel: novelId,
    loaded,
    ...props.noveler,
  };
  setEvent(server, datas);
};

const saveNovel = () => {
  if (!domain.value || !form.url || !form.url.includes(domain.value)) {
    return;
  }
  const nNovel = novel.value;
  const { listId } = nNovel;
  console.log(nNovel);
  if (form.id) {
    const { id, loaded } = form;
    wsServer(listId, id, loaded);
  } else {
    const params = {
      id: 1,
      clutter: props.noveler.clutterId,
    };
    const keys = ['url', 'title', 'author', 'origin', 'content', 'finish', 'loaded'];
    keys.forEach((v) => {
      params[v] = nNovel[v];
    });
    add(params).then((res) => {
      if (res.code === 200) {
        const { id, loaded } = res.data;
        wsServer(listId, id, loaded);
      }
    });
  }
};

</script>

<template>
  <com-dialog :show="dialog">
    <section class="noveler-dialog">
      <header>
        <p>NOVEL</p>
      </header>
      <main>
        <label>
          <span class="label-title">domain: </span>
          <span>{{ domain }}</span>
        </label>
        <label>
          <span class="label-title">url: </span>
          <input type="text" v-model="form.url" />
        </label>
      </main>
      <footer>
        <button @click="hide">取消</button>
        <button @click="getNovel">获取数据</button>
        <button v-if="novel.title" @click="saveNovel">保存</button>
      </footer>
    </section>
    <section class="novel-container">
      <h1>{{ novel.title }}</h1>
      <p>{{ novel.content }}</p>
      <p>{{ novel.author }}</p>
      <template v-if="novel.list">
        <div v-for="item in novel.list" :key="`novel.list-${item.url}`">
          <span>{{item.name}}</span>
          <span v-if="item.loading">加载中……</span>
          <template v-if="item.loaded && !item.downed">
            <span v-if="item.download">下载成功</span>
            <span v-else>下载失败</span>
          </template>
          <template v-if="item.downed">
          <span v-if="item.add">新增成功</span>
          <span v-else>新增失败</span>
          </template>
        </div>
      </template>
    </section>
  </com-dialog>
</template>

<style lang='less' scoped>
.noveler-dialog {
  margin: 0 auto;
  padding: 12px;
  label {
    margin-top: 12px;
    display: block;
    .label-title {
      margin-right: 8px;
      display: inline-block;
      width: 125px;
      text-align: right;
    }
    input {
      width: 400px;
    }
  }
  header {
    padding: 6px;
    text-align: center;
  }
  footer {
    margin-top: 12px;
    padding: 6px;
    text-align: center;
  }
}
.novel-container {
  width: 560px;
  height: 500px;
  overflow: auto;
}
</style>
