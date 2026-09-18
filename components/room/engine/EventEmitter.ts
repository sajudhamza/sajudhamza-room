type Handler = (...args: any[]) => void;

export default class EventEmitter {
  private handlers = new Map<string, Set<Handler>>();

  on(name: string, fn: Handler) {
    if (!this.handlers.has(name)) this.handlers.set(name, new Set());
    this.handlers.get(name)!.add(fn);
    return () => this.off(name, fn);
  }

  off(name: string, fn: Handler) {
    this.handlers.get(name)?.delete(fn);
  }

  emit(name: string, ...args: any[]) {
    this.handlers.get(name)?.forEach((fn) => fn(...args));
  }

  clear() {
    this.handlers.clear();
  }
}
