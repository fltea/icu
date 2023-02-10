<template>
<header class="com-header">
  <div class="header-logo">
    <a href="/"><img src="/image.png" alt="FLTEA"></a>
  </div>
  <div>
    <a class="header-nav" v-for="(item, index) in menus" :key="`menus-${index}-${item.path}`" :href="item.path">{{item.name}}</a>
  </div>
</header>
</template>

<script setup>
import { reactive } from 'vue';
import comMenus from '@/utils/comMenus';

const menus = reactive(comMenus);
</script>

<style lang='less' scoped>
.com-header {
  display: flex;
  padding: 10px;
  @logos: 30px;
  .header-logo {
    width: @logos;
    font-size: 0;
    img {
      max-width: @logos;
      max-height: @logos;
    }
  }
  .header-nav {
    margin-left: 12px;
    line-height: @logos;
  }
}
</style>
