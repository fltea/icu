<script setup>
import { computed, reactive } from 'vue';

const panel = reactive({
  curyear: null,
  curmonth: null,
  curd: new Date(),
});
// 获取某月最后一天信息
const monthDates = (year, month) => {
  const ldate = new Date(year, month, 0);
  return {
    total: ldate.getDate(),
    // Sunday - Saturday : 0 - 6
    day: ldate.getDay(),
    year: ldate.getFullYear(),
    month: ldate.getMonth() + 1,
  };
};

const datesList = (list, max, item, type = 0) => {
  const { total, day, year, month } = item;
  const isPrev = type < 0;
  if (!type) {
    panel.curyear = year;
    panel.curmonth = month;
  }
  let dateno = isPrev ? total - day : 1;
  while (dateno <= total && list.length < max) {
    list.push({
      date: dateno,
      year,
      month,
      cur: isPrev,
    });
    dateno += 1;
  }
};

const curlist = computed(() => {
  const list = [];
  const date = panel.curd;
  let curDate;
  if (date) {
    curDate = new Date(date);
  }
  if (isNaN(+curDate)) {
    console.error(`${date} is not a date.`);
    return list;
  }

  //  7 日 6 周
  const itemMax = 7 * 6;

  // 上一月份
  const prev = monthDates(curDate.getFullYear(), curDate.getMonth());
  datesList(list, itemMax, prev, -1);
  // 当前月
  const cur = monthDates(curDate.getFullYear(), curDate.getMonth() + 1);
  datesList(list, itemMax, cur);
  // 下一月份
  const next = monthDates(curDate.getFullYear(), curDate.getMonth() + 2);
  datesList(list, itemMax, next, 1);

  return list;
});
</script>

<template>
<section class="date-panel">
  <header>
    <button>&lt;&lt;</button>
    <button>&lt;</button>
    <button>{{ panel.curyear }} - {{ panel.curmonth }}</button>
    <button>&gt;</button>
    <button>&gt;&gt;</button>
  </header>
  <div class="panel-list">
    <div class="list-item">
      <p>Sun</p>
    </div>
    <div class="list-item">
      <p>Mon</p>
    </div>
    <div class="list-item">
      <p>Tue</p>
    </div>
    <div class="list-item">
      <p>Wed</p>
    </div>
    <div class="list-item">
      <p>Thurs</p>
    </div>
    <div class="list-item">
      <p>Fri</p>
    </div>
    <div class="list-item">
      <p>Sat</p>
    </div>
    <div class="list-item" v-for="(item, index) in curlist" :key="`panel-week-${index}`">
      <p>{{item.date}}</p>
    </div>
  </div>
</section>
</template>

<style scoped lang='less'>
@itemw: 50px;
.date-panel {
  width: @itemw * 7;
  line-height: @itemw * 0.6;
  text-align: center;
}
.panel-list {
  margin-top: @small;
  display: flex;
  flex-wrap: wrap;
  .list-item {
    width: @itemw;
  }
}
</style>
