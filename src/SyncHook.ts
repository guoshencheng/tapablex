import Hook from './Hook';
import StageList from './utils/StageList';

export type SyncHookCallBack<T extends any[], R> = (...args: T) => R

export type SyncHookTaps<T extends any[], R> = {
  fn: SyncHookCallBack<T, R>,
  type: string,
  stage?: number,
  name?: string,
  before?: string | string[],
}

export type SyncHookTapOptions<T extends any[], R> = SyncHookTaps<T, R> & {
  type?: string,
}

export default class SyncHook<T extends any[], R> extends Hook<T> {

  taps: StageList<SyncHookTaps<T, R>>

  tap(type: string, options: SyncHookTapOptions<T, R>, fn: SyncHookCallBack<T, R>): void {
    this._insert({
      ...options,
      type,
      fn,
    })
  }

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
