---
title: "Attaching to UIScrollView's parent with Auto Layout"
date: '2022-03-25'
tags: [swift]
---

When using auto layout with a `UIScrollView`, subviews may not attach to the top edge of the scroll view's parent. Else you cannot scroll, but the handle shrinks the more you scroll.

Setting left and right is ok to fix the width if you do not plan to scroll horizontally.
