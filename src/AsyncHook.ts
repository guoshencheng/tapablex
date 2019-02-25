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

  callPromise(...args: T): Promise<any[]>;
  callPromise(...args: T): Promise<R[] | any[] | undefined> {
    return new Promise((resolve, reject) => {
      const _args = [...args, (err: any, info: R[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      }] as any;
      this.callAsync(_args);
    })
  }

  callAsync(...args: Append<T, HookCallBack<any[]>>): void;
  callAsync(...args: Append<T, HookCallBack<R[] | any[] | undefined>>): void{
    let cur = this.taps.first;
    const callback = args[args.length - 1];
    const result = [] as any[];
    const next = () => {
      const curTap = cur.value;
      curTap.fn(args.slice(0, args.length - 1), (err: any, info: R) => {
        if (err) {
          callback(err);
        } else {
          result.push(info);
          if (cur.next) {
            cur = cur.next;
            next();
          } else {
            callback(null, result);
          }
        }
      });
    }
    next();
  }
}