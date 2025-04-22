"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = exports.Observer = void 0;
var Observer = /** @class */ (function () {
    function Observer(onNext, onError, onComplete) {
        this.onNext = onNext;
        this.onError = onError;
        this.onComplete = onComplete;
    }
    Observer.prototype.next = function (value) {
        this.onNext(value);
    };
    Observer.prototype.error = function (error) {
        if (this.onError) {
            this.onError(error);
        }
    };
    Observer.prototype.complete = function () {
        if (this.onComplete) {
            this.onComplete();
        }
    };
    return Observer;
}());
exports.Observer = Observer;
var Observable = /** @class */ (function () {
    function Observable(init) {
        this.init = init;
        this.observers = [];
        this.isFirstSubscription = true;
    }
    Observable.prototype.subscribe = function (onNext, onError, onComplete) {
        var _this = this;
        var observer = new Observer(onNext, onError, onComplete);
        this.observers.push(observer);
        // Initialize the observer with initial values or events
        this.init(observer);
        if (this.isFirstSubscription) {
            this.isFirstSubscription = false;
            this.onFirstSubscription();
        }
        return {
            unsubscribe: function () {
                var index = _this.observers.indexOf(observer);
                if (index !== -1) {
                    _this.observers.splice(index, 1);
                }
            },
        };
    };
    Observable.prototype.next = function (value) {
        this.observers.forEach(function (observer) {
            observer.next(value);
        });
    };
    Observable.prototype.complete = function () {
        this.observers.forEach(function (observer) {
            observer.complete();
        });
    };
    Observable.prototype.onFirstSubscription = function () { };
    Observable.prototype.setOnFirstSubscription = function (onFirstSubscription) {
        this.onFirstSubscription = onFirstSubscription;
    };
    return Observable;
}());
exports.Observable = Observable;
// Usage
// const observable = new Observable<string>((observer) => {
//     observer.next('Hello')
//     observer.next('World')
//     setTimeout(() => observer.next('Delayed message'), 2000)
//     observer.complete()
// })
// const subscription1 = observable.subscribe(
//     (value) => console.log(`Observer 1: ${value}`),
//     (error) => console.error(`Observer 1 Error: ${error}`),
//     () => console.log('Observer 1 completed')
// )
// const subscription2 = observable.subscribe(
//     (value) => console.log(`Observer 2: ${value}`),
//     (error) => console.error(`Observer 2 Error: ${error}`),
//     () => console.log('Observer 2 completed')
// )
// setTimeout(() => {
//     subscription1.unsubscribe()
//     subscription2.unsubscribe()
// }, 3000)
//# sourceMappingURL=observable.js.map