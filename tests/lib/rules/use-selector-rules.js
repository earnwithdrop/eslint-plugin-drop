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

const COMPONENT_WITH_NO_USE_SELECTOR = `
const Component = () => {
  return <View />
}
`
const COMPONENT_WITH_USE_SELECTOR_AND_NO_MEMO = `
const Component = () => {
  const selectorValue = useSelector(selector)
  return <View />
}
`

const COMPONENT_WITH_USE_SELECTOR_AND_MEMO = `
const Component = React.memo(() => {
  const selectorValue = useSelector(selector)
  return <View />
})
`

const COMPONENT_WITH_USE_SELECTOR_AND_MEMO_AND_PROPS = `
const Component = React.memo((props: {x: number}) => {
  const selectorValue = useSelector(selector)
  return <View />
})
`

ruleTester.run('use-selector-rules', rule, {
  valid: [
    {
      code: COMPONENT_WITH_NO_USE_SELECTOR,
    },
    {
      code: COMPONENT_WITH_USE_SELECTOR_AND_MEMO,
    },
    {
      code: COMPONENT_WITH_USE_SELECTOR_AND_MEMO_AND_PROPS,
    },
  ],

  invalid: [
    {
      code: COMPONENT_WITH_USE_SELECTOR_AND_NO_MEMO,
      errors: [
        {
          message: rule.USE_SELECTOR_ERROR_MESSAGE,
        },
      ],
    },
  ],
})
