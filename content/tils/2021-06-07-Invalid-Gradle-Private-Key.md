---
title: 'Invalid Gradle Private Key'
date: '2021-06-07'
tags: [android]
---

Gradle did reject my ssh key due to `invalid privatekey`.

The solution: converting it into a different format.

```bash
ssh-keygen-p -f id_rsa -m pem
```
