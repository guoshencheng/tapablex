import Hook from './Hook';

// import StageList from './utils/StageList';
// import Logger from './utils/Logger';

export type TapCallBack<T extends any[], R> = (...args: T) => R;
export default class SyncHook<T extends any[], R> extends Hook<TapCallBack<T, R>> {
  call(event: string, ...args: T): R[] {
    const list = this.taps[event];
    const result = [] as R[]
    if (list) {
      list.foreach((tap) => {
        const cur = tap.fn(...args);
        result.push(cur);
      })
    }
    return result;
  }
}
