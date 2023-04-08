<script setup>
import { computed, reactive, watch } from 'vue';

const props = defineProps({
  tab: Boolean,
  modelValue: String,
});
const emit = defineEmits(['selected']);
const panel = reactive({
  year: null,
  month: null,
  list: [],
});

// 获取某天信息
const dateInfos = (year, month) => {
  let ldate;
  if (year) {
    if (month) {
      ldate = new Date(year, month, 0);
    } else {
      ldate = new Date(year);
    }
  }

  if (isNaN(+ldate)) {
    console.error(`${year} ${month} is not a date.`);
    return {};
  }
  return {
    date: ldate.getDate(),
    // Sunday - Saturday : 0 - 6
    day: ldate.getDay(),
    year: ldate.getFullYear(),
    month: ldate.getMonth() + 1,
  };
};

let valuedate = {};
const nowdate = dateInfos(new Date());

const initPanel = () => {
  // console.log('initPanel', nowdate);
  panel.year = nowdate.year;
  panel.month = nowdate.month;
};
// 日期列表
const datesList = (list, max, item, type = 0) => {
  const { date, day, year, month } = item;
  const isPrev = type < 0;
  let now;
  let curd;
  if (!type) {
    panel.curyear = year;
    panel.curmonth = month;
    if (nowdate.year === year && nowdate.month === month) {
      now = nowdate.date;
    }
    if (valuedate.year === year && valuedate.month === month) {
      curd = valuedate.date;
    }
  }
  let dateno = isPrev ? date - day : 1;
  while (dateno <= date && list.length < max) {
    list.push({
      date: dateno,
      year,
      month,
      cur: type === 0,
      now: !curd && dateno === now,
      curd: dateno === curd,
    });
    dateno += 1;
  }
};

const tabindex = computed(() => +props.tab - 1);
const curlist = computed(() => {
  const list = [];
  const { year, month } = panel;
  // console.log('computed curlist', year, month);
  if (!year || !month) {
    return list;
  }

  //  7 日 6 周
  const itemMax = 7 * 6;

  // 上一月份
  const prev = dateInfos(year, month - 1);
  datesList(list, itemMax, prev, -1);
  // 当前月
  const cur = dateInfos(year, month);
  datesList(list, itemMax, cur);
  // 下一月份
  const next = dateInfos(year, month + 1);
  datesList(list, itemMax, next, 1);

  return list;
});

const selectItem = (item) => {
  // console.log('selectItem', item);
  const value = new Date(item.year, item.month - 1, item.date);
  emit('selected', value);
};

const prevYear = () => {
  panel.year -= 1;
};
const prevMonth = () => {
  panel.month -= 1;
};
const nextMonth = () => {
  panel.month += 1;
};
const nextYear = () => {
  panel.year += 1;
};

const resetCurd = () => {
  const items = curlist.value.filter((v) => v.cur);
  items.forEach((v) => {
    v.curd = v.date === valuedate.date;
  });
};

watch(() => props.modelValue, (val) => {
  // console.log('watch props.modelValue', val);
  valuedate = dateInfos(val);
  if (val) {
    const { year, month } = valuedate;
    // 判断年月
    if (year !== panel.year || month !== panel.month) {
      panel.year = year;
      panel.month = month;
    } else {
      resetCurd();
    }
  } else {
    if (!panel.year) {
      initPanel();
    }
    resetCurd();
  }
}, { immediate: true });
</script>

<template>
<section class="date-panel">
  <header class="panel-header">
    <button class="panel-button" :tabindex="tabindex" @click="prevYear">&lt;&lt;</button>
    <button class="panel-button" :tabindex="tabindex" @click="prevMonth">&lt;</button>
    <button class="panel-button" :tabindex="tabindex">{{ panel.curyear }} - {{ panel.curmonth }}</button>
    <button class="panel-button" :tabindex="tabindex" @click="nextMonth">&gt;</button>
    <button class="panel-button" :tabindex="tabindex" @click="nextYear">&gt;&gt;</button>
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
    <div class="list-item date-item" v-for="(item, index) in curlist" :key="`panel-week-${index}`" :class="{'now-date': item.now,'cur-date': item.curd, 'cur-list': item.cur}" @click="selectItem(item)" :tabindex="tabindex">
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
  .panel-button {
    min-width: 35px;
    background: none;
    border: none;
    color: @norColor;
    &:hover {
      color: @proColor;
      font-weight: bold;
    }
  }
}
.panel-header {
  display: flex;
  justify-content: space-between;
}
.panel-list {
  margin-top: @tiny;
  display: flex;
  flex-wrap: wrap;
  .list-item {
    width: @itemw;
  }
  .date-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: @itemw;
    cursor: pointer;
    &.cur-list {
      font-weight: bold;
    }
    &::before {
      position: absolute;
      top: 5%;
      left: 5%;
      z-index: -1;
      width: @itemw * 0.9;
      height: @itemw * 0.9;
      border-radius: 6px;
    }
    &:hover {
      color: #fff;
      &::before {
        content: '';
        background: @HoverColor;
      }
    }
  }
  .now-date {
    color: #fff;
    &::before {
      content: '';
      background: @bgp;
    }
  }
  .cur-date {
    color: #fff;
    &::before {
      content: '';
      background: @HoverColor;
    }
  }
}
</style>
