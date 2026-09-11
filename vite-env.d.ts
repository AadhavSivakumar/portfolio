/// <reference types="vite/client" />
// Without this, `tsc` (which the build runs before vite) does not know about
// import.meta.env and the ASSET_BASE constant fails to type-check.
