---
title: Apple’s SourceKit LSP and SDE Roadmap
aliass: [/pages/Apples-SourceKit-LSP-and-SDE-Roadmap/]
date: 2018-11-16
tags: [vscode, swift, lsp]
---

Apple recently [announced](https://forums.swift.org/t/new-lsp-language-service-supporting-swift-and-c-family-languages-for-any-editor-and-platform/17024/) to develop a language server for Swift and C-family languages. Or said more clearly: Apple started development to support every editor implementing the [language server protocol](https://langserver.org/) like VS Code, Sublime Text, Jet Brains‘ IDEs and Atom.

Later they published the [source code in GitHub ](https://github.com/apple/sourcekit-lsp) including [support for VS Code and Sublime Text](https://github.com/apple/sourcekit-lsp/tree/master/Editors). It will work on Linux but is currently limited to Swift snapshots and the VS Code extension hasn’t been published yet.

I really love Apple’s decision to take over this responsibility. I think they will be able do a much better job than we as a community have done so far. There were quite a few LSPs for Swift, AFAIK all of them started as an experiment. Most of them got stuck at Swift 3.x and never supported Swift 4. [SDE for VS Code](https://github.com/vknabel/vscode-swift-development-environment) was one of them until I started maintaining it.

## The future of SDE

That being said, I feel responsible to inform users (and potential ones) about my plans regarding SDE. TL;DR I will still continue to maintain SDE and fix issues if I can. And, of course, I‘d be happy for any feedback and bug reports.

I strongly believe Apple‘s SourceKit LSP will be the way to go once it is stable and supports stable Swift releases. My future goal for SDE is to smoothly prepare the transition to it and Apple’s still unpublished VS Code extension.

As SDE comes with its own LSP implementation, I already released [SDE 2.6.0](https://github.com/vknabel/vscode-swift-development-environment/releases/tag/2.6.0) to support alternative language server implementations like [RLovelett‘s LangserverSwift](https://github.com/RLovelett/langserver-swift) and Apple’s (back then: unpublished) SourceKit LSP.

The following roadmap isn’t final and may actually differ:
At first I will mirror all [settings of the VS Code extension](https://github.com/apple/sourcekit-lsp/blob/master/Editors/vscode/package.json) as it reduces barriers and migration issues. [#39](https://github.com/vknabel/vscode-swift-development-environment/issues/39)

Once the extension has been released to VS Code‘s extension registry and it is stable enough, I will add a warning to prefer that instead if not installed yet. [#40](https://github.com/vknabel/vscode-swift-development-environment/issues/40) If it has been installed and activated, SDE will disable itself automatically. [#41](https://github.com/vknabel/vscode-swift-development-environment/issues/41) These options should be opt-out. The goal within this phase is to decide which extension to use within which project.

As soon as I don’t see any reason to keep maintaining SDE, I will add a message as explanation. If SDE will still have features which are not part of Apple’s extension, I will extract them into separate extensions which will still be maintained.

I hope you agree with these future plans. If you have more ideas, feedback or if your don’t agree on this, please [open an issue](https://github.com/vknabel/vscode-swift-development-environment/issues/new) or [tell me on Twitter](https://www.twitter.com/vknabel).
