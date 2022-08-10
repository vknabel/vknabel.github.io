---
title: 'UIApplication.shared not in Extensions'
date: '2021-08-02'
tags: [swift]
---

`UIApplication.shared` isn't available within an iOS app extension.
To annotate your code paths not needed in an extension, but using `UIApplication.shared`, just use the `@available(iOSApplicationExtension, unavailable)` annotation.

Now you will receive the same error when using the annotated api from an extension!
