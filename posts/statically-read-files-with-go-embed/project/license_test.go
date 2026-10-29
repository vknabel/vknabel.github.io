package goembed_test

import (
	_ "embed"
	"os"
	"testing"

	"github.com/google/go-cmp/cmp"
)

//go:embed LICENSE
var license string

// .
// |-- LICENSE
// |-- go.mod
// |-- go.sum
// `-- license_test.go
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
