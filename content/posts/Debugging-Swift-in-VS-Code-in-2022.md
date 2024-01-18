---
title: Debugging Swift in VS Code in 2022
aliases: [/pages/Debugging-Swift-in-VS-Code-in-2022/]
date: 2022-02-08
tags: [vscode, swift]
images:
  - /images/Debugging-Swift-in-VS-Code-in-2022/example_debugging.png
  - /images/Debugging-Swift-in-VS-Code-in-2022/example_breakpoint.png
  - /images/Debugging-Swift-in-VS-Code-in-2022/example_launch_configs.png
---

Back in 2019 I wrote an [article about how to debug](/pages/Debugging-Swift-in-VS-Code) your Swift Package Manager projects in Visual Studio Code. In late december 2021, the Swift Server Working group released a brand [new extension for vscode](https://marketplace.visualstudio.com/items?itemName=sswg.swift-lang), which dramatically improves debugging your Swift code. Especially for linux! Time for an update!

Running, debugging and developing your targets in Visual Studio Code is not prepared by default. Especially for us Swift developers this might come unexpected, especially in comparison to Xcode.
In VS Code we require extensions and configs for this purpose.

First we need to install the mentioned extension: [Swift for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=sswg.swift-lang).

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
Creating Tests/MyProjectTests/
Creating Tests/MyProjectTests/MyProjectTests.swift

$ code . # if not found: open -a "Visual Studio Code" .
```

The Swift extension for VS Code will now generate some launch configurations within a `.vscode/launch.json` file.
It generates release and debug [LLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)-launch-configurations for each target and one launch configuration for each test target. Previously this step would have been manual.

As we currently have one target `MyProject` and one test target `MyProjectTests`, we will have the following launch configurations:

![Launch configs](/images/Debugging-Swift-in-VS-Code-in-2022/example_launch_configs.png)

Also note, that the `preLaunchTask`s have been created, too!

```json
{
  "configurations": [
    {
      "type": "lldb",
      "request": "launch",
      "name": "Debug MyProject",
      "program": "${workspaceFolder:MyProject}/.build/debug/MyProject",
      "args": [],
      "cwd": "${workspaceFolder:MyProject}",
      "preLaunchTask": "swift: Build Debug MyProject"
    },
    {
      "type": "lldb",
      "request": "launch",
      "name": "Release MyProject",
      "program": "${workspaceFolder:MyProject}/.build/release/MyProject",
      "args": [],
      "cwd": "${workspaceFolder:MyProject}",
      "preLaunchTask": "swift: Build Release MyProject"
    },
    {
      "type": "lldb",
      "request": "launch",
      "name": "Test MyProject",
      "program": "/Applications/Xcode.app/Contents/Developer/usr/bin/xctest",
      "args": [".build/debug/MyProjectPackageTests.xctest"],
      "cwd": "${workspaceFolder:MyProject}",
      "preLaunchTask": "swift: Build All"
    }
  ]
}
```

Now we are ready to start debugging!
Let's open `Sources/MyProject/main.swift`, and add a breakpoint before executing `print("Hello, world!")` by left-clicking the empty space before the line number.

![Breakpoint in main.swift](/images/Debugging-Swift-in-VS-Code-in-2022/example_breakpoint.png)

Next, switch to the `Run and Debug` tab on the left, make sure `Debug MyProject` is selected, and click the green run button.

Now your project will be compiled, run and stops at the breakpoint!

![Stopped at breakpoint in main.swift](/images/Debugging-Swift-in-VS-Code-in-2022/example_debugging.png)

Sadly this approach currently does not work when debugging iOS or macOS apps, but Swift Package Manager projects and CLIs work great!
I hope you enjoy your increased productivity!
