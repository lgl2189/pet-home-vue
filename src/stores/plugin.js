// 自动同步到 LocalStorage 的插件
export const piniaPluginLocalStorage = (options) => {
  return (context) => {
      const { store } = context;
      // 检查当前 store 是否在指定的 stores 列表中
      if (!options.stores ||!options.stores.includes(store.$id)) {
          return;
      }
      const storageKey = `pinia-${store.$id}`;

      // 从 localStorage 中恢复状态
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
          const parsedState = JSON.parse(savedState);
          const stateToPatch = {};
          options.keys.forEach((key) => {
              // 使用 Object.prototype.hasOwnProperty.call 替代直接调用
              if (Object.prototype.hasOwnProperty.call(parsedState, key)) {
                  stateToPatch[key] = parsedState[key];
              }
          });
          store.$patch(stateToPatch);
      }

      // 监听状态变化并保存到 localStorage
      const unwatch = store.$subscribe((mutation, state) => {
          const stateToSave = {};
          options.keys.forEach((key) => {
              // 使用 Object.prototype.hasOwnProperty.call 替代直接调用
              if (Object.prototype.hasOwnProperty.call(state, key)) {
                  stateToSave[key] = state[key];
              }
          });
          localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      }, { detached: true });

      // 当 store 被销毁时停止监听
      store.$onAction(({ after }) => {
          after(() => {
              if (store.$disposed) {
                  unwatch();
              }
          });
      });
  };
};