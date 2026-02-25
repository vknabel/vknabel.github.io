---
title: Atomic Design
date: 2022-08-17
tags: [books, web]
---

Today I stumbled upon [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/). It is some kind of architectural pattern for the user interface. The goal is to build a reusable UI that is easy to understand and maintain.

It starts with atoms, which represent the smallest units of the UI like text, buttons or images. By composing atoms, you get molecules like a search input (label, input, button). Then there are organisms like the top navigation bar. Templates align organisms. In the end, Pages fill the templates with acutal data.

From my perspective, only the Pages connect to non-UI parts of the application. Hence the Atomic Design is only focused about the structure of the view.
