# Ensure all files are typechecked

## Rule Details

This rule aims to remind us to remove files we're working on from .typecheckignore.

The `.typecheckignore` file & the `npm run lint:types` command were created as a way for us to incrementally adopt typescript without slowing us down. However, it's hard without this rule to know when we're working on a file that is not being validated in CI.
