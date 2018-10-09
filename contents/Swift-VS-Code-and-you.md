---
title: "Swift, VS Code and you"
kind: blog
tags: [swift, vscode, linux]
---

Editors like Visual Studio Code live from a wide range of extensions and customization. In contrast there are IDEs like Xcode and AppCode, which have everything set up and are ready to go. In order to provide a rich set of features,  they cannot not offer the same level of flexibility. Which editor you might want to use is a highly personal decision.

> *Disclaimer:* I am the maintainer or a contributor of some of these projects.

## Autocompletion
Although Visual Studio Code ships with basic syntax highlighting, it won’t give you any suggestions or diagnostics.

There are several extensions trying to solve this issue, though most have been discontinued. Each of these extensions work best with the Swift Package Manager and require some additional Swift tools to be installed.

AFAIK the only extension supporting macOS, Linux, Swift 4 and non-SwiftPM targets is Maintained Swift Development Environment.

Although it does only understand Swift Package Manager projects, it can be configured to provide completions for your Xcode projects.

## Debugging
Every piece of code needs to be tested and debugged. In contrast to Xcode, you need to manually configure your debugging targets.

## Code Style
You can only keep your code style consistent when using tools to enforce it. SwiftLint for VS Code you will show style hints and SwiftFormat for VS Code will take care of your whitespace.

## Templating
There is a lot of tooling built on top of templating languages like Stencil of Leaf. Of course there are some extensions for these languages:
* Use Stencil for VS Code if you are using Sourcery or Vapor.
* Kitura users may be interested in Leaf for VS Code.

## Keybindings
If you are an Xcode user, vscode-xcode-keybindings provides you some keybindings you know like `cmd+r`, `cmd+b`.

## What’s left
In general
* No Xcode project support
* No Playground support
* No iOS debugging
* No refactoring
* No Swift migrations
* Missing debugger snippets
* Missing tasks and commands for SPM
* Incomplete Language Server
* Manual installation of dependencies
* Convenience plugins for external Tooling (Sourcery, Mint, Marathon, ...)
* Limited Linux support
* Code Coverage reports

- svanimpe.stencil
- vknabel.vscode-swiftformat
- shinnn.swiftlint
- vknabel.vscode-swift-development-environment
- francisco.html-leaf
- vadimcn.vscode-lldb
- vscode-xcode-keybindings
- https://yeswolf.github.io/ide/