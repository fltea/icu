<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { detail } from '@/api/account';

const router = useRouter();
const curItem = ref({
  id: '',
});

const loadItem = () => {
  detail({
    id: curItem.value.id,
  }).then((res) => {
    console.log(res);
    curItem.value = res.data || {};
  });
};

watch(() => router, ({ currentRoute }) => {
  const { value } = currentRoute;
  curItem.value.id = value.params.id;
}, { immediate: true });

onMounted(loadItem);
</script>

<template>
<h1>{{ curItem.name }}</h1>
<section>
  <p class="account-item"><span>昵称</span> {{ curItem.nickName }}</p>
  <p class="account-item"><span>平台</span> {{ curItem.platform }}</p>
  <p class="account-item"><span>账号主页</span> {{ curItem.link }}</p>
  <p class="account-item"><span>余额</span> {{ curItem.balance }}</p>
  <p class="account-item"><span>账户描述</span> {{ curItem.desc }}</p>
  <p class="account-item"><span>绑定手机</span> {{ curItem.phone }}</p>
  <p class="account-item"><span>绑定邮箱</span> {{ curItem.email }}</p>
  <p class="account-item"><span>实名认证</span> {{ curItem.verify }}</p>
  <p class="account-item"><span>绑定证件</span> {{ curItem.IDCard }}</p>
  <p class="account-item"><span>开户日期</span> {{ curItem.beginDate }}</p>
  <p class="account-item"><span>销户日期</span> {{ curItem.endDate }}</p>
  <p class="account-item" v-if="curItem.Aties && curItem.Aties.length">绑定的账户</p>
  <div v-for="(item, index) in curItem.Aties" :key="`keys${index}`">
    <p class="accounter-item"><span>被绑定账户昵称</span> {{ item.tiedName }}</p>
    <p class="accounter-item"><span>绑定时间</span> {{ item.tieDate }}</p>
    <p class="accounter-item"><span>解绑时间</span> {{ item.untieDate }}</p>
    <p class="accounter-item"><span>备注</span> {{ item.remark }}</p>
  </div>
  <p class="account-item" v-if="curItem.Ties && curItem.Ties.length">被绑定的账户</p>
  <div v-for="(item, index) in curItem.Ties" :key="`keys${index}`">
    <p class="accounter-item"><span>绑定账户</span> {{ item.accountName }}</p>
    <p class="accounter-item"><span>绑定时间</span> {{ item.tieDate }}</p>
    <p class="accounter-item"><span>解绑时间</span> {{ item.untieDate }}</p>
    <p class="accounter-item"><span>备注</span> {{ item.remark }}</p>
  </div>
</section>
</template>

<style lang='less' scoped>
.account-item {
  margin-top: @tiny;
  line-height: 28px;
}
.accounter-item {
  margin-top: @mini;
  padding-left: 1.5em;
}
</style>
