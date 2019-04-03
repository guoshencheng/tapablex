import Hook, { HookTap } from './Hook';
import { StageNode } from './utils/StageList';
import { Append } from './types';
// import Logger from './utils/Logger';
// import StageList from './utils/StageList';

export type AsyncCallBack<R> = (err: any, result: R | null) => void

export type TapCallBack<T extends any[], R> = (...args: T) => Promise<R>;

export default class AsyncHook<T extends any[], R = void> extends Hook<TapCallBack<T, R>> {

  protected $$type = 'SyncHook'
  
  callPromise(event: string, ...args: T): Promise<R[]> {
    const list = this.taps[event];
    if (list && list.first) {
      const results = [] as R[];
      const run = async (cur: StageNode<HookTap<TapCallBack<T, R>>>): Promise<R[]> => {
        const tap = cur.value;
        if (tap.event === event) {
          const r = await tap.fn(...args);
          results.push(r);
        }
        if (cur.next) {
          return await run(cur.next)
        } else {
          return results;
        }
      }
      return run(list.first);
    } else {
      return Promise.resolve([] as R[])
    }
  }

  callAsync(event: string, ...args: Append<T, AsyncCallBack<R[]>>): void {
    const realArgs = args.slice(0, -1) as T;
    const callback = args.slice(args.length - 1)[0] as AsyncCallBack<R[]>;
    if (callback && typeof callback === 'function') {
      this.callPromise(event, ...realArgs).then((results: R[]) => callback(null, results)).catch(err => callback(err, null))
    }
  }
}
