---
title: 'ReactifSwift: async function composition'
kind: thought
date: 2019-10-15
tags: [swift, experiment, functional]
---

Async operators `debounce`, `throttle` or `delay` that functional reactive programming libraries as `RxSwift` and `ReactiveSwift` provide are super useful and expressive. Though their biggest benefit lays within composability.

This playground tries to achieve the same using plain functions with little help of a global scheduler for a greater testing experience. For better composability it relies on [Overture](https://github.com/pointfreeco/swift-overture) in version 0.2.0.

_Originally written at 2018-06-10_

## Example

```swift

var count = 0
let countChars = with({ count += $0 }, pipe(
    map(get(\String.count)),
    throttle(time: 100)
))

let time = TestingScheduler()
ReactifCurrent.scheduler = time
countChars("A")
time.tick(50)
countChars("B")
time.tick(100)
countChars("Abc")
count // 4

```

## Implementation

```swift
// import Overture
import Foundation

typealias Unary<A> = (A) -> Void

protocol Invalidatable {
    func invalidate()
}
extension Timer: Invalidatable {}

protocol Scheduler {
    func now() -> Date
    func delay(_ time: TimeInterval, _ f: @escaping () -> Void) -> Invalidatable
}

final class TestingScheduler: Scheduler {
    private var delayed: [FakeTimer] = []
    private var currentInterval: TimeInterval = 0

    init() {}

    private final class FakeTimer: Invalidatable {
        let date: Date
        var fire: (() -> Void)?

        init(date: Date, fire: @escaping () -> Void) {
            self.fire = fire
            self.date = date
        }

        var isValid: Bool {
            return fire != nil
        }

        func tick(_ now: Date) {
            if let fire = fire, now >= self.date {
                fire()
            }
        }

        func invalidate() {
            self.fire = nil
        }
    }

    func tick(_ interval: TimeInterval) {
        self.currentInterval += interval
        let currently = now()
        self.delayed.forEach { $0.tick(currently) }
        self.delayed = self.delayed.filter { $0.isValid }
    }

    func now() -> Date {
        return Date(timeIntervalSince1970: currentInterval)
    }

    func delay(_ interval: TimeInterval, _ f: @escaping () -> Void) -> Invalidatable {
        let timer = FakeTimer(date: now().addingTimeInterval(interval), fire: f)
        delayed.append(timer)
        return timer
    }
}

final class TimeScheduler: Scheduler {
    init() {}

    func now() -> Date {
        return Date()
    }

    func delay(_ interval: TimeInterval, _ f: @escaping () -> Void) -> Invalidatable {
        return Timer(timeInterval: interval, repeats: false) { _ in
            f()
        }
    }
}

struct ReactifRuntimeContext {
    var scheduler: Scheduler = TimeScheduler()
}

var ReactifCurrent = ReactifRuntimeContext()

struct Sink {
    typealias Completion = () -> Void
    let call: (@escaping (@escaping Completion) -> Void) -> Bool
    init(_ call: @escaping (@escaping (@escaping Completion) -> Void) -> Bool) {
        self.call = call
    }
}

extension Sink {
    static func lock(name: String? = nil) -> Sink {
        let lock = NSLock()
        lock.name = name
        return Sink { f in
            if lock.try() {
                f(lock.unlock)
                return true
            } else {
                return false
            }
        }
    }

    static func recursiveLock(name: String? = nil) -> Sink {
        let lock = NSRecursiveLock()
        lock.name = name
        return Sink { f in
            if lock.try() {
                f(lock.unlock)
                return true
            } else {
                return false
            }
        }
    }

    static func synchronous() -> Sink {
        return Sink { f in
            f({})
            return true
        }
    }
}

func filter(_ includes: @escaping () -> Bool) -> (Sink) -> Sink {
    return { (sink: Sink) in
        Sink { (f: @escaping Unary<Sink.Completion>) in
            includes() && sink.call(f)
        }
    }
}

func reschedule(_ transform: @escaping (@escaping Unary<Sink.Completion>, @escaping Sink.Completion) -> Void) -> (Sink) -> Sink {
    return { (sink: Sink) in
        Sink { (f: @escaping Unary<Sink.Completion>) in
            sink.call { complete in
                transform(f, complete)
            }
        }
    }
}

func delay(time: TimeInterval) -> (Sink) -> Sink {
    return reschedule { f, completion in
        ReactifCurrent.scheduler.delay(time) {
            f(completion)
        }
    }
}

func extend(time: TimeInterval) -> (Sink) -> Sink {
    return reschedule { f, completion in
        f {
            ReactifCurrent.scheduler.delay(time, completion)
        }
    }
}

func debounce(time: TimeInterval) -> (Sink) -> Sink {
    var currentAttempt: Invalidatable?
    return reschedule { f, completion in
        currentAttempt?.invalidate()
        currentAttempt = ReactifCurrent.scheduler.delay(time) {
            f(completion)
        }
    }
}

func throttle(time: TimeInterval) -> (Sink) -> Sink {
    var lastInvocation: Date?
    return filter {
        let now = ReactifCurrent.scheduler.now()
        defer { lastInvocation = now }
        if let lastInvocation = lastInvocation, now.timeIntervalSince(lastInvocation) < time {
            return false
        } else {
            return true
        }
    }
}

func schedule<A>(_ factory: @escaping @autoclosure () -> Sink) -> (@escaping Unary<A>) -> Unary<A> {
    return { f in
        let sink = factory()
        return { a in sink.call { f(a);$0() } }
    }
}

// TODO: throttle using time after completion instead of starting time
func throttle<A>(time: TimeInterval) -> (@escaping Unary<A>) -> Unary<A> {
    return schedule(with(.synchronous(), throttle(time: time)))
}

func exhaustA<A>(ending time: TimeInterval? = nil) -> (@escaping Unary<A>) -> Unary<A> {
    return schedule(with(.recursiveLock(), extend(time: 10)))
}
func exhaust<A>(ending time: TimeInterval? = nil) -> (@escaping Unary<A>) -> Unary<A> {
    return { f in
        var lock = NSLock()
        return { a in
            if lock.try() {
                f(a)
                if let time = time {
                    ReactifCurrent.scheduler.delay(time, lock.unlock)
                } else {
                    lock.unlock()
                }
            }
        }
    }
}

func map<A, B>(_ transform: @escaping (A) -> B) -> (@escaping Unary<B>) -> Unary<A> {
    return { f in pipe(transform, f) }
}

func filter<A>(_ include: @escaping (A) -> Bool) -> (@escaping Unary<A>) -> Unary<A> {
    return { f in
        return { a in
            if include(a) {
                f(a)
            }
        }
    }
}

func debounce<A>(time: TimeInterval) -> (@escaping Unary<A>) -> Unary<A> {
    return { f in
        var currentAttempt: Invalidatable?
        return { a in
            currentAttempt?.invalidate()
            currentAttempt = ReactifCurrent.scheduler.delay(time) {
                f(a)
            }
        }
    }
}

```

## Conclusion

I think this is a quite cool idea for 240 lines of code. If just a few functions are required and using a FRP library would be too much just for a few functions, this might be a lightweight, but valuable alternative.

Though as we now have `Combine` by Apple, this is more likely to be a niche idea.

_[download this playground](./playground.zip)_
