---
title: 'InferIt: a Constraint Solving Package Manager'
date: 2019-10-15
tags: [swift, tooling]
---

The initial idea behind InferIt was to create some mixture of a constraint solver and a dependency manager: you would just tell it what to install and it would gather as much information as possible to install it.

The goal is to fulfill a requirement. InferIt would then try to resolve all variables by trying to fulfill several requirements. If a requirement has been met, the value can be propagated.

The current example does not include side effects or file system lookups. Though this essentially is the key behind this idea and is possible for synchronous operations.

_Originally written at 2018-01-15_

## Example

```swift
let c = Context()

let name = Variable<String>("name")
let githubRepository = Variable<String>("githubRepository")
let workingDirectory = Variable<Path>("workingDirectory")
let inferConfig = Variable<InferConfig>("inferConfig")
let repositoryUrl = Variable<URL>("respositoryUrl")
let projectDirectory = Variable<Path>("projectDirectory")
c.provide(name).by { "vknabel/rock" }
c.provide(githubRepository).when(
  name.with { $0.split(separator: "/").count == 2 },
  { $0 }
)
c.provide(workingDirectory).by { Path.current }
c.provide(inferConfig).by(InferConfig.provider)
c.provide(repositoryUrl).when(
  githubRepository,
  { URL(string: "https://github.com/\($0).git")! }
)
c.provide(repositoryUrl).when(
  name.asUrl.toBeDefined,
  { $0 }
)
c.provide(projectDirectory).when(
  repositoryUrl,
  workingDirectory,
  { try cloneRepository(from: $0, to: $1) }
)
c.solve(requirement: projectDirectory) // this actually runs the application

```

## Implemenation

