<script setup>
import { computed } from 'vue';
import { formatTime } from '@/utils/tools';
import { save } from '@/api/weibo';
import ComVideo from '@/components/ComVideo.vue';
import Comments from './Comment.vue';
import UserItem from './UserItem.vue';

const props = defineProps({
  weibo: Object,
  retweeted: Boolean,
});
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
        picUrl: info.page_pic.url,
        title: info.title,
        url: info.urls.mp4_ld_mp4,
      };
    }
  }
  return result;
});

const saveWeibo = () => {
  // console.log(item);
  save(item.value);
};
const delWeibo = () => {
  console.log(item);
};
</script>

<template>
<section class="weibo-item">
  <user-item :user="item.user">
    <template v-slot:created_at>
      <span class="user-desc">{{formatTime(item.created_at)}}</span>
    </template>
    <template v-slot:acts>
      <button @click="saveWeibo">保存</button>
      <button @click="delWeibo">刪除</button>
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
  font-size: 16px;
  line-height: 1.4;
  background: #f6f6f6;
  border-radius: 3px;
  .weibo-item {
    margin: 0;
    background-color: #ddd;
  }
  .weibo-inner {
    padding-left: 8px;
    padding-right: 8px;
    padding-bottom: 8px;
  }
  .weibo-pics {
    margin-top: 6px;
    display: flex;
    flex-wrap: wrap;
    .pics-item {
      margin-bottom: 6px;
      width: 48%;
      height: 200px;
      overflow: auto;
      border: 1px solid;
    }
    .pics-inner {
      width: 100%;
      // max-height: 100%;
    }
  }

  .weibo-video {
    height: 300px;
  }
  .weibo-comments {
    max-height: 300px;
    overflow: auto;
  }

  ::v-deep(a) {
    color: #eb7340;
    .url-icon {
      filter: sepia(100%) saturate(3800%) contrast(75%);
      img {
        vertical-align: -4px;
      }
    }
  }
}
</style>
