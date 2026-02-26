---
title: Bash scripts with Gum
date: 2022-08-03
tags: [go, tooling, hosting]
---

I gave the newest tool of Charm [Gum](https://github.com/charmbracelet/gum) a try.
It allows to create interactive bash scripts in just a few lines of code.

In my case I gave it a try for Kubernetes. I often want to look at the logs of a pod, but the exact k8s pod differs from time to time.
And sometimes I forget the exact namespace or the pod's name includes random characters.

```bash
#! /bin/bash

# let the user select a namespace
NAMESPACE=$(kubectl get namespaces -o name | gum choose | cut -d/ -f2)
# let the user select a pod of the namespace
POD=$(kubectl get pods -n "$NAMESPACE" | tail -n +2 | gum choose | cut -d' ' -f1)
# if you want to repeat, copy the command
echo "> kubectl logs -n \"$NAMESPACE\" \"$POD\""
# print the logs
kubectl logs -n "$NAMESPACE" "$POD"
```
