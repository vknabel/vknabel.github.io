---
title: 'SwiftUI @main AppDelegate'
date: '2021-05-27T11:56:02Z'
tags: [swift]
---

When using `@main` on a `SwiftUI.App` and `@UIApplicationDelegateAdaptor(AppDelegate.self)` you can still have an `AppDelegate` without handling SwiftUI manually as without `@main`.

You don't even need a `SceneDelegate`! A _huge_ difference for tiny apps!
