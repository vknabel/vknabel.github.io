---
title: ArgumentOverture
kind: thought
date: 2018-09-30
tags: [swift, experiment, cli]
---

A Swift Playground aiming to provide some functional helpers to parse arguments for command line tools. It uses [Overture](https://github.com/pointfreeco/swift-overture) and is build for high composability, flexibility and little impact on your project's freedom to evolve.

A central use case was [Archery](https://github.com/vknabel/archery)'s: only actually interpreted arguments shall be consumed. Any others shall be collected (`remaining`) or should prevent execution (`exhaust`), depending on the current command.

First of all an example usage.

```swift
// Experiment
do {
    let (isVerbose, whoToGreet, language, _) = try with(["-v", "hi", "Some string", "--language", "en"], chain(
        flag("verbose", "v"),
        positional("Name"),
        argument("language", "l"),
        exhaust
    ))
} catch {
    print("Command failed:", error)
}

```

The implementation of the micro-library itself.

```swift
// Errors
private func quoted(_ string: String) -> String {
    return "\"\(string)\""
}

public protocol StringConvertibleError: Error, CustomStringConvertible {}

public struct MissingArgumentError: StringConvertibleError {
    public let name: String?
    public var description: String {
        return with(name, pipe(
            map(quoted),
            map { "Missing argument \($0)" },
            ??"Missing argument"
        ))
    }
}

public struct NonExhaustiveArgumentsError: StringConvertibleError {
    public let remaining: [String]
    public var description: String {
        return "Unused arguments: \(remaining)"
    }
}

// Domain
private func isArgument(named name: String) -> (String) -> Bool {
    return { $0 == "-\(name)" || $0 == "--\(name)" }
}

private func isOneArgument(of names: [String]) -> (String) -> Bool {
    return { passed in
        names.lazy
        .map(isArgument(named:))
        .reduce(false, { $0 || $1(passed) })
    }
}

private func indexOfArguments(named names: [String]) -> ([String]) -> Array<String>.Index? {
    return { passed in
        passed.index(where: isOneArgument(of: names))
    }
}

public func flag(_ names: String...) -> ([String]) -> ([String], Bool) {
    return { arguments in
        if let index = arguments.index(where: isOneArgument(of: names)) {
            var result = arguments
            result.remove(at: index)
            return (result, true)
        } else {
            return (arguments, false)
        }
    }
}

public func positional(_ name: String? = nil) -> ([String]) throws -> ([String], String) {
    return { arguments in
        let index = arguments.index(where: { !$0.starts(with: "-")})
        if let index = index {
            var result = arguments
            result.remove(at: index)
            return (result, arguments[index])
        } else {
            throw  MissingArgumentError(name: name)
        }
    }
}

public func optional<A>(_ f: @escaping ([String]) throws -> ([String], A)) -> ([String]) throws -> ([String], A?) {
    return { arguments in
        do {
            let (remaining, parsed) = try f(arguments)
            return (remaining, .some(parsed))
        } catch is MissingArgumentError {
            return (arguments, nil)
        } catch {
            throw error
        }
    }
}

public func argument(_ names: String...) -> ([String]) throws ->  ([String], String) {
    return { arguments in
        if let flagIndex = indexOfArguments(named: names)(arguments), arguments.count >= flagIndex + 2 {
            let value = arguments[flagIndex + 1]
            var rest = arguments
            rest.remove(at: flagIndex + 1)
            rest.remove(at: flagIndex)
            return (rest, value)
        } else {
            throw MissingArgumentError(name: names.first)
        }
    }
}

public func exhaust(_ arguments: [String]) throws -> ([String], Void) {
    if arguments.isEmpty {
        return ([], ())
    } else {
        throw NonExhaustiveArgumentsError(remaining: arguments)
    }
}

public func remaining(_ arguments: [String]) -> ([String], [String]) {
    return ([], arguments)
}

```

## What's next?

The same concept could be applied to processes and especially handling interrupts:

```swift
with(Process(), concat(
    setWorkingDir("tmp"),
    passInterrupt(),
    setBashCommand("") // is { concat(setLaunchPath("/bin/bash"), setArguments(["-c", $0]) }
))
```

_[download this playground](./playground.zip)_
