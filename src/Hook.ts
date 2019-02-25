import StageList from './utils/StageList';

export type Measure<T extends number> = T extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 ? T : never;
export type Append<T extends any[], U> = {
  0: [U];
  1: [T[0], U];
  2: [T[0], T[1], U];
  3: [T[0], T[1], T[2], U];
  4: [T[0], T[1], T[2], T[3], U];
  5: [T[0], T[1], T[2], T[3], T[4], U];
  6: [T[0], T[1], T[2], T[3], T[4], T[5], U];
  7: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], U];
  8: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], U];
}[Measure<T['length']>];

export type HookCallBack<T> = (err: any, info: T) => any;

export type FixSizeArray<L extends number, T> = Array<T> & {
  0: T,
  length: L
};

export type ArgumentNames<T extends any[]> = FixSizeArray<T['length'], string>;


export type HookTap<H> = {
  fn: H,
  stage?: number,
  name: string,
  before?: string | string[],
}

export type TapOptionAble<O> = O & {
  name?: string
}

export default class Hook<H> {

  taps: StageList<TapOptionAble<HookTap<H>>>

  constructor() {
    this.taps = new StageList<any>();
  }
  // abstract tap(key: string, fn: (...args: T) => R): void;
  // abstract tapPromise(key: string, pfn: (...args: T) => Promise<R>): void;
  // abstract tapAsync(key: string, afn: (...args: Append<T, HookCallBack<R>>) => void): void;
  // abstract call(...args: T): R;
  // abstract callAsync(...args: Append<T, HookCallBack<R>>): void;
  // abstract promise(...args: T): Promise<R>

  protected _insert(options: TapOptionAble<HookTap<H>>): void {
    options.stage = options.stage || 0;
    this.taps.stageInsert(options, (curV: HookTap<H>, newV: HookTap<H>) => {
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
