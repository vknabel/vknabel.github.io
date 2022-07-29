---
title: Refactoring RxJS Code in Angular
aliases: [/pages/Refactoring-RxJS-in-Angular/]
date: 2017-09-28
tags: [web, functional, migration]
---

Do you work with legacy RxJS code? Have you ever revisited your first few observables in your application? Do you need to fix bugs in an app of your learning phase? Are you still learning best practices for writing reactive code? This guide is for you. Even if you don’t have anything to do with Angular, you may find this interesting. I will show you a way of how to improve your reactive streams in order to understand their functionality in many isolated, but tiny steps. Some of them may offer external dependencies, but we will always show, how to do it manually.

Within each step we isolate/eliminate side effects, get more explicit about lifetime and learn about how to prevent unintended behavior. If you use this guide to refactor some specific code, you should perform all single steps in order and rerun all tests after each change. If you can‘t find the shown pattern you can take the next step.

> _Unit Testing:_ If you don‘t have any test create them upfront. Each step is a small refactoring: you may break something. For the guys of you who sit in front of really untestable code: I understand your situation. All ”dangerous” steps are marked. You need to test much more and manually. At least introduce unit tests afterwards. Dependency injection is your friend.

In the beginning, we start easy and just isolate our side effects from our subscriptions. Instead of passing our callbacks directly, we wrap them into `do` operators. Whenever you read a `do`, you know: that‘s a side effect.
If you want a slightly more expressive variant try `@molecule/do-next`, `@molecule/do-error` and `@molecule/do-complete`.

```javascript
// previous code
myObservable$.subscribe(
  (next) => handleNext(next),
  (error) => handleError(error),
  () => handleCompletion()
)

// refactored code
myObservable$
  .do(
    (next) => handleNext(next),
    (error) => handleError(error),
    () => handleCompletion()
  )
  .subscribe()

/* or with @molecule/do-next,
 * @molecule/do-error,
 * @molecule/do-complete
 */
myObservable$
  .do(
    (next) => handleNext(next),
    (error) => handleError(error),
    () => handleCompletion()
  )
  .subscribe()
```

Well, that was easy. Now let‘s make all of our operators simpler. A good sign, that you tried to do more than one thing inside an operator is the use of closure blocks and explicit return statements (`() => {}`).
Especially if we extract all side effects from our operators, we know: _all_ side effects live within `do*` and `finally`!
Every statement that is not your `return`-statement and no variable declaration, that is used for your `return` is a side effect. If the operator is a `catch`, move the side effects logically isolated (see above) to `do(undefined, yourErrorHandler)`/`doError(yourErrorHandler)`. Otherwise extract them to `do`/`doNext`.

```javascript
// previous code
myObservable$.catch(error => {
	console.log(’Could not resolve myObservable$’, error);
	return Observable.empty();
})
// refactored code
myObservable$
	 // or use .do(undefined, errorHandler)
  .doError(error => console.log(
		’Could not resolve myObservable$’,
		error
	))
  .catch(() => Observable.empty());
```

In order to further simplify your operation handler, you can extract the whole block into a new `private` method of your class. If it doesn’t even depend on `this` you can actually make it `static`. The following case may seem a bit awkward at first, but it will keep everything simple and stupid. You will see, one can totally understand `previewOfFavorites$` without knowing all those details. And if the underlying API changes, our public methods with all of our business logic just don‘t care.

```javascript
// previous code
public get previewOfFavorites(): Observable<Favorite[]> {
	const previewSize$ = this.user.settings$.map(settings => settings.preview.size);
	const favorites$ = this.user.favorites$();
	return Observable.combineLatest(
		previewSize$,
		previewOfFavorites$,
		(size, favorites) => favorites.slice(0, 3)
	);
}
// refactored code
public get previewOfFavorites$(): Observable<Favorite[]> {
	return Observable.combineLatest(
		this.previewSize$,
		this.previewOfFavorites$,
		(size, favorites) => favorites.slice(0, 3)
	);
}

private get previewSize$(): Observable<number> {
	return this.user.settings$.map(settings => settings.preview.size);
}

private get favorites$(): Observable<Favorite[]> {
	return this.user.favorites$();
}
```

Finally we should have mostly single `return`-statements as handlers and transformations. In that case we just use the short notation for closures. One exception are object literals, which need to be wrapped in parentheses (`() => ({})`) or leave the explicit return statement if you prefer it.

```javascript
// previous code
myObservable$.map((value) => {
  return [value]
})
// refactored code
myObservable$.map((value) => [value])
```

## What's next?

This blogpost has never been finished. It wasn't touch for more than a year and I don't understand all my remaining notes anymore.
Here they are:

- Replace instance variables through Observables they represent

  - Store observable as `readonly` and `shareReplay(1)` and remove `subscribe`.
  - Replace usages with `withLatestFrom` or `this.xx$.first().mergeMap`
  - When filtered procedural, move logic into observable method for later use
  - Keep visibility (prefer `private`, of course)
  - Angular templates should use `|async`
  - You can now remove `changeDetector.markForCheck()` invocations
  - If param is requires synchronously use `Observable.defer().shareReplay(1)`

- Remove temporary observable and adjust `mergeMap`s
- If extracted subject with object for parameter, adjust function parameters
- Trigger actions with temporary observable named `*Action` (`Observable.empty().finally`)
- Sideeffect at the begginning before current operator, otherwise behind
- Keep functions which prevent execution
- All subjects should always be private: add accessors `processDidChange`, `processDidFail`, `processDidComplete`,`processObserver` (just if required)
