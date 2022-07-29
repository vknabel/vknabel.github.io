---
title: Angular *ngFor trackBy
date: 2022-07-19
tags: [web]
---

When iterating over an array of objects in Angular, the change detection compares the references of the objects to detect changes.

If the object reference now change too, like when updating local data from the network, Angular will discard the identity of all nested components within the `ngFor` and re-render the entire list. Even if the objects deeply equal, the change detection will still detect the change.

To help our loop caching components and instead changing their inputs, we can add a `trackBy` function to the `ngFor` directive.

```html
<div
  class="checkbox-row"
  *ngFor="let option of field.options; trackBy: fieldOptionTrackBy"
></div>
```

And in TypeScript, we add identity tracking function:

```typescript
fieldOptionTrackBy(index: number, option: AssistantStepOption): string {
  return option.identifier;
}
```

> _**Background:** Angular did reset my `mat-checkbox` within the `ngFor`. That lead to a discard of the freshly changed values._
