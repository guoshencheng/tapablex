import StageList from './utils/StageList';
import { SortTap } from './Hook';

// import StageList from './utils/StageList';
// import Logger from './utils/Logger';

export type TapCallBack<T extends any[], R> = (...args: T) => R;

export type SyncHookTapOpions<T extends any[], R> = {
  fn?: TapCallBack<T, R>
}

export type SyncHookTap<T extends any[], R> = SyncHookTapOpions<T, R> & {
  event: string,
  fn: TapCallBack<T, R>,
  name?: string,
}

export default class SyncHook<T extends any[], R> {

  taps: {
    [key: string]: StageList<SyncHookTap<T, R>>
  }

  tap(event: string, option: SyncHookTap<T, R> | TapCallBack<T, R>, fn?: TapCallBack<T, R>) {
    if (!this.taps[event]) {
      this.taps[event] = new StageList<SyncHookTap<T, R>>();
    }
    let tap 
    if (typeof option === 'function') {
      tap = {
        fn: option,
        event,
      }
    } else {
      tap = {
        ...option,
        event,
      }
    }
    this.taps[event].stageInsert(tap, SortTap as any)
  }

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
