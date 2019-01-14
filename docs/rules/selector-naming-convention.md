# Name all selectors with a &#39;get&#39; prefix (selector-naming-convention)

## Rule Details

This rule aims to enforce some consistency around how selectors are named in order to improve code readability

Examples of **incorrect** code for this rule:

```js
const something = state => state.something;
```

Examples of **correct** code for this rule:

```js
const getSomething = state => state.something;
```
