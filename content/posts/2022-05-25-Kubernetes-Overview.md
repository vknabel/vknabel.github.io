---
title: Kubernetes Overview for Beginners
date: 2022-05-25
tags: [devops]
---

I have never done anything productive with Kubernetes before. But it is a really tough topic to get started with. It's overwhelming.

Luckily I found an excellent [Kubernetes tutorial on Youtube](https://www.youtube.com/watch?v=X48VuDVv0do).

I made some personal notes while watching. Mostly to keep some overview for all the different concepts.

> Today I haven't finished the video, so the overview is only a rough draft. Some missing concepts are Storage Classes, Ingress Controllers and more!

## Kubernetes Concepts

- a **Pod** is an abstraction of usually one container.
- all **IP addresses** are assigned and changed with every restart
- **Pods** communicate using **Services**
- **External Services** are accessible by IP and port
- **Ingress** is used for external access using domains
- A **ConfigMap** holds configuration data. Changing the config map prevents whole rebuilds and redeploys of specifc pods
- **Secrets** are like **ConfigMaps**, but for sensitive data. Values are by default base64 encoded in the YAML.
- **Volumes** connect storage (local or remote) to a **Pod**
- Kubernetes does not handle storage!
- **LoadBalancers** are a type of **Services**
- **Replicas** are the amount of **Deployments**.
- **Deployments** are blueprints for **Pods**

**StatefulSets** are like **Deployments**, but stateful.

- They are designed to databases etc to avoid data inconsistency.
- Harder to get right than a simple **Deployment**.
- Databases are often deployed outside the cluster.

**StatefulSet** has volume claim templates, to create independent storage for each replica.

`volumeClaimTemplates` create a volume claim for each replica.

## Kubernetes Architecture

Master nodes and worker nodes are kept separate to keep the cluster controllable. Imagine you couldn't manage your cluster to increase the number of worker nodes or replicas.

**Worker Nodes**
Runs multiple pods.

3 processes are running on each node:

- container runtime
- the Kubelet connects container runtime and the configuration
- the kube proxy routes requests to services)

**Master Nodes**
Manage the worker nodes.

Runs 4 processes:

- Api Server / cluster gateway / authentication
- the Scheduler that decides which worker node gets workload
- Controller Manager observes the state of the cluster and makes changes
- etcd is a Key-Value-Store for k8n
