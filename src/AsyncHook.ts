import Hook, { Append, HookCallBack, HookTap } from './Hook';
import Logger from './utils/Logger';
import StageList from './utils/StageList';

export type AsyncHookCallBack<T extends any[], R> = (...args: Append<T, HookCallBack<R>>) => void

export type AsyncHookTaps<T extends any[], R> = HookTap<AsyncHookCallBack<T, R>> 

export type AsyncHookTapOptions<T extends any[], R> = AsyncHookTaps<T, R> & {
  name?: string,
}

export default class AsyncHook<T extends any[], R> extends Hook<T, AsyncHookCallBack<T, R>> {
  taps: StageList<AsyncHookTaps<T, R>>
  
  tap(name: string, fn: AsyncHookTaps<T, R>): void;
  tap(name: string, options:AsyncHookTapOptions<T, R>, fn: AsyncHookCallBack<T, R>): void;
  tap(name: string, options: AsyncHookTapOptions<T, R> | AsyncHookCallBack<T, R>, fn?: AsyncHookCallBack<T, R>): void {
    if (typeof options === 'function') {
      options = {
        fn: options,
        name,
      } as AsyncHookTapOptions<T, R>;
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
}