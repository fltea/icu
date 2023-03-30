<script setup>
import { computed } from 'vue';
import { formatTime } from '@/utils/tools';
import { winfo, wcomment, save } from '@/api/weibo';
import ComVideo from '@/components/ComVideo.vue';
import Comments from './Comment.vue';
import UserItem from './UserItem.vue';

const props = defineProps({
  weibo: Object,
  retweeted: Boolean,
  detail: Boolean,
  noactions: Boolean,
});
const cookie = localStorage.getItem('wcookie') || '';
const item = computed(() => props.weibo);
// const media = ref(props.weibo.page_info);
const video = computed(() => {
  let result = null;
  if (props.weibo.page_info) {
    const info = props.weibo.page_info;
    const { type } = info;
    const isVideo = type === 'video';
    if (isVideo) {
      result = {
        picUrl: info.page_pic ? info.page_pic.url : '',
        title: info.title,
        url: info.urls ? info.urls.mp4_ld_mp4 : info.url,
      };
    }
  }
  return result;
});

const saveWeibo = () => {
  // console.log(item);
  save({
    weibo: JSON.stringify(item.value),
  });
};
// const linkWeibo = () => {
//   if (!props.detail) {
//     console.log(item);
//     window.open(`/weibo/${item.value.id}`);
//   }
// };

const detailComment = () => {
  wcomment({
    id: item.value.id,
    cookie,
  }).then((res) => {
    // console.log(res);
    item.value.comments = res.list;
  });
};
const detailData = () => {
  winfo({
    id: item.value.id,
    cookie,
  }).then((res) => {
    // console.log(res);
    if (res.data) {
      const { comments_count: count, detail } = res.data;
      item.value.text = detail;
      item.value.isLongText = false;
      if (!props.retweeted && count) {
        detailComment();
      }
    }
  });
};
const hasSave = (data) => {
  let result = !data.isLongText;
  if (data.retweeted_status) {
    result = result && !data.retweeted_status.isLongText;
  }

  return result;
};
</script>

<template>
<section class="weibo-item" :class="{'weibo-detail': props.detail}">
  <user-item :user="item.user" :nopic="!!props.retweeted" :noactions="props.noactions">
    <template #created_at>
      <span class="user-desc">{{formatTime(item.created_at)}}</span>
    </template>
    <template #acts v-if="!noactions">
      <slot name="acts"></slot>
      <button v-if="item.isLongText" @click="detailData">详情</button>
      <button v-if="hasSave(item)" @click="saveWeibo">保存</button>
    </template>
  </user-item>
  <section class="weibo-inner">
    <div v-html="item.text"></div>
    <div class="weibo-pics" v-if="item.pics">
      <div v-for="(pic, index) in item.pics" :key="`pics-${index}`" class="pics-item">
        <img class="pics-inner" :src="pic.url">
      </div>
    </div>
    <com-video class="weibo-video" v-if="video" :video="video"></com-video>
  </section>
  <slot></slot>
  <section class="weibo-comments" v-if="item.comments">
    <comments v-for="item in item.comments" :key="`item.comments-${item.id}`" :comment="item"></comments>
  </section>
</section>
</template>

<style lang="less" scoped>
.weibo-item {
  padding-top: 8px;
  background: #f6f6f6;
  border-radius: 3px;
  &.weibo-detail {
    .weibo-pics {
      display: block;
      .pics-item {
        width: auto;
        height: auto;
        .pics-inner {
          position: unset;
          max-width: 100%;
          transform: none;
        }
      }
    }
    .weibo-comments {
      max-height: unset;
    }
  }
  .weibo-item {
    margin: 0;
    background-color: #ddd;
  }
  .weibo-inner {
    padding-left: 70px;
    padding-right: 8px;
    padding-bottom: 8px;
  }
  .weibo-pics {
    margin-top: 6px;
    display: flex;
    flex-wrap: wrap;
    .pics-item {
      margin-bottom: 6px;
      width: 300px;
      height: 280px;
      overflow: hidden;
    }
    .pics-inner {
      position: relative;
      left: 50%;
      top: 50%;
      max-width: 350px;
      transform: translate(-50%, -50%);
    }
  }

  .weibo-video {
    height: 300px;
  }
  .weibo-comments {
    padding-left: 70px;
    max-height: 300px;
    overflow: auto;
  }

  :deep(a) {
    color: @emColor;
    .url-icon {
      filter: sepia(100%) saturate(3800%) contrast(75%);
      img {
        vertical-align: -1px;
      }
    }
  }
}
</style>
