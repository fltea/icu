/* eslint-disable import/no-extraneous-dependencies */
import { createPinia } from 'pinia';
import useWuerStore from './wuser';

export default () => {
  const pinia = createPinia();

  useWuerStore(pinia);

  return pinia;
};
