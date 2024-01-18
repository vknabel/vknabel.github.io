---
title: Starting the journey about creating a new programming language
date: 2022-07-22
tags: [lithia, compilers]
---

This is planned to be a series of blog posts about designing and developing my own programming language, where I want to share some pitfalls, my learnings, design decisions, experience and the development process.

While this series will not teach you how to write your first own programming language on its own, it might be supplementary.

After years of playing with the idea of writing my own programming language, I finally started. In the past I read books and blog posts about creating my own compiler, and I actually have written some parsers, but I never implemented the whole language itself. I know some theory, but I do not know how to actually apply it in practice.

I felt stuck between theory and simple proof of concept implementations like creating another Lisp.

## What's in this series?

These are all finished blog posts so far.

- [Designing and scoping my language Lithia](/posts/designing-and-scoping-my-language-lithia/)
- [The current state of Lithia after 2 years](/posts/the-current-state-of-lithia-after-2-years/)

## My motivations and background

As soon as I learned programming, I was inspired by all the tooling like linters, editors and the compiler itself. All developed in order to develop. They were those magical blackboxes, that felt beyond everything I could achieve.

Later I played around with various language features and writing my own standard library replacement for existing languages. Lots of fun, but not productive.

With the years, I learned new paradigms like object orientation, logical, constraint and functional programming. And beyond those big paradigms, there are many different concepts that define the languages character like the module system, dependencies, inheritance, generics, operator overloading, interfaces, type classes, strong or weak typing, dynamic or static, side-effects, monads and many more.

I started experimenting with new programming language concepts, mixing a few and thinking about the consequences. How do these features integrate and what does it mean for a different group of features? And which syntax do you need to support the special characteristics?

For fun, I worked on small libraries and tooling in existing programming language ecosystems. Nothing special or widespread.
I read about compilers and interpreters and even though I implemented small lisp-like languages and custom parsers, I felt like I couldn’t write a compiler on my own.

I kept the wish to design and create my own programming language from ground up. With tooling. I want to learn every aspect of it. Run into problems. Solve them and gradually increase the maturity of the language, the tooling and the compiler.

That being said, I don’t want my language to be used in wild, heck I encourage you to _not_ use it. The journey and what we learn along the way is the treasure.

## Summary

I decided to create yet another programming language and let’s be honest: nobody will ever use it and I’m fine with it. But anyway I will still provide tooling and documentation for it.

I will update and link all my compiler and language design blog posts here.

If you wish, check out the open source repository of [Lithia](https://github.com/vknabel/lithia). If you have any questions don't hesitate to ask me on [@mastodon.social@vknabel](https://mastodon.social/@vknabel) or join the [Lithia disussions](https://github.com/vknabel/lithia/discussions).

Happy coding!
