// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia';
import { user } from '@/api/weibo';

export default defineStore('wuser', {
  state: () => ({
    USER: 'fltea-users',
    users: [],
  }),
  actions: {
    setUser(Id) {
      const list = this.users.filter((v) => v !== Id);
      list.push(Id);
      this.users = list;
      localStorage.getItem(this.USER, JSON.stringify(list));
    },
    async getUsers() {
      let users = localStorage.getItem(this.USER);
      if (users) {
        users = JSON.parse(users);
        if (!Array.isArray(users)) {
          users = users.list || [];
        }
      } else {
        users = await user({
          ids: true,
        });
        users = users.data || [];
      }
      // console.log('getUsers', users);
      this.users = users;
    },
  },
});
