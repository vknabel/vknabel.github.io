---
title: "Swift, VS Code and you"
aliases: [/pages/Swift-VS-Code-and-you/]
tags: [swift, vscode, lsp]
date: 2020-01-22
---

Editors like Visual Studio Code live from a wide range of extensions and customization. In contrast there are IDEs like Xcode and AppCode, which have everything set up and are ready to go. In order to provide a rich set of features, they cannot not offer the same level of flexibility. Which editor you might want to use is a highly personal decision.

> _*Disclaimer:* I am the maintainer of the extensions [Maintained Swift Development Environment](https://marketplace.visualstudio.com/items?itemName=vknabel.vscode-swift-development-environment), [sourcekite](https://www.github.com/vknabel/sourcekite), [SwiftLint](https://marketplace.visualstudio.com/items?itemName=vknabel.vscode-swiftlint), [SwiftFormat](https://marketplace.visualstudio.com/items?itemName=vknabel.vscode-swiftformat), [apple-swift-format](https://marketplace.visualstudio.com/items?itemName=vknabel.vscode-apple-swift-format)._

## Autocompletion

Although Visual Studio Code ships with basic syntax highlighting, it won’t give you any suggestions or diagnostics. In order to get autocompletion working, you have two major possibilities:
Using [Apple’s official VS Code extension](https://github.com/apple/sourcekit-lsp) or using [Maintained Swift Development Environment](https://marketplace.visualstudio.com/items?itemName=vknabel.vscode-swift-development-environment) (or in short SDE). Apple’s extension needs to be compiled manually with Node JS, SDE has already been published to the marketplace.

SDE supports two underlaying drivers: Apple’s SourceKit LSP and its own Sourcekite, while Apple does not. Support thee same degree of freedom.
If you are not sure install SDE and try both drivers out. Stick with the one that fits your needs best.

### sourcekit-lsp in action

At the moment of writing, [sourcekit-lsp](https://github.com/apple/sourcekit-lsp) is more reliable in autocompletion. And as it’s Apple’s official implementation, it will further improve on the long term.
It does only support Swift Package Manager projects.

![SDE with sourcekit-lsp](/images/Swift-VS-Code-and-you/SDE-sourcekit-lsp.gif)

### sourcekite in action

[`sourcekite`](https://github.com/apple/sourcekite) works out of the box with Swift Package Manager projects, too. Additionally you can manually configure your project structure to support standalone files, Xcode projects, Tensorflow or UIKit projects.

![SDE with sourcekite](/images/Swift-VS-Code-and-you/SDE-sourcekite.gif)

## Debugging

Every piece of code needs to be tested and debugged. In contrast to Xcode, you need to manually configure your debugging targets.

For this purpose use LLDB Debugger. In case you need more details, read my blog post on [Debugging Swift in VS Code | Valentin Knabel](/pages/Debugging-Swift-in-VS-Code/). On Linux you might need some additional setup.

![LLDB Debugger](/images/Swift-VS-Code-and-you/LLDB.png)

## SwiftLint

You probably know SwiftLint. Wouldn't it be great to see all its warnings and errors in VS Code? It is with [SwiftLint](https://marketplace.visualstudio.com/items?itemName=vknabel.vscode-swiftlint).

Of course you need to install [SwiftLint](https://github.com/realm/SwiftLint#installation) manually. If you add SwiftLint as dependency to your Swift Package Manager project, the extension will prefer the local version.

![SwiftLint](/images/Swift-VS-Code-and-you/Swiftlint.png)

## SwiftFormat

If you like code formatters, you have two options.
First [SwiftFormat](https://marketplace.visualstudio.com/items?itemName=vknabel.vscode-swiftformat) which uses [nicklockwood/SwiftFormat](https://www.github.com/nicklockwood/SwiftFormat) under the hood and second [apple-swift-format](https://marketplace.visualstudio.com/items?itemName=vknabel.vscode-apple-swift-format) which relies on [apple/swift-format](https://www.github.com/apple/swift-format).
Pick the used extension for your project's tool to avoid unnecessary reformats and merge conflicts.

In both cases, you need to install the command line tools manually: either [nicklockwood/SwiftFormat](https://github.com/nicklockwood/SwiftFormat#command-line-tool) or [apple/swift-format](https://github.com/apple/swift-format#swift-format).
In both cases: if you add the formatter of your choice as dependency to your Swift Package Manager project, the extension will prefer the local version.

> Pro tip: enable `editor.formatOnSave`!

![SwiftFormat](/images/Swift-VS-Code-and-you/swift-format.gif)

## Templating

There is a lot of tooling built on top of templating languages like Stencil of Leaf. Of course there are some extensions for these languages:

- Use [Stencil](https://marketplace.visualstudio.com/items?itemName=svanimpe.stencil) for VS Code if you are using Sourcery or Kitura. No additional dependencies are are required.

![Stencil](/images/Swift-VS-Code-and-you/Stencil.png)

- Vapor users may be interested in [Leaf HTML](https://marketplace.visualstudio.com/items?itemName=Francisco.html-leaf) for VS Code. Nothing to install here either.

![Leaf](/images/Swift-VS-Code-and-you/Leaf.png)

## What’s left

In general there are many features missing when using VS Code for Swift development.
Here is a non-exhaustive list of all features missing:

- No Xcode project support
- No Playground support
- No iOS debugging
- No refactoring, yet
- No Swift migrations
- Missing debugger snippets
- Missing tasks and commands for SPM
- Incomplete Language Servers
- Manual installation of dependencies
- Convenience plugins for external Tooling (Mint, Sourcery, Rocket, ...)
- Limited Linux support
- [Code Coverage](/pages/Swift-Coverage-for-VS-Code/) _updated_

What about you? Have you already tried different editors?
Do you know any additional extensions or have any questions?
Let's get in touch on [@mastodon.social@vknabel](https://mastodon.social/@vknabel) or via [email](mailto:swift-vscode-and-you@vknabel.com).
