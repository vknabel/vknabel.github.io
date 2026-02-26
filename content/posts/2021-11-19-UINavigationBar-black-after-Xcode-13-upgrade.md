---
title: 'UINavigationBar black after Xcode 13 upgrade'
date: '2021-11-19'
tags: [swift, tooling]
---

In case your `UINavigationBar` has been set to a custom color and the navigation bar is not translucent, you will experience a visual regression when updating to Xcode 13.
The navigation bar background will be black - until you start scrolling. Then it behaves as expected.

Thankfully there is a workaround and an easy fix:
[Apple Developer Forums: barTintColor not working in iOS 15](https://developer.apple.com/forums/thread/682420)
