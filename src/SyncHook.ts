import Hook, { HookTap } from './Hook';
import StageList from './utils/StageList';
import Logger from './utils/Logger';

export type SyncHookCallBack<T extends any[], R> = (...args: T) => R

export type SyncHookTap<T extends any[], R> = HookTap<SyncHookCallBack<T, R>>

export type SyncHookTapOptions<T extends any[], R> = SyncHookTap<T, R> & {
  name?: string,
}

export default class SyncHook<T extends any[], R> extends Hook<T, SyncHookCallBack<T, R>> {

  taps: StageList<SyncHookTap<T, R>>

  tap(name: string, fn: SyncHookCallBack<T, R>): void;
  tap(name: string, options: SyncHookTapOptions<T, R>, fn: SyncHookCallBack<T, R>): void;
  tap(name: string, options: SyncHookTapOptions<T, R> | SyncHookCallBack<T, R>, fn?: SyncHookCallBack<T, R>): void {
    if (typeof options === 'function') {
      options = {
        fn: options,
        name,
      } as SyncHookTapOptions<T, R>;
      this._insert(options)
    } else {
      if (fn) {
        this._insert({
          ...options, 
          name,
          fn,
        })
      } else {
        Logger.warn('the third argument should be a function');
      }
    }
  }

  call(...args: T): any;
  call(...args: T): R[] {
    const results = [] as R[];
    this.taps.foreach((value) => {
      const { fn } = value;
      results.push(fn(...args))
    })
    return results;
  }
}
