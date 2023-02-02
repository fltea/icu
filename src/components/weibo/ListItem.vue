<script setup>
import { computed } from 'vue';
import { formatTime } from '@/utils/tools';
import { save } from '@/api/weibo';
import ComVideo from '@/components/ComVideo.vue';
import Comments from './Comment.vue';

const props = defineProps({
  weibo: Object,
  retweeted: Boolean,
});
const item = computed(() => props.weibo);
const user = computed(() => props.weibo.user);
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
// console.log(item);
</script>

<template>
<section class="weibo-item">
  <section class="weibo-user">
    <img class="user-pic" :src="user.profile_image_url" :alt="user.screen_name">
    <p>{{user.screen_name}}  <span class="user-desc">{{formatTime(item.created_at)}}</span></p>
    <p class="user-desc">{{user.description}}</p>
    <div class="user-act">
      <button @click="saveWeibo">保存</button>
      <button @click="delWeibo">刪除</button>
    </div>
  </section>
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
  margin-bottom: 10px;
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
  .weibo-user {
    margin-bottom: 6px;
    position: relative;
    padding-left: 70px;
    padding-right: 110px;
    padding-top: 4px;
    height: 46px;
    .user-pic {
      position: absolute;
      left: 8px;
      top: 0;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .user-desc {
      font-size: 14px;
      color: #939393;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-act {
      position: absolute;
      top: 0;
      right: 10px;
      width: 100px;
      button {
        margin-right: 6px;
        font-size: 12px;
        cursor: pointer;
      }
    }
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
