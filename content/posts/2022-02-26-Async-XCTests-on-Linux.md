---
title: 'Missing Async XCTests on Linux'
date: '2022-02-26'
tags: [swift]
---

Async tests do not work on Linux, only on macOS. Instead you need to implement a helper function that runs the test async by relying on expectations.

https://www.swiftbysundell.com/articles/unit-testing-code-that-uses-async-await/
