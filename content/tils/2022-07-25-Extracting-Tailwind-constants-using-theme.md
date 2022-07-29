---
title: Extracting Tailwind constants using theme
date: 2022-07-25
tags: [web]
---

When using tailwind, you might be forced to manually write SCSS by hand.
With `@apply some classes;` you can embed whole classes with all their styles into your own rules.

But sometimes you need to only acces one single constant. Like accessing an animation timeout, default paddings, fonts or a color for some cases.

That's possible with a simple `theme('colors.primary')`.
