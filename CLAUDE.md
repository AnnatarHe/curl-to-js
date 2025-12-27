# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Deno library that parses curl commands into structured JavaScript objects. Published to npm as `@annatarhe/curl-to-js`.

## Commands

```bash
# Run tests
deno test

# Run a single test
deno test --filter "test name"

# Format code
deno fmt

# Check formatting
deno fmt --check

# Lint
deno lint
```

## Architecture

The library has a simple three-layer architecture:

1. **shellwords.ts** - Low-level shell tokenizer (forked from jimmycuadra/shellwords). Splits command strings respecting quotes and escapes.

2. **args.ts** - Parses tokenized shell words into structured `ParsedArgs`: main command, options (key-value pairs), and positional arguments.

3. **parser.ts** - The main `parse()` function that interprets parsed args as curl-specific options (-X, -H, -d, -F, --url, etc.) and returns a `ParsedCommand` object.

Entry point is `mod.ts` which exports `parse` and `parseArgs`.

## Code Style

- No semicolons
- Single quotes
- Spaces (not tabs)
- Follows Deno fmt conventions (see `deno.json`)

## Commit Rules

Follow Conventional Commits with scope:

```
fix(parser): fix parser if with `curl -sSL xxx`
feat(args): add support for new curl flag
perf(shellwords): improve tokenization performance
```
