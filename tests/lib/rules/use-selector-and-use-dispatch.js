/**
 * @fileoverview Rules for useSelector & useDispatch
 * @author drop
 */

'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const { resolve } = require('path')
const { TSESLint } = require('@typescript-eslint/experimental-utils')
const rule = require('../../../lib/rules/use-selector-and-use-dispatch')

const ruleTester = new TSESLint.RuleTester({
  parser: resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const VALID1 = `
const Component = () => {
  return <View />
}
`
const INVALID1 = `
const Component = () => {
  const selectorValue = HOOK_NAME
  return <View />
}
`

const VALID2 = `
const Component = React.memo(() => {
  const selectorValue = HOOK_NAME
  return <View />
})
`

const VALID3 = `
const Component = React.memo((props: {x: number}) => {
  const selectorValue = HOOK_NAME
  return <View />
})
`

const VALID4 = `
const Component = () => {
  const selectorValue = HOOK_NAME
  return <View />
}

export const MemoizedComponent = React.memo(Component)
`

const VALID5 = `
const Component = () => {
  const selectorValue = HOOK_NAME
  return <View />
}

export default React.memo(Component)
`

const VALID6 = `
const Component = () => {
  const selectorValue = HOOK_NAME
  return <View />
}

export const ConnectedComponent = connect()(Component)
`

const VALID7 = `
const Component = () => {
  const selectorValue = HOOK_NAME
  return <View />
}

export default connect()(Component)
`

const VALID8 = `
function useCustomHook() {
  const x = HOOK_NAME
}
`

const generateUseDispatchCode = input =>
  input.replace('HOOK_NAME', 'useDispatch()')
const generateUseSelectorCode = input =>
  input.replace('HOOK_NAME', 'useSelector(selector)')

const validCodeArray = [
  VALID1,
  VALID2,
  VALID3,
  VALID4,
  VALID5,
  VALID6,
  VALID7,
  VALID8,
].reduce(
  (acc, curr) => [
    ...acc,
    { code: generateUseDispatchCode(curr) },
    { code: generateUseSelectorCode(curr) },
  ],
  []
)

const invalidCodeArray = [INVALID1].reduce(
  (acc, curr) => [
    ...acc,
    {
      code: generateUseDispatchCode(curr),
      errors: [{ message: rule.USE_SELECTOR_DISPATCH_ERROR_MESSAGE }],
    },
    {
      code: generateUseSelectorCode(curr),
      errors: [{ message: rule.USE_SELECTOR_DISPATCH_ERROR_MESSAGE }],
    },
  ],
  []
)

ruleTester.run('use-selector-rules', rule, {
  valid: validCodeArray,

  invalid: invalidCodeArray,
})
