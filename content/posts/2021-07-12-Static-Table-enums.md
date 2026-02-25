---
title: 'Static Table enums'
date: '2021-07-12'
tags: [swift]
---

Using enums in Swift for static Table View Data Sources is really great.
Especially when declaring them as `enum X: Int` and using the `rawValue` to reflect the section or row index.

You can even use the `CaseIterable` protocol to count the number of sections or rows.
