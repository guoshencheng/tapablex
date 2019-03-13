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
});
