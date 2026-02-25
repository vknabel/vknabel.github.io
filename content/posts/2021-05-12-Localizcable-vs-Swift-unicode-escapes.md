---
title: 'Localizcable vs Swift unicode escapes'
date: '2021-05-12'
tags: [swift]
---

`Localizable.strings` doesn't support unicode `\unnnn` escapes, but only `\Unnnn`!
In Swift the `\U` is for UTF-16 escapes like `\Unnnnnnnn`.
