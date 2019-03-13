import SyncHook from '../src/SyncHook';

describe('sync hook call hook one by one', () => {
  it('hook can bi call successfully', () => {
    const hook = new SyncHook<any, void>();
    const value = 'RESULT';
    const value2 = 'RESULT2';
    const EVENT1 = 'EVENT1';
    const EVENT2 = 'EVENT2';
    hook.tap(EVENT1, (arg1: any) => {
      expect(arg1).toEqual(value);
    });
    hook.tap(EVENT2, (arg1: any, arg2: any) => {
      expect(arg1).toEqual(value);
      expect(arg2).toEqual(value2);
    });
    hook.call(EVENT1, value);
    hook.call(EVENT2, value, value2);
  })
});
