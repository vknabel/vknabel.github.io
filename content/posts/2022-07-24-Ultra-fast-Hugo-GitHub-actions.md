---
title: 'Ultra-fast Hugo GitHub actions'
date: '2022-07-24'
tags: [web, tooling]
---

I created a [GitHub workflow](https://github.com/vknabel/vknabel.github.io/blob/main/.github/workflows/pages.yml) to automatically build and deploy my website to GitHub Pages.

It uses [peaceiris/actions-hugo@v2](https://github.com/peaceiris/actions-hugo) to build the website with Hugo and [peaceiris/actions-gh-pages@v3](https://github.com/peaceiris/actions-gh-pages) to deploy it to GitHub Pages.
