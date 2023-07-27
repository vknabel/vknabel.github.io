---
title: Designing and scoping my programming language Lithia
date: 2022-07-22
tags: [lithia, compilers]
---

Once you have decided you want to create your own programming language, you need to create a broader concept. Every programming language is unique in its own way. Your goal is to find out in which way. And you need to find your reason _why_ you want to create it in the first place.

- Do you want to solve a particular problem?
- Is it for learning purposes?
- For who do you build the language?
- Who should use it?

Keep the answers in mind during the whole design process: they will guide you into the right direction.

In my case, I designed [Lithia](https://github.com/vknabel/lithia) for myself to learn and explore all sorts of tooling around programming and to create them myself. And that's also the focus of the language: tooling around itself. Learning by doing is king here.

_This blog post is part of a [Journey about creating a new programming language](/posts/journey-about-creating-a-new-programming-language/)._

## My initial take on designing Lithia

I really like functional programming, but I value being able to perform changes imperatively when I need to. I like the idea of lazy evaluation and being able to create infinite data structures, but to only execute needed parts. And the stronger your type system is, the more errors can be caught at compile time. Some downsides like verbosity can be reduced by type inference.

Writing functional algorithms really work well with enumerations where every case may have attributes or associated values. It should also be possible to add scoped methods to already declared classes or data types.

And generics are great, let‘s stuff generics in there. Great nice language. How long will I take to implement it? Well…, scrap that.

**Let‘s start all over.**

Every programming language special on its own way. To define each characteristic of it, you not only need to know the language features, but the intentionally missing ones, naming conventions, typical patterns, the standard library and how everything is tied together.

That all defines the programming language. Everything is a tradeoff. For example, every piece of syntactic sugar makes your language more expressive, but harder to read. Every new feature needs to be learned and understood correctly. And every feature may be used in the wrong places or not at all.

## What language is worth to implement?

Let‘s be honest: programming languages tend to be on the bigger side of projects and we all have limited time, energy and motivation. And there are plenty of programming languages out there.

Where does your language fit between all those other already finished languages? Are you solving niche problems? Are you experimenting with new language concepts or are you mixing seemingly unrelated paradigms? And more importantly: why do **you** want to implement it yourself? Are you able to even finish it? How do you keep your motivation up in the long term?

If you decided to start working on a compiler or interpreter, be sure to be able to finish it and expect you will be the only one using it.

So what‘s my case? Lithia does not solve a particular problem, but it enables me to learn about the inner workings of compilers, interpreters and the tooling around it. I want a green field to build all kinds of tooling. And in case there is a limitation or bug, I can fix or embrace and document it. What can be achieved in a specific field is not limited by external factors, only by my time, energy and motivation.

## It’s about the scope and milestones

We know, the planned Lithia is not going to be able to compete with whole language ecosystems or programming languages that shine through lots of features. I wouldn’t be able to finish it.

Instead, the scope must be reduced. Even more as the language should be accompanied by tooling, coming with a huge scope increase!

But great tooling requires meta data like types to operate on and the compiler needs to support all that.

There need to be compromises.

And I need continuous wins to keep my motivation high. Once there is a basic implementation, I want to do some simple stuff, while working on a complex subsystem.

Lithia needs to shine through the absence of many features. Instead it should focus on few key concepts, that support requirements for tooling. And after all, it should be a language I like to program in.

To sum up, Lithia…

- is a simple language with only a few features
- supports tooling
- allows a few quick wins
- is conceptually attracting

## Lithia is an experiment

I personally prefer mostly functional programming languages with a shot of imperative programming. In that context I also favour lazy over strict evaluation and love currying.

> **Lazy vs strict evaluation:** expressions will only be evaluated if their value is actually needed in lazy evaluation. With strict evaluation they will always be evaluated.

> **Currying**: let’s imagine you have a function with two parameters, but you currently have just the first parameter. With currying you can pass just the first one and you will receive a function that accepts the second parameter. Without currying you‘d need to manually create that function.

Lithia won’t allow direct mutations of variables. There will only be constants. I didn’t want to explicitly forbid any mutations, but at this stage I didn’t know how they fit into the language, yet.

> **Why?** lazy evaluation and directly mutating variables might lead to weird behaviour. And what about types of a variable? May they change at any time?

The type system should be easy to bootstrap, but should enable static analysis in the future.

That’s my baseline.

### Type System

Variables, parameters and functions won't have an explicit type annotation like Java's `String name`, Swift's `let name: String` or Go's `var name string`. If there would be type annotations, Lithia would need to enforce them right from the beginning.

Instead Lithia should have an easy to bootstrap dynamic type system, that still enables static analysis. The easiest way is not to allow structural manipulation of types.

How far can we get with type inference?

### Base Types

There are two basic kinds of types to support:

- types like classes and structs with independent properties.
- types like enums that list all possible values. In some languages enums may have associated properties, thus mixing sum and product types.

Another aspect are reference and value types and semantics. How should changes propagate through the different parts of your program?

In Lithia there will be one type with properties called _data_ without any inheritance or methods like classes have. They will have a list of untyped properties.

> Don't worry if upcoming code snippets look unfamiliar – we will cover the syntax in another article.

```
data Example {
  firstProperty
  secondProperty
}
```

But here is an optimisation for tooling: if you want to store a function within your _data_, you can add all its parameters `firstProperty param, and, more`. When the tooling and the compiler mature, they can detect errors and improve autocompletion.

In Lithia, the _enum_ type breaks with common interpretations. Here an _enum_ isn’t a direct list of possible values, but a list of possible types, called a union.

This change from individual values to more generic types should make the currently rather static language feel more dynamic and like a scripting language for lovers of strong typing.

### The type switch

Now that we have enums, we need to resolve those types. A type switch maps every type to a function. It requires the enum definition and returns a function that receives the value.

```
let increaseOptional = type Optional {
  Some: { some => some.value + 1 },
  None: { none => none }
}
increaseOptional (Some 1)
increaseOptional None
```

The goal is to provide functions to work on the enums within one module, that are reusable and higher level. This should reduce the amount of external type switches.

### Standard Library

The stdlib is a great place to get quick wins from once the most basic implementation of the language has been finished.

In Lithia the interpreter’s responsibility ends early. It defines Strings, Characters, numeric types, Functions and some more basic types.

The Standard Library called _prelude_ starts with famous types like Boolean and List.

In here there are many possibilities:

- Testing
- Docs generation
- Sorting
- All kinds of basic data manipulations
- And much, much more!

### What didn’t make it to Lithia

The list of all features that did not find any place in Lithia is longer than what did. All have their particular reasons and their absence fit into the concept of Lithia. Here are some honorable mentions:

- Interfaces / protocols
- Extensions / adding new methods to existing types
- Methods
- Type casts and direct type testing
- Custom operators
- Overloading
- Variational arguments
- Exceptions

## Summary

In this post, I summarised my take on creating your own programming language. Don’t do it for glory, do it for yourself and the experience you gain.

Design your scope and concept. Make sure you stay motivated until the end. Don’t hesitate to reevaluate your decisions. Take tiny steps.

If you wish, check out the open source repository of [Lithia](https://github.com/vknabel/lithia). If you have any questions don't hesitate to ask me on [@mastodon.social@vknabel](https://mastodon.social/@vknabel) or join the [Lithia discussions](https://github.com/vknabel/lithia/discussions).

Happy coding!
