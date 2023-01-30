<script setup>
import ComHeader from '@/components/layout/ComHeader.vue';
import ComFooter from '@/components/layout/ComFooter.vue';
</script>

<template>
  <com-header></com-header>
  <section class="layout-inner">
    <router-view></router-view>
  </section>
  <com-footer></com-footer>
</template>

<style scoped></style>
