---
title: "Swift Coverage for VS Code"
aliases: [/pages/Swift-Coverage-for-VS-Code/]
tags: [swift, vscode]
date: 2020-08-29
---

When developing Swift in Visual Studio Code there were a few cases, where I preferred Xcode. Beside the obvious cases like iOS Development, managing certificates and provisioning profiles, there was one big case left: Writing unit tests.

With perfect TDD (unit tests first, then code) this is no real problem, but if you want to write tests for already existing code, it is essential to get feedback about your current progress and test coverage.

In these situations, I still opened Xcode, to check the coverage. As I did this too regular and missed my VS Code setup, I decided to give code coverage in VS Code a try.

![Code Coverage in Xcode](/images/Swift-Coverage-for-VS-Code/example-xcode.png)

After some research, I mostly found code coverage extensions for JS or other languages. Though I never found an extension supporting the llvm-cov-format produced by `swift test --enable-code-coverage` at `.build/*/debug/codecov/*.json` out of the box. There are solutions like converting this coverage file to `lcov.info`, but this would always require some setup in every project. So I started my own.

As I really liked the idea of other extensions to highlight the code itself, I decided to adopt this idea. Though many highlight covered code using a green background, which feels too heavy for always being activated. So I decided to only highlight covered expressions by default.

![Code Coverage in VS Code with Swift Coverage](/images/Swift-Coverage-for-VS-Code/example-vscode.png)

To get started, install [Swift Coverage - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=vknabel.swift-coverage) and run your tests using `swift test --enable-code-coverage`.

Whenever you need to update your coverage statistics, simple re-run your tests.
That's it!

Are you using [Maintained Swift Development Environment](https://github.com/vknabel/vscode-swift-development-environment)?
To keep your coverage always up to date set `sde.swiftBuildingParams` setting to `["test", "--enable-code-coverage"]` to run all your unit tests on every change. Might not be a good idea with a slow test suite, but in smaller projects, this is super great.

Is there something you are missing for Swift and VS Code?
Do you have any questions or tips?
Let's get in touch on [Twitter](https://twitter.com/vknabel) or via [email](mailto:swift-coverage-for-vscode@vknabel.com).

Have you found a bug or need help with [Swift Coverage](https://github.com/vknabel/vscode-swift-coverage)? It's open source, just head to GitHub and [open an issue](https://github.com/vknabel/vscode-swift-coverage/issues/new).
