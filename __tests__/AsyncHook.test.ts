import AsyncHook from '../src/AsyncHook';

describe('async hook call hook one by one in async', () => {
  it('hook can be called async successfully', () => {
    const hook = new AsyncHook<any, string>();
    const EVENT1 = 'EVENT1';
    const EVENT2 = 'EVENT2';
    const RESULT1 = 'RESULT1';
    const RESULT2 = 'RESULT2';
    hook.tap(EVENT1, async () => {
      return RESULT1;
    })
    hook.tap(EVENT2, async () => {
      return RESULT2;
    })
    hook.callAsync(EVENT1, (_: any, r: string) => {
      expect(r).toEqual([RESULT1]);
    })
    hook.callAsync(EVENT2, (_: any, r: string) => {
      expect(r).toEqual([RESULT2]);
    })
  })

  it('hook can be call async successfully and one by one', () => {
    const hook = new AsyncHook<any, string>();
    const EVENT = 'EVENT';
    const RESULT1 = 'RESULT1';
    const RESULT2 = 'RESULT2';
    const RESULT3 = 'RESULT3';
    const sort = [] as string[]
    hook.tap(EVENT, async () => {
      sort.push('A')
      return RESULT1;
    })
    hook.tap(EVENT, async () => {
      sort.push('V')
      return RESULT2;
    })
    hook.tap(EVENT, async () => {
      sort.push('C')
      return RESULT3;
    })
    hook.callAsync(EVENT, (_: any, r: string[]) => {
      expect(sort).toEqual(['A', 'V', 'C']);
      expect(r).toEqual([RESULT1, RESULT2, RESULT3]);
    })
  })

  it('hook can be called promise successfully and one by one', () => {
    const hook = new AsyncHook<any, string>();
    const EVENT = 'EVENT';
    const RESULT1 = 'RESULT1';
    const RESULT2 = 'RESULT2';
    const RESULT3 = 'RESULT3';
    const sort = [] as string[]
    hook.tap(EVENT, async () => {
      sort.push('A')
      return RESULT1;
    })
    hook.tap(EVENT, async () => {
      sort.push('V')
      return RESULT2;
    })
    hook.tap(EVENT, async () => {
      sort.push('C')
      return RESULT3;
    })
    const run = async () => {
      const result = await hook.callPromise(EVENT)
      expect(result).toEqual([RESULT1, RESULT2, RESULT3]);
    }
    run();
  })
});
