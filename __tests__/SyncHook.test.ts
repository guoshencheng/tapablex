import SyncHook from '../src/SyncHook';

describe('sync hook call hook one by one', () => {
  it('hook can bi call successfully', () => {
    const hook = new SyncHook(['a', 'b', 'c']);
  })
});
