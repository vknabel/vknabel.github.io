---
title: Go Data Race Detector
date: 2022-07-09
tags: [go, tooling]
---

You can run your Go program or your tests with the Data Race detection enabled. This might cost some performance and memory, but in case a data race is being detected, that's worth it!

Perfect for your CI!

```bash
go run --race ./cmd/app
go test --race ./...
```
