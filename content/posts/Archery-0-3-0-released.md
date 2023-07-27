---
title: Archery 0.3.0 released
aliases: [/pages/Archery-0-3-0-released/]
date: 2019-10-12
tags: [archery, swift, announcement]
---

_Archery_ is about doing something with your project’s metadata. The new version 0.3.0 puts everything on steroids and allows you to script your metadata.
A detailed overview of all changes can be found on [GitHub](https://github.com/vknabel/Archery/blob/master/CHANGELOG.md#021).

## Archerfile Loaders

At first you will notice the new option to load additional contents into your Archerfile an incredibly open field of new possibilities.
The most obvious use case is to collect metadata from multiple configuration files.
At a second look you can even script the generation of your metadata.

```yaml
loaders:
  - cat Metadata/*.yml
  - "echo today: $(date +%Y-%m-%d)"
  - mirror file https://raw.githubusercontent.com/vknabel/Archery/0.3.0/Examples/MapSwiftTargetsToScripts.yml
```

But caution: your loader will be executed with every invocation of Archery. Make sure they run fast enough!

## Sequence of Scripts

Often one script requires multiple steps. In earlier versions we used `vknabel/ArcheryArrow` for this purpose. Now we can be much more direct:

```yaml
scripts:
  test:
    run: [host, swift5.0, swift5.1]
    scripts:
      host: swift test
swift5.0: docker ...
swift5.1: docker ...
```

## Environment variables

Let’s assume we have `Metadata/Scripts.yml` with the following contents:

```yaml
scripts:
  dump: echo $ARCHERY_METADATA
```

In here we use our second new feature: using env variables to access our Archerfile contents!

On execution you will receive the fully loaded metadata as JSON!

```bash
$ archery dump
🏹  Running scripts ▶︎ dump
{"loaders":[],"scripts":{"dump":{"command":"echo $ARCHERY_METADATA"}},"today":"2019-10-10"}
```

A full list of all exposed environment variables visit [Archery on GitHub](https://github.com/vknabel/Archery).

To accomplish this the whole underlying script execution mechanism has been rebuild from scratch.
Previously scripts relied on separate SwiftPM repositories, called Arrows, which would be installed by Archery using Mint. For many use cases this mechanism required too much ceremony around it. For example the `vknabel/BashArrow` would have to be compiled before running your actual script.
Instead we focus on the easiest and fastest scripting mechanism: bash scripts.
Though this will not break: Archery will generate the correct Mint commands and will execute your arrows as before if you have Mint installed.

Aside from the speed up for bash scripts, the `vknabel/ArcheryArrow` will come pre-shipped too and doesn‘t take a whole Swift build to proceed.

## FAQ and Examples

### How do I update to 0.3.0?

Your existing Archerfile still works the same as before. So nothing to do on this side!

If you currently use the arrow syntax, make sure to have Mint installed as it moved from an internal to an external dependency. Also make sure to use Swift 5 as Swift 4 support has been dropped.

### Is there a new plugin concept?

Previously Mint was the only mechanism to implement plugins. Now as we focus on more general solutions, the new mechanism needs to be more general, too.

Though more general problems require more solutions or even more specializations. Mint will still be available as any other command line tool. To fill the more general gap, I created [Mirror](https://github.com/vknabel/mirror-sh) which tries to solve similar problems on a more general basis.

### How can I share and reuse parts of my metadata?

Now as you can script your metadata, you can also easily reuse parts of your configuration.

```yaml
loaders:
  - mirror file https://raw.githubusercontent.com/vknabel/Archery/0.3.0/Examples/TestingOnMultiplePlatforms.yml
```

In this example we used [Mirror](https://github.com/vknabel/mirror-sh) from above as `curl` would always download the file over and over. Mirror does it only once.

### Project Bash

Some larger projects might already require their own CLI. Smaller ones only have a few helpers around.
The following script exposes
Linking all scripts into your current bash session.

```yaml
# Archerfile
scripts:
  alias: node Scripts/alias.js
```

```javascript
// Scripts/alias.js
const scripts = JSON.parse(process.env.ARCHERY_METADATA).scripts;
Object.keys(scripts)
  .filter((name) => name !== "alias")
  .forEach((name) => {
    const command = `${process.env.ARCHERY} ${name}`;
    console.log(`
function ${name}() {
  ${command} "$@"
`);
  });
```

At the end we are capable of linking all helpers directly into our current bash or zsh session!

```bash
$ eval $(/Users/vknabel/Developer/vknabel/Archery/.build/debug/archery alias)
```

### How can I test on multiple operating systems?

```yaml
scripts:
  test:
    help: Runs tests on your current host system, but also on supported linux versions
    run: [host, swift5.0, swift5.1]
    scripts:
      host: swift test
      swift5.0:
        env:
          SWIFT_VERSION: 5.0
        command: |-
          export CONTAINER=$(docker create —rm —workdir /archery swift:$SWIFT_VERSION swift test)
          docker cp . $CONTAINER:/archery
          docker start —attach $CONTAINER
      swift5.1:
        env:
          SWIFT_VERSION: 5.1
        command: |-
          export CONTAINER=$(docker create --rm --workdir /archery swift:$SWIFT_VERSION swift test)
          docker cp . $CONTAINER:/archery
          docker start —attach $CONTAINER
```

### How to override with private configs?

Overriding data with Archery is quite easy: load the same data structure with different contents. If you wish some configs to be private, just put them into your `.gitignore`.

```yaml
loaders:
  # load default configs
  - cat Config.default.yml
  # override with private configs if existing
  - cat Config.private.yml 2> /dev/null
```

Using the same mechanism you can even override a few scripts, e.g. if you prefer to dockerize your dependencies.

### Any questions left?

If you have any questions left or ideas for improvements, create an issue for [Archery on GitHub](https://github.com/vknabel/Archery) or get in contact with [@mastodon.social@vknabel](https://mastodon.social/@vknabel). Thanks for reading!
