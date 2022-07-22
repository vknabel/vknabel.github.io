---
title: "Thoughts on: Elegant Objects"
aliases: [/pages/Thoughts-on-Elegant-Objects/]
date: 2018-10-09
tags: [books, oop, functional]
---

Writing things down is part of my learning process. These thoughts came up while reading through Yegor Bugayenko’s book Elegant Objects about a more declarative and less procedural approach of object oriented programming.
This is more a personal document than a book review or summary and as I already knew some topics, I do not mention several chapters or details, I might explain concepts different than the original author and many examples from Java, Ruby or C++ cannot be applied to Swift as they would already solve the issue.

The book itself is split into three parts of the lifetime of an object: the birth or initialization, education, employment and retirement or deinitialization.

Elegant Objects teaches to **treat all objects as human beings** and that we should talk with them `[].isEmpty` instead of talking about them `[].count == 0`.

## Birth

- Objects are not bags of data, they are the data they represent
- Therefore objects are no algorithms
- Objects without data make no sense

### 1.1 Never use -er names

https://www.yegor256.com/2015/03/09/objects-end-with-er.html

- Names describing algorithms and behavior of the objects instead of their identity are no real OOP. Typical suffixes are `er` and `or` (exceptions: user, computer, etc):
  - Formatter (a format can apply itself, right?)
  - Converter (exchange rate? Metric system?)
  - Manager (repository)
  - Controller (this one is interesting. It holds the view, but how can we name it instead? In UIKit not practical?)
  - Helper (well, yes)
  - Validator (predicate)
  - Router (routing table?)
  - Dispatcher (queue would be too specific)
  - Observer (outside Swift: target, addressee, recipient? Similar: output pipe)
  - Listener (
  - Sorter
  - Encoder
  - Decoder
  - Observable (stream)
  - Probably all `able` names, too
  - Encodable, Decodable (quite generic and hard)
- Because of the focus on data: many initializers (5...10), a few queries (), as little mutations as possible (). Reasoning: makes it much easier to use
- This data centric approach reminds me of some functional code I‘ve seen before, which impressed me a lot.

### 1.2 Make one constructor primary

https://www.yegor256.com/2015/05/28/one-primary-constructor.html

- Have only one primary initializer and many convenience inits

### 1.3 Keep constructors code-free

https://www.yegor256.com/2015/05/07/ctors-must-be-code-free.html

- Code-free constructors: actually had performance impacts on this in Ionic! Swift‘s `lazy` helps a lot here! => this kind of performance impact should be explicit
- Rule of thumb: don‘t touch the arguments
- Suggestion: creation of many, small classes (like a class just for parsing an int out of a string) (reducing overhead with `Taggable` like solutions?)

## Education

- Keep objects small (this is a trend in Swift, right? `Taggable`)

### 2.1 Encapsulate as little as possible

- Rule of thumb: max 4 values per object, otherwise compose
- What about configuration files? Should their object representations be passed through the whole program or should they be split into more maintainable objects?
- Every data within an object is part of its identity (in general, yes, but what about database entries and their id? Of course `==` should be false if the id is the same, but the name is different)

### 2.2 Encapsulate something at the very least

https://www.yegor256.com/2014/12/15/how-much-your-objects-encapsulate.html

- Static methods are not pure OOP
- Objects without data are just static
- There is only one object encapsulating nothing: the universe (or in swift unit)
- Doesn‘t like `x * z`, but probably not completely applicable to Swift (it changes the way you think)

### 2.3 Always use interfaces

https://www.yegor256.com/2014/11/20/seven-virtues-of-good-object.html

- Every public method should have their representation within an interface.
- Do not use object instances directly
- I think this approach is right, especially easy when using unidirectional data flow architecture. It requires just a few interfaces, but the gains for testability are awesome. If we need to write too much interfaces, we probably picked the wrong abstraction or have too much coupling.
- Note: in Swift you can use a struct with values of functions instead of methods if it better fits your use case than protocols.

### 2.4 Choose method names carefully

https://www.yegor256.com/2018/08/22/builders-and-manipulators.html

- Rule of thumb: queries (builders) are nouns (with adjectives), mutations (manipulators) are verbs (with adverbs).
- Queries return
- Mutations mutate and return nothing
- Reduces side-effects
- If we need results from the mutation, we should create a new object, which decouples mutations and queries. Generally a good idea, but then you loose compiler safety, that the mutation should have been triggered before reading the results. Using callbacks would just hide the problem, as we would pass the result to the callback. Hence: the mutation would emit data. Exceptions from this would only be thins like `Observable<Void>` and `Promise<Void>`
- Booleans should not include `is` but should be readable with an `is` (prefer is `equal(to:)` over `equals(_:)`)

### 2.5 Don‘t use public constants

https://www.yegor256.com/2015/07/06/public-static-literals.html

- Do not use public constants (this includes global constants, singletons, static properties, ...)
- Constants should be private
- Instead wrap the constants into a class which _uses_ it as intended.
- Example: `CRLFString` which automatically appends `\r\n` to all strings on `toString`.
- Regarding enums: `HTTPMethod` are just constants, too! Instead favor distinct classes for `PostRequest`, `GetRequest`, ...
- In my eyes using enums with associated values is fine as they are much more advanced. E.g. `LocalizableString` with `case priceLabel(amount: Int, currency: String)` and `var localized: String { get }`.

### 2.6 Be Immutable

https://www.yegor256.com/2014/06/09/objects-should-be-immutable.html

- Of course immutability is important!

### 2.7 Write tests instead of documentation

- Tests are good docs; tests should be easy to read as the code should be

### 2.8 Don‘t mock; use fakes

https://www.yegor256.com/2014/09/23/built-in-fake-objects.html

- Mocking is fragile (internal knowledge needed)
- Fakes are more robust
- Fakes should provide as much customization as possible.
- It don’t think Fakes should necessarily be implemented next to the interfaces, but they are essential for unit tests and should always be shipped with libraries (either within module `LibraryTesting` or in prod code)
- I even think more libraries (including my own) should ship a basic set of unit tests that each implementation should pass. [Protocols are more than Bags of Syntax](https://oleb.net/blog/2016/12/protocols-have-semantics/).

### 2.9 Keep interfaces short; use smarts

https://www.yegor256.com/2016/04/26/why-inputstream-design-is-wrong.html

- As everything, interfaces should only do one thing
- Applying defaults and providing overloads are more than this one thing: multiple implementations would still need to apply the same defaults. What if the defaults would be different? In that case we would mix up to problems to one n-to-m problem.
- The proposed solution is the introduction of `Smart` classes. With an implementation given, it will provide all overloads, convenience functions and defaults. If the only connection to the outside world is an instance of the interface, it should be okay to keep the `Smart`-suffix. In Swift we do not need this helper at all: we can just move all overloads to an extension.

## Employment

### Expose fewer than five public methods

- Suggests 5 as max amount of public methods in one single class
- It‘s about cohesion: every method should access all instance variables. Otherwise you might break it up.
- I guess these smart classes and Stdlib classes don’t fit into this rule

### Don’t use static methods

https://www.yegor256.com/2014/05/05/oop-alternative-to-utility-classes.html

- Should never be used and are no OOP
- Treat OOP as declarative paradigm instead of a imperative one

### 3.2.5 Functional Programming

- Did not understand benefits of declarative OOP over functional programming. (FP is simpler because it has no methods)
- Is it possible to combine FP with dOOP? Especially in Swift: could we replace Monads by dOOP?
- Maybe dOOP for the big picture and FP for the small one?
- Composability over decorators (higher order objects)
- dOOP would be a perfect fit for a rule editor! Probably more approachable than FP due to the decorators. „I want an array X. It should be an array with unique elements.“

### 3.4 Be loyal and immutable, or constant

https://www.yegor256.com/2014/12/22/immutable-objects-not-dumb.html

- Loyal: always represents the same real-world entity (e.g. never change the file path or the user id)
- Immutable: object-state will not change
- Constant objects are immutable
- Non-constant but immutable: changes if real-world changes (e.g. after changing files or after manipulating memory)
- My example: a redux store is immutable but not constant as it does only change accordingly if it‘s represented real-world data changes (the application state). But it must be loyal and must always represent the same application. When diving deeper, there must be a `class` wrapper around the state-`struct`. This wrapper can apply mutations to the state, but it cannot replace it.

### 3.6 Don‘t use `new` outside of secondary ctors

- Required `init`s may never instantiate objects
- Funcs may never instantiate objects
- But still, not all initializers may be called within `convenience` inits (think of greater dependencies! A convenience init can still hard-code dependencies because of laziness)
- When needed create a helper function in convenience inits and store it
- => Unit tests will be much better

## Retirement

### 4.1.2 Alternatives to null

- Use `Optional` only for data, but not for errors

### 4.2.1 Don‘t catch unless you have to

- Fail early, catch late

### 4.2.3 Recover only once

### 4.2.4 Use aspect-oriented programming

- Using AOP is not required for this task! Simply create a higher-order function or an object decorator

### 4.3 Be either final or abstract

https://www.yegor256.com/2014/11/20/seven-virtues-of-good-object.html

- In Swift there are no `abstract` classes. Instead we have protocols with default implementations. This is a much better approach. As a result, all Swift classes should be final. Swift classes are implicitly final for external modules when not marked as open.

### 4.4 Use RAII

- Resource Acquisition Is Initialization
- Says to lock resources on init and release them on deinit
- In Swift this approach is already common: Subscription, Disposable, opaque objects for `NSNotificationCenter`

## Recap

I still don’t know what I am going to take away from this book as it particularly has strong opinions which do not align with mine. Yet, there are things I have experienced myself and got the same solution. What I found valuable are naming and the rules of thumb as I generally agree on them. Though as in most books, some sentences are too absolute:

- IMHO it’s okay to use return values for mutations: if the only way to get information when performing side-effects, it should better be explicit.
- Sometimes we do not use boolean queries directly within conditions. In those cases it might read far better if we still keep the `is` prefix. And: "is `containing`" sounds awful when compared to `contains`.
- The approach to make it explicit what you want to optimize your code for and how your code should look like is interesting. Of course this may sound philosophical or too meta, but it may help prioritizing.
- Regarding static methods and global variables: in general? Agreed. Though, I think the global `Current` as proposed by pointfree.co is worth it, as long as it is in-line with your goals and your business: execution-environment specific things should go into `Current` (JS: `window.open`). Things like sessions should preferably be implemented using classic DI (e.g. Tweetbot hay have multiple sessions).
- Functions have much less overhead than classes. The proposed declarative OOP snippets read mostly like FP on the usage side: you do not gain any benefits from the fact that objects have methods. On the declaration side, writing a class has a much bigger overhead when compared to a function. Though you gain the ability to replace the implementation when using protocols and polymorphism resulting in more verbosity. I think FP feels less like fighting against the language than declarative OOP would feel like.
- Of course all these techniques help to improve maintainability, but what‘s often left unsaid: you can also encapsulate dirty hacks that way. And what if we need to touch these parts again? Keep the tests, throw the code away and write everything from scratch, but in clean. If there is no code to maintain (deleted code is no code) and if we cannot break anything (we have tests for our dirty hack), we can easily maintain everything. In most cases these parts will only be written once. Though this approach requires being explicit about it.
