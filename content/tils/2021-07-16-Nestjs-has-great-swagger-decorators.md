---
title: 'Nestjs has great swagger decorators!'
date: '2021-07-16T11:01:55Z'
tags: [web]
---

Nestjs has very great decorators to annotate your routes, dtos and controllers.
This makes it really easy to keep your Swagger or OpenAPI documentation up to date.

https://docs.nestjs.com/openapi/types-and-parameters

_Only downside:_ as TypeScript interfaces do not exist at runtime, you need to declare all your data transfer objects as classes, which might lead you to add convenience or validation methods to them. Don't do it. These classes are just decorations.
