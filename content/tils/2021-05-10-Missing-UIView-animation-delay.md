---
title: 'Missing UIView animation delay'
date: '2021-05-10'
tags: [swift]
---

UIView animate does **not delay** if there are **no changes**.

The completion block will be called immediately!
