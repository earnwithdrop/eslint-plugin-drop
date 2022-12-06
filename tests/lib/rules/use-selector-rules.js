/**
 * @fileoverview Rules for useSelector
 * @author drop
 */

'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const { resolve } = require('path')
const { TSESLint } = require('@typescript-eslint/experimental-utils')
const rule = require('../../../lib/rules/use-selector-rules')

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
  const selectorValue = useSelector(selector)
  return <View />
}
`

const VALID2 = `
const Component = React.memo(() => {
  const selectorValue = useSelector(selector)
  return <View />
})
`

const VALID3 = `
const Component = React.memo((props: {x: number}) => {
  const selectorValue = useSelector(selector)
  return <View />
})
`

const VALID4 = `
const Component = () => {
  const selectorValue = useSelector(selector)
  return <View />
}

export const MemoizedComponent = React.memo(Component)
`

const VALID5 = `
const Component = () => {
  const selectorValue = useSelector(selector)
  return <View />
}

export default React.memo(Component)
`

const VALID6 = `
const Component = () => {
  const selectorValue = useSelector(selector)
  return <View />
}

export const ConnectedComponent = connect()(Component)
`

const VALID7 = `
const Component = () => {
  const selectorValue = useSelector(selector)
  return <View />
}

export default connect()(Component)
`

ruleTester.run('use-selector-rules', rule, {
  valid: [
    {
      code: VALID1,
    },
    {
      code: VALID2,
    },
    {
      code: VALID3,
    },
    {
      code: VALID4,
    },
    {
      code: VALID5,
    },
    {
      code: VALID6,
    },
    {
      code: VALID7,
    },
  ],

  invalid: [
    {
      code: INVALID1,
      errors: [
        {
          message: rule.USE_SELECTOR_ERROR_MESSAGE,
        },
      ],
    },
  ],
})
