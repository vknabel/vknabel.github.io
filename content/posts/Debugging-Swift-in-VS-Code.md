---
title: Debugging Swift in VS Code the old way
aliases: [/pages/Debugging-Swift-in-VS-Code/]
date: 2019-11-21
tags: [vscode, swift]
---

Running and debugging your targets in Visual Studio Code is not prepared by default. Especially for us Swift developers this might come unexpected, especially in comparison to Xcode.
In VS Code we require extensions and configs for this purpose.

> **Update from 2022:** the Swift Server Work Group released their own [official VS Code extension](https://marketplace.visualstudio.com/items?itemName=sswg.swift-lang) which dramatically improves the debugging user experience. [Here is the new, updated blog post](/pages/Debugging-Swift-in-VS-Code-in-2022/).

Within this blog post, we will set up debugging for a Swift Package Manager project. As a bonus we will also prepare debugging your unit tests.

First we need to install an extension as VS Code does not come with Swift debugger: [LLDB Debugger](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb).

Now let’s create a new project on open it in VS Code!

```bash
$ swift package init --type executable
Creating executable package: MyProject
Creating Package.swift
Creating README.md
Creating .gitignore
Creating Sources/
Creating Sources/MyProject/main.swift
Creating Tests/
Creating Tests/LinuxMain.swift
Creating Tests/MyProjectTests/
Creating Tests/MyProjectTests/MyProjectTests.swift
Creating Tests/MyProjectTests/XCTestManifests.swift

$ code . # if not found: open -a "Visual Studio Code" .
```

As we’ve prepared all prerequisites, we are ready to set up our first debugging target! In the debuggers tab in your vscode window, select the drop down and then "Add configuration...". This will now create a new file called `.vscode/launch.json`.

Below is an example configuration supporting running executable targets, unit tests on macOS and Linux. Relevant files will be compiled using the pre-launch-tasks.

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    // Running executables
    {
      "type": "lldb",
      "request": "launch",
      "name": "Run your Executable",
      "program": "${workspaceFolder}/.build/debug/your-executable",
      "args": [],
      "cwd": "${workspaceFolder}",
      "preLaunchTask": "swift-build"
    },
    // Running unit tests
    {
      "type": "lldb",
      "request": "launch",
      "name": "Debug tests on macOS",
      "program": "<path to xctest executable>", //For example /Applications/Xcode.app/Contents/Developer/usr/bin/xctest
      "args": ["${workspaceFolder}/.build/debug/<xctest bundle name>.xctest"],
      "preLaunchTask": "swift-build-tests"
    },
    {
      "type": "lldb",
      "request": "launch",
      "name": "Debug tests on Linux",
      "program": "./.build/x86_64-unknown-linux/debug/YourPackageTests.xctest",
      "preLaunchTask": "swift-build-tests"
    }
  ]
}
```

And here are the promised pre-launched-tasks:

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    // compile your SPM project
    {
      "label": "swift-build",
      "type": "shell",
      "command": "swift build" // for TensorFlow add -Xlinker -ltensorflow
    },
    // compile your SPM tests
    {
      "label": "swift-build-tests",
      "type": "process",
      "command": "swift",
      "group": "build",
      "args": [
        "build",
        "--build-tests"
        // for TensorFlow add "-Xlinker", "-ltensorflow"
      ]
    }
  ]
}
```

Sadly this approach currently does not work when debugging iOS or macOS apps, but Swift Package Manager projects and CLIs work great!
I hope you enjoy your increased productivity!
