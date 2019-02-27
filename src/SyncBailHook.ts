import Hook from './Hook';
import { TapCallBack } from './SyncHook';

export default class SyncBailHook<T extends any[], R> extends Hook<TapCallBack<T, R>> {

  $$type = 'SyncBailHook'

  call(event: string, ...args: T): R | undefined {
    const list = this.taps[event];
    let result;
    if (list) {
      list.foreach((tap) => {
        const cur = tap.fn(...args);
        if (cur) {
          result = cur;
          return true;
        }
      })
    }
    return result;
  }
}
