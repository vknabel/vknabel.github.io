---
title: 'Having two admin dev accounts is a bad idea'
date: '2021-11-15'
tags: [cli]
---

I tried to keep my work stuff separate from my personal stuff on the same machine.
I created two admin users, set up a group for homebrew and set the permissions accordingly.

Sadly this didn't work out in the long run. So I started to run Homebrew as my preferred admin user.

```bash
if [ "$(whoami)" != "vknabel" ]; then
  sudo -S --login -u vknabel bash -- $(which brew) "$@"
else
  brew "$@"
fi
```

This approach worked and was muich more reliable than the previous approach.

Then came Flutter. I had to add additional permissions and eventually change their ownership from time to time as flutter messed them up.
