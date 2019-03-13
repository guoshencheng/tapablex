import Hook from './Hook';

export type TapCallBack<T extends any[], R> = (...args: T) => R;
export default class SyncHook<T extends any[], R = void> extends Hook<TapCallBack<T, R>> {

  protected $$type = 'SyncHook'

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
