---
title: SDE 2.7.0 released
aliases: [/pages/SDE-2-7-0-released/]
date: 2019-04-11
tags: [vscode, lsp, announcement]
---

Today I released the new [2.7.0 update to SDE for VS Code](https://github.com/vknabel/vscode-swift-development-environment/releases/tag/2.7.0) and the companion project sourcekite has been updated, too.

The new sourcekite [0.5.0](https://github.com/vknabel/sourcekite/releases/tag/0.5.0) now supports Swift 5, but drops support for Swift 3. If you still need support for Swift 3.1, I also tagged [0.4.2](https://github.com/vknabel/sourcekite/releases/tag/0.4.2).

Since 2.6.0, SDE already supported Apple‘s official [sourcekit-lsp](https://github.com/apple/sourcekit-lsp) by using the `"sde.languageServerMode": "langserver"` and the `swift.languageServerPath` setting.
As announced in [Apples SourceKit-LSP and SDE Roadmap](https://www.vknabel.com/pages/Apples-SourceKit-LSP-and-SDE-Roadmap/) SDE 2.7.0 now explicitly mirrors official SourceKit-LSP settings like `sourcekit-lsp.serverPath` and `sourcekit-lsp.toolchainPath`. These settings will only be respected when explicitly setting `"sde.languageServerMode": "sourcekit-lsp"`.

I‘d suggest you to configure both `sourcekit-lsp` and `sourcekite` configs. Depending on your project, you may swap out the actually used LSP by updating `sde.languageServerMode`. Both LSP implementations have different benefits. Apple‘s SourceKit-LSP is easier to install, under active development and more robust. On the other hand SDE‘s LSP is more flexible in terms of settings, works for standalone Swift files, Xcode projects (through manual configuration) and handles modules differently.

## Upgrade if you use SourceKit-LSP

In your settings replace your `"sde.languageServerMode": "langserver"` with `"sde.languageServerMode": "sourcekit-lsp"` and `swift.languageServerPath` with `sourcekit-lsp.serverPath`.

That‘s it.

## Upgrade if you use Sourcekite

Clone the latest version of sourcekite and open the repo within your terminal.

**On Linux:** assuming you have already linked your `sourcekitdInProc`, you simply need to run `swift build -Xlinker -l:sourcekitdInProc -c release` and overwrite your old binary.

**On macOS:** Run `make install LIB_DIR=/Library/Developer/Toolchains/swift-latest.xctoolchain/usr/lib` if you have multiple Swift toolchains installed and `make install LIB_DIR=/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib` otherwise to install the new build to `/usr/local/bin/sourcekite`. If you used a different path, override it by adding `PREFIX=<your-path>`.

Your `swift.path.sourcekite` should still be valid. Make sure to restart your VS Code before further development.

## Upgrade if you use Ryan Lovelett‘s LangserverSwift

You have no upgrade steps to do, but you are now able to additionally use SourceKit-LSP.

Install SourceKit-LSP and let the global `sourcekit-lsp.serverPath` point to the release binary. Now you can swap your language server inside different projects by overriding `sde.languageServerMode`.

Though as Ryan‘s Langserver is no longer maintained, I‘d recommend you to set your default `sde.languageServerMode` to `sourcekite` or `sourcekit-lsp`.
