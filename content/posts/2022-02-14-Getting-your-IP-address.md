---
title: 'Getting your IP address'
date: '2022-02-14T20:53:32Z'
tags: [cli]
---

Sometimes you need your local IP address on the command line to automatically pass it to a script.

```bash
ifconfig en0 |awk '/inet / {print $2; }'
```
