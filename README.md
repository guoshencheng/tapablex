# tapablex

> inspired by [webpack tapable](https://github.com/webpack/tapable) and re-implement it, just a observer mode support async notification and work on

### SyncHook

run sync hook one by one and return all values when all of them finished

### SyncBailHook

run sync hooks one by one. break when any hook function return a value which is not null

### AsyncHook

run async hook one by one and return all value when all of them finished with a callback or Promise


