<script setup>
import { computed, reactive, watch } from 'vue';

const props = defineProps({
  tab: Boolean,
  modelValue: String,
});
const emit = defineEmits(['selected']);
const panel = reactive({
  curyear: null,
  curmonth: null,
  curd: null,
  list: [],
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
  const { total, day, year, month, date = -1 } = item;
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
      cur: type === 0,
      curd: dateno === +date,
    });
    dateno += 1;
  }
};

const tabindex = computed(() => +props.tab - 1);
const curlist = computed(() => {
  const list = [];
  let date = panel.curd;
  let curDate;
  if (date) {
    curDate = new Date(date);
  } else {
    curDate = new Date();
  }
  if (isNaN(+curDate)) {
    console.error(`${date} is not a date.`);
    return list;
  }

  //  7 日 6 周
  const itemMax = 7 * 6;
  date = curDate.getDate();

  // 上一月份
  const prev = monthDates(curDate.getFullYear(), curDate.getMonth());
  datesList(list, itemMax, prev, -1);
  // 当前月
  const cur = monthDates(curDate.getFullYear(), curDate.getMonth() + 1);
  cur.date = date;
  datesList(list, itemMax, cur);
  // 下一月份
  const next = monthDates(curDate.getFullYear(), curDate.getMonth() + 2);
  datesList(list, itemMax, next, 1);

  return list;
});

const selectItem = (item) => {
  console.log(item);
  const value = new Date(item.year, item.month - 1, item.date);
  panel.curd = value;
  emit('selected', value);
};

const turnTo = () => {};
const prevYear = () => {
  panel.curyear -= 1;
  turnTo();
};
const prevMonth = () => {
  panel.curmonth -= 1;
  turnTo();
};
const nextMonth = () => {
  panel.curmonth += 1;
  turnTo();
};
const nextYear = () => {
  panel.curyear += 1;
  turnTo();
};

watch(() => props.modelValue, (val) => {
  panel.curd = val;
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
    <div class="list-item date-item" v-for="(item, index) in curlist" :key="`panel-week-${index}`" :class="{'cur-date': item.curd, 'cur-list': item.cur}" @click="selectItem(item)" :tabindex="tabindex">
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
  .cur-date {
    color: #fff;
    &::before {
      content: '';
      background: @bgp;
    }
  }
}
</style>
