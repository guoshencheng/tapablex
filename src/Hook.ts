import StageList from './utils/StageList';
import Logger from './utils/Logger';

export type HookTapOpions<HOOKCALLBACK> = {
  fn?: HOOKCALLBACK,
  stage?: number,
  before?: string[] | string,
  name?: string,
}

export type HookTap<HOOKCALLBACK> = HookTapOpions<HOOKCALLBACK> & {
  event: string,
  fn: HOOKCALLBACK,
}

export default class Hook<HOOKCALLBACK> {

  $$type = 'HookBase'

  taps: {
    [key: string]: StageList<HookTap<HOOKCALLBACK>>
  }

  callPromise(..._: any): Promise<any> {
    Logger.warn(`can't not call promise in ${this.$$type}`);
    return Promise.resolve();
  }

  call(..._: any): any {
    Logger.warn(`can't not call sync in ${this.$$type}`);
  }

  callAsync(..._: any) {
    Logger.warn(`can't not call async in ${this.$$type}`);
  }

  constructor() {
    this.taps = {}
  }
  // abstract tap(key: string, fn: (...args: T) => R): void;
  // abstract tapPromise(key: string, pfn: (...args: T) => Promise<R>): void;
  // abstract tapAsync(key: string, afn: (...args: Append<T, HookCallBack<R>>) => void): void;
  // abstract call(...args: T): R;
  // abstract callAsync(...args: Append<T, HookCallBack<R>>): void;
  // abstract promise(...args: T): Promise<R>

  protected tap(event: string, option: HookTapOpions<HOOKCALLBACK> | HOOKCALLBACK, fn?: HOOKCALLBACK) {
    let tap 
    if (typeof option === 'function') {
      tap = {
        fn: option,
        event,
      }
    } else {
      if (!fn) {
        return;
      }
      tap = {
        ...option,
        fn,
        event,
      }
    }
    this._insert(event, tap);
  }

  protected _insert(event: string, tap: HookTap<HOOKCALLBACK>): void {
    tap.stage = tap.stage || 0;
    if (!this.taps[event]) {
      this.taps[event] = new StageList<HookTap<HOOKCALLBACK>>();
    }
    this.taps[event].stageInsert(tap, SortTap as any)
  }
}

// type SortTapFunction<HOOKCALLBACK> = (curV: HookTap<HOOKCALLBACK>, newV: HookTap<HOOKCALLBACK>) => boolean;
export const SortTap = (curV: HookTap<any>, newV: HookTap<any>) => {
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
}
