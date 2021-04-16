/**
 * https://dev.to/mr_bertoli/rxjs-from-scratch-observables-hl6
 */

'use strict';

export class Observable {

  constructor(initFunc) {
    this.initFunc = initFunc;
  }

  subscribe(observer) {
    const subscription = new Subscription();
    const subscriber = new Subscriber(observer, subscription);  // <- passed by reference

    const teardown = this.initFunc(subscriber);
    // 3. add the teardown logic to the Subscription instance
    subscription.add(teardown);  // <- second function inside the subscription

    return subscription;
  }
}

// a container for functions
class Subscription {
  constructor() {
    this.teardowns = [];
  }
  add(teardown) {
    this.teardowns.push(teardown);
  }
  unsubscribe() {
    this.teardowns.forEach(teardown => teardown())
    this.teardowns = [];
  }
}


// a safe wrapper around observers
class Subscriber {
  constructor(observer, subscription) {
    this.observer = observer;
    this.closed = false;
    this.subscription = subscription;
    // 1. add an Observer completion logic to the Subscription container
    this.subscription.add(() => this.closed = true); // <- first function inside the subscription
  }
  next(value) {
    if (!this.closed) {
      this.observer.next(value);
    }
  }
  error(err) {
   if (!this.closed) {
      this.closed = true;
      this.observer.error(err);
      // 2. enable the Subscriber to call `unsubscribe` on completion
      this.subscription.unsubscribe();  // <- unsubscribe on error
    }
  }
  complete() {
    if (!this.closed) {
      this.closed = true;
      this.observer.complete();
      this.subscription.unsubscribe();  // <- unsubscribe on completion
    }
  }
}


