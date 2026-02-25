---
title: Overriding Go values with ldflags
date: 2022-08-12
tags: [golang]
---

You can override Go values with ldflags during the build.

That way, you can inject values like the current version, build date or the current commit hash.

```bash
go build \
    -ldflags "-X 'github.com/metal-stack/v.Version=$(VERSION)' \
              -X 'github.com/metal-stack/v.Revision=$(GITVERSION)' \
              -X 'github.com/metal-stack/v.GitSHA1=$(SHA)' \
              -X 'github.com/metal-stack/v.BuildDate=$(BUILDDATE)'" \
```

Seen in the [metal-stack/v](https://github.com/metal-stack/v) repository.
