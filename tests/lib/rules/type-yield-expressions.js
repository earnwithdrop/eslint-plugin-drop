/**
 * @fileoverview Type yield expressions
 * @author drop
 */

'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { resolve } = require('path')
const { TSESLint } = require('@typescript-eslint/experimental-utils')
const rule = require('../../../lib/rules/type-yield-expressions')

const ruleTester = new TSESLint.RuleTester({
  parser: resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
})

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const wrapInGenerator = input => `
function* fn() {
    ${input}
}
`

ruleTester.run('type-yield-expressions', rule, {
  valid: [
    {
      code: wrapInGenerator('yield call(someSaga)'),
    },
    {
      code: wrapInGenerator('const x: number = yield call(someSaga)'),
    },
  ],

  invalid: [
    {
      code: wrapInGenerator('const x = yield call(someSaga)'),
      errors: [
        {
          message: 'Outputs of yield expressions should be typed',
        },
      ],
    },
    {
      code: wrapInGenerator('return yield call(someSaga)'),
      errors: [
        {
          message: 'Outputs of yield expressions should be typed',
        },
      ],
    },
  ],
})
