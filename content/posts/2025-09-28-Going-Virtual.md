---
title: "Blushlog: Going Virtual"
date: 2025-09-28
tags: [lithia, blush, compilers, golang, devlog]
---

A few years ago while I started working on [Lithia](https://github.com/vknabel/Lithia), I decided to use whatever takes me to my goal. Getting finished was the primary focus. And I did.

With [Blush](https://github.com/vknabel/blush) I want to take less compromise and build a better language. Performance and portability aren't completely irrelevant anymore.

_This blog post is part of a [Journey about creating a new programming language](/posts/journey-about-creating-a-new-programming-language/)._

## The Tree Walker

For Lithia I chose to implement a tree walker interpreter. It is simple to implement and easy to understand. The downside is that it's slow.

Here the interpreter walks the abstract syntax tree (AST) and executes the program directly. This means that every time a function is called, the AST nodes for that function have to be traversed again.

In this approach every node in the AST has an `evaluate` method that takes the current context as a parameter. The context holds variable bindings and other state information.

Variables and constants were stored in a map. During every variable access, a lookup with the string name of the variable had to be performed. In case of a miss, a parent context had to be checked as well until the variable was found or the global context was reached.

```lithia
let a = "global"

func do { =>
  let b = "local"

  print a // lookup "a" in current context -> miss -> lookup "a" in parent context -> hit
  print b // lookup "b" in current context -> hit
}

do // looks up the function "do" and calls it
```

Additionally checking the type of a value wasn't trivial as well as the types had to be looked up by name as well.

Furthermore Lithia leverages lazy evaluation, which means that expressions are not evaluated until their value is needed. This adds additional overhead as every expression has to be wrapped in a thunk (a parameterless function).

And this makes the second problem of this clear: everything is hidden behind pointers and in general everything is kind of costly. Not necessarily in terms of complexity, its just slow like hashing strings multiple times per variable access, checking if everything has been evaluated and last but not least it can't be cached efficiently by the CPU.

## The Bytecode Interpreter

Blush takes a different approach to this. It defines a virtual machine (VM) that executes bytecode instructions. Blush's VM is stack based, which is comparable for a simple calculator or a deck of cards: each operation works on the topmost elements of the stack.

The bytecode itself is separated of all constants. Instead these are in a separate array or slice while the bytecode references them by index.
In case of the expression `40 + 2`, the constant `40` is at index `0` and `2` is at index `1`. The human readable bytecode to add these two numbers is then:

```
# 1 + 2
Cons 0 # Pushes the constant at index 0 (40) onto the stack
Cons 1 # Pushes the constant at index 1 (2) onto the stack
Add
# Result: 42
```

> The actual bytecode currently looks like this: `01 00 00 01 00 01 10`. Neat, huh?

The VM iterates over the bytecode instructions and executes them one by one.
Here `Cons` loads the constant with the fitting index onto the stack. `Add` pops the top two elements from the stack, adds them and pushes the result back onto the stack.
That way the stack of the VM grows and shrinks as needed.

When it comes to variables, the VM uses a different approach as well: each variable gets an index assigned at compile time. That way variable access is just a matter of looking up an index of a single array.

Now let's get back to our example from above:

```lithia
let a = "global" // globals[0] = constants[0]

func do() { // functions are constants: constants[1]
  let b = "local" // locals[0] = constants[2]

  print(a) // globals[0]
  print(b) // locals[0]
}

do() // constants[1]()
```

No more string lookups. No more parent contexts. Just direct index access.
And the best part of this: the CPU can cache this data much more efficiently.

What about laziness? Almost everything is now eagerly evaluated. Expressions are evaluated as soon as they are encountered.
Though there are a few exceptions like logical operators (`&&`, `||`) which skip their right hand side if the result is already determined by the left hand side. This is common and does not add much overhead.

But in Blush globals are still initialized lazily. More on this in a future blog post.

## Why that hassle?

Interpreters are much easier to implement and to understand. Is this actually worth it?

Glad you asked! I made some micro benchmarks for Lithia and Blush. In this case I wrote a simple recursive Fibonacci function in both languages and measured the time it takes to compute for several numbers.

> Microbenchmarks can be misleading and do not reflect real world performance. But as long as we keep all tests as similar as possible, we can get a rough idea of the performance difference.

Here is the Lithia version:

```lithia
func fib { n =>
    if (n < 2), n, (fib n - 1) + (fib n - 2)
}
```

Here is the Blush version:

```blush
func fib(n) {
	return if n < 2 {
		n
	} else {
		fib(n-1) + fib(n-2)				
	}
}
```

As both languages are implemented in Go, I used the builtin Go benchmarking for both to keep it as similar as possible.

And these are the results on my machine:

| Input | Repetitions | Lithia     | Repetitions   | Blush      | Factor     |
|-------|-------------|------------|---------------|------------|------------|
| 28    | 1           | 5,338 sec  | 1,000,000,000 | 0.1101 ns  | 4,848,486  |
| 30    | 1           | 13,990 sec | 1,000,000,000 | 0.2860 ns  | 4,891,832  |
| 32    | 1           | 36,805 sec | 1,000,000,000 | 0.7305 ns  | 5,038,386  |
| 40    | 1           | (too long) | 1,000,000,000 | 34,238 sec | (too long) |

When I first saw these results, I had to check if I messed something up. We are comparing seconds with nanoseconds here. That's why I added another run with `fib(40)` for Blush to validate the tests. And they were right. Blush is nearly _five million_ times faster than Lithia in this case.

To get some more context, I also measured the Python and Ruby `fib(40)` and got around 10 to 17 seconds here. Although these numbers are not accurate and probably estimated too high, they give a rough idea of the performance difference. Blush is multiple times slower than these languages, but still in the same ballpark, while Lithia is outclassed by magnitudes.

Blush is still in early development. Through optimization, new language features but also additional safe guards the performance profile will change over time. And probably not always for the better. Also this is just a microbenchmark that is not in favor of Lithia. Real world performance might be different. Take these numbers with a grain of salt.

But yes, this was worth the hassle.
In case you are curios about what's up next or want a nerd talk, feel free to reach out to me [@mastodon.social@vknabel](https://mastodon.social/@vknabel).
