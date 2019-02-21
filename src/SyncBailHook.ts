import SyncHook from './SyncHook';

export default class SyncBailHook<T extends any[], R> extends SyncHook<T, R> {
  call(...args: T): R | undefined {
    let r;
    this.taps.foreach((value) => {
      const { fn } = value;
      r = fn(...args);
      if (r) {
        return true;
      }
    });
    return r;
  }
}
