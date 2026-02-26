---
title: Hugo's Syntax Highlighting is static
date: 2022-07-24
tags: [web, go]
---

Unlinke many other static site generators, the [syntax highlighting of Hugo](https://gohugo.io/content-management/syntax-highlighting/) does not use client-side JavaScript, which is great!

The underlying library is available as Go module [github.com/alecthomas/chroma](https://github.com/alecthomas/chroma).
