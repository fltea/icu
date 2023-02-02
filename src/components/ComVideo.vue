<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const ownVideo = ref(null);
const observer = new IntersectionObserver((entries) => {
  // console.log(entries[0].isIntersecting);
  const isVisible = entries[0].isIntersecting;
  if (!isVisible) {
    ownVideo.value.pause();
  }
});

const props = defineProps({
  video: Object,
});

const video = ref(props.video);
const played = ref(false);

const play = () => {
  played.value = true;
  ownVideo.value.play();
};

onMounted(() => {
  observer.observe(ownVideo.value);
});
onBeforeUnmount(() => {
  if (observer) {
    observer.unobserve(ownVideo.value);
    observer.disconnect();
  }
});
</script>

<template>
  <section class="com-video">
    <div class="cvideo-cover" v-show="!played" @click="play">
      <img class="cvideo-img" :src="video.picUrl" :alt="video.title">
    </div>
    <video class="cvideo-video" controls ref="ownVideo">
      <source :src="video.url" type="video/mp4">
    </video>
  </section>
</template>

<style lang='less' scoped>
.com-video {
  position: relative;
  min-height: 300px;
  .cvideo-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    cursor: pointer;
    overflow: hidden;
    background: #ccc;
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      content: '';
      background:url('@/assets/icons/play.svg') no-repeat center center rgba(0, 0, 0, .1);
      background-size: 80px;
      z-index: 2;
    }
    .cvideo-img {
      position: absolute;
      left: 50%;
      top: 50%;
      max-width: 100%;
      transform: translate(-50%, -50%);
    }
  }
  .cvideo-video {
    width: 100%;
    height: 100%;
  }
}
</style>