```swift
import Foundation

struct InferConfig {
  var projectDirectory: String {
    return ""
  }

  static func provider() throws -> InferConfig {
    throw ResolveError.notImplemented(#function)
  }
}

func cloneRepository(from url: URL, to path: Path) throws -> Path {
  return path + "/" + url.lastPathComponent
}

public enum ResolveError: Error, CustomStringConvertible {
  case notImplemented(String)
  case undeclaredVariable(String)
  case couldNotResolveVariable(String)
  case conditionalCastFailed(Any, Any.Type)

  public static func from(_ error: Error) -> ResolveError {
    if let error = error as? ResolveError {
      return error
    } else {
      fatalError("An unknown error occurred: \(error)")
    }
  }

  public var description: String {
    switch self {
    case let .notImplemented(feature):
      return "Not Implemented: \(feature)"
    case let .undeclaredVariable(variable):
      return "Variable not declared: \(variable)"
    case let .couldNotResolveVariable(variable):
      return "Variable could not be resolved: \(variable)"
    case let .conditionalCastFailed(value, to):
      return "Type error: \(value) is no \(to)"
    }
  }
}

//: Variables don't depend on a context.
public protocol Requirement {
  associatedtype Source
  associatedtype Result
  var sourceName: String { get }
  func apply(state: RequirementState<Source>) -> RequirementState<Result>
}

public class Variable<T>: Requirement {
  public let sourceName: String

  public init(_ name: String) {
    sourceName = name
  }

  public func apply(state: RequirementState<T>) -> RequirementState<T> {
    return state
  }
}

public extension Requirement {
  func with(_ filter: @escaping (Result) -> Bool) -> AnyRequirement<Source, Result> {
    return AnyRequirement(named: sourceName) { sourceState in
      switch self.apply(state: sourceState) {
      case let .resolved(source) where filter(source):
        return .resolved(source)
      case .resolved:
        return .failed(.notImplemented("validation mismatch"))
      case .unresolved:
        return .unresolved
      case let .failed(error):
        return .failed(error)
      }
    }
  }

  func flatMap<R>(_ transform: @escaping (Result) -> RequirementState<R>) -> AnyRequirement<Source, R> {
    return AnyRequirement(named: sourceName) { sourceState in
      switch self.apply(state: sourceState) {
      case let .resolved(source):
        switch transform(source) {
        case let .resolved(result):
          return .resolved(result)
        case let .failed(error):
          return .failed(error)
        case .unresolved:
          return .unresolved
        }
      case let .failed(error):
        return .failed(error)
      case .unresolved:
        return .unresolved
      }
    }
  }

  func map<R>(_ transform: @escaping (Result) -> R) -> AnyRequirement<Source, R> {
    return AnyRequirement(named: sourceName) { sourceState in
      switch self.apply(state: sourceState) {
      case let .resolved(source):
        return .resolved(transform(source))
      case let .failed(error):
        return .failed(error)
      case .unresolved:
        return .unresolved
      }
    }
  }
}

public class AnyRequirement<Source, Result>: Requirement {
  public typealias Transformation = (RequirementState<Source>) -> RequirementState<Result>
  public let sourceName: String
  private let transformation: Transformation
  init(named name: String, transform: @escaping Transformation) {
    sourceName = name
    transformation = transform
  }

  public func apply(state: RequirementState<Source>) -> RequirementState<Result> {
    return transformation(state)
  }
}

public enum RequirementState<Value> {
  case resolved(Value)
  case unresolved
  case failed(ResolveError)

  public init(catching factory: () throws -> Value) {
    do {
      self = .resolved(try factory())
    } catch {
      self = .failed(.from(error))
    }
  }

  public init(catching factory: () throws -> RequirementState<Value>) {
    do {
      self = try factory()
    } catch {
      self = .failed(.from(error))
    }
  }

  func map<R>(_ transform: (Value) throws -> R) rethrows -> RequirementState<R> {
    switch self {
    case let .resolved(value):
      return try .resolved(transform(value))
    case .unresolved:
      return .unresolved
    case let .failed(error):
      return .failed(error)
    }
  }

  func flatMap<R>(_ transform: (Value) throws -> RequirementState<R>) rethrows -> RequirementState<R> {
    switch self {
    case let .resolved(value):
      return try transform(value)
    case .unresolved:
      return .unresolved
    case let .failed(error):
      return .failed(error)
    }
  }

  internal func casted<T>(to _: T.Type = T.self) -> RequirementState<T> {
    switch self {
    case let .resolved(value):
      if let value = value as? T {
        return .resolved(value)
      } else {
        return .failed(.conditionalCastFailed(value, T.self))
      }
    case .unresolved:
      return .unresolved
    case let .failed(error):
      return .failed(error)
    }
  }
}

extension Variable where T == String {
  var asUrl: Variable<URL?> {
    return Variable<URL?>(sourceName) // TODO: AnyRequirement
  }
}

extension Variable where T == URL? {
  var toBeDefined: Variable<URL> {
    return Variable<URL>(sourceName) // TODO: AnyRequirement
  }
}

final class Provider<T> {
  private let context: Context
  private let variable: Variable<T>

  init(for variable: Variable<T>, in context: Context) {
    self.context = context
    self.variable = variable
  }

  func by(_ provider: @escaping () throws -> T) {
    context.bind(variable: variable, catching: provider)
  }

  func when<R: Requirement>(_ precondition: R, _ resolve: @escaping (R.Result) throws -> T) {
    context.bind(variable: variable, to: {
      let solution: RequirementState<R.Result> = self.context.solve(requirement: precondition)
      return solution.flatMap { (value: R.Result) -> RequirementState<T> in
        RequirementState { try resolve(value) }
      }
    })
  }

  func when<R0: Requirement, R1: Requirement>(_ precondition0: R0, _ precondition1: R1, _ resolve: @escaping (R0.Result, R1.Result) throws -> T) {
    context.bind(variable: variable, to: {
      let solution0 = { self.context.solve(requirement: precondition0) }
      let solution1 = { self.context.solve(requirement: precondition1) }
      return solution0().flatMap { (value0: R0.Result) -> RequirementState<T> in
        solution1().flatMap { (value1: R1.Result) in
          RequirementState { try resolve(value0, value1) }
        }
      }
    })
  }
}

fileprivate struct VariableBindings {
  typealias Resolver = () -> RequirementState<Any>
  var resolvers: [Resolver] = []
  var state: RequirementState<Any> = .unresolved
}

final class Context {
  private var bindings: [String: VariableBindings] = [:]

  func provide<T>(_ variable: Variable<T>) -> Provider<T> {
    return Provider(for: variable, in: self)
  }

  internal func bind<T>(variable: Variable<T>, catching resolver: @escaping () throws -> T) {
    bind(variable: variable) {
      RequirementState(catching: resolver)
    }
  }

  internal func bind<T>(variable: Variable<T>, to resolver: @escaping () -> RequirementState<T>) {
    var binding = bindings[variable.sourceName] ?? VariableBindings()
    binding.resolvers.append({ resolver().casted() })
    bindings[variable.sourceName] = binding
  }

  private func log(resolver: VariableBindings.Resolver, for sourceName: String) -> RequirementState<Any> {
    let result = resolver()
    switch result {
    case let .failed(error):
      print("[FAILED] \(sourceName) with \(error)")
    case let .resolved(value):
      print("[SOLVED] \(sourceName) as \(String(reflecting: value))")
    case .unresolved:
      break
    }
    return result
  }

  private func solvePure(sourceName: String) -> RequirementState<Any> {
    guard let binding = bindings[sourceName] else {
      print("[FAILED] No rules for \(sourceName)")
      return .failed(.undeclaredVariable(sourceName))
    }
    switch binding.state {
    case .unresolved:
      return binding.resolvers.reduce(.failed(.couldNotResolveVariable(sourceName))) { result, resolver in
        if case .unresolved = result {
          return resolver()
        } else if case .failed(.couldNotResolveVariable(sourceName)) = result {
          return log(resolver: resolver, for: sourceName)
        } else {
          return result
        }
      }
    case let result:
      return result
    }
  }

  internal func solve(sourceName: String) -> RequirementState<Any> {
    let result = solvePure(sourceName: sourceName)
    bindings[sourceName]?.state = result
    return result
  }

  func solve<R: Requirement>(requirement: R) -> RequirementState<R.Result> {
    let variableState: RequirementState<R.Source> = solve(sourceName: requirement.sourceName).casted()
    return requirement.apply(state: variableState)
  }
}

```

## Conclusion

Thus I still believe this to be an interesting topic, the amount of variables and requirements seem to explode and to be hard to debug without any additional tools.

Furthermore this constraint solver still operates synchronously. To be production ready this needs to be implemented asynchrously, which would then enhance.

_[download this playground](./playground.zip)_
