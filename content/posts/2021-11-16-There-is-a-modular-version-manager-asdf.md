---
title: 'There is a modular version manager: asdf!'
date: '2021-11-16'
tags: [tooling]
---

Today I learned about [asdf](https://github.com/asdf-vm/asdf), which is a pluggable version manager.

Previously I used nvm, rvm, swiftenv and more. I now use asdf. Just add the plugin of your choice and install your desired versions.

The only drawback is installing completely new versions of the tools. You are only able to install exact versions. You can't install _some major 16 nodejs version_.
But you can still install `asdf install <plugin> latest` or in case of nodejs `lts-*` versions.

Don't forget to pick the version locally or globally.

> some side-tip: there is an [asdf plugin for direnv](https://github.com/asdf-community/asdf-direnv)!
