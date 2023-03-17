import { user } from '@/api/weibo';
import { formatDate } from './tools';

const USER = 'fltea-users';

export const setUsers = (list) => {
  const date = formatDate(new Date(), 'YYYY-mm-dd');
  const usersData = {
    date,
    list,
  };
  localStorage.setItem(USER, JSON.stringify(usersData));
};

export const loadUsers = () => new Promise((resolve, reject) => {
  const users = localStorage.getItem(USER);

  function loadData() {
    user({
      ids: true,
    }).then((res) => {
      // console.log(res);
      const list = res.data || [];
      setUsers(list);
      resolve(list);
    }).catch(reject);
  }
  if (users) {
    const usersData = JSON.parse(users);
    const date = formatDate(new Date(), 'YYYY-mm-dd');
    if (usersData.date === date) {
      resolve(usersData.list);
    } else {
      loadData();
    }
  } else {
    loadData();
  }
});
