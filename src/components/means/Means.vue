<script setup>
import { reactive, computed, watch } from 'vue';
import { meansAdd, meansMod } from '@/api/means';

const props = defineProps({
  show: Boolean,
  means: Object,
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
  code: '',
  organization: '',
  book: '',
  found: '',
  stock: '',
  beginDate: '',
  endDate: '',
  scale: '',
  price: '',
  inDate: '',
  outDate: '',
  rate: '',
  amount: '',
  content: '',
  remark: '',
});

watch(dialog, (val) => {
  if (val) {
    const item = props.means || {};
    Object.keys(form).forEach((v) => {
      form[v] = item[v] || '';
    });
  }
}, { immediate: true });

const hide = () => {
  dialog.value = false;
};
const save = () => {
  if (!form.name) {
    return;
  }
  const FN = form.id ? meansMod : meansAdd;
  FN(form).then((res) => {
    console.log(res);
    emit('success');
    hide();
  });
};
</script>

<template>
  <com-dialog v-model="dialog">
    <section class="form-dialog">
      <header>
        <p>MEANS</p>
      </header>
      <main>
        <label>
          <span class="label-title">name: </span>
          <input type="text" v-model="form.name" />
        </label>
        <label>
          <span class="label-title">code:  </span>
          <input type="text" v-model="form.code" />
        </label>
        <label>
          <span class="label-title">organization:  </span>
          <input type="text" v-model="form.organization" />
        </label>
        <label>
          <span class="label-title">book:  </span>
          <input type="text" v-model="form.book" />
        </label>
        <label>
          <span class="label-title">found:  </span>
          <input type="text" v-model="form.found" />
        </label>
        <label>
          <span class="label-title">stock:  </span>
          <input type="text" v-model="form.stock" />
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
          <span class="label-title">scale:  </span>
          <input type="text" v-model="form.scale" />
        </label>
        <label>
          <span class="label-title">price:  </span>
          <input type="text" v-model="form.price" />
        </label>
        <label>
          <span class="label-title">inDate:  </span>
          <input type="text" v-model="form.inDate" />
        </label>
        <label>
          <span class="label-title">outDate:  </span>
          <input type="text" v-model="form.outDate" />
        </label>
        <label>
          <span class="label-title">rate:  </span>
          <input type="text" v-model="form.rate" />
        </label>
        <label>
          <span class="label-title">amount:  </span>
          <input type="text" v-model="form.amount" />
        </label>
        <label>
          <span class="label-title">content:  </span>
          <textarea v-model="form.content"></textarea>
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

<style scoped lang='less'>
.form-dialog {
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
