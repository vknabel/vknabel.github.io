---
title: Kubernetes without Load Balancers?
date: 2022-08-06
tags: [hosting]
---

All the hosted Kubernetes solutions I know of want you to pay roughly 10$ pre month for each load balancer.

If you currently don't expect much traffic, but want to play around with k8s or if many docker-compose files don't fit your needs anymore, this easily doubles your costs.

[Downey.io – save money and skip the kubernetes load balancer](https://downey.io/blog/skip-kubernetes-loadbalancer-with-hostport-daemonset/)

> Bonus learning: I didn't heard of the `DaemonSet` until now!
