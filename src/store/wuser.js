// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia';
import { user } from '@/api/weibo';

export default defineStore('wuser', {
  state: () => ({
    users: [],
    loading: false,
  }),
  actions: {
    setUser(Id) {
      const list = this.users.filter((v) => v !== Id);
      list.push(Id);
      this.users = list;
    },
    async getUsers() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let users = await user({
        ids: true,
      });
      users = users.data || [];
      this.users = users;
      // console.log('users', users, this.users);
      this.loading = false;
    },
  },
});
