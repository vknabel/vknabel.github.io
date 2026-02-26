---
title: CommandMine
aliases: [/pages/CommandMine/]
date: 2017-03-08
tags: [swift, tooling]
---

Command mine is a concept of a swift library for parsing command line arguments. It is designed to support asynchronous implementations of CLIS, that may even be used inside frameworks.

## Definitions

CommandMine is about extracting minerals out of your ore.

```swift
let goldmine = Mine<Gold>() // declare your mine
 .drift( // One way to get to your gold
  named: "init",
  digging drift: Drift, // Prepares your Shaft
  to shaft: execute // your actual program
 )
```

### Shaft

A protocol describing factories of _Rails_.

### Mine

Your program. Is a Shaft.

### Drift

A special form of a Shaft, that parses raw ore (`[String]`) into minerals.

### Ore

The arguments passed to your program.

### Lore

An event wrapper around minerals.

### Mineral

The desired mineral of your mine.

### Rail

Transports your filled Lores.
A simple typealias for _Observables_ of _Lores_.

### Elevator

The fastest connection to the outside. A Rx wrapper around print and read line.

The idea behind the elevator is to make your CLI embeddable as library without any changes.

```swift
let ele = Elevator<String, String>()
ele.onNext(.error("")) //.success("")

Elevator.
```

## Reusability

CommandMine tries to keep your CLIs independent from STDIO and may be used asynchronously.

Additionally it is important to keep parts of your code reusable and replaceable: your CLI may evolve.

### Framework Support

When it comes to internal or higher level tooling, frameworks suite better than plain CLIs as it eliminates the need to deal with another binary in your path, that your users need to install and keep up to date. Instead it will be compiled within your own target.

In order to split your project into a framework and CLI, you just declare your mine and drifts in `YourMine`, everything else in `YourShaft` and in your executable's `main.swift` you just start your mine.

> _Hint:_ you can create this project layout with `mine init`.

```swift
import YourMine
yourMine.runMain()
```

So `YourShaft` will be good for everyone who either wants to provide a complete new CLI using your logic, or for non CLIs.
At first exporting your mine and drifts into `YourMine` seems awkward, but it may actually help others to embed your project as a subcommand (after all Mines are just complex Shafts) or to just reuse one drift.

## Summary

- `Mine`: your CLIs, tasks arguments
- `Drift`: parses arguments for Shaft, sync
- `Cage`: the options
- `Shaft`: a command, async
- `Elevator`: user feedback

A `Drift` is an `Observable` Factory that emits one single `Lore` or an error with its help.

```swift
import CommandMine

let main = Shaft(named: "rock", summary: "")
 .drift(named: "init", explainedBy: "Creates a new project") { (cage: EmptyLore) in
  return initObsi
 }

main.run { result in
 switch result {
 case .success(_), .usage(_, _), .error(_):
  break
 }
}

Shaft.name
Shaft.instructions
Shaft.drifts

enum MineResult<A> {
 case success(A)
 case usage(String?, String?)
 case error(Error) // thrown errors will be inserted
}
final class/struct Drift<Arguments, Result>: Drifty {
 let bindTo: (Arguments) -> Observable<MineEvent<Result>>
}

Drifty.map
Drifty.flatMap

final class/struct Shaft<A>: Drifty {
 let usage: (String?, String?)
 let rootDrift: Drifts<[String], A>
}
extension Shaft {
 init(named: String, instructions: String? = nil)
 func drift<Cage>(named: String, instructions: String? = nil, cage: Cage.Type = Cage.self, _: @escaping Drift<Cage, A>) -> Shaft<A>
}

extension Drift {
 static func positional(parameter: @escaping (String) -> Observable<A>) -> [String] -> Observable<MineResult<([String], A)>> {
  return { args in
   guard let arg = args.first else {
    return .of(.usage(nil, nil))
   }
   return Jfkf
  }
 }

 static func exhaustive()
 func optional()
}
```

## What's next?

An alternative concept for modeling CLIs in Swift is [ArgumentOverture](/pages/ArgumentOverture), which would have much less impact on the actual program.

This concept is probably too big and hard to adapt for the benefit it will provide. Though the name is quite nice. 😅
