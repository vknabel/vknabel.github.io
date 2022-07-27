---
title: Iterating over a map in Go
date: 2022-05-17
tags: [golang]
---

Iterating over a map in Go is not predictable.
This is a design decision to avoid relying on memory layout.

```go
for k, v := range map {
    // always prints different results!
    fmt.Printf("%s: %s\n", k, v)
}
```
