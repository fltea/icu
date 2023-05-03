/* eslint-disable import/no-extraneous-dependencies */
import { createPinia } from 'pinia';
import useWuserStore from './wuser';

export default () => {
  const pinia = createPinia();

  useWuserStore(pinia);
  return pinia;
};
