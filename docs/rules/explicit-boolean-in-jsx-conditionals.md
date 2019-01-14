# Require explicit booleans in JSX conditional rendering using && (explicit-boolean-in-jsx)

## Rule Details

### Description

This rule enforces the use of explicit booleans when using conditional rendering inside JSX.

### Reasoning

Rendering strings in React Native should be done using a `<Text>` tag. Passing a string into a `<View>` causes a silent crash on Android.

An example of conditional rendering in react is as follows:

```javascript
<View>{variable && <Component />}</View>
```

`Component` here should be rendered only when `variable` is truthy. However, if `variable` is an empty string `''` (this is falsey), the code evaluates to:

```javascript
<View>{''}</View>
```

This causes a silent crash on Android

## Examples

Examples of **incorrect** code for this rule:

```javascript
const Something = () => <View>{something && <Something />}</View>;
```

```javascript
const Something = () => <View>{'' && <Something />}</View>;
```

Examples of **correct** code for this rule:

```javascript
const Something = () => <View>{!!something && <Something />}</View>;
```

```javascript
const Something = () => <View>{Boolean(something) && <Something />}</View>;
```

```javascript
const Something = () => <View>{a > b && <Something />}</View>;
```

```javascript
const Something = () => (
  <View someProp={something && somethingElse}>
    <Component />
  </View>
);
```
