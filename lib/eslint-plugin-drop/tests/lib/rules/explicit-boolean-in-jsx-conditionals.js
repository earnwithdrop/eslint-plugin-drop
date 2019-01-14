/**
 * @fileoverview Require explicit booleans in JSX conditional rendering using &&
 * @author drop
 */

'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/explicit-boolean-in-jsx-conditionals')
// eslint-disable-next-line
const { RuleTester } = require('eslint')

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
})

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('explicit-boolean-in-jsx-conditionals', rule, {
  valid: [
    {
      code:
        'const Something = () => <View>{!!something && <Something />}</View>',
      filename: 'Component.js',
    },
    {
      code:
        'const Something = () => <View>{Boolean(something) && <Something />}</View>',
      filename: 'Component.js',
    },
    {
      code:
        'const Something = () => <View someProp={something && somethingElse}><Component /></View>',
      filename: 'Component.js',
    },
    {
      code:
        'const Something = () => <View someProp={isPrefixFunction() && somethingElse}><Component /></View>',
      filename: 'Component.js',
    },
    {
      code:
        'const Something = () => <View someProp={isPrefixValue && somethingElse}><Component /></View>',
      filename: 'Component.js',
    },
  ],

  invalid: [
    {
      code: 'const Something = () => <View>{something && <Something />}</View>',
      filename: 'Component.js',
      errors: [
        {
          message: 'Conditionals in JSX should use explicit Booleans',
        },
      ],
    },
    {
      code: "const Something = () => <View>{'' && <Something />}</View>",
      filename: 'Component.js',
      errors: [
        {
          message: 'Conditionals in JSX should use explicit Booleans',
        },
      ],
    },
  ],
})
