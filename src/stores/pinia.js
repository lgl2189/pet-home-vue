import { createPinia } from "pinia";
import { piniaPluginLocalStorage } from "./plugin";

export const pinia = createPinia()

const piniaPluginLocalStorageOptions = {
  stores: ['user'], // 替换为你实际需要同步的 store 的 id
  keys: ['token'] // 替换为你实际需要存储的键名
};

pinia.use(piniaPluginLocalStorage(piniaPluginLocalStorageOptions))