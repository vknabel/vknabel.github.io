package goembed_test

import (
	"embed"
	"io/fs"
	"os"
	"testing"

	"github.com/google/go-cmp/cmp"
)

//go:embed README.md
//go:embed docs
var docsFS embed.FS

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
