---
title: Kind is the new minikube
date: 2022-08-05
tags: [devops]
---

I have been playing around with minikube for quite some time now. Though as I run minikube on my Mac, I experienced multiple bugs regarding accessing the cluster and it's published ports.

From my perspective Kind works much better, is faster, more stable on macOS and allows the creation of multiple clusters. Though it is not bug-free on macOS. Although most bugs seem to be related to Docker itself on the Mac.

You can even pause the cluster - just pause it's docker container.
