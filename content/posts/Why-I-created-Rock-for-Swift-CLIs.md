---
title: Why I created Rock for Swift CLIs
aliases: [/pages/Why-I-created-Rock-for-Swift-CLIs/]
date: 2017-02-22
tags: [swift, tooling]
---

I excessively make use of the official Swift Package Manager as I usually do some CLIs or other stuff. For this use case it is really great. When developing Apps, Carthage and CocoaPods come in handy, which are great, too.
For Web Development there are yarn and NPM, which support project based and global installs. Then there are gem (global) and bundler (project) for ruby based dependencies.

What I missed was an easy way of distribution for Swift CLIs for either projects or globally. Homebrew is great and can handle global installs great, but for some projects the overhead of submitting new formulas seems too high, especially as this has to be a contribution of a user, not its developer, which is exactly the behavior you want for your personal environment.
Furthermore it is not meant to pin certain versions of your dependencies. You simply can't install one dependency in different versions just for some projects you're working on.

Exactly this is the reason why we have Swiftenv, RVM, pyenv, Bundler and much more:

How can you ensure your whole team uses the same dependency versions?
You must declare it.

For Swift CLI dependencies there is no such system yet.
And that has been the reason why I created Rock for the Swift Ecosystem.
I want everyone to be able to submit their own projects (like CocoaPods) but support decentralized (and private) architectures, too (like Carthage and SwiftPM).
Therefore Rock only focuses on Swift CLIs has been built to work seamlessly with Swift Package Manager projects.

Do you see the same or other problems? Do you have a different opinion?
I would be really happy to receive some feedback from you.
