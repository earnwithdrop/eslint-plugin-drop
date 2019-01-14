/**
 * @fileoverview Name all selectors with a &#39;get&#39; prefix
 * @author drop
 */

'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/selector-naming-convention')
// eslint-disable-next-line
const { RuleTester } = require('eslint')

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
})

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('selector-naming-convention', rule, {
  valid: [
    {
      code: 'const getSomething = state => state.stuff',
      filename: 'selectors.js',
    },
    {
      code: 'const something = state => state.stuff',
      filename: 'something.js',
    },
  ],

  invalid: [
    {
      code: 'const stuff = state => state.stuff',
      filename: 'selectors.js',
      errors: [
        {
          message: "Selector functions should be prefixed with 'get'",
        },
      ],
    },
    {
      code: 'const stuff = state => state.stuff',
      filename: 'selectors/index.js',
      errors: [
        {
          message: "Selector functions should be prefixed with 'get'",
        },
      ],
    },
  ],
})
