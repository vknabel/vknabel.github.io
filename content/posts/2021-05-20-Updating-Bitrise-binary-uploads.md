---
title: 'Updating Bitrise binary uploads'
date: '2021-05-20'
tags: [devops, swift]
---

Bitrise binary uploads cannot be updated after saving. Instead they need to be deleted and recreated.
Thus all workflow steps need to be updated if they rely on the data.

**Pro-tip:** when copy-pasting, skip the `BITRISE_IO` and `_URL` parts – they will be inserted automatically when using the web UI.
