---
title: 'Reminder: websites contain weird characters'
date: '2021-11-16'
tags: [tooling, web]
---

Copying contents from the web often copies weird characters, like the invisible character `U+FEFF` or "Zero Width No-Break Space".

Code editors like VS Code might highlight those characters depending on your config, but other websites don't. In my case I copied a secret for my CI pipeline including the invisible character.

An easy workaround for this on the mac: Spotlight removes some of these characters. A simple `cmd+space`, `cmd+v`, `cmd+a`, `cmd+c` and `esc` cleans the copied text.

And suddenly the inserted password is correct!
