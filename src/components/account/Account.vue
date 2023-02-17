<script setup>
import { reactive, computed, watch } from 'vue';
import { add, modify } from '@/api/account';

const props = defineProps({
  show: Boolean,
  account: Object,
});
const emit = defineEmits(['update:show', 'success']);
const dialog = computed({
  get() {
    return props.show;
  },
  set(value) {
    return emit('update:show', value);
  },
});
const form = reactive({
  id: '',
  name: '',
  nickName: '',
  balance: '',
  pic: '',
  desc: '',
  platform: '',
  platformURL: '',
  paswd: '',
  phone: '',
  email: '',
  verify: '',
  IDCard: '',
  beginDate: '',
  endDate: '',
  remark: '',
});

watch(dialog, (val) => {
  if (val) {
    const item = props.account || {};
    Object.keys(form).forEach((v) => {
      form[v] = item[v] || '';
    });
  }
}, { immediate: true });
const hide = () => {
  dialog.value = false;
};

const save = () => {
  if (!(form.name && form.nickName)) {
    return;
  }

  delete form.beginDate;
  delete form.endDate;

  if (form.id) {
    modify(form).then((res) => {
      console.log(res);
      emit('success');
      hide();
    });
  } else {
    add(form).then((res) => {
      console.log(res);
      emit('success');
      hide();
    });
  }
};
</script>

<template>
<com-dialog :show="dialog">
  <section class="noveler-dialog">
    <header>
      <p>ACCOUNT</p>
    </header>
    <main>
      <label>
        <span class="label-title">name: </span>
        <input type="text" v-model="form.name" />
      </label>
      <label>
        <span class="label-title">nickName:  </span>
        <input type="text" v-model="form.nickName" />
      </label>
      <label>
        <span class="label-title">balance:  </span>
        <input type="text" v-model="form.balance" />
      </label>
      <label>
        <span class="label-title">pic:  </span>
        <input type="text" v-model="form.pic" />
      </label>
      <label>
        <span class="label-title">desc:  </span>
        <input type="text" v-model="form.desc" />
      </label>
      <label>
        <span class="label-title">platform:  </span>
        <input type="text" v-model="form.platform" />
      </label>
      <label>
        <span class="label-title">platformURL:  </span>
        <input type="text" v-model="form.platformURL" />
      </label>
      <label>
        <span class="label-title">paswd:  </span>
        <input type="text" v-model="form.paswd" />
      </label>
      <label>
        <span class="label-title">phone:  </span>
        <input type="text" v-model="form.phone" />
      </label>
      <label>
        <span class="label-title">email:  </span>
        <input type="text" v-model="form.email" />
      </label>
      <label>
        <span class="label-title">verify:  </span>
        <input type="text" v-model="form.verify" />
      </label>
      <label>
        <span class="label-title">IDCard:  </span>
        <input type="text" v-model="form.IDCard" />
      </label>
      <label>
        <span class="label-title">beginDate:  </span>
        <input type="text" v-model="form.beginDate" />
      </label>
      <label>
        <span class="label-title">endDate:  </span>
        <input type="text" v-model="form.endDate" />
      </label>
      <label>
        <span class="label-title">remark:  </span>
        <textarea v-model="form.remark"></textarea>
      </label>
    </main>
    <footer>
      <button @click="hide">取消</button>
      <button @click="save">保存</button>
    </footer>
  </section>
</com-dialog>
</template>

<style lang='less' scoped>
.noveler-dialog {
  margin: 0 auto;
  padding: 12px;
  label {
    margin-top: 12px;
    display: block;
    .label-title {
      margin-right: 8px;
      display: inline-block;
      width: 125px;
      text-align: right;
    }
    input,
    textarea {
      width: 400px;
    }
    textarea {
      height: 50px;
      resize: none;
      vertical-align:middle;
    }
  }
  header {
    padding: 6px;
  }
  footer {
    margin-top: 12px;
    padding: 6px;
    text-align: center;
  }
}
</style>
