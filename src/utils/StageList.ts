
export class StageNode<T> {
  next?: StageNode<T>
  pre?: StageNode<T>
  value: T
  constructor(value: T) {
    this.value = value;
  }
  add(node: StageNode<T>): StageNode<T> {
    const next = this.next;
    this.next = node;
    this.next.pre = this;
    this.next.next = next;
    return node;
  }

  insert(node: StageNode<T>): StageNode<T> {
    const pre = this.pre;
    this.pre = node;
    this.pre.pre = pre;
    this.pre.next = this;
    return node;
  }

  stageInsert(node: StageNode<T>, sort?: StageSort<T>): StageNode<T> {
    if (!sort) {
      return this.insert(node);
    } else {
      if (sort(this.value, node.value)) {
        if (this.pre) {
          return this.pre.stageInsert(node, sort);
        } else {
          return this.insert(node);
        }
      } else {
        return this.insert(node);
      }
    }
  }

  stageAdd(node: StageNode<T>, sort?: StageSort<T>): StageNode<T> {
    if (!sort) {
      return this.add(node);
    } else {
      if (sort(this.value, node.value)) {
        if (this.next) {
          return this.next.stageAdd(node, sort);
        } else {
          return this.add(node);
        }
      } else {
        return this.insert(node);
      }
    }
  }
}

export type StageSort<T> = (curV: T, newV: T) => boolean

export type StageForeachCallback<T> = (value: T) => boolean | undefined | void;

export default class StageList<T> {

  first: StageNode<T>

  last: StageNode<T>

  init(value: T) {
    this.first = new StageNode<T>(value);
    this.last = this.first;
  }

  foreach(calback: StageForeachCallback<T>) {
    if (!this.first) return;
    let cur = this.first;
    function handle() {
      const needBreak = calback(cur.value);
      if (needBreak) {
        return;
      }
      if (cur.next) {
        cur = cur.next;
        handle();
      }
    }
    handle();
  }

  check(node: StageNode<T>) {
    if (!node.next) {
      this.last = node;
    }
    if (!node.pre) {
      this.first = node;
    }
  }

  stageInsert(value: T, sort?: StageSort<T>) {
    if (!this.first) {
      this.init(value);
    } else {
      const node = new StageNode<T>(value);
      if (!sort) {
        const first = this.first;
        first.insert(node);
      } else {
        this.last.stageInsert(node, sort);
      }
      this.check(node);
    }
  }

  stageAppend(value: T, sort?: StageSort<T>) {
    if (!this.first) {
      this.init(value);
    } else {
      const node = new StageNode<T>(value);
      if (!sort) {
        const last = this.last;
        last.add(node);
      } else {
        this.first.stageAdd(node, sort);
      }
      this.check(node);
    }
  }
}
