---
title: Upgrading a server-side Swift project to Vapor 4
aliases: [/pages/Upgrading-a-server-side-Swift-project-to-Vapor-4/]
date: 2020-04-22
tags: [swift, vapor, migration]
---

The past few days I created a new server using [Vapor](https://vapor.codes) and hit `vapor new <project> --auth` which created a Vapor 3 server. Later I upgraded the young project to Vapor 4, but found some lack of practical information about the upgrade on the internet. So here I share my subjective experience and try to give you some tips.

The app itself is relatively simple:

- it has user authentication and registration
- users don‘t have any profile and cannot interact with each other
- on certain events, we notify multiple users on all of their devices
- users have their personal list of notifications

After a while, when most parts of the MVP were finished, I wanted to add [vapor/apns](https://github.com/vapor/apns), which required the new Vapor 4. But hasn’t Vapor 4 been released recently? Yes, but it seems like the Vapor team probably decided to keep Vapor 3 the default until the documentation and all surrounding has been finished (which is a good thing!).

The [list of changes](https://forums.swift.org/t/whats-new-in-vapor-4/31832) reads nicely, new services API, new model API built on top of property wrappers looks gorgeous, synchronously decoding contents improves controllers far more than you might expect and eager loading is great to tune up performance and to even reduce the amount of nested futures to be handled.

As mentioned I was especially interested in APNS. Additionally I need background jobs, which come as [vapor/queues](https://github.com/vapor/queues) , too.
For me the decision was an obvious one: let‘s upgrade the code base!

## Starting the Migration from Vapor 3 to Vapor 4

At that time, the server had only 4 controllers, 10 routes, 13 request_response structs_enums, 6 models, only empty migrations, zero services and zero repositories. It was still using an SQLite in-memory database with SQLite imports and types spread across the whole project. Also it obviously didn‘t send any Push Notifications (although they were already stored).

So as a first step to upgrade Vapor, I head over to their [Upgrading Docs](https://docs.vapor.codes/4.0/upgrading/) and started with updating the Package.swift manifest dependencies and platforms as proposed. Apparently I could even drop the vapor/auth dependency as it is now included in Vapor 4. You might stumble upon `platforms: [.macOS(.v10_15)]`: no worries, it still supports Linux. 👍

### Configure

Next I copied the new proposed contents of `Sources/Run/main.swift`, deleted `Sources/App/app.swift`, `Sources/App/boot.swift` (it was still empty) and changed `configure(_:_:_:)` and `routes(_:_:)` to be of type `(Application) throws -> Void`.

As I already touched `configure(_:)` and `routes(_:)`, I wanted to make those two files compile first, before moving to the next files, but the upgrading docs didn‘t really serve me well here. After some time reading through docs, I decided to generate a new Vapor 4 reference project using `vapor-beta new Example` which used [vapor/template](https://github.com/vapor/template) as template.

When comparing [Vapor 3 api-template configure.swift](https://github.com/vapor/api-template/blob/master/Sources/App/configure.swift) with the [new one](https://github.com/vapor/template/blob/master/Sources/App/configure.swift) I came to the conclusion, I could drop the most code.

In Vapor 3 we usually started creating a `XxxConfig` where we added types of migrations or used middlewares or databases.

```swift
// MARK: - Vapor 3
import Vapor
import Fluent
import FluentSQLite

public func configure(_ config: inout Config, _ env: inout Environment, _ services: inout Services) throws {
	// Register providers first
	try services.register(FluentSQLiteProvider())

	// Register routes to the router
	let router = EngineRouter.default()
	try routes(router)
	services.register(router, as: Router.self)

	// Configure a SQLite database
	let sqlite = try SQLiteDatabase(storage: .memory)

	// Register the configured SQLite database to the database config.
	var databases = DatabasesConfig()
	databases.add(database: sqlite, as: .sqlite)
	services.register(databases)

	// Register middleware
	var middlewares = MiddlewareConfig()
	middlewares.use(ErrorMiddleware.self)
	services.register(middlewares)

	// Register migrations
	var migrations = MigrationConfig()
	migrations.add(model: User.self, database: .sqlite) // Note: it‘s a type!
	services.register(migrations)
}
```

With Vapor 4, we just add instances of those types to `app.xxx` directly instead. Much more readable!

```swift
// MARK: - Vapor 4
import Vapor
import Fluent
import FluentSQLiteDriver

public func configure(_ app: Application) throws {
	try app.databases.use(.sqlite(.memory), as: DatabaseID.sqlite)
	app.middleware.use(ErrorMiddleware.default(environment: app.environment))
	app.migrations.add(CreateUser()) // Note: here it‘s an instance!

	try routes(app)
}
```

Now our `configure.swift` should only complain about our migrations, so let‘s head over to fix those!

### Models

Before we can fix our migrations, we should upgrade our models! For this step, it’s best to start bottom up from your simplest models to your most complex ones with lots of relations. Be patient and do one step at a time.

Here is our example model in Vapor 3:

```swift
// MARK: - Vapor 3
import Vapor
import FluentSQLite

final class DeviceToken: SQLiteModel {
    typealias Database = SQLiteDatabase

	  static let createdAtKey: TimestampKey? = \.createdAt

    var id: Int? // Note the Int? As id!
    var value: String
	  var userID: User.ID
	  var createdAt: Date?

	  var user: Parent<DeviceToken, User> { parent(\.userID) }

    init(id: Int? = nil, value: String, user: User) throws {
        self.id = id
        self.value = value
		  self.userID = try user.requireID()
    }
}
```

And here is the interesting part: our new Vapor 4 variant of `DeviceToken`!

```swift
import Fluent // 1

// MARK: - Vapor 4
final class DeviceToken: Model {
	static let schema = "device_tokens" // 2

	@ID(key: .id) // 3
	var id: Int?

	@Field(key: "value") // 4
	var value: String

	@Parent(key: "user_id") // 5
	var user: User

	@Timestamp(key: "created_at", on: .create) // 6
  var createdAt: Date?

	init() {} // 7 this is required, but in my case always empty ^^

	init(id: UUID? = nil, value: String, user: User) throws {
		self.id = id
		self.value = value
		// 8
		// ATTENTION: using self.user = user crashes
		self.$user.id = try user.requireID()
		self.$user.value = user
	}
}
```

Quite a lot to explain here, although it should be rather straight-forward. Essentially we:

1. drop the fluent database import
2. replace the database typealias with the name of our schema (e.g. table name)
3. add the `@ID(key: .id)` property wrapper
4. mark every field with `@Field(key: "name_of_field_in_schema")` (giving the column name)
5. declare the parent
   1. remove old `var userID: User.ID`
   2. replace old computed `var user: Parent<DeviceToken, User> { parent(\.userID) }`
   3. with `@Parent(key: "user_id") var user: User`
   4. The same rules apply to children and siblings
6. Instead of declaring static `createdAtKey`, `updatedAtKey` and `deletedAtKey` use `@Timestamp(key: FieldKey, on: TimestampTrigger)` as seen above
7. add an empty `init() {}`. Not sure when to customize and what its for 🤔
8. Here you need to pay attention! You may never set your relations directly, always use `$user.value =` or `$user.id =`. In this case we set both resulting in an already eager loaded `user`.

Oh and if your models conform to `Parameter`: just remove it. It has been removed.

### Migrations

As our models are fine now, let’s dive into their migrations!

Previously it was a common practice to conform your models to `Migration` and to even let Fluent derive a default migration from your `Model`. Though with Vapor 4 we need to actually implement those. I mean, conforming your models to migration isn‘t scalable anyways. So after all it‘s a good change.

Although I am generally a fan of doing just one single change at a time, I think this a great opportunity to move your migrations into separate files inside a `Migrations` folder, if they are still in the same file as their models.

From all I know, your existing migrations will break, but they should be rather easy to migrate. Anyways I didn‘t have real migrations, just the default ones:

```swift
// MARK: - Vapor 3
import Fluent
extension DeviceToken: Migration { }

// Alternatively manual migrations
import FluentPostgreSQL

extension Domain: Migration {
    static func prepare(on conn: PostgreSQLConnection) -> Future<Void> {
        return PostgreSQLDatabase.create(DeviceToken.self, on: conn) { builder in
            builder.field(for: \.id, isIdentifier: true)
            builder.field(for: \.value)
            builder.field(for: \.userID)
            builder.reference(from: \.userID, to: \User.id)
			  builder.field(for: \.createdAt)
			  builder.unique(on: \.value)
        }
    }
}
```

> **Some personal note:** I prefer to use the actual relation entities the in initializers. That way I have compiler guarantees, that their id actually exist!

So let‘s get our hands dirty and write some migrations in Vapor 4.

```swift
// MARK: - Vapor 4
import Fluent // Note: we don‘t have to specify the database type!

struct CreateDeviceToken: Migration {
	func prepare(on: database: Database) -> EventLoopFuture<Void> {
		return database.schema("device_tokens")
			.id() // <- oops! This is always .uuid, not .int which is not available on SQLite
			.field("value", .string, .required)
			.field("user_id", .uuid, .required, .references("users", "id“))
			.field("created_at", .datetime, .required)
			.unique(on: "value")
			.create()
	}

	func revert(on database: Database) -> EventLoopFuture<Void> {
		return database.schema("device_tokens").delete()
	}
}
```

At first, we notice much more strings than key paths and that all migrations have to rewritten! Though the upgrade should be comparably easy. If you have a lot migrations, you might have a though job as `revert(on:)` is mandatory now. Hopefully we will never need to revert any migrations in production!

> Another thing to note: I was using SQLite, but the `.id()`-shorthand is hard-coded to use type `.uuid`:

```swift
// From Fluent’s source code
public final class SchemaBuilder {
	public func id() -> Self {
  		self.field(.id, .uuid, .identifier(auto: false))
	}
}
```

> As the models and migrations were already independent of the database technology, I decided to switch from SQLite to Postgres, especially as models are now independent of the underlaying database (you import `Fluent` instead of `Fluent{Database}`), this change was quite easy and did only affect `Package.swift` and `configure.swift`. If you don‘t, you probably need to use `.field(.id, .int, .identifier(auto: true))` instead of `.id`.

If you don’t use any authentication, `configure.swift`, all your models and migrations should compile without any errors!

### Authentication

As I didn’t tune my current authentication implementation, I tried to stick as close as possible to the new [Vapor: Security → Authentication](https://docs.vapor.codes/4.0/authentication/) docs.

> Because the app will have a password less login, I didn’t use any basic authentication, which is therefore missing below. But according to the docs, it should be relatively easy to implement.

```swift
// MARK: Vapor 3
import Vapor
import Authentication

extension User: TokenAuthenticatable {
    /// See `TokenAuthenticatable`.
    typealias TokenType = UserToken
}

final class UserToken: SQLiteModel {
	// ...
	    static func create(userID: User.ID) throws -> UserToken {
        // generate a random 128-bit, base64-encoded string.
        let string = try CryptoRandom().generateData(count: 16).base64EncodedString()
        // init a new `UserToken` from that string.
        return .init(string: string, userID: userID)
    }
	// ...
}

/// Allows this model to be used as a TokenAuthenticatable’s token.
extension UserToken: Token {
    /// See `Token`.
    typealias UserType = User

    /// See `Token`.
    static var tokenKey: WritableKeyPath<UserToken, String> {
        return \.string
    }

    /// See `Token`.
    static var userIDKey: WritableKeyPath<UserToken, User.ID> {
        return \.userID
    }
}
```

Actually upgrading this, took me some time, since parts of the logic are now reversed.

```swift
// MARK: - Vapor 4
// 1
import Vapor

// 2
extension User: Authenticatable {
	  // 3
    func generateToken() throws -> UserToken {
        try UserToken(
            value: [UInt8].random(count: 16).base64,
            user: self
        )
    }
}

// 4
extension UserToken: ModelTokenAuthenticatable {
	static let valueKey = \UserToken.$value
  	static let userKey = \UserToken.$user

	// 5
  var isValid: Bool {
	  Date() >= expiresAt ?? Date()
  }
}
```

1. First of all: drop the Authentication import. Vapor is enough.
2. Now we mark `User` as `Authenticatable` instead of `TokenAuthenticatable`. This allows you to decode it in your controllers!
3. Essentially we moved the static `UserToken.create` to `User.generateToken` and updated it to use Swift’s latest APIs. Completely optional.
4. The old `Token` protocol will be replaced by `ModelTokenAuthenticatable` where we get rid of the `UserType`-typealias and rename the static constants for key paths. And we prefix them with `$` to select the field property wrappers instead of their values.
5. The docs proposed `isValid` to always be `true`, though as I kept `expiredAt`, I chose a real implementation.

At this point, your models, migrations and your configure should be free from errors.

Some small changes in your routes and we can put a check at authentication. Though as these are very well documented and highly specific to your application, I’ll keep this short!

```swift
// MARK: - Vapor 3
let bearer = router.grouped(User.tokenAuthMiddleware())

// MARK: - Vapor 4
let bearer = app.grouped(UserToken.authenticator()) // note the UserToken instead of User
```

### Services and Repositories

As I didn’t use services and repositories yet, I have no more detailed help for you, but from reading the appropriate upgrading chapters [Upgrading Services](https://docs.vapor.codes/4.0/upgrading/#services) and [Upgrading Repositories](https://docs.vapor.codes/4.0/upgrading/#repositories), it should be straightforward anyways.

### Routes and Controllers, Learnings

Now only routes and controllers should be left. As routes and controllers are tied together, I both simultaneously. One route and method at a time.

Here I won’t provide lots of actual code diffs as above, because even the list of all subtle changes is impressive and far from complete.

- instead of `Model.parameter` in your routes name it `":model_id"`, in your controller replace `req.parameters.next(_:)`with `Model.find(req.parameters.get("model_id"), on: req.db)`
- if you have route components with a `/` inside, split them up
- There are less extensions on `req`, but more vars
  _ Use `req.auth.require(_:)`instead of`req.requireAuthenticated(_:)`
  _ `DeviceToken.query(on: req.db)`
- `req.content.decode(_:)` is now synchronous
- In queries, your key paths should end with fields (just share some $)
  _ `.filter(\.$token == deviceToken)`_`.filter(\.$user.$id == user.id)`
- `.save(on:)` now returns `Void`
  _ either add a new func `saveAndReturn(on database: Database) -> EventLoopFuture<Self>` on `Model`
  _ or use `x.save(on: req.db).transform(to: x)`
- Async
  _ `map` and `flatMap` may not throw anymore (you can temporarily add overloads marked as `@available(_, deprecated)`to get warnings) * there is no global`flatMap(_:_:)`anymore, instead use`.and(_:).flatMap(_:)`
- Relations
  _ direct access of relations like `token.user` crashes if not loaded eagerly using `.with(\.$user)` (`QueryBuilder<Model>.with(_:KeyPath<Self, Relation>)`) _ for save, synchronous access use`token.$user.value?`or for async access`token.$user.get(on:)`or`.query(on:)`_ directly setting`token.user =`always fails; use`token.$user.value =`or`token.$user.id =`_ when setting`token.$user.value =`, it does not update`token.$user.id`! You need to do both, but then your data has been loaded eagerly!

## Where to go from here?

Most of your server should be migrated. What’s missing are view renderers, your tests (though they should not break) and more advanced feature. But most effort should be finished.

Even in my small application, the upgrade required a reasonable amount of work, though it was mostly about diffing existing code and documentation. On the other hand the Vapor team did a great job to produce compile errors instead of runtime errors!
As someone who upgraded several large single page web apps, this was a bless!

Did this help you? Have you found a bug? What was your upgrade like? Let’s [have a chat on Twitter](https://www.twitter.com/vknabel) and feel free to [open an issue on GitHub](https://github.com/vknabel/vknabel.github.io/issues/new).
