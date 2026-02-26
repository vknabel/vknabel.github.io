---
title: My Personal View on Acorn
date: 2022-12-12
tags: [hosting, tooling]
---

[Acorn](https://acorn.io) is an application deployment framework for k8s, that tries to simplify instead of introducing another layer of indirection. I won't cover all details and problems it tries to solve here, instead I'd like to share some experiences and thoughts.

> **Acorn has been discontinued** and they are now doing some AI slop stuff.

## My experience with Acorn and Kubernetes

Before we dive right in, I'd like to let you know about my level of experience with Kubernetes and Acorn.

I started having a look on Acorn in August 2022 and played around with it. I did not have production experience with Kubernetes, but I started learning and playing around with it a few months before.

To get a deeper understanding on k8s, I soon started to migrate my personal services hosted on multiple docker-compose-files. Later I had a look on Acorn and started to play around with it. I also translated my docker-compose-files and k8s manifests to Acorn and liked the result.

Later I migrated my personal production services to k8s and Acorn. As [Puffery](http://github.com/vknabel/puffery) only has a few users, there wasn't much risk involved.

On October 2022, I held a talk about [Acorn](https://acorn.io) at the [Kubernetes Community Days Munich 2022](https://community.cncf.io/events/details/cncf-kcd-munich-presents-kubernetes-community-days-munich-2022-1/). And recently I wrote the [corresponding blog post](https://www.x-cellent.com/posts/getting-started-with-acorn-for-kubernetes) for my employer's blog to share the contents of the talk.

## Secrets

Acorn forces you to declare secrets in the `Acornfile`, but it forbids you to provide them there. Instead it will automatically generate the secrets on the initial deployment. You don't have to worry about secrets anymore.

The weird part is, when you have an existing secret. You don't override or change the generated secret. Instead you create a new secret at the command line and link both secrets together.

But if you are used to it, it's actually a nice way to solve this issue.

## Referencing Resources

In Acorn you need to reference some resources like a specific secret or volume. Here you use an URL with the appropriate scheme. For example, to reference a secret, you use the `secret://` scheme.

In regards to volumes, this is awesome, as you can even mount a specific path of the volume into a directory. But when using secrets, this is sometimes a bit annoying, as you need to reference the whole secret and then extract the value you need, like `secret://db-password/token`. The benefit: you can create a secret to mount multiple files into a container using an opaque secret.

I understand the reasoning behind using resource URLs, as these resources technically need to be created and are not part of the Acorn Image. But in the beginning this was a bit confusing. Maybe this is just a documentation issue.

## Development

For development we always need a vast range of tools. Especially when working with multiple programming languages. I tend to avoid installing those on my local machine and instead use containers. In easier cases I use [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for VS Code. For more complex use cases that include databases, I rely on docker-compose. But if the application needs to run in a Kubernetes cluster, it would be twice the work to maintain the `docker-compose.yaml` and the k8s manifests. With Acorn, I can use the same manifests for development and production. Of course I need to sprinkle some `if` statements in the `Acornfile` to make it work for both environments, but it feels much more natural than maintaining two different sets of manifests.

And to be honest, I think an `Acornfile` is far easier to read, than a `docker-compose.yaml` or many k8s manifests.

## Production Use

I have been using Acorn in production for a few months now and I have not encountered any problems so far.
Instead I really like gathering all logs of one application with a single command out of the box: `acorn logs [app]`.

I also like the fact, that Acorn knows the concept of an app. That way it can provide a great overview about whole applications across multiple resource types.

## Conclusion

I really like Acorn and I think it's a great tool to simplify the deployment of applications to Kubernetes. It's not perfect, but it's a great start. At the moment I'm not sure if I would use it for a production application with a lot of users, but I would definitely use it for my personal projects.
