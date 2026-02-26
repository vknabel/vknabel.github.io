---
title: Adopting Swift Async Await in Vapor
aliases: [/pages/Adopting-Swift-Async-Await-in-Vapor/]
date: 2021-11-15
tags: [swift, tooling]
---

A few months ago Swift 5.5 has been released and made `async`/`await` available. And in [4.50.0](https://github.com/vapor/vapor/releases/tag/4.50.0) Vapor added support for it, too!

> _If you are still on Vapor 3, you first need to [upgrade your server to Vapor 4](https://www.vknabel.com/pages/Upgrading-a-server-side-Swift-project-to-Vapor-4/)._

Now we can migrate most usages of Swift NIO's `EventLoopFuture` with `async`. But we don't have to! This is not a breaking change. I recently performed this upgrade for the server of my app [Puffery](https://github.com/vknabel/puffery) and as both, the client and the server are open source I will include links to the respective git commits.

> _**Puffery** is an app to send messages into channels using Shortcuts or HTTP. This will trigger a push notification to all clients that have subscribed. Within the app you can view your messages and channels._

I wouldn't recommend to directly replace all occurrences of `EventLoopFuture`. If you aren't going to touch specific code paths in a while, there is no need to migrate those. But we'll come back to that later.

## Upgrading to Swift 5.5

If you haven't already, you need to upgrade your Swift Tools Version within your `Package.swift`-manifest:

```swift
// swift-tools-version:5.5
import PackageDescription
```

Now a few lines later we need to upgrade to a newer macOS version, because `async`/`await` not only requires Swift 5.5, but also macOS 12 Monterey. Make sure you have upgraded accordingly. Otherwise you'd need to work on a linux machine or within a docker container.

```swift
let package = Package(
    name: "PufferyServer",
    platforms: [
        .macOS(.v12), // upgrade to .v12
    ],
```

Next up, we need to bump our dependencies. As we want to rely on special features of the new Vapor, we explicitly go `from: "4.50.0"`. Repeat this with other dependencies like Fluent.

```swift
		// ...
    dependencies: [
	    // ...
	    .package(url: "https://github.com/vapor/vapor.git", from: "4.50.0"), // upgrade to 4.50.0
	    // ...
		],
```

Now, to silence a warning, we need to explicitly declare our `Run` target as `executableTarget`.

```swift
    targets: [
	    // ...
	    .executableTarget(name: "Run", dependencies: ["App"]),
	    // ...
		]
)
```

If you use a Dockerfile, build `FROM swift:5.5 as build`. Also if present don't forget to update your `.swift-version`-file and your CI.

Now update your packages using `swift package update`. If you use Xcode, also update your dependencies using `File > Packages > Update to Latest Package Versions` to keep them in sync. In theory `swift build` and `swift test` should run without any errors. If it does, fix those and proceed.

_[`git commit -am "Upgraded PufferyServer to Swift 5.5"`](https://github.com/vknabel/puffery/commit/1c41e5ae5c49748c1389b4491e03d595e5b0f406)_

## Adopting Async Await

Now that we upgraded our new Swift version and updated our dependencies, let's get started with our migration.

We will incrementally do tiny steps and migrate every function after another. But it doesn't make sense to migrate all functions immediately. If you haven't touched specific files in a while, there is no need to do so now. A great example are your database migrations. You won't touch them anyways. Just write new ones with `async`/`await` and you are fine.

In my opinion, controllers are the easiest place to get started. Later you can tackle migrate `Jobs` or `ScheduledJob`s. Then your services and your repositories.

The easiest places to upgrade will most likely be your Fluent queries: there are overloads for `.find()` and `.all()` to return `EventLoopFuture` and `async throws`.

### Migrate the function signature

```diff
- 	func messagesForAllChannels(_ req: Request) throws -> EventLoopFuture<[MessageResponse]> {
+ 	func messagesForAllChannels(_ req: Request) async throws -> [MessageResponse] {
```

Now fix all issues within the function. Then fix the errors of all callers.

If you temporarily converted invocations of this method from `EventLoopFuture` to an async function using `.get()`, it is now time to remove it.

### Migrate Protocol Methods if directly affected

Most protocols need to be prefixed with `Async` like `AsyncJob` or `AsyncScheduledJob`. Then you can replace all function signatures.

### I need async, but I have an EventLoopFuture

To convert a not yet converted `EventLoopFuture`, we call `EventLoopFuture<V>.get() async throws -> V`. You can migrate the function later.

```swift
try await theEventLoopFuture.get()
```

### I need an EventLoopFuture, but I have an async function

Sometimes I decided to keep some function signatures as they were and I did not migrate them. For those cases I created a small helper function to create an `EventLoopFuture` from an async task.

```swift
extension EventLoop {
    func from<T>(task: @escaping () async throws -> T) -> EventLoopFuture<T> {
        let promise = makePromise(of: T.self)
        promise.completeWithTask { try await task() }
        return promise.futureResult
    }
}
```

For example executing multiple futures in parallel is easy with `eventLoop.flatten`, but it's much harder with `async`/`await`.

### Migrate `.flatMap`

Migrate `.flatMap({ messages in doSomething(messages) })` to `let result = try await doSomething(messages).get()`.

### Migrate `.flatMapThrowing`

Migrate `.flatMapThrowing({ messages in doSomething(messages) })` to `let result = try doSomething(messages)`

### Migrate `eventLoop.flatten`

Executing multiple futures in parallel is easy with `eventLoop.flatten`, but it's much harder with `async`/`await`.

I'd recommend to keep this part as is, and to keep this part as `EventLoopFuture`.
See [I need an EventLoopFuture, but I have async](#I need an EventLoopFuture, but I have async).

### Migrate `.transform(to:)`

This is straight forward: use the value directly. Typically you'd return this.

Sometimes I used `transform` within a `flatMap` to keep the same return value. Now, just `try await` these side effects.

```diff
-	.flatMap({ user in
-		user.update(on: req.db)
-			.transform(to: user)
-	})
+	try await update(on: req.db)
```

### Migrate `.always(_:)`

`.always` will be executed when an `EventLoopFuture` fails and when it succeeds. This is the same behaviour of `defer` with `async`/`await`!

```diff
-	return computeSomething()
- .always { _ in
- 	doSomething()
- }
+ defer {
+		doSomething()
+ }
+	return try await computeSomething()
```

> _**Attention:** you probably need to move your defer up. Using `async`/`await` will likely introduce more return and throw statements which will exit your functions early._

### Returning constant futures

If you currently throw a failing future, just throw the error directly.

```diff
- return req.eventLoop.future(error: Abort(.notFound))
+ throw Abort(.notFound)
```

To replace a succeeding future, return the value directly.

```diff
- return req.eventLoop.future(success: value)
+ return value
```

If thee `future(error:)` was embedded within a `do`-`catch` to lift errors to an `EventLoopFuture`, you can probably remove the `do`-`catch` and mark the function as `throws` instead.

### Test and Commit

Do not forget to regularly run your tests and to keep your project in a green state. From time to time, do some commits.

_[`git commit -am "Use async/await for Vapor"`](https://github.com/vknabel/puffery/commit/17825477cb1d2709dc16e0669a9b943e2d978fd4)_

## Real World Examples

In case you need guidance, here are typical examples for Vapor-endpoints. These examples should look familiar.

_All code snippets are actual code from Puffery._

### Example for a Fluent query

This function is part of the `SubscriptionRepository`. It is meant to be used from `Controllers` to consistently access, filter and sort the channel subscriptions of a user.

```swift
func all(of user: User) -> EventLoopFuture<[Subscription]> {
	do {
		return try Subscription.query(on: db)
			.filter(\Subscription.$user.$id == user.requireID())
			.sort(\.$createdAt, .descending)
			.all()
	} catch {
		return eventLoop.future(error: error)
	}
}
```

We start by changing the type signature to `async throws`.

To fix the type errors, we could drop `do`-`catch` as the new variant is throwing. Previously it wasn't throwing as there is no overload of `EventLoopFuture.flatMap` that accepts throwing `EventLoopFuture`s. Therefore `all(of:)` was required to lift thrown errors to futures.

As there is no distinction between directly throwing and a query failure with `async`/`await` we can get rid of the `do`-`catch`. And as Fluent has overloads for both `EventLoopFuture` and `async throws` we're done here.

```swift
func all(of user: User) async throws -> [Subscription] {
	try await Subscription.query(on: db)
	  .filter(\Subscription.$user.$id == user.requireID())
    .sort(\.$createdAt, .descending)
    .all()
 }
```

### Example Migrations for simple read-only endpoints

My `MessageController` looked like this:

```swift
final class MessageController {
	func messagesForAllChannels(_ req: Request) throws -> EventLoopFuture<[MessageResponse]> {
		let user = try req.auth.require(User.self)

		return req.subscriptions.all(of: user)
	    .flatMap(req.messages.latestSubscribed(for:))
      .flatMapThrowing { messages in
	      try messages.map {
	        try MessageResponse($0.message, subscription: $0.subscription)
				}
     }
	}

	// other endpoints ...
}
```

This code should be familiar to any Vapor developer. I started migration with the function signature, replaced `flatMap` and `flatMapThrowing` and inserted the `.get()`.

```swift
func messagesForAllChannels(_ req: Request) async throws -> [MessageResponse] {
	let user = try req.auth.require(User.self)

  let subs = try await req.subscriptions.all(of: user).get()
  let messages = try await req.messages.latestSubscribed(for: subs).get()
  return try messages.map {
	  try MessageResponse($0.message, subscription: $0.subscription)
	}
}
```

After I migrated my `SubscriptionRepository`, I could even get rid of the trailing `.get()`.

### Example Migration for simple write-endpoints

This function's migration path was more complex.

```swift
func confirmEmailIfNeeded(_ user: User) throws -> EventLoopFuture<Void> {
	guard let emailAddress = user.email else {
		return req.eventLoop.future()
	}

	let confirmation = try Confirmation(scope: "email", snapshot: emailAddress, user: user)
	return confirmation.create(on: req.db)
		.flatMapThrowing { _ in
			try Email(/*...*/)
		}
		.flatMap { email in
			self.req.queue.dispatch(SendEmailJob.self, email)
		}
}
```

Here we could completely remove the empty `req.eventLoop.future()`. A simple, blank `return` statement is enough. And creating models doesn't force us anymore to nest everything one level deeper. We `await` the result, but we discard it.

```swift
func confirmEmailIfNeeded(_ user: User) async throws {
	guard let emailAddress = user.email else {
		return
	}

	let confirmation = try Confirmation(scope: "email", snapshot: emailAddress, user: user)
	try await confirmation.create(on: req.db)
	let email = try Email(/*...*/)
	try await req.queue.dispatch(SendEmailJob.self, email)
}
```

## Summary

Within this post we upgraded our Swift version, Package manifest, docker / CI Swift versions and our dependencies. Then we incrementally migrated portions of our codebase by following a set of rules. What was your migration like? Did you experience any problems?

If you wish, check out the open source repository of [Puffery](https://github.com/vknabel/puffery) or check it out on the [App Store](https://apps.apple.com/de/app/puffery/id1508776889). If you have any questions or feedback don't hesitate to ask me on [@mastodon.social@vknabel](https://mastodon.social/@vknabel) or join the [Puffery disussions](https://github.com/vknabel/puffery/discussions).
