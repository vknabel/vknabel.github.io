---
title: 'Swift and Firebase'
date: '2021-06-02'
tags: [swift]
---

Nothing especially new here, but a reminder:
Firebase might be a good choice if you need realtime updates.

Instead of implementing and connecting to websockets and implementing one-time requests and observing differently, you can simply use `getData` or `observeValue` as they are already implemented.

Even some errors vanish when observing: you start by the cache and if there is no update due to errors, you don't get new data.
But beware: Firebase still might not be the best choice, depending on your app or the circumstances.
