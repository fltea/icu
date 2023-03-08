<template>
<header class="com-header">
  <div class="header-toper">
    <div class="header-logo">
      <a href="/"><img src="/image.png" alt="FLTEA"></a>
    </div>
    <div class="header-navs">
      <a class="header-nav" v-for="(item, index) in menus" :key="`menus-${index}-${item.path}`" :href="item.path">{{item.name}}</a>
    </div>
  </div>
  <div class="header-subnav" v-if="subNavs.length">
    <a class="sub-nav" v-for="(item, index) in subNavs" :key="`menus-${index}-${item.path}`" :href="item.path">{{item.name}}</a>
  </div>
</header>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import comMenus from '@/utils/comMenus';
import { getComName } from '@/utils/tools';

const router = useRouter();
const menus = reactive(comMenus);
const routes = router.getRoutes();
let { currentRoute } = router;
currentRoute = currentRoute.value;
currentRoute = currentRoute.path.split('/').filter((v) => !!v).shift();
const subNavs = routes.filter((v) => v.path.includes(`/${currentRoute}/`)).filter((v) => !v.path.includes(':') && (v.path.split('/').length <= 3)).map((v) => {
  const item = { ...v };
  let { name } = item;
  name = name.replace(currentRoute, '');
  name = name.replace(/_/g, '');
  const names = getComName(name);
  item.name = names;
  return item;
});
</script>

<style lang='less' scoped>
.com-header {
  // padding-top: 10px;
  padding-bottom: 10px;
  @logos: 30px;
  .header-toper {
    display: flex;
    padding: 2px 10px;
    background-color: @proColor;
  }
  .header-logo {
    width: @logos;
    font-size: 0;
    img {
      max-width: @logos;
      max-height: @logos;
    }
  }
  .header-navs {
    word-break: break-all;
  }
  .header-nav {
    white-space: nowrap;
    margin-left: 12px;
    line-height: @logos;
    color: @linkrColor;
    &:hover {
      color: @linkrHoverColor;
    }
  }
  .header-subnav {
    padding-top: 5px;
    padding-bottom: 8px;
    padding-left: 42px;
    padding-right: 10px;
    background: @bgf8;
    .sub-nav {
      & + .sub-nav {
        margin-left: 12px;
      }
    }
  }
}
</style>
