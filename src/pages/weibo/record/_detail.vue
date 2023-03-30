<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { recordDetail } from '@/api/weibo';
import ListItem from '@/components/weibo/ListItem.vue';

const router = useRouter();
const detail = ref({});
let id = '';

const detailData = () => {
  if (!id) {
    return;
  }
  recordDetail(id).then((res) => {
    // console.log(res);
    detail.value = res.data || {};
  });
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  // console.log(value);
  id = value.params.detail;
}, { immediate: true });

onMounted(detailData);
</script>

<template>
  <section class="com-container" v-if="detail.id">
    <list-item v-if="detail.infos" :weibo="detail.infos" detail noactions>
      <list-item v-if="detail.infos.retweeted_status" :weibo="detail.infos.retweeted_status" retweeted detail noactions></list-item>
    </list-item>
    <div v-else>
      <h1>{{ detail.title }}</h1>
      <div class="detail-user">
        <p><a :href="detail.authorLink" target="_blank">{{ detail.author }}</a></p>
        <p>{{ detail.publishTime }}</p>
        <p>{{ detail.authorIp }}</p>
      </div>
      <div class="pre-content" v-html="detail.content"></div>
    </div>
  </section>
</template>

<style lang='less' scoped>
.detail-user {
  margin-top: @small;
  padding: 6px;
  display: flex;
  background: @bgf8;
  p:nth-child(n+2) {
    margin-left: @small;
  }
}
</style>
