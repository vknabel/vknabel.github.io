---
title: ChainArguments
kind: thought
tags: [swift, playground, cli]
playground: ChainArguments.playground
---

```swift
// Helpers
func chain<Element, A, B>(
    _ f: @escaping ([Element]) -> ([Element], A),
    _ g: @escaping ([Element]) -> ([Element], B)
    ) -> ([Element]) -> (A, B) {
    return { els in
        let (elAs, vA) = f(els)
        let (_, vB) = g(elAs)
        return (vA, vB)
    }
}

func chain<Element, A, B, C>(
    _ f: @escaping ([Element]) -> ([Element], A),
    _ g: @escaping ([Element]) -> ([Element], B),
    _ h: @escaping ([Element]) -> ([Element], C)
    ) -> ([Element]) -> (A, B, C) {
    return { els in
        let (elAs, vA) = f(els)
        let (elBs, vB) = g(elAs)
        let (_, vC) = h(elBs)
        return (vA, vB, vC)
    }
}

func chain<Element, A, B, C>(
    _ f: @escaping ([Element]) throws -> ([Element], A),
    _ g: @escaping ([Element]) throws -> ([Element], B),
    _ h: @escaping ([Element]) throws -> ([Element], C)
    ) -> ([Element]) throws -> (A, B, C) {
    return { els in
        let (elAs, vA) = try f(els)
        let (elBs, vB) = try g(elAs)
        let (_, vC) = try h(elBs)
        return (vA, vB, vC)
    }
}

func chain<Element, A, B, C, D>(
    _ f: @escaping ([Element]) throws -> ([Element], A),
    _ g: @escaping ([Element]) throws -> ([Element], B),
    _ h: @escaping ([Element]) throws -> ([Element], C),
    _ i: @escaping ([Element]) throws -> ([Element], D)
    ) -> ([Element]) throws -> (A, B, C, D) {
    return { els in
        let (elAs, vA) = try f(els)
        let (elBs, vB) = try g(elAs)
        let (elCs, vC) = try h(elBs)
        let (_, vD) = try i(elCs)
        return (vA, vB, vC, vD)
    }
}

prefix operator ??
prefix func ??<A>(_ value: A) -> (A?) -> A {
    return { $0 ?? value }
}

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

// Experiment
do {
    let (isVerbose, whoToGreet, language, _) = try with(["-v", "hi", "Je ne sais pas", "--language", "en"], chain(
        flag("verbose", "v"),
        positional("Name"),
        argument("language", "l"),
        exhaust
    ))
} catch {
    print("MÖÖP MÖÖP", error)
}

/*
with(Process(), concat(
    setWorkingDir("tmp"),
    passInterrupt(),
    setBashCommand("") // is { concat(setLaunchPath("/bin/bash"), setArguments(["-c", $0]) }
))*/


```