import Hook, { SyncHookTaps } from './Hook';
import StageList from './utils/StageList';
import Logger from './utils/Logger';

export type SyncHookCallBack<T extends any[], R> = (...args: T) => R


export type SyncHookTapOptions<T extends any[], R> = SyncHookTaps<T, R> & {
  name?: string,
}

export default class SyncHook<T extends any[], R> extends Hook<T> {

  taps: StageList<SyncHookTaps<T, R>>

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

  private _insert(options: SyncHookTapOptions<T, R>): void {
    options.stage = options.stage || 0;
    this.taps.stageInsert(options, (curV: SyncHookTaps<T, R>, newV: SyncHookTaps<T, R>) => {
      const curVStage = curV.stage || 0;
      const newVStage = newV.stage || 0;
      let before;
      if (newV.before && typeof newV.before === 'string') {
        before = [newV.before];
      } else {
        before = newV.before || [];
      }
      const inBefore = curV.name && before.indexOf(curV.name) > -1;
      return curVStage < newVStage && !inBefore;
    })
  }
}
