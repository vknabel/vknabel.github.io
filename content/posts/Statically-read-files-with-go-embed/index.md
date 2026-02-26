---
title: Statically read files with go:embed
date: 2022-08-18
tags: [go]
---

Did you ever want to access the contents of an auxiliary file from within your repository to access the contents at runtime? This file could include some static settings like the version of the application, translations for user-facing texts, GraphQL requests or SQL queries. The typical solution to this problem is shipping your binary with the auxiliary files.

But this solution comes with great costs. You cannot ship one single executable anymore. Those files need to sit somewhere in the filesystem. And they might be misplaced, outdated or even missing.

Thankfully there is a library and language feature introduced in Go 1.16 that allows you to embed files statically into your binary.

> You can [download](./project.zip) this example project or jump directly to the source code on [Github](https://github.com/vknabel/vknabel.github.io/tree/main/content/posts/Statically-read-files-with-go-embed/project).

## Let's go:embed the license file

For now we want to start easy by embedding the contents a single file. In this case we wish to set our `license` to the contents of our `LICENSE` file.

To get started, we need to import the `embed` package. As we won't use any member of the embed package for now, we place an underscore before the package. This imports `embed` solely for its side-effects. Otherwise go fmt would directly erase the import statement.

```go
import _ "embed"
```

Now let's create a new variable `license` and assign the contents of the `LICENSE` file to it.
We simply initialize the variable by using the `go:embed` compiler directive.

```go
//go:embed LICENSE
var license string
```

And that's it. If we mistype the file name, we get an error. If we forget to import the `embed` package, we get a warning. But there may be no space between in `//go:embed` like in normal comments.

> **Note**: embedding file contents only works for global variables, not for locals.

To actually understand how powerful this feature is, let's write a test by manually reading the file and comparing both.

```go
func TestEmbedsLicenseFile(t *testing.T) {
	// as usual, read the file
	bytes, err := os.ReadFile("LICENSE")
	// check for errors
	if err != nil {
		t.Fatal(err)
	}
	// convert to string
	want := string(bytes)
	// actually use the contents
	if diff := cmp.Diff(want, license); diff != "" {
		t.Errorf("unexpected license (-want +got):\n%s", diff)
	}
}
```

In this example, we declared the variable as `string`, but in other cases you might want to use `[]byte`. For example if you want to pin the signature of a remote certificate.

## go:embed the file system

In our previous example, we included a very special file that is unique in our repository. But sometimes we have many files, which should all be included in our binary.

In this case we are going to embed our docs folder within our app. We don't want our users to be forced to leave. Instead we want them to be able to explore and access the docs directly from within our app.

In this case we are going to create an embedded file system.

```go
import "embed"

//go:embed docs
var docsFS embed.FS
```

`embed.FS` conforms to `fs.FS` and as with all `fs.FS`, we can read directory and file contents. The usage is pretty straightforward.
So let's write a test which checks if the contents of the embedded `docs` folder are equal to the contents of the `docs` folder in our repository.

```go
func TestEmbedsDocs(t *testing.T) {
	dirFS := os.DirFS(".")

	// get all files within the docs directory
	gotEntries, err := fs.ReadDir(docsFS, "docs")
	if err != nil {
		t.Fatal(err)
	}
	wantEntries, err := fs.ReadDir(dirFS, "docs")
	if err != nil {
		t.Fatal(err)
	}
	if len(gotEntries) != len(wantEntries) {
		t.Errorf("got %d entries, want %d", len(gotEntries), len(wantEntries))
	}
	for i := range wantEntries {
		if diff := cmp.Diff(gotEntries[i].Name(), wantEntries[i].Name()); diff != "" {
			t.Errorf("unexpected entry (-want +got):\n%s", diff)
		}

		// read the files
		got, err := fs.ReadFile(docsFS, "docs/"+gotEntries[i].Name())
		if err != nil {
			t.Error(err)
		}
		want, err := fs.ReadFile(dirFS, "docs/"+wantEntries[i].Name())
		if err != nil {
			t.Error(err)
		}
		if diff := cmp.Diff(got, want); diff != "" {
			t.Errorf("unexpected contents (-want +got):\n%s", diff)
		}
	}
}
```

> This unit test is probably a bit too much, but it's always a good idea to ensure the embedded contents are valid. Are they valid json? Not empty? Do certain files exist?

Huh? No magic? Yep. As you can see in the test above, the acutal file system and the embedded file system are used exactly the same.
There are no real differences when using the readonly `fs.FS`. But here's the difference. Nobody guarantees that the files in the os file system has not been tampered with. Or if it has been set up correctly in the expected path. The compiler _proves_ that those files are accessible.

Another benefit: you decide which files you want to embed. Are you only interested in markdown files? Use `//go:embed docs/*.md`.

Let's add another file: the README.md.

```go
//go:embed README.md
//go:embed docs
var docsFS embed.FS
```

Yep, that's it. We simply add another `//go:embed` directive. But how do we know if both directives are respected?
Correct, by writing a quick test!

```go
func TestEmbedsReadme(t *testing.T) {
	// read using the ReadFile method
	got, err := docsFS.ReadFile("README.md")
	if err != nil {
		t.Fatal(err)
	}
	// as os has, too
	want, err := os.ReadFile("README.md")
	if err != nil {
		t.Fatal(err)
	}
	if diff := cmp.Diff(got, want); diff != "" {
		t.Errorf("unexpected README (-want +got):\n%s", diff)
	}
}
```

## Summary

`go:embed` bundles files and directories into the binary at compile-time. Of course you shouldn't embed all files and blow up your binary size, but it can greatly simplify your deployment process and prove that auxiliary files are accessible and immutable.

Curious about more use cases? Here is a non-exhaustive list to get started:

- injecting the version of your software
- pinning the signature of a remote certificate
- embedding documentation
- linking against an environment (prod, staging, ...)
- translations / localizations
- GraphQL requests
- SQL queries
- snapshot testing (e.g. for integration tests)
- for loading defaults
- ...
