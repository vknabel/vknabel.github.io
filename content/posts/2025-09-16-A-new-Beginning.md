---
title: "Zirric: A new Beginning"
date: 2025-09-16
tags: [lithia, zirric, compilers, golang, devlog]
images:
  - /images/2025-09-16-A-new-Beginning/cover.png
---

After a long time of procrastination I finally resumed my work on my new programming language. [Back then](/posts/the-current-state-of-lithia-after-2-years/) I wrote about the current state of [Lithia](https://github.com/vknabel/lithia) and how I arrived in a dead end regarding the language design. Sure I proposed some large changes, but if a lazy evaluated programming language with a parensless call syntax becomes a strict evaluated programming language with a regular call syntax and multiple additional features, is it still the same ~~boat~~... language?

Literally every line of code would break. That's why I decided to create a new, currently private, repository for my new programming language called **zirric**.

_This blog post is part of a [Journey about creating a new programming language](/posts/journey-about-creating-a-new-programming-language/)._

## What will zirric be like?

Similarly to Lithia, zirric will still be simple, but it will still be much more feature rich than Lithia.

First to get the boring stuff out of the way:

- zirric will be dynamically but strongly typed as Lithia is.
- zirric will be strict evaluated while Lithia is lazy evaluated.
- The call syntax might now look slightly familiar as `f(a, b)` instead of `f a, b`.

### Annotations

Regarding the type system zirric adds the new `annotation` types to Lithia's `data` and `enum` types.
An `annotation` is declared like a `data` type, but can be instantiated with an `@` before declarations.

```zirric
annotation Countable {
  @Returns(Int)
  length(@Has(Countable) value)
}

@Countable({ v -> v.length })
data Bag {
    @Array items
}
```

In contrast to decorators in other languages, annotations only store data. They cannot change the behavior of functions or types.
To use annotations, a new reflection API will be provided.

```zirric
import reflect

@Returns(Int)
func count(@Has(Countable) value) {
  return reflect.typeOf(value).annotation(Countable).length(value)
}
```

The effectively replaces the old but common [witness pattern in Lithia](https://github.com/vknabel/lithia?tab=readme-ov-file#why-no-interfaces) with a more flexible and powerful system without introducing other new concepts like interfaces.

As you might have noticed, the new annotations *can* but don't have to be used to provide type hints. In the long term these should be checked by the compiler and fuel the language server to provide better IDE support.

### Control Flow

In Lithia there were no control flow constructs like `if` statements or `for` loops except the `type` expression. Instead everything was expressed via functions and recursion. This was slow and cumbersome.

zirric now comes with classic `if` and `switch` statements as well as `for` loops.
`if` statements will support multiple branches and `else if` as well as inline variable declarations.

```zirric
if condition {
  doSomething()
} else if otherCondition {
  doSomethingElse()
} else {
  defaultCase()
}
```

`switch` statements will support type matching as well as value matching.

```zirric
switch value {
case @SomeType:
  doSomething(value)
case 42:
  doSomethingElse()
case _:
  defaultCase()
}
```

`for` loops will support iterating over ranges, arrays, maps and custom iterators and infinite loops with `for { }`.

```zirric
for {
  if condition {
    break
  }
}

for i in Range(0, 10) {
  println(i)
}
```

In contrast to other languages, there will also be `if`, `switch` and `for` expressions that can be used inline to assign values. In there only variable declarations and one expression per branch are allowed.

```zirric
let filtered = for num -> items {
  if num % 13 == 0 {
    break
  } else if num % 2 == 0 && num % 3 == 0 {
    "fizzbuzz"
  } else if num % 2 == 0 {
    "fizz"
  } else if num % 3 == 0 {
    "buzz"
  } else {
    continue
  }
}
```

### A few more things

zirric will come with a working package manager out of the box, it will have a new design and mascot (you might have noticed) and in the long term the language server and tooling will be much better and more accurate than Lithia's.

A much better performance is also a goal, but don't expect miracles here. Lithia was just really slow.

More on all of that later.

## What is the current state?

As of now, zirric is still in a very early stage. zirric can parse lots of the syntax although large parts are still missing. Though the execution side is still in its infancy and only supports a few basic mathematical operations, arrays, bools, and `if` statements and expressions. Variables and functions will be the next big step.

At the tooling side, the core of the package manager is already present.

I guess I have quite a long way to go, but I am excited to finally work on a new programming language again. If you want to follow along or want a quick chat, feel free to reach out to me [@mastodon.social@vknabel](https://mastodon.social/@vknabel).
